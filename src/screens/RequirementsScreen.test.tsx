import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { CLAUSES } from '@/data/clauses';
import { findClause, inStandard } from '@/domain/conformity';
import { registerFile } from '@/domain/fileStore';
import { renderScreen } from '@/test/render';
import { RequirementsScreen } from './RequirementsScreen';

const seedDocuments = (documents: unknown[]) => {
  window.localStorage.setItem('norma.state.v1', JSON.stringify({ documents }));
};

const document1 = {
  id: 'D001',
  name: { sv: 'Miljöaspektregister', en: 'Aspects register' },
  version: '1.0',
  owner: '',
  nextReview: '',
  kind: 'soft',
  state: { sv: 'Utkast', en: 'Draft' },
  tabId: 'templates',
  metadata: {},
  fileName: null,
  fileSize: null,
};

const document2 = {
  id: 'D002',
  name: { sv: 'Policy', en: 'Policy' },
  version: '1.0',
  owner: '',
  nextReview: '',
  kind: 'soft',
  state: { sv: 'Utkast', en: 'Draft' },
  tabId: 'templates',
  metadata: {},
  fileName: null,
  fileSize: null,
};

const render = (clauseId = '6.1.2') =>
  renderScreen(<RequirementsScreen />, {
    route: `/requirements/${clauseId}`,
    path: '/requirements/:clauseId',
  });

/** Clause rows in the tree are the only elements carrying aria-current. */
const treeRows = () => Array.from(document.querySelectorAll('[aria-current]'));

/** The two headline cells are distinguished only by the panel they control. */
const toggleFor = (standard: '9001' | '14001') =>
  document.querySelector<HTMLButtonElement>(`[aria-controls="not-met-${standard}"]`)!;

