import { describe, expect, it } from 'vitest';
import { CLAUSES, type Clause } from '@/data/clauses';
import {
  chapterProgress,
  conformity,
  findClause,
  inStandard,
  notMet,
  standardLabel,
  statusOf,
  type StatusMap,
} from './conformity';

function clause(id: string, over: Partial<Clause> = {}): Clause {
  const text = { title: id, what: '', steps: [], evidence: [] };
  return {
    id,
    number: id,
    chapter: '4',
    standard: 'both',
    defaultStatus: 'prog',
    refs: '',
    sv: text,
    en: text,
    ...over,
  };
}

describe('statusOf', () => {
  it('falls back to the seeded status', () => {
    expect(statusOf(clause('4.1', { defaultStatus: 'met' }), {})).toBe('met');
  });

  it('prefers a user override', () => {
    const statuses: StatusMap = { '4.1': 'prog' };
    expect(statusOf(clause('4.1', { defaultStatus: 'met' }), statuses)).toBe('prog');
  });
});

describe('conformity', () => {
  it('counts a met clause whole and one in progress a half', () => {
    const list = [
      clause('a', { defaultStatus: 'met' }),
      clause('b', { defaultStatus: 'prog' }),
    ];
    expect(conformity(list, {})).toBe(75);
  });

  it('is 100 when everything is met and 50 when everything is in progress', () => {
    const list = [clause('a'), clause('b')];
    expect(conformity(list, { a: 'met', b: 'met' })).toBe(100);
    expect(conformity(list, { a: 'prog', b: 'prog' })).toBe(50);
  });

  it('rounds to whole percent', () => {
    const list = [clause('a'), clause('b'), clause('c')];
    expect(conformity(list, { a: 'met', b: 'prog', c: 'prog' })).toBe(67);
  });

  it('returns zero rather than dividing by zero on an empty list', () => {
    expect(conformity([], {})).toBe(0);
  });
});

describe('inStandard', () => {
  const list = [
    clause('shared', { standard: 'both' }),
    clause('quality', { standard: '9001' }),
    clause('environment', { standard: '14001' }),
  ];

  it('includes integrated clauses in both standards', () => {
    expect(inStandard('9001', list).map((c) => c.id)).toEqual(['shared', 'quality']);
    expect(inStandard('14001', list).map((c) => c.id)).toEqual(['shared', 'environment']);
  });

  it('covers the whole catalogue between the two standards', () => {
    const ids = new Set([
      ...inStandard('9001').map((c) => c.id),
      ...inStandard('14001').map((c) => c.id),
    ]);
    expect(ids.size).toBe(CLAUSES.length);
  });
});

describe('notMet', () => {
  it('returns everything that is not met, including clauses in progress', () => {
    const list = [clause('a'), clause('b'), clause('c')];
    expect(notMet(list, { a: 'met', b: 'prog' }).map((c) => c.id)).toEqual(['b', 'c']);
  });

  it('is empty once every clause is met', () => {
    const statuses = Object.fromEntries(CLAUSES.map((c) => [c.id, 'met' as const]));
    expect(notMet(CLAUSES, statuses)).toHaveLength(0);
  });
});

describe('chapterProgress', () => {
  it('reports one row per chapter, in order', () => {
    expect(chapterProgress({}).map((r) => r.chapter.id)).toEqual([
      '4',
      '5',
      '6',
      '7',
      '8',
      '9',
      '10',
    ]);
  });

  it('flags a chapter as behind only below half', () => {
    const allProg = Object.fromEntries(CLAUSES.map((c) => [c.id, 'prog' as const]));
    // Everything in progress is exactly 50%, which is not behind.
    expect(chapterProgress(allProg).every((r) => r.percent === 50 && !r.behind)).toBe(true);
  });

  it('is behind when a chapter has nothing met and something below half', () => {
    const rows = chapterProgress({});
    for (const row of rows) expect(row.behind).toBe(row.percent < 50);
  });
});

describe('standardLabel', () => {
  it('names the integrated case explicitly', () => {
    expect(standardLabel('both')).toBe('ISO 9001 + ISO 14001');
    expect(standardLabel('9001')).toBe('ISO 9001');
    expect(standardLabel('14001')).toBe('ISO 14001');
  });
});

describe('findClause', () => {
  it('finds a clause by id and distinguishes the environment variants', () => {
    expect(findClause('8.2')?.standard).toBe('9001');
    expect(findClause('8.2e')?.standard).toBe('14001');
    expect(findClause('8.2e')?.number).toBe('8.2');
  });

  it('returns undefined for an unknown or missing id', () => {
    expect(findClause('99.9')).toBeUndefined();
    expect(findClause(undefined)).toBeUndefined();
  });
});
