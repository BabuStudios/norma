import type { Bilingual } from '@/data/types';

export type ScreenId =
  | 'dash'
  | 'context'
  | 'objectives'
  | 'communication'
  | 'competence'
  | 'compliance'
  | 'emergency'
  | 'improvement'
  | 'req'
  | 'docs'
  | 'aspects'
  | 'audits'
  | 'sup'
  | 'review'
  | 'field'
  | 'settings';

export interface NavItem {
  id: ScreenId;
  /** Route the sidebar links to. The prototype had no routing; production does. */
  path: string;
  label: Bilingual;
}

export interface NavGroup {
  label: Bilingual;
  items: NavItem[];
}

export const NAV: NavGroup[] = [
  {
    label: { sv: 'Styrning', en: 'Steering' },
    items: [
      { id: 'dash', path: '/overview', label: { sv: 'Ledningssystem', en: 'Management system' } },
      {
        id: 'context',
        path: '/processes/context',
        label: { sv: 'Verksamhetens förutsättningar', en: 'Context & interested parties' },
      },
      {
        id: 'objectives',
        path: '/processes/objectives',
        label: { sv: 'Mål och handlingsplaner', en: 'Objectives & action plans' },
      },
      {
        id: 'communication',
        path: '/processes/communication',
        label: { sv: 'Kommunikation', en: 'Communication' },
      },
      {
        id: 'competence',
        path: '/processes/competence',
        label: { sv: 'Kompetens och medvetenhet', en: 'Competence & awareness' },
      },
      {
        id: 'compliance',
        path: '/processes/compliance',
        label: { sv: 'Efterlevnad av lagkrav', en: 'Compliance obligations' },
      },
      {
        id: 'emergency',
        path: '/processes/emergency',
        label: { sv: 'Beredskap och agerande vid nödläge', en: 'Emergency preparedness' },
      },
      {
        id: 'improvement',
        path: '/processes/improvement',
        label: { sv: 'Avvikelser och ständiga förbättringar', en: 'Nonconformity & improvement' },
      },
    ],
  },
  {
    label: { sv: 'Krav', en: 'Requirements' },
    items: [
      { id: 'req', path: '/requirements', label: { sv: 'Kravgenomgång', en: 'Requirements' } },
      { id: 'docs', path: '/documents', label: { sv: 'Dokument', en: 'Documents' } },
    ],
  },
  {
    label: { sv: 'Planering', en: 'Planning' },
    items: [
      {
        id: 'aspects',
        path: '/aspects',
        label: { sv: 'Miljöaspekter', en: 'Environmental aspects' },
      },
    ],
  },
  {
    label: { sv: 'Drift', en: 'Operation' },
    items: [
      { id: 'audits', path: '/audits', label: { sv: 'Internrevision', en: 'Internal audits' } },
      { id: 'sup', path: '/suppliers', label: { sv: 'Leverantörer', en: 'Suppliers' } },
      {
        id: 'review',
        path: '/management-review',
        label: { sv: 'Ledningens genomgång', en: 'Management review' },
      },
    ],
  },
  {
    label: { sv: 'System', en: 'System' },
    items: [
      {
        id: 'field',
        path: '/field-mode',
        label: { sv: 'Fältläge (mobil)', en: 'Field mode (mobile)' },
      },
      {
        id: 'settings',
        path: '/settings',
        label: { sv: 'Inställningar & GDPR', en: 'Settings & GDPR' },
      },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV.flatMap((group) => group.items);

/** The nav item and its group for a pathname, used for the header breadcrumb. */
export function locate(pathname: string): { item: NavItem; group: NavGroup } {
  for (const group of NAV) {
    for (const item of group.items) {
      if (pathname === item.path || pathname.startsWith(`${item.path}/`)) {
        return { item, group };
      }
    }
  }
  return { item: NAV[0].items[0], group: NAV[0] };
}
