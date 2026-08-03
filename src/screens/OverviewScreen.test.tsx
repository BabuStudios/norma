import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { renderScreen } from '@/test/render';
import { OverviewScreen } from './OverviewScreen';

const render = () => renderScreen(<OverviewScreen />, { route: '/overview' });

describe('the overview, starting from nothing', () => {
  it('says no external audit is booked rather than inventing a date', () => {
    render();
    expect(screen.getByText('Ingen bokad')).toBeInTheDocument();
    expect(screen.queryByText(/Certifieringsrevision/)).not.toBeInTheDocument();
  });

  it('shows an empty change log with an explanation, not a blank area', () => {
    render();
    expect(screen.getByText(/Inga ändringar loggade ännu/)).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
