import { describe, expect, it } from 'vitest';
import { CLAUSES } from '@/data/clauses';
import type { ManagedDocument } from '@/data/documents';
import { findClause } from './conformity';
import { evidenceKind, evidenceRows, KIND_LABEL, linkedDocumentsForClause } from './evidence';

const doc = (id: string, name: string): ManagedDocument => ({
  id,
  name: { sv: name, en: name },
  version: '1.0',
  owner: '',
  nextReview: '',
  kind: 'soft',
  state: { sv: 'Utkast', en: 'Draft' },
  tabId: 'templates',
  metadata: {},
  fileName: null,
  fileSize: null,
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

  it('marks an evidence item on file once a document is linked, regardless of clause status', () => {
    const policy = doc('D001', 'policy.pdf');
    const rows = evidenceRows(clause, undefined, 'sv', { 0: [policy] });
    expect(rows[0].onFile).toBe(true);
    expect(rows[0].stateLabel).toBe('Finns');
    expect(rows[0].linkedDocuments).toEqual([policy]);
  });

  it('leaves evidence items with no link untouched', () => {
    const rows = evidenceRows(clause, undefined, 'sv', { 0: [doc('D001', 'policy.pdf')] });
    for (const row of rows.slice(1)) {
      expect(row.onFile).toBe(false);
      expect(row.linkedDocuments).toEqual([]);
    }
  });
});

describe('linkedDocumentsForClause', () => {
  const registry = [doc('D001', 'a.pdf'), doc('D002', 'b.pdf'), doc('D003', 'c.pdf')];

  it('narrows the global link map to one clause, re-keyed by evidence index', () => {
    const links = {
      '4.1:0': ['D001'],
      '4.1:2': ['D002', 'D003'],
      '4.2:0': ['D001'],
    };
    expect(linkedDocumentsForClause(links, registry, '4.1')).toEqual({
      0: [doc('D001', 'a.pdf')],
      2: [doc('D002', 'b.pdf'), doc('D003', 'c.pdf')],
    });
  });

  it('does not confuse a clause id that is a prefix of another', () => {
    // "6.1" must not pick up links stored under "6.1.2".
    const links = { '6.1.2:0': ['D001'] };
    expect(linkedDocumentsForClause(links, registry, '6.1')).toEqual({});
    expect(linkedDocumentsForClause(links, registry, '6.1.2')).toEqual({
      0: [doc('D001', 'a.pdf')],
    });
  });

  it('is empty for a clause with nothing linked', () => {
    expect(linkedDocumentsForClause({}, registry, '4.1')).toEqual({});
  });

  it('drops an entry that has been emptied out rather than keeping an empty array', () => {
    expect(linkedDocumentsForClause({ '4.1:0': [] }, registry, '4.1')).toEqual({});
  });

  it('drops a link whose document no longer exists in the register', () => {
    const links = { '4.1:0': ['D999'] };
    expect(linkedDocumentsForClause(links, registry, '4.1')).toEqual({});
  });
});
