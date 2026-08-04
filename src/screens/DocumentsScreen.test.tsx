import { screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { renderScreen } from '@/test/render';
import { DocumentsScreen } from './DocumentsScreen';

const render = () => renderScreen(<DocumentsScreen />, { route: '/documents' });

describe('the document register, starting empty', () => {
  it('shows an empty state rather than a blank table', () => {
    render();
    expect(screen.getByText(/Inga dokument i den här fliken ännu/)).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('always offers the add-document button, not only from the empty state', () => {
    render();
    expect(screen.getByRole('button', { name: '+ Nytt dokument' })).toBeInTheDocument();
  });

  it('ships with Mallar, Styrande and Redovisande tabs, Mallar active first', () => {
    render();
    const tabs = screen.getAllByRole('tab');
    expect(tabs.map((tab) => tab.textContent)).toEqual(['Mallar', 'Styrande', 'Redovisande']);
    expect(tabs[0]).toHaveAttribute('aria-selected', 'true');
  });
});

describe('adding a document', () => {
  it('opens and closes the form on the same button', async () => {
    const { user } = render();
    const toggle = screen.getByRole('button', { name: '+ Nytt dokument' });

    await user.click(toggle);
    expect(screen.getByLabelText('Dokumentnamn')).toBeInTheDocument();

    await user.click(toggle);
    expect(screen.queryByLabelText('Dokumentnamn')).not.toBeInTheDocument();
  });

  it('adds the document to the register on save', async () => {
    const { user } = render();
    await user.click(screen.getByRole('button', { name: '+ Nytt dokument' }));

    await user.type(screen.getByLabelText('Dokumentnamn'), 'Kvalitetshandbok');
    await user.clear(screen.getByLabelText('Ansvarig'));
    await user.type(screen.getByLabelText('Ansvarig'), 'Maja Karlsson');
    await user.click(screen.getByRole('button', { name: 'Spara dokument' }));

    expect(screen.getByRole('table')).toBeInTheDocument();
    expect(screen.getByText('Kvalitetshandbok')).toBeInTheDocument();
    // Mallar is the active tab and ships with the "M" prefix.
    expect(screen.getByText('M001')).toBeInTheDocument();
    expect(screen.getByText('Maja Karlsson')).toBeInTheDocument();
    expect(screen.getByText('Utkast')).toBeInTheDocument();
    expect(screen.queryByLabelText('Dokumentnamn')).not.toBeInTheDocument();
  });

  it('will not save a document without a name', async () => {
    const { user } = render();
    await user.click(screen.getByRole('button', { name: '+ Nytt dokument' }));
    await user.click(screen.getByRole('button', { name: 'Spara dokument' }));

    expect(screen.getByLabelText('Dokumentnamn')).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('discards the draft on cancel', async () => {
    const { user } = render();
    await user.click(screen.getByRole('button', { name: '+ Nytt dokument' }));
    await user.type(screen.getByLabelText('Dokumentnamn'), 'Kvalitetshandbok');

    await user.click(screen.getByRole('button', { name: 'Avbryt' }));
    expect(screen.queryByLabelText('Dokumentnamn')).not.toBeInTheDocument();
    expect(screen.queryByText('Kvalitetshandbok')).not.toBeInTheDocument();
  });

  it('numbers documents in the order they are added', async () => {
    const { user } = render();

    await user.click(screen.getByRole('button', { name: '+ Nytt dokument' }));
    await user.type(screen.getByLabelText('Dokumentnamn'), 'Först');
    await user.click(screen.getByRole('button', { name: 'Spara dokument' }));

    await user.click(screen.getByRole('button', { name: '+ Nytt dokument' }));
    await user.type(screen.getByLabelText('Dokumentnamn'), 'Sedan');
    await user.click(screen.getByRole('button', { name: 'Spara dokument' }));

    expect(screen.getByText('M001')).toBeInTheDocument();
    expect(screen.getByText('M002')).toBeInTheDocument();
  });

  it('lets a file be attached and shows its name in the register', async () => {
    const { user } = render();
    await user.click(screen.getByRole('button', { name: '+ Nytt dokument' }));
    await user.type(screen.getByLabelText('Dokumentnamn'), 'Kvalitetshandbok');

    const file = new File(['content'], 'handbok.pdf', { type: 'application/pdf' });
    await user.upload(screen.getByLabelText('Fil'), file);
    await user.click(screen.getByRole('button', { name: 'Spara dokument' }));

    expect(screen.getByText(/handbok\.pdf/)).toBeInTheDocument();
  });

  it('opens the attached file in a new tab from its own link', async () => {
    // jsdom has no object-URL implementation; stand one in so uploaded
    // files can be opened, same as a real browser would let them be.
    URL.createObjectURL = vi.fn((file: File) => `blob:mock/${file.name}`);
    URL.revokeObjectURL = vi.fn();

    const { user } = render();
    await user.click(screen.getByRole('button', { name: '+ Nytt dokument' }));
    await user.type(screen.getByLabelText('Dokumentnamn'), 'Kvalitetshandbok');

    const file = new File(['content'], 'handbok.pdf', { type: 'application/pdf' });
    await user.upload(screen.getByLabelText('Fil'), file);
    await user.click(screen.getByRole('button', { name: 'Spara dokument' }));

    const link = screen.getByRole('link', { name: 'handbok.pdf' });
    expect(link).toHaveAttribute('href', 'blob:mock/handbok.pdf');
    expect(link).toHaveAttribute('target', '_blank');
  });
});

describe('document tabs', () => {
  it('adds a new tab and switches to it', async () => {
    const { user } = render();
    await user.click(screen.getByRole('button', { name: '+ Lägg till flik' }));
    await user.type(screen.getByLabelText('Fliknamn'), 'Avtal');
    await user.click(screen.getByRole('button', { name: 'Spara flik' }));

    const tab = screen.getByRole('tab', { name: 'Avtal' });
    expect(tab).toBeInTheDocument();
    await user.click(tab);
    expect(tab).toHaveAttribute('aria-selected', 'true');
  });

  it('only shows documents filed under the active tab', async () => {
    const { user } = render();
    await user.click(screen.getByRole('button', { name: '+ Nytt dokument' }));
    await user.type(screen.getByLabelText('Dokumentnamn'), 'Mallpolicy');
    await user.click(screen.getByRole('button', { name: 'Spara dokument' }));
    expect(screen.getByText('Mallpolicy')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Styrande' }));
    expect(screen.queryByText('Mallpolicy')).not.toBeInTheDocument();
    expect(screen.getByText(/Inga dokument i den här fliken ännu/)).toBeInTheDocument();
  });

  it('lets each tab define its own metadata fields, collected on new documents', async () => {
    const { user } = render();
    await user.click(screen.getByRole('button', { name: 'Redigera metadata' }));
    await user.type(screen.getByLabelText('Fältnamn'), 'Godkänd av');
    await user.click(screen.getByRole('button', { name: 'Lägg till fält' }));

    expect(screen.getByText('Godkänd av')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: '+ Nytt dokument' }));
    expect(screen.getByLabelText('Godkänd av')).toBeInTheDocument();

    await user.type(screen.getByLabelText('Dokumentnamn'), 'Policy');
    await user.type(screen.getByLabelText('Godkänd av'), 'VD');
    await user.click(screen.getByRole('button', { name: 'Spara dokument' }));
    expect(screen.getByText('Policy')).toBeInTheDocument();
  });

  it('removes a metadata field from a tab', async () => {
    const { user } = render();
    await user.click(screen.getByRole('button', { name: 'Redigera metadata' }));
    await user.type(screen.getByLabelText('Fältnamn'), 'Godkänd av');
    await user.click(screen.getByRole('button', { name: 'Lägg till fält' }));
    expect(screen.getByText('Godkänd av')).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Ta bort fält Godkänd av/ }));
    expect(screen.queryByText('Godkänd av')).not.toBeInTheDocument();
  });
});

describe('the ID prefix, per tab', () => {
  it('defaults each stock tab to its own prefix', async () => {
    const { user } = render();
    expect(screen.getByLabelText('ID-prefix')).toHaveValue('M');

    await user.click(screen.getByRole('tab', { name: 'Styrande' }));
    expect(screen.getByLabelText('ID-prefix')).toHaveValue('S');

    await user.click(screen.getByRole('tab', { name: 'Redovisande' }));
    expect(screen.getByLabelText('ID-prefix')).toHaveValue('R');
  });

  it('stamps new documents with the active tab’s configured prefix', async () => {
    const { user } = render();
    const prefixInput = screen.getByLabelText('ID-prefix');
    await user.clear(prefixInput);
    await user.type(prefixInput, 'POL-');

    await user.click(screen.getByRole('button', { name: '+ Nytt dokument' }));
    await user.type(screen.getByLabelText('Dokumentnamn'), 'Policy');
    await user.click(screen.getByRole('button', { name: 'Spara dokument' }));

    expect(screen.getByText('POL-001')).toBeInTheDocument();
  });

  it('numbers each tab’s documents independently of the others', async () => {
    const { user } = render();
    await user.click(screen.getByRole('button', { name: '+ Nytt dokument' }));
    await user.type(screen.getByLabelText('Dokumentnamn'), 'Mallpolicy');
    await user.click(screen.getByRole('button', { name: 'Spara dokument' }));
    expect(screen.getByText('M001')).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Styrande' }));
    await user.click(screen.getByRole('button', { name: '+ Nytt dokument' }));
    await user.type(screen.getByLabelText('Dokumentnamn'), 'Styrpolicy');
    await user.click(screen.getByRole('button', { name: 'Spara dokument' }));
    expect(screen.getByText('S001')).toBeInTheDocument();
  });

  it('leaves other tabs’ prefixes untouched when one is changed', async () => {
    const { user } = render();
    const prefixInput = screen.getByLabelText('ID-prefix');
    await user.clear(prefixInput);
    await user.type(prefixInput, 'POL-');

    await user.click(screen.getByRole('tab', { name: 'Styrande' }));
    expect(screen.getByLabelText('ID-prefix')).toHaveValue('S');
  });
});

describe('deleting a document', () => {
  it('removes the document from the register', async () => {
    const { user } = render();
    await user.click(screen.getByRole('button', { name: '+ Nytt dokument' }));
    await user.type(screen.getByLabelText('Dokumentnamn'), 'Kvalitetshandbok');
    await user.click(screen.getByRole('button', { name: 'Spara dokument' }));
    expect(screen.getByText('Kvalitetshandbok')).toBeInTheDocument();

    const row = screen.getByText('Kvalitetshandbok').closest('tr') as HTMLElement;
    await user.click(within(row).getByRole('button', { name: /Ta bort dokument/ }));

    expect(screen.queryByText('Kvalitetshandbok')).not.toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
