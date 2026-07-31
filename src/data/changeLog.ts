import type { Bilingual } from './types';

/**
 * The traceable change log shown on the overview.
 *
 * Empty: nothing has happened in this system yet. Entries appear as the
 * company works — status changes, approvals, ticked steps.
 *
 * In production this is an append-only audit log held server-side. The GDPR
 * screen promises it is immutable, so it must never be reconstructed on the
 * client; this array only stands in for the API response.
 */
export interface ChangeLogEntry {
  when: string;
  who: string;
  what: Bilingual;
  ref: string;
}

export const CHANGE_LOG: ChangeLogEntry[] = [];
