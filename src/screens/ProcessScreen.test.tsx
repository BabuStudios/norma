import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PROCESS_PAGES } from '@/data/processPages';
import { renderScreen } from '@/test/render';
import { ProcessScreen } from './ProcessScreen';

const render = (pageId: string) =>
  renderScreen(<ProcessScreen />, { route: `/processes/${pageId}`, path: '/processes/:pageId' });

describe('a mandatory-process page', () => {
  it('shows the page title, its standard references and intro text', () => {
    render('objectives');
    expect(
      screen.getByRole('heading', { level: 2, name: 'Mål och handlingsplaner' }),
    ).toBeInTheDocument();
    expect(screen.getByText('ISO 9001 §6.2 · ISO 14001 §6.2')).toBeInTheDocument();
    expect(screen.getByText(/Kvalitets- och miljömål ska vara mätbara/)).toBeInTheDocument();
  });

  it('starts with no blocks, same empty state as every other register', () => {
    render('context');
    expect(screen.getByText(/Inget innehåll tillagt än/)).toBeInTheDocument();
  });

  it('does not offer an organization chart, unlike Ledningssystem', async () => {
    const { user } = render('context');
    await user.click(screen.getByRole('button', { name: 'Redigera' }));
    expect(
      screen.queryByRole('button', { name: 'Lägg till organisationsschema' }),
    ).not.toBeInTheDocument();
  });

  it("keeps each page's blocks independent of the others", async () => {
    const first = render('context');
    await first.user.click(screen.getByRole('button', { name: 'Redigera' }));
    await first.user.click(screen.getByRole('button', { name: 'Lägg till textblock' }));
    const heading = screen.getByLabelText('Rubrik');
    await first.user.clear(heading);
    await first.user.type(heading, 'Intressenter');
    await first.user.click(screen.getByRole('button', { name: 'Klar' }));
    expect(screen.getByRole('heading', { level: 3, name: 'Intressenter' })).toBeInTheDocument();
    first.unmount();

    render('objectives');
    expect(screen.queryByText('Intressenter')).not.toBeInTheDocument();
    expect(screen.getByText(/Inget innehåll tillagt än/)).toBeInTheDocument();
  });

  it('redirects to the overview for an unknown page id', () => {
    render('does-not-exist');
    expect(screen.getByTestId('pathname')).toHaveTextContent('/overview');
  });

  it.each(PROCESS_PAGES)('renders $id with its own title', (page) => {
    render(page.id);
    expect(screen.getByRole('heading', { level: 2, name: page.title.sv })).toBeInTheDocument();
  });
});
