import { describe, expect, it } from 'vitest';
import { CLAUSES } from '@/data/clauses';
import { findClause } from './conformity';
import { evidenceKind, evidenceRows, KIND_LABEL } from './evidence';

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

  it('renders one row per evidence item with a localized name and chip', () => {
    const sv = evidenceRows(clause, 'prog', 'sv');
    expect(sv).toHaveLength(clause.sv.evidence.length);
    expect(sv[0].name).toBe(clause.sv.evidence[0]);
    expect(sv[0].kindLabel).toBe(KIND_LABEL[sv[0].kind].sv);
  });

  it('interpolates the evidence name into its description', () => {
    const [row] = evidenceRows(clause, 'prog', 'sv');
    expect(row.description).toContain(row.name);
    expect(row.description).not.toContain('{name}');
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
    const rows = evidenceRows(clause, 'met', 'sv');
    expect(rows.every((r) => r.onFile)).toBe(true);
    expect(rows.every((r) => r.stateLabel === 'Finns')).toBe(true);
  });

  it('marks only the first item on file while the clause is in progress', () => {
    const rows = evidenceRows(clause, 'prog', 'en');
    expect(rows[0].onFile).toBe(true);
    expect(rows.slice(1).every((r) => !r.onFile)).toBe(true);
    expect(rows[1]?.stateLabel).toBe('Missing');
  });
});
