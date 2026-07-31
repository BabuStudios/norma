import type { Bilingual, PillKind } from './types';

/**
 * Field mode: what staff see on a phone. Nothing is in flight yet, so the
 * walk and the task list are both empty.
 */
export const FIELD_WALK: { clause: string; done: number; total: number } | null = null;

export interface FieldCheck {
  question: Bilingual;
  checked: boolean;
}

export const FIELD_CHECKS: FieldCheck[] = [];

export interface FieldTask {
  clause: string;
  title: Bilingual;
  due: Bilingual;
  kind: PillKind;
}

export const FIELD_TASKS: FieldTask[] = [];
