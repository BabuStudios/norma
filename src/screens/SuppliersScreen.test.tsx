import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { SUPPLIERS } from '@/data/suppliers';
import { renderScreen } from '@/test/render';
import { SuppliersScreen } from './SuppliersScreen';

const render = (supplierId = 'stalgrossisten-vast') =>
  renderScreen(<SuppliersScreen />, {
    route: `/suppliers/${supplierId}`,
    path: '/suppliers/:supplierId',
  });

const columnHeaders = () =>
  screen.getAllByRole('columnheader').map((th) => th.textContent?.trim());

describe('the supplier register', () => {
  it('lists every supplier with a summary of what needs attention', () => {
    render();
    expect(screen.getAllByRole('row')).toHaveLength(SUPPLIERS.length + 1); // + header
    const needing = SUPPLIERS.filter((s) => s.kind !== 'met').length;
    expect(
      screen.getByText(`${SUPPLIERS.length} leverantörer · ${needing} kräver åtgärd`),
    ).toBeInTheDocument();
  });

  it('shows the chosen supplier in the detail aside', () => {
    render('kemipartner-nordic');
    expect(
      screen.getByRole('heading', { level: 2, name: 'KemiPartner Nordic AB' }),
    ).toBeInTheDocument();
    expect(screen.getByText('Ingrid Falk')).toBeInTheDocument();
  });

  it('navigates when a row is chosen', async () => {
    const { user } = render('stalgrossisten-vast');
    await user.click(screen.getByRole('rowheader', { name: 'Transport & Last AB' }));
    expect(screen.getByTestId('pathname')).toHaveTextContent('/suppliers/transport-och-last');
  });

  it('shows the empty state for a supplier with no documents', () => {
    render('verktygsservice-boras');
    expect(screen.getByText('Inga dokument kopplade ännu.')).toBeInTheDocument();
  });

  it('starts with the next-evaluation column on and the rest off', () => {
    render();
    expect(columnHeaders()).toContain('Nästa utvärdering');
    expect(columnHeaders()).not.toContain('Org.nr');
  });

  it('adds and removes an optional column', async () => {
    const { user } = render();
    await user.click(screen.getByRole('button', { name: /Lägg till kolumn/ }));

    const menu = document.getElementById('supplier-column-menu')!;
    const orgNo = within(menu).getByRole('checkbox', { name: 'Org.nr' });
    await user.click(orgNo);
    expect(columnHeaders()).toContain('Org.nr');
    expect(screen.getAllByRole('cell', { name: '556213-4471' }).length).toBeGreaterThan(0);

    await user.click(within(menu).getByRole('checkbox', { name: 'Org.nr' }));
    expect(columnHeaders()).not.toContain('Org.nr');
  });

  it('closes the column menu on Escape and on an outside press', async () => {
    const { user } = render();
    const open = screen.getByRole('button', { name: /Lägg till kolumn/ });

    await user.click(open);
    expect(document.getElementById('supplier-column-menu')).toBeInTheDocument();
    await user.keyboard('{Escape}');
    expect(document.getElementById('supplier-column-menu')).not.toBeInTheDocument();

    await user.click(open);
    await user.click(document.body);
    expect(document.getElementById('supplier-column-menu')).not.toBeInTheDocument();
  });
});

describe('editing a supplier', () => {
  it('saves a change through to both the aside and the table', async () => {
    const { user } = render('verktygsservice-boras');
    await user.click(screen.getByRole('button', { name: 'Redigera leverantör' }));

    const contact = screen.getByLabelText('Kontaktperson');
    await user.clear(contact);
    await user.type(contact, 'Astrid Berg');
    const score = screen.getByLabelText('Betyg');
    await user.clear(score);
    await user.type(score, '77');

    await user.click(screen.getByRole('button', { name: 'Spara ändringar' }));

    expect(screen.getByText('Astrid Berg')).toBeInTheDocument();
    const row = screen.getByRole('rowheader', { name: 'Verktygsservice i Borås' }).closest('tr')!;
    expect(within(row).getByRole('cell', { name: '77' })).toBeInTheDocument();
  });

  it('discards the draft on cancel', async () => {
    const { user } = render('verktygsservice-boras');
    await user.click(screen.getByRole('button', { name: 'Redigera leverantör' }));

    const contact = screen.getByLabelText('Kontaktperson');
    await user.clear(contact);
    await user.type(contact, 'Should not persist');
    await user.click(screen.getByRole('button', { name: 'Avbryt' }));

    expect(screen.getByText('Tomas Nyqvist')).toBeInTheDocument();
    expect(screen.queryByText('Should not persist')).not.toBeInTheDocument();
  });

  it('leaves edit mode when another supplier is chosen', async () => {
    const { user } = render('verktygsservice-boras');
    await user.click(screen.getByRole('button', { name: 'Redigera leverantör' }));
    expect(screen.getByRole('button', { name: 'Spara ändringar' })).toBeInTheDocument();

    await user.click(screen.getByRole('rowheader', { name: 'Återvinning Syd AB' }));
    expect(screen.queryByRole('button', { name: 'Spara ändringar' })).not.toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Redigera leverantör' })).toBeInTheDocument();
  });

  it('keeps a non-numeric score from corrupting the record', async () => {
    const { user } = render('verktygsservice-boras');
    await user.click(screen.getByRole('button', { name: 'Redigera leverantör' }));

    const score = screen.getByLabelText('Betyg');
    await user.clear(score);
    await user.type(score, 'not a number');
    await user.click(screen.getByRole('button', { name: 'Spara ändringar' }));

    const row = screen.getByRole('rowheader', { name: 'Verktygsservice i Borås' }).closest('tr')!;
    expect(within(row).getByRole('cell', { name: '0' })).toBeInTheDocument();
  });
});
