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
    refs: '',
    sv: text,
    en: text,
    ...over,
  };
}

describe('statusOf', () => {
  it('is undefined until somebody assesses the clause', () => {
    expect(statusOf(clause('4.1'), {})).toBeUndefined();
  });

  it('reads the assessed status', () => {
    const statuses: StatusMap = { '4.1': 'met' };
    expect(statusOf(clause('4.1'), statuses)).toBe('met');
  });
});

describe('conformity', () => {
  it('counts a met clause whole and one in progress a half', () => {
    const list = [clause('a'), clause('b')];
    expect(conformity(list, { a: 'met', b: 'prog' })).toBe(75);
  });

  it('counts an unassessed clause as nothing', () => {
    // A company that has not started reads 0%, not 50%.
    const list = [clause('a'), clause('b')];
    expect(conformity(list, {})).toBe(0);
    expect(conformity(list, { a: 'met' })).toBe(50);
  });

  it('is 100 only when everything is met', () => {
    const list = [clause('a'), clause('b')];
    expect(conformity(list, { a: 'met', b: 'met' })).toBe(100);
    expect(conformity(list, { a: 'met', b: 'prog' })).toBe(75);
  });

  it('rounds to whole percent', () => {
    const list = [clause('a'), clause('b'), clause('c')];
    expect(conformity(list, { a: 'met', b: 'prog', c: 'prog' })).toBe(67);
  });

  it('returns zero rather than dividing by zero on an empty list', () => {
    expect(conformity([], {})).toBe(0);
  });

  it('starts the whole catalogue at zero', () => {
    expect(conformity(CLAUSES, {})).toBe(0);
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
  it('counts both in-progress and unassessed clauses as not met', () => {
    const list = [clause('a'), clause('b'), clause('c')];
    expect(notMet(list, { a: 'met', b: 'prog' }).map((c) => c.id)).toEqual(['b', 'c']);
  });

  it('starts with every requirement outstanding', () => {
    expect(notMet(CLAUSES, {})).toHaveLength(CLAUSES.length);
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

  it('starts every chapter at zero and behind', () => {
    for (const row of chapterProgress({})) {
      expect(row.percent).toBe(0);
      expect(row.behind).toBe(true);
    }
  });

  it('stops being behind at half', () => {
    const allProg = Object.fromEntries(CLAUSES.map((c) => [c.id, 'prog' as const]));
    for (const row of chapterProgress(allProg)) {
      expect(row.percent).toBe(50);
      expect(row.behind).toBe(false);
    }
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
