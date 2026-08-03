import { describe, expect, it } from 'vitest';
import { CLAUSES } from '@/data/clauses';
import { findClause } from './conformity';
import { evidenceKind, evidenceRows, KIND_LABEL, uploadsForClause, type UploadedFile } from './evidence';

const file = (name: string): UploadedFile => ({
  id: name,
  name,
  size: 1024,
  uploadedAt: '2026-01-01T00:00:00.000Z',
});

describe('evidenceKind', () => {
  it('classifies from the Swedish label', () => {
    expect(evidenceKind('Protokoll från ledningsgruppen')).toBe('minutes');
    expect(evidenceKind('Lagkravsregister')).toBe('register');
    expect(evidenceKind('Ändringsloggar')).toBe('register');
    expect(evidenceKind('Kompetensmatris')).toBe('register');
    expect(evidenceKind('Utbildningsintyg och utvärderingar')).toBe('certificate');
    expect(evidenceKind('Omvärldsanalys (SWOT eller PESTLE)')).toBe('analysis');
  });

  it('falls back to a plain document', () => {
    expect(evidenceKind('Signerad policy')).toBe('document');
    expect(evidenceKind('')).toBe('document');
  });

  it('prefers the earlier pattern when a label matches more than one', () => {
    // "Övningsprotokoll" is minutes, not a register, even though other rules
    // could fire on similar words.
    expect(evidenceKind('Övningsprotokoll')).toBe('minutes');
    // Register wins over analysis here: it is checked first.
    expect(evidenceKind('Miljöaspektregister med bedömningskriterier')).toBe('register');
  });
});

describe('evidenceRows', () => {
  const clause = findClause('4.1')!;

  it('renders one row per evidence item with a localized name, chip and description', () => {
    const sv = evidenceRows(clause, 'prog', 'sv');
    expect(sv).toHaveLength(clause.sv.evidence.length);
    expect(sv[0].name).toBe(clause.sv.evidence[0].label);
    expect(sv[0].description).toBe(clause.sv.evidence[0].ask);
    expect(sv[0].kindLabel).toBe(KIND_LABEL[sv[0].kind].sv);
  });

  it('carries the hand-authored description straight through, not a generated one', () => {
    // Each evidence item's description is authored in the catalogue
    // (EvidenceItem.ask), not built from a template — there is no
    // interpolation step left for evidenceRows to get wrong.
    for (const c of CLAUSES) {
      for (const lang of ['sv', 'en'] as const) {
        const rows = evidenceRows(c, 'prog', lang);
        expect(rows.map((r) => r.description)).toEqual(c[lang].evidence.map((e) => e.ask));
      }
    }
  });

  it('gives the same type chip in both languages for every clause', () => {
    // The prototype derived the chip from the localized label, so a clause
    // could read "Register" in Swedish and "Document" in English.
    for (const c of CLAUSES) {
      const sv = evidenceRows(c, 'prog', 'sv');
      const en = evidenceRows(c, 'prog', 'en');
      expect(en.map((r) => r.kind)).toEqual(sv.map((r) => r.kind));
    }
  });

  it('marks everything on file once the clause is met', () => {
    // "Met" asserts the artifacts exist, so this is the one state where they do.
    const rows = evidenceRows(clause, 'met', 'sv');
    expect(rows.every((r) => r.onFile)).toBe(true);
    expect(rows.every((r) => r.stateLabel === 'Finns')).toBe(true);
  });

  it('marks nothing on file while the clause is only in progress', () => {
    const rows = evidenceRows(clause, 'prog', 'en');
    expect(rows.every((r) => !r.onFile)).toBe(true);
    expect(rows.every((r) => r.stateLabel === 'Missing')).toBe(true);
  });

  it('marks nothing on file for an unassessed clause', () => {
    const rows = evidenceRows(clause, undefined, 'sv');
    expect(rows).toHaveLength(clause.sv.evidence.length);
    expect(rows.every((r) => !r.onFile)).toBe(true);
    expect(rows.every((r) => r.stateLabel === 'Saknas')).toBe(true);
  });

  it('marks an evidence item on file once a file is attached, regardless of clause status', () => {
    const rows = evidenceRows(clause, undefined, 'sv', { 0: [file('policy.pdf')] });
    expect(rows[0].onFile).toBe(true);
    expect(rows[0].stateLabel).toBe('Finns');
    expect(rows[0].files).toEqual([file('policy.pdf')]);
  });

  it('leaves evidence items with no attachment untouched', () => {
    const rows = evidenceRows(clause, undefined, 'sv', { 0: [file('policy.pdf')] });
    for (const row of rows.slice(1)) {
      expect(row.onFile).toBe(false);
      expect(row.files).toEqual([]);
    }
  });
});

describe('uploadsForClause', () => {
  it('narrows the global upload map to one clause, re-keyed by evidence index', () => {
    const uploads = {
      '4.1:0': [file('a.pdf')],
      '4.1:2': [file('b.pdf'), file('c.pdf')],
      '4.2:0': [file('other-clause.pdf')],
    };
    expect(uploadsForClause(uploads, '4.1')).toEqual({
      0: [file('a.pdf')],
      2: [file('b.pdf'), file('c.pdf')],
    });
  });

  it('does not confuse a clause id that is a prefix of another', () => {
    // "6.1" must not pick up files stored under "6.1.2".
    const uploads = { '6.1.2:0': [file('aspects.pdf')] };
    expect(uploadsForClause(uploads, '6.1')).toEqual({});
    expect(uploadsForClause(uploads, '6.1.2')).toEqual({ 0: [file('aspects.pdf')] });
  });

  it('is empty for a clause with nothing uploaded', () => {
    expect(uploadsForClause({}, '4.1')).toEqual({});
  });

  it('drops an entry that has been emptied out rather than keeping an empty array', () => {
    expect(uploadsForClause({ '4.1:0': [] }, '4.1')).toEqual({});
  });
});
