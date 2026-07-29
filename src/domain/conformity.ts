import { CHAPTERS, CLAUSES, type Chapter, type Clause } from '@/data/clauses';
import type { ClauseStatus, Standard } from '@/data/types';

/** Per-clause status overrides, keyed by clause id. */
export type StatusMap = Record<string, ClauseStatus>;

export function statusOf(clause: Clause, statuses: StatusMap): ClauseStatus {
  return statuses[clause.id] ?? clause.defaultStatus;
}

/**
 * Conformity as a percentage: a met clause counts one, a clause in progress
 * counts a half. Used for the chapter bars and the two headline figures.
 */
export function conformity(clauses: Clause[], statuses: StatusMap): number {
  if (clauses.length === 0) return 0;
  const earned = clauses.reduce((sum, clause) => {
    const status = statusOf(clause, statuses);
    return sum + (status === 'met' ? 1 : status === 'prog' ? 0.5 : 0);
  }, 0);
  return Math.round((earned / clauses.length) * 100);
}

/** Clauses that count towards a standard. `both` clauses count towards each. */
export function inStandard(standard: '9001' | '14001', clauses = CLAUSES): Clause[] {
  const excluded: Standard = standard === '9001' ? '14001' : '9001';
  return clauses.filter((clause) => clause.standard !== excluded);
}

export function notMet(clauses: Clause[], statuses: StatusMap): Clause[] {
  return clauses.filter((clause) => statusOf(clause, statuses) !== 'met');
}

export interface ChapterProgress {
  chapter: Chapter;
  percent: number;
  /** Below half, the chapter number and bar go accent — it needs attention. */
  behind: boolean;
}

export function chapterProgress(statuses: StatusMap): ChapterProgress[] {
  return CHAPTERS.map((chapter) => {
    const percent = conformity(
      CLAUSES.filter((clause) => clause.chapter === chapter.id),
      statuses,
    );
    return { chapter, percent, behind: percent < 50 };
  });
}

const STANDARD_LABEL: Record<Standard, string> = {
  both: 'ISO 9001 + ISO 14001',
  '9001': 'ISO 9001',
  '14001': 'ISO 14001',
};

export function standardLabel(standard: Standard): string {
  return STANDARD_LABEL[standard];
}

export function findClause(id: string | undefined): Clause | undefined {
  return CLAUSES.find((clause) => clause.id === id);
}
