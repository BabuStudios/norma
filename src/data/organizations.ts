import type { Bilingual } from './types';

/**
 * The consultant multi-client switcher. One fictional company is filled in;
 * the other two carry names and headline figures only, as in the prototype.
 * In production this list comes from the user's client memberships.
 */
export interface Organization {
  name: string;
  meta: Bilingual;
}

export const ORGANIZATIONS: Organization[] = [
  {
    name: 'Nordvik Industri AB',
    meta: { sv: '42 anställda · Ytbehandling', en: '42 employees · Surface treatment' },
  },
  {
    name: 'Bergslagens Bygg AB',
    meta: { sv: '28 anställda · Entreprenad', en: '28 employees · Contracting' },
  },
  {
    name: 'Sävar Logistik AB',
    meta: { sv: '61 anställda · Transport', en: '61 employees · Transport' },
  },
];

/** The signed-in user, shown in the header avatar and the requirement rail. */
export const CURRENT_USER = { name: 'Maja Karlsson', initials: 'MK' };

/** Next external audit, shown on the overview. */
export const NEXT_EXTERNAL_AUDIT = { date: '14 sep 2026', body: 'Intertek' };
