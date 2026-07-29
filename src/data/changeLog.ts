import type { Bilingual } from './types';

/**
 * The traceable change log shown on the overview.
 *
 * In production this is an append-only audit log held server-side — the GDPR
 * screen promises it is immutable, so it must not be reconstructed on the
 * client. This array stands in for the API response.
 */
export interface ChangeLogEntry {
  when: string;
  who: string;
  what: Bilingual;
  ref: string;
}

export const CHANGE_LOG: ChangeLogEntry[] = [
  {
    when: '2026-07-27 09:12',
    who: 'Maja K.',
    what: {
      sv: 'Ändrade status på 6.1.3 till Pågår',
      en: 'Changed status of 6.1.3 to In progress',
    },
    ref: '6.1.3',
  },
  {
    when: '2026-07-26 16:40',
    who: 'Erik L.',
    what: {
      sv: 'Godkände D-014 Nödlägesrutin v1.2',
      en: 'Approved D-014 Emergency routine v1.2',
    },
    ref: 'D-014',
  },
  {
    when: '2026-07-26 11:03',
    who: 'Sara N.',
    what: { sv: 'Bockade av steg 2 i krav 6.1.2', en: 'Ticked off step 2 in requirement 6.1.2' },
    ref: '6.1.2',
  },
  {
    when: '2026-07-24 14:22',
    who: 'Maja K.',
    what: {
      sv: 'Lade till miljöaspekt: köldmedium KA-2',
      en: 'Added environmental aspect: refrigerant KA-2',
    },
    ref: '6.1.2',
  },
  {
    when: '2026-07-22 08:55',
    who: 'Anders P.',
    what: { sv: 'Signerade internrevisionsrapport IR-03', en: 'Signed internal audit report IR-03' },
    ref: 'IR-03',
  },
];