describe('the requirement walkthrough', () => {
  it('shows the selected clause in the detail pane', () => {
    render('6.1.2');
    const clause = findClause('6.1.2')!;
    expect(screen.getByRole('heading', { level: 2, name: clause.sv.title })).toBeInTheDocument();
    expect(screen.getByText(clause.sv.what)).toBeInTheDocument();
    expect(screen.getByText('Krav 6.1.2')).toBeInTheDocument();
  });

  it('shows the environment variant of a shared clause number', () => {
    render('8.2e');
    expect(screen.getByText('Krav 8.2')).toBeInTheDocument();
    expect(
      screen.getByRole('heading', { level: 2, name: 'Nödläge och beredskap' }),
    ).toBeInTheDocument();
  });

  it('carries the disclaimer that the text is a paraphrase, not the standard', () => {
    render();
    expect(screen.getByText(/Standardens ordalydelse finns hos SIS/)).toBeInTheDocument();
  });

  it('starts with no status chosen — nothing is pre-assessed', () => {
    render('6.1.2');
    expect(screen.getByRole('button', { name: 'Pågår' })).toHaveAttribute('aria-pressed', 'false');
    expect(screen.getByRole('button', { name: 'Uppfyllt' })).toHaveAttribute(
      'aria-pressed',
      'false',
    );
  });

  it('shows no evidence on file until the clause is met', () => {
    render('6.1.2');
    expect(screen.queryByText('Finns')).not.toBeInTheDocument();
    expect(screen.getAllByText('Saknas').length).toBeGreaterThan(0);
  });

  it('says no owner is assigned rather than naming somebody', () => {
    render('6.1.2');
    expect(screen.getByText('Ingen ansvarig utsedd')).toBeInTheDocument();
    expect(screen.getByText('Inga ändringar')).toBeInTheDocument();
  });

  it('says no documents are linked yet', () => {
    render('6.1.2');
    expect(screen.getByText('Inga dokument kopplade ännu.')).toBeInTheDocument();
  });

  it('ticks a step and moves the counter', async () => {
    const { user } = render('6.1.2');
    const clause = findClause('6.1.2')!;
    const total = clause.sv.steps.length;

    expect(screen.getByText(`0/${total} klara`)).toBeInTheDocument();
    await user.click(screen.getAllByRole('checkbox')[0]);
    expect(screen.getByText(`1/${total} klara`)).toBeInTheDocument();

    await user.click(screen.getAllByRole('checkbox')[0]);
    expect(screen.getByText(`0/${total} klara`)).toBeInTheDocument();
  });

  it('keeps step state per clause rather than per position', async () => {
    const { user } = render('6.1.2');
    await user.click(screen.getAllByRole('checkbox')[0]);
    expect(screen.getAllByRole('checkbox')[0]).toBeChecked();

    // Move to another clause: its first step must not inherit the tick.
    await user.click(screen.getByRole('button', { name: /Risker och möjligheter/ }));
    expect(screen.getAllByRole('checkbox')[0]).not.toBeChecked();
  });

  it('changes the clause status', async () => {
    const { user } = render('6.1.2');
    const met = screen.getByRole('button', { name: 'Uppfyllt' });
    expect(met).toHaveAttribute('aria-pressed', 'false');

    await user.click(met);
    expect(screen.getByRole('button', { name: 'Uppfyllt' })).toHaveAttribute(
      'aria-pressed',
      'true',
    );
    expect(screen.getByRole('button', { name: 'Pågår' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('flips every evidence row to on file when the clause becomes met', async () => {
    const { user } = render('6.1.2');
    expect(screen.getAllByText('Saknas').length).toBeGreaterThan(0);

    await user.click(screen.getByRole('button', { name: 'Uppfyllt' }));
    expect(screen.queryByText('Saknas')).not.toBeInTheDocument();
    expect(screen.getAllByText('Finns').length).toBeGreaterThan(0);
  });

  it('filters the tree to one standard', async () => {
    const { user } = render();
    expect(treeRows()).toHaveLength(CLAUSES.length);

    await user.click(screen.getByRole('button', { name: '14001' }));
    const expected = CLAUSES.filter((c) => c.standard !== '9001').length;
    expect(treeRows()).toHaveLength(expected);

    await user.click(screen.getByRole('button', { name: 'Alla' }));
    expect(treeRows()).toHaveLength(CLAUSES.length);
  });

  it('searches by title and by clause number', async () => {
    const { user } = render();
    const search = screen.getByRole('searchbox');

    await user.type(search, 'nödläge');
    expect(treeRows()).toHaveLength(1);

    await user.clear(search);
    await user.type(search, '9.1');
    const byNumber = treeRows();
    expect(byNumber.length).toBeGreaterThan(0);
    expect(byNumber.every((row) => row.textContent?.includes('9.1'))).toBe(true);
  });

  it('says so when nothing matches', async () => {
    const { user } = render();
    await user.type(screen.getByRole('searchbox'), 'zzzzz');
    expect(treeRows()).toHaveLength(0);
    expect(screen.getByText('Inga krav matchar sökningen.')).toBeInTheDocument();
  });

  it('navigates when a tree row is chosen', async () => {
    const { user } = render('6.1.2');
    await user.click(screen.getByRole('button', { name: /Kompetens/ }));
    expect(screen.getByTestId('pathname')).toHaveTextContent('/requirements/7.2');
  });

  it('falls back to the default clause for an unknown id', () => {
    render('does-not-exist');
    expect(screen.getByText('Krav 6.1.2')).toBeInTheDocument();
  });
});

describe('the chapter conformity panel', () => {
  it('is expanded by default, showing every chapter at zero', () => {
    render();
    const rows = screen.getAllByRole('button', { name: /%/ });
    expect(rows).toHaveLength(7);
    for (const row of rows) {
      expect(row).toHaveTextContent('0');
      expect(row).toHaveAttribute('data-behind', 'true');
    }
  });

  it('collapses and expands on its own toggle', async () => {
    const { user } = render();
    const toggle = screen.getByRole('button', {
      name: /Uppfyllnad per kapitel/,
    });
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('button', { name: /%/ }).length).toBeGreaterThan(0);

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryAllByRole('button', { name: /%/ })).toHaveLength(0);

    await user.click(toggle);
    expect(toggle).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getAllByRole('button', { name: /%/ }).length).toBeGreaterThan(0);
  });

  it('opens the first requirement of the chosen chapter', async () => {
    const { user } = render();
    const chapters = [...new Set(CLAUSES.map((c) => c.chapter))];
    const rows = screen.getAllByRole('button', { name: /%/ });
    expect(rows).toHaveLength(chapters.length);

    await user.click(rows[0]);
    const firstOfChapter = CLAUSES.find((c) => c.chapter === chapters[0])!;
    expect(screen.getByTestId('pathname')).toHaveTextContent(`/requirements/${firstOfChapter.id}`);
  });
});

describe('the not-met band', () => {
  it('says no external audit is booked rather than inventing a date', () => {
    render();
    expect(screen.getByText('Ingen bokad')).toBeInTheDocument();
    expect(screen.queryByText(/Certifieringsrevision/)).not.toBeInTheDocument();
  });

  it('reports every requirement as not met', () => {
    render();
    expect(toggleFor('9001')).toHaveTextContent(String(inStandard('9001').length));
    expect(toggleFor('14001')).toHaveTextContent(String(inStandard('14001').length));
  });

  it('lists every outstanding requirement in the dropdown', async () => {
    const { user } = render();
    await user.click(toggleFor('9001'));

    const panel = document.getElementById('not-met-9001')!;
    expect(within(panel).getAllByRole('button')).toHaveLength(inStandard('9001').length);
  });

  it('opens and closes on the same button', async () => {
    const { user } = render();
    await user.click(toggleFor('9001'));
    expect(document.getElementById('not-met-9001')).toBeInTheDocument();
    expect(toggleFor('9001')).toHaveAttribute('aria-expanded', 'true');

    await user.click(toggleFor('9001'));
    expect(document.getElementById('not-met-9001')).not.toBeInTheDocument();
  });

  it('closes on Escape', async () => {
    const { user } = render();
    await user.click(toggleFor('9001'));
    await user.keyboard('{Escape}');
    expect(document.getElementById('not-met-9001')).not.toBeInTheDocument();
  });

  it('closes when pressing outside it', async () => {
    const { user } = render();
    await user.click(toggleFor('9001'));
    await user.click(document.body);
    expect(document.getElementById('not-met-9001')).not.toBeInTheDocument();
  });

  it('navigates to the chosen requirement and closes', async () => {
    const { user } = render();
    await user.click(toggleFor('9001'));

    const panel = document.getElementById('not-met-9001')!;
    const [firstRow] = within(panel).getAllByRole('button');
    const clauseNumber = firstRow.textContent?.match(/^[\d.]+/)?.[0];
    await user.click(firstRow);

    const path = screen.getByTestId('pathname').textContent!;
    expect(path).toMatch(/^\/requirements\//);
    // The row's clause number must be the one the URL carries — the id may
    // carry an `e` suffix the number does not.
    expect(path.replace('/requirements/', '')).toMatch(new RegExp(`^${clauseNumber}e?$`));
    expect(document.getElementById('not-met-9001')).not.toBeInTheDocument();
  });
});

describe('linking evidence to documents', () => {
  it('opens a picker listing the document register from the row button', async () => {
    seedDocuments([document1]);
    const { user } = render('6.1.2');

    const [linkButton] = screen.getAllByRole('button', { name: 'Koppla dokument' });
    await user.click(linkButton);

    expect(
      screen.getByRole('menuitemcheckbox', { name: /D001.*Miljöaspektregister/ }),
    ).toBeInTheDocument();
  });

  it('shows a message when the register has no documents to link', async () => {
    const { user } = render('6.1.2');
    const [linkButton] = screen.getAllByRole('button', { name: 'Koppla dokument' });
    await user.click(linkButton);

    expect(screen.getByText('Inga dokument att koppla.')).toBeInTheDocument();
  });

  it('flips an evidence item from Saknas to Finns once a document is linked', async () => {
    seedDocuments([document1]);
    const { user } = render('6.1.2');
    expect(screen.getAllByText('Saknas').length).toBeGreaterThan(0);

    const [linkButton] = screen.getAllByRole('button', { name: 'Koppla dokument' });
    await user.click(linkButton);
    await user.click(screen.getByRole('menuitemcheckbox', { name: /D001/ }));

    expect(screen.getByText('Miljöaspektregister')).toBeInTheDocument();
    expect(screen.getAllByText('Finns').length).toBeGreaterThan(0);
  });

  it('unlinks a document by checking it again in the picker', async () => {
    seedDocuments([document1]);
    const { user } = render('6.1.2');

    const [linkButton] = screen.getAllByRole('button', { name: 'Koppla dokument' });
    await user.click(linkButton);
    const checkbox = screen.getByRole('menuitemcheckbox', { name: /D001/ });
    await user.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'true');

    await user.click(checkbox);
    expect(checkbox).toHaveAttribute('aria-checked', 'false');
    expect(screen.queryByText('Miljöaspektregister')).not.toBeInTheDocument();
  });

  it('links more than one document to the same evidence item', async () => {
    seedDocuments([document1, document2]);
    const { user } = render('6.1.2');

    const [linkButton] = screen.getAllByRole('button', { name: 'Koppla dokument' });
    await user.click(linkButton);
    await user.click(screen.getByRole('menuitemcheckbox', { name: /D001/ }));
    await user.click(screen.getByRole('menuitemcheckbox', { name: /D002/ }));

    expect(screen.getByText('Miljöaspektregister')).toBeInTheDocument();
    expect(screen.getByText('Policy')).toBeInTheDocument();
  });

  it('unlinks a document from its own remove button in the linked list', async () => {
    seedDocuments([document1]);
    const { user } = render('6.1.2');

    const [linkButton] = screen.getAllByRole('button', { name: 'Koppla dokument' });
    await user.click(linkButton);
    await user.click(screen.getByRole('menuitemcheckbox', { name: /D001/ }));
    expect(screen.getByText('Miljöaspektregister')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Ta bort Miljöaspektregister/ }));
    expect(screen.queryByText('Miljöaspektregister')).not.toBeInTheDocument();
    expect(screen.getAllByText('Saknas').length).toBeGreaterThan(0);
  });

  it('keeps links scoped to the evidence item they were made on', async () => {
    seedDocuments([document1]);
    const { user } = render('6.1.2');

    const [firstLinkButton] = screen.getAllByRole('button', { name: 'Koppla dokument' });
    await user.click(firstLinkButton);
    await user.click(screen.getByRole('menuitemcheckbox', { name: /D001/ }));
    expect(screen.getByText('Miljöaspektregister')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Kompetens/ }));
    expect(screen.queryByText('Miljöaspektregister')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Miljöaspekter och påverkan/ }));
    expect(screen.getByText('Miljöaspektregister')).toBeInTheDocument();
  });

  it('opens a linked document in a new tab when it has an uploaded file', async () => {
    // jsdom has no object-URL implementation; stand one in and register it as
    // though the document had already been uploaded from the document library.
    URL.createObjectURL = vi.fn(() => 'blob:mock/aspektregister.pdf');
    URL.revokeObjectURL = vi.fn();
    registerFile('D001', new File(['content'], 'aspektregister.pdf'));

    seedDocuments([document1]);
    const { user } = render('6.1.2');
    const [linkButton] = screen.getAllByRole('button', { name: 'Koppla dokument' });
    await user.click(linkButton);
    await user.click(screen.getByRole('menuitemcheckbox', { name: /D001/ }));

    const link = screen.getByRole('link', { name: 'Miljöaspektregister' });
    expect(link).toHaveAttribute('href', 'blob:mock/aspektregister.pdf');
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('works the same way in English — links come from the register, not local copy', async () => {
    window.localStorage.setItem(
      'norma.state.v1',
      JSON.stringify({ lang: 'en', documents: [document1] }),
    );
    const { user } = render('6.1.2');

    const [linkButton] = screen.getAllByRole('button', { name: 'Link document' });
    await user.click(linkButton);
    await user.click(screen.getByRole('menuitemcheckbox', { name: /D001/ }));

    expect(screen.getByText('Aspects register')).toBeInTheDocument();
    expect(screen.getAllByText('On file').length).toBeGreaterThan(0);
  });
});

