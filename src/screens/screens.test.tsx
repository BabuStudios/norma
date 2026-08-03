import { screen } from '@testing-library/react';
import type { ReactElement } from 'react';
import { beforeEach, describe, expect, it } from 'vitest';
import type { Lang } from '@/data/types';
import { renderScreen } from '@/test/render';
import { AspectsScreen } from './AspectsScreen';
import { AuditsScreen } from './AuditsScreen';
import { DocumentsScreen } from './DocumentsScreen';
import { FieldModeScreen } from './FieldModeScreen';
import { ManagementReviewScreen } from './ManagementReviewScreen';
import { OverviewScreen } from './OverviewScreen';
import { RequirementsScreen } from './RequirementsScreen';
import { SettingsScreen } from './SettingsScreen';
import { SuppliersScreen } from './SuppliersScreen';

/** AppProvider reads its initial state from storage, so seed before rendering. */
function useLanguage(lang: Lang) {
  window.localStorage.setItem('norma.state.v1', JSON.stringify({ lang }));
}

const SCREENS: {
  name: string;
  element: ReactElement;
  route: string;
  path: string;
  /** A string that must appear, proving the screen rendered its own content. */
  marker: Record<Lang, string | RegExp>;
}[] = [
  {
    name: 'overview',
    element: <OverviewScreen />,
    route: '/overview',
    path: '/overview',
    marker: { sv: 'Ändringslogg (spårbar)', en: 'Change log (traceable)' },
  },
  {
    name: 'requirements',
    element: <RequirementsScreen />,
    route: '/requirements/6.1.2',
    path: '/requirements/:clauseId',
    marker: {
      sv: 'Bevis som revisorn vill se',
      en: 'Evidence the auditor wants',
    },
  },
  {
    name: 'documents',
    element: <DocumentsScreen />,
    route: '/documents',
    path: '/documents',
    marker: { sv: /Använd mall/, en: /Use template/ },
  },
  {
    name: 'aspects',
    element: <AspectsScreen />,
    route: '/aspects',
    path: '/aspects',
    marker: { sv: /Livscykelperspektiv/, en: /Life cycle perspective/ },
  },
  {
    name: 'audits',
    element: <AuditsScreen />,
    route: '/audits',
    path: '/audits',
    marker: { sv: 'Revisionsprogram 2026', en: 'Audit programme 2026' },
  },
  {
    name: 'suppliers',
    element: <SuppliersScreen />,
    route: '/suppliers',
    path: '/suppliers/:supplierId?',
    marker: {
      sv: /Inga leverantörer registrerade/,
      en: /No suppliers registered/,
    },
  },
  {
    name: 'management review',
    element: <ManagementReviewScreen />,
    route: '/management-review',
    path: '/management-review',
    marker: { sv: 'Underlag till mötet', en: 'Inputs to the meeting' },
  },
  {
    name: 'field mode',
    element: <FieldModeScreen />,
    route: '/field-mode',
    path: '/field-mode',
    marker: {
      sv: /Ingen revisionsrunda pågår/,
      en: /No audit walk in progress/,
    },
  },
  {
    name: 'settings',
    element: <SettingsScreen />,
    route: '/settings',
    path: '/settings',
    marker: { sv: 'Roller och behörigheter', en: 'Roles and permissions' },
  },
];

describe.each(['sv', 'en'] as const)('every screen in %s', (lang) => {
  beforeEach(() => useLanguage(lang));

  it.each(SCREENS)('renders $name', ({ element, route, path, marker }) => {
    renderScreen(element, { route, path });
    // getAllByText: some markers legitimately repeat, such as the "use
    // template" link on each of the four template cards.
    expect(screen.getAllByText(marker[lang]).length).toBeGreaterThan(0);
  });
});

describe('screens that present tabular data', () => {
  beforeEach(() => useLanguage('sv'));

  // Only the GDPR screen still has rows, since its content describes the
  // system rather than the company. The rest show their empty state.
  it('gives the settings screen real tables with column headers', () => {
    renderScreen(<SettingsScreen />, { route: '/settings', path: '/settings' });
    expect(screen.getAllByRole('table').length).toBeGreaterThan(0);
    expect(screen.getAllByRole('columnheader').length).toBeGreaterThan(0);
  });

  it.each([
    ['documents', <DocumentsScreen key="d" />, '/documents', /Inga dokument ännu/],
    ['aspects', <AspectsScreen key="a" />, '/aspects', /Miljöaspektregistret är tomt/],
    ['audits', <AuditsScreen key="au" />, '/audits', /Inget revisionsprogram lagt/],
  ])('shows an empty state on %s rather than an empty table', (_n, element, route, marker) => {
    renderScreen(element, { route, path: route });
    expect(screen.getByText(marker)).toBeInTheDocument();
    expect(screen.queryByRole('table')).not.toBeInTheDocument();
  });
});
