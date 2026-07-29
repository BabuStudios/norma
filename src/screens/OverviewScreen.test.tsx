import { screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CLAUSES } from '@/data/clauses';
import { inStandard, notMet } from '@/domain/conformity';
import { renderScreen } from '@/test/render';
import { OverviewScreen } from './OverviewScreen';

const render = () => renderScreen(<OverviewScreen />, { route: '/overview' });

/** The two headline cells are distinguished only by the panel they control. */
const toggleFor = (standard: '9001' | '14001') =>
  document.querySelector<HTMLButtonElement>(`[aria-controls="not-met-${standard}"]`)!;

describe('the overview', () => {
  it('shows how many requirements are not met, per standard', () => {
    render();
    const expected9001 = notMet(inStandard('9001'), {}).length;
    const expected14001 = notMet(inStandard('14001'), {}).length;

    expect(toggleFor('9001')).toHaveTextContent(String(expected9001));
    expect(toggleFor('14001')).toHaveTextContent(String(expected14001));
  });

  it('opens the not-met list and closes it again on the same button', async () => {
    const { user } = render();
    await user.click(toggleFor('9001'));
    expect(document.getElementById('not-met-9001')).toBeInTheDocument();
    expect(toggleFor('9001')).toHaveAttribute('aria-expanded', 'true');

    await user.click(toggleFor('9001'));
    expect(document.getElementById('not-met-9001')).not.toBeInTheDocument();
  });

  it('closes the list on Escape', async () => {
    const { user } = render();
    await user.click(toggleFor('9001'));
    expect(document.getElementById('not-met-9001')).toBeInTheDocument();

    await user.keyboard('{Escape}');
    expect(document.getElementById('not-met-9001')).not.toBeInTheDocument();
  });

  it('closes the list when pressing outside it', async () => {
    const { user } = render();
    await user.click(toggleFor('9001'));
    expect(document.getElementById('not-met-9001')).toBeInTheDocument();

    await user.click(document.body);
    expect(document.getElementById('not-met-9001')).not.toBeInTheDocument();
  });

  it('navigates to the chosen requirement and closes the list', async () => {
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

  it('lists one progress row per chapter and links it to the requirements', async () => {
    const { user } = render();
    const chapters = [...new Set(CLAUSES.map((c) => c.chapter))];
    const rows = screen.getAllByRole('button', { name: /%/ });
    expect(rows).toHaveLength(chapters.length);

    await user.click(rows[0]);
    expect(screen.getByTestId('pathname')).toHaveTextContent('/requirements');
  });

  it('shows the traceable change log', () => {
    render();
    expect(screen.getByText('Ändringslogg (spårbar)')).toBeInTheDocument();
    expect(screen.getByText(/Godkände D-014/)).toBeInTheDocument();
  });
});
