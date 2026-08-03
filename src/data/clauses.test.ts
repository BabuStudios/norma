import { describe, expect, it } from 'vitest';
import { CHAPTERS, CLAUSES, DEFAULT_CLAUSE_ID } from './clauses';

/**
 * The catalogue is hand-authored content, so these guard the properties the
 * screens rely on rather than the exact wording.
 */
describe('the requirements catalogue', () => {
  it('covers chapters 4 to 10', () => {
    expect(CHAPTERS.map((c) => c.id)).toEqual(['4', '5', '6', '7', '8', '9', '10']);
  });

  it('has a unique id per clause', () => {
    const ids = CLAUSES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('places every clause on a known chapter', () => {
    const known = new Set(CHAPTERS.map((c) => c.id));
    for (const clause of CLAUSES) expect(known).toContain(clause.chapter);
  });

  it('leaves no chapter empty', () => {
    for (const chapter of CHAPTERS) {
      expect(CLAUSES.some((c) => c.chapter === chapter.id)).toBe(true);
    }
  });

  it('keeps the steps and evidence arrays parallel across languages', () => {
    // evidenceRows() indexes the Swedish evidence array while rendering the
    // English one; a length mismatch would silently misclassify a chip.
    for (const clause of CLAUSES) {
      expect(clause.en.steps).toHaveLength(clause.sv.steps.length);
      expect(clause.en.evidence).toHaveLength(clause.sv.evidence.length);
    }
  });

  it('authors both languages for every clause', () => {
    for (const clause of CLAUSES) {
      for (const lang of ['sv', 'en'] as const) {
        expect(clause[lang].title.trim()).not.toBe('');
        expect(clause[lang].what.trim()).not.toBe('');
        expect(clause[lang].steps.length).toBeGreaterThan(0);
        expect(clause[lang].evidence.length).toBeGreaterThan(0);
        for (const step of clause[lang].steps) expect(step.trim()).not.toBe('');
        for (const item of clause[lang].evidence) {
          expect(item.label.trim()).not.toBe('');
          expect(item.ask.trim()).not.toBe('');
        }
      }
    }
  });

  it('writes a real, item-specific description for every evidence item', () => {
    // A generic per-type template would repeat the same sentence shape across
    // unrelated evidence — guard against that regressing back in.
    for (const clause of CLAUSES) {
      for (const lang of ['sv', 'en'] as const) {
        for (const item of clause[lang].evidence) {
          expect(item.ask).not.toBe(item.label);
          expect(item.ask.length).toBeGreaterThan(item.label.length);
        }
      }
    }
  });

  it('gives every evidence item its own description, not a shared template', () => {
    // This is the property a generic per-type template would violate: every
    // "document"-kind item once read identically apart from the interpolated
    // name. Substring-checking the label against the description doesn't work
    // as a check here — Swedish definite forms can reorder letters inside a
    // word (register -> registret), so uniqueness is the reliable signal.
    for (const lang of ['sv', 'en'] as const) {
      const asks = CLAUSES.flatMap((c) => c[lang].evidence.map((e) => e.ask));
      expect(new Set(asks).size).toBe(asks.length);
    }
  });

  it('cites clause numbers and carries a displayable number', () => {
    for (const clause of CLAUSES) {
      expect(clause.refs).toMatch(/§/);
      expect(clause.number).toMatch(/^\d+(\.\d+)*$/);
      // Environment-only variants share a number with their 9001 sibling and
      // carry an `e` suffix on the id to stay unique.
      expect(clause.id.startsWith(clause.number)).toBe(true);
    }
  });

  it('points the default clause at something real', () => {
    expect(CLAUSES.some((c) => c.id === DEFAULT_CLAUSE_ID)).toBe(true);
  });

  it('quotes no standard text — explanations are our own paraphrase', () => {
    // A crude tripwire: the paraphrase never uses the standards' normative
    // verb forms, which is the shape copied text would take.
    for (const clause of CLAUSES) {
      expect(clause.en.what).not.toMatch(/\bThe organization shall\b/i);
      expect(clause.sv.what).not.toMatch(/\bOrganisationen ska\b/i);
    }
  });
});
