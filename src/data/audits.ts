import type { Bilingual, PillKind } from './types';

/**
 * Internal audit (§9.2). The programme and the checklists are the company's
 * own — an audit programme has to cover their processes and areas — so both
 * start empty.
 */
export interface PlannedAudit {
  week: string;
  area: Bilingual;
  auditor: Bilingual;
  clauses: string;
  kind: PillKind;
  state: Bilingual;
}

export const AUDIT_PROGRAMME: PlannedAudit[] = [];

export interface ChecklistQuestion {
  clause: string;
  question: Bilingual;
  defaultChecked: boolean;
}

export const AUDIT_CHECKLIST: ChecklistQuestion[] = [];

/** Findings to date. Nothing audited yet, so nothing found. */
export const AUDIT_FINDINGS = { major: 0, minor: 0, observations: 0 };
