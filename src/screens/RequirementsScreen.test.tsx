import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CLAUSES } from '@/data/clauses';
import { findClause } from '@/domain/conformity';
import { renderScreen } from '@/test/render';
import { RequirementsScreen } from './RequirementsScreen';

const render = (clauseId = '6.1.2') =>
  renderScreen(<RequirementsScreen />, {
    route: `/requirements/${clauseId}`,
    path: '/requirements/:clauseId',
  });

/** Clause rows in the tree are the only elements carrying aria-current. */
const treeRows = () => Array.from(document.querySelectorAll('[aria-current]'));

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

describe('attaching evidence files', () => {
  it('flips an evidence item from Saknas to Finns and shows the file', async () => {
    const { user } = render('6.1.2');
    expect(screen.getAllByText('Saknas').length).toBeGreaterThan(0);

    const [input] = screen.getAllByLabelText('Ladda upp') as HTMLInputElement[];
    const file = new File(['content'], 'aspektregister.pdf', { type: 'application/pdf' });
    await user.upload(input, file);

    expect(screen.getByText('aspektregister.pdf')).toBeInTheDocument();
    expect(screen.getAllByText('Finns').length).toBeGreaterThan(0);
  });

  it('shows a human-readable file size', async () => {
    const { user } = render('6.1.2');
    const [input] = screen.getAllByLabelText('Ladda upp') as HTMLInputElement[];
    const file = new File(['x'.repeat(2048)], 'a.pdf');
    await user.upload(input, file);

    expect(screen.getByText('2.0 KB')).toBeInTheDocument();
  });

  it('supports attaching more than one file to the same evidence item', async () => {
    const { user } = render('6.1.2');
    const [input] = screen.getAllByLabelText('Ladda upp') as HTMLInputElement[];
    const a = new File(['a'], 'a.pdf');
    const b = new File(['b'], 'b.pdf');
    await user.upload(input, [a, b]);

    expect(screen.getByText('a.pdf')).toBeInTheDocument();
    expect(screen.getByText('b.pdf')).toBeInTheDocument();
  });

  it('removes an attached file and reverts to Saknas', async () => {
    const { user } = render('6.1.2');
    const [input] = screen.getAllByLabelText('Ladda upp') as HTMLInputElement[];
    const file = new File(['content'], 'aspektregister.pdf');
    await user.upload(input, file);
    expect(screen.getByText('aspektregister.pdf')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: 'Ta bort aspektregister.pdf' }));
    expect(screen.queryByText('aspektregister.pdf')).not.toBeInTheDocument();
  });

  it('keeps uploads scoped to the clause they were attached to', async () => {
    const { user } = render('6.1.2');
    const [input] = screen.getAllByLabelText('Ladda upp') as HTMLInputElement[];
    await user.upload(input, new File(['content'], 'aspektregister.pdf'));

    await user.click(screen.getByRole('button', { name: /Kompetens/ }));
    expect(screen.queryByText('aspektregister.pdf')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Miljöaspekter och påverkan/ }));
    expect(screen.getByText('aspektregister.pdf')).toBeInTheDocument();
  });

  it('works the same way in English — the file name is not localized copy', async () => {
    window.localStorage.setItem('norma.state.v1', JSON.stringify({ lang: 'en' }));
    const { user } = render('6.1.2');

    const [input] = screen.getAllByLabelText('Upload') as HTMLInputElement[];
    await user.upload(input, new File(['content'], 'aspektregister.pdf'));

    expect(screen.getByText('aspektregister.pdf')).toBeInTheDocument();
    expect(screen.getAllByText('On file').length).toBeGreaterThan(0);
  });
});