describe('commenting on evidence', () => {
  it('opens a comment editor next to Koppla dokument and shows what was written', async () => {
    const { user } = render('6.1.2');
    const [commentButton] = screen.getAllByRole('button', { name: 'Kommentar' });
    await user.click(commentButton);

    const editor = screen.getByLabelText('Kommentar till bevispunkten');
    await user.type(editor, 'Ligger hos VD.');
    await user.keyboard('{Escape}');

    expect(screen.getByText('Ligger hos VD.')).toBeInTheDocument();
  });

  it('removes a comment with its own remove button', async () => {
    const { user } = render('6.1.2');
    const [commentButton] = screen.getAllByRole('button', { name: 'Kommentar' });
    await user.click(commentButton);
    await user.type(screen.getByLabelText('Kommentar till bevispunkten'), 'Se pärmen.');
    await user.keyboard('{Escape}');
    expect(screen.getByText('Se pärmen.')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Ta bort kommentar' }));
    expect(screen.queryByText('Se pärmen.')).not.toBeInTheDocument();
  });

  it('keeps comments scoped to their own evidence item', async () => {
    const { user } = render('6.1.2');
    const [firstButton, secondButton] = screen.getAllByRole('button', { name: 'Kommentar' });

    await user.click(firstButton);
    await user.type(screen.getByLabelText('Kommentar till bevispunkten'), 'Första bevispunkten.');
    await user.keyboard('{Escape}');

    await user.click(secondButton);
    await user.type(screen.getByLabelText('Kommentar till bevispunkten'), 'Andra bevispunkten.');
    await user.keyboard('{Escape}');

    expect(screen.getByText('Första bevispunkten.')).toBeInTheDocument();
    expect(screen.getByText('Andra bevispunkten.')).toBeInTheDocument();
  });

  it('works the same way in English', async () => {
    window.localStorage.setItem('norma.state.v1', JSON.stringify({ lang: 'en' }));
    const { user } = render('6.1.2');
    const [commentButton] = screen.getAllByRole('button', { name: 'Comment' });
    await user.click(commentButton);

    await user.type(screen.getByLabelText('Comment on the evidence item'), 'With the CEO.');
    await user.keyboard('{Escape}');
    expect(screen.getByText('With the CEO.')).toBeInTheDocument();
  });
});
