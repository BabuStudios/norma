import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderScreen } from '@/test/render';
import { SuppliersScreen } from './SuppliersScreen';

const render = (route = '/suppliers') =>
  renderScreen(<SuppliersScreen />, { route, path: '/suppliers/:supplierId?' });

const columnHeaders = () =>
  screen.queryAllByRole('columnheader').map((th) => th.textContent?.trim());

describe('the supplier register, starting empty', () => {
  it('explains what the register is for instead of showing a bare table', () => {
    render();
    expect(screen.getByText(/Inga leverantörer registrerade/)).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });

  it('offers adding a supplier as the first step', () => {
    render();
    expect(screen.getByRole('button', { name: /Lägg till leverantör/ })).toBeInTheDocument();
  });

  it('reports a count of zero without claiming anything needs attention', () => {
    render();
    expect(screen.getByText('0 leverantörer')).toBeInTheDocument();
    expect(screen.queryByText(/kräver åtgärd/)).not.toBeInTheDocument();
  });

  it('asks for a selection in the detail aside rather than crashing', () => {
    // The aside used to read SUPPLIERS[0] unconditionally.
    render();
    expect(screen.getByText('Välj en leverantör i listan.')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Redigera leverantör' })).not.toBeInTheDocument();
  });

  it('survives a URL naming a supplier that does not exist', () => {
    render('/suppliers/nobody');
    expect(screen.getByText('Välj en leverantör i listan.')).toBeInTheDocument();
  });
});

describe('the column menu, with no rows to show', () => {
  it('still opens, listing every optional column', async () => {
    const { user } = render();
    await user.click(screen.getByRole('button', { name: /Lägg till kolumn/ }));

    const menu = document.getElementById('supplier-column-menu')!;
    expect(within(menu).getAllByRole('checkbox')).toHaveLength(6);
    expect(within(menu).getByRole('checkbox', { name: 'Nästa utvärdering' })).toBeChecked();
    expect(within(menu).getByRole('checkbox', { name: 'Org.nr' })).not.toBeChecked();
  });

  it('remembers a toggled column even with nothing in the table', async () => {
    const { user } = render();
    await user.click(screen.getByRole('button', { name: /Lägg till kolumn/ }));

    const menu = document.getElementById('supplier-column-menu')!;
    await user.click(within(menu).getByRole('checkbox', { name: 'Org.nr' }));
    expect(within(menu).getByRole('checkbox', { name: 'Org.nr' })).toBeChecked();
    // No table exists to grow a column, and that must not throw.
    expect(columnHeaders()).toHaveLength(0);
  });

  it('closes on Escape and on an outside press', async () => {
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
