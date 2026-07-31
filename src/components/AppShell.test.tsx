import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { ORGANIZATIONS } from '@/data/organizations';
import { AppProvider } from '@/state/AppProvider';
import { AppShell } from './AppShell';

function renderShell(route = '/requirements') {
  const user = userEvent.setup();
  render(
    <AppProvider>
      <MemoryRouter initialEntries={[route]}>
        <Routes>
          <Route element={<AppShell />}>
            <Route path="*" element={<p>screen body</p>} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AppProvider>,
  );
  return { user };
}

describe('the app shell', () => {
  it('titles the screen and breadcrumbs its group and client', () => {
    renderShell('/requirements');
    expect(screen.getByRole('heading', { level: 1, name: 'Kravgenomgång' })).toBeInTheDocument();
    expect(screen.getByText('Styrning · Awimex International')).toBeInTheDocument();
  });

  it('marks the current nav item and no other', () => {
    renderShell('/suppliers');
    const current = screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('aria-current') === 'page');
    expect(current).toHaveLength(1);
    expect(current[0]).toHaveTextContent('Leverantörer');
  });

  it('keeps the nav item current on a nested route', () => {
    renderShell('/suppliers/kemipartner-nordic');
    const current = screen
      .getAllByRole('link')
      .find((link) => link.getAttribute('aria-current') === 'page');
    expect(current).toHaveTextContent('Leverantörer');
  });

  it('switches every string when the language changes', async () => {
    const { user } = renderShell('/requirements');
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Kravgenomgång');

    await user.click(screen.getByRole('button', { name: 'EN' }));

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Requirements');
    expect(screen.getByRole('link', { name: /Environmental aspects/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Export' })).toBeInTheDocument();
  });

  it('tells the browser and assistive tech which language is showing', async () => {
    const { user } = renderShell();
    expect(document.documentElement.lang).toBe('sv');
    await user.click(screen.getByRole('button', { name: 'EN' }));
    expect(document.documentElement.lang).toBe('en');
  });

  it('marks the active language on the toggle', async () => {
    const { user } = renderShell();
    expect(screen.getByRole('button', { name: 'SV' })).toHaveAttribute('aria-pressed', 'true');
    await user.click(screen.getByRole('button', { name: 'EN' }));
    expect(screen.getByRole('button', { name: 'EN' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: 'SV' })).toHaveAttribute('aria-pressed', 'false');
  });

  it('names Awimex International as the client', () => {
    renderShell();
    expect(screen.getByText('Awimex International')).toBeInTheDocument();
  });

  it('stays on the one client when the switcher is used', async () => {
    // The switcher cycles; with a single client it must land back on it rather
    // than blanking out.
    const { user } = renderShell();
    expect(ORGANIZATIONS).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /Byt kund/ }));
    expect(screen.getByText('Awimex International')).toBeInTheDocument();
  });

  it('shows no avatar while no user is signed in', () => {
    renderShell();
    expect(screen.queryByTitle(/Karlsson/)).not.toBeInTheDocument();
  });

  it('badges the requirements item with every requirement still open', () => {
    renderShell();
    const link = screen.getByRole('link', { name: /Kravgenomgång/ });
    expect(link.textContent).toMatch(/Kravgenomgång30/);
  });

  it('offers a skip link to the content', () => {
    renderShell();
    const skip = screen.getByRole('link', { name: 'Hoppa till innehållet' });
    expect(skip).toHaveAttribute('href', '#norma-content');
    expect(document.getElementById('norma-content')).toBeInTheDocument();
  });

  it('opens the navigation drawer from the header', async () => {
    const { user } = renderShell();
    const sidebar = document.getElementById('norma-sidebar')!;
    expect(sidebar).toHaveAttribute('data-open', 'false');

    await user.click(screen.getByRole('button', { name: 'Öppna meny' }));
    expect(sidebar).toHaveAttribute('data-open', 'true');

    // Choosing a destination puts the drawer away again.
    await user.click(screen.getByRole('link', { name: /Dokument/ }));
    expect(document.getElementById('norma-sidebar')).toHaveAttribute('data-open', 'false');
  });
});
