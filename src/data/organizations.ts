import type { Bilingual } from './types';

/**
 * The companies this installation manages.
 *
 * One entry, Awimex International, with nothing filled in beyond the name —
 * headcount, industry and the rest are the company's to enter. The sidebar
 * still supports several clients for consultants, so this stays a list.
 */
export interface Organization {
  name: string;
  /** Short descriptor under the name. Absent until the company sets it. */
  meta?: Bilingual;
}

export const ORGANIZATIONS: Organization[] = [{ name: 'Awimex International' }];

/**
 * The signed-in user. Null until authentication is wired up — nothing here
 * should invent a person, since the change log and approvals are supposed to
 * carry a real identity.
 */
export const CURRENT_USER: { name: string; initials: string } | null = null;

/**
 * Next external audit. Null until one is booked; the overview shows an empty
 * state rather than a made-up date.
 */
export const NEXT_EXTERNAL_AUDIT: { date: string; body: string } | null = null;
