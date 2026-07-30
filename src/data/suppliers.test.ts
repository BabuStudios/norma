import { describe, expect, it } from 'vitest';
import {
  OPTIONAL_COLUMNS,
  SUPPLIERS,
  SUPPLIER_FACTS,
  SUPPLIER_FIELDS,
  resolveSupplier,
  type SupplierSeed,
} from './suppliers';

/**
 * The register ships empty, so resolveSupplier is exercised against a fixture
 * rather than seeded data. The fixture also documents the stored shape.
 */
const fixture: SupplierSeed = {
  id: 'fixture-ab',
  name: 'Fixture AB',
  category: { sv: 'Basmaterial', en: 'Base material' },
  certs: '9001, 14001',
  lastEvaluated: '2026-02-10',
  nextEvaluation: '2027-02-10',
  score: 92,
  kind: 'met',
  state: { sv: 'Godkänd', en: 'Approved' },
  regNo: '556213-4471',
  contact: 'Per Ohlsson',
  spend: '2,4 Mkr',
  risk: { sv: 'Medel', en: 'Medium' },
  terms: { sv: 'Miljökrav i avtal', en: 'Environmental terms in contract' },
  documents: [],
};

describe('the supplier register', () => {
  it('ships empty — suppliers are the company’s to add', () => {
    expect(SUPPLIERS).toHaveLength(0);
  });
});

describe('resolveSupplier', () => {
  it('resolves bilingual fields into the chosen language', () => {
    expect(resolveSupplier(fixture, 'sv').category).toBe('Basmaterial');
    expect(resolveSupplier(fixture, 'en').category).toBe('Base material');
    expect(resolveSupplier(fixture, 'en').state).toBe('Approved');
  });

  it('lets an override win over the stored value', () => {
    const resolved = resolveSupplier(fixture, 'sv', { contact: 'Astrid Berg', score: 77 });
    expect(resolved.contact).toBe('Astrid Berg');
    expect(resolved.score).toBe(77);
  });

  it('leaves untouched fields alone when overriding', () => {
    const resolved = resolveSupplier(fixture, 'sv', { contact: 'Astrid Berg' });
    expect(resolved.name).toBe('Fixture AB');
    expect(resolved.regNo).toBe('556213-4471');
  });

  it('keeps an override across a language switch', () => {
    // An edited category is plain text: it must not revert when the user flips
    // language, even though the stored value is bilingual.
    const override = { category: 'Ytbehandling' };
    expect(resolveSupplier(fixture, 'en', override).category).toBe('Ytbehandling');
  });
});

describe('the supplier field definitions', () => {
  it('lists eight facts in the read-only aside', () => {
    expect(SUPPLIER_FACTS).toHaveLength(8);
  });

  it('edits twelve fields, and every one exists on a resolved supplier', () => {
    expect(SUPPLIER_FIELDS).toHaveLength(12);
    const resolved = resolveSupplier(fixture, 'sv');
    for (const field of SUPPLIER_FIELDS) expect(resolved).toHaveProperty(field.key);
  });

  it('omits from the facts what the aside header already shows', () => {
    const keys = SUPPLIER_FACTS.map((f) => f.key);
    expect(keys).not.toContain('name');
    expect(keys).not.toContain('state');
  });

  it('gives every optional column a width and a resolvable key', () => {
    const resolved = resolveSupplier(fixture, 'sv');
    for (const column of OPTIONAL_COLUMNS) {
      expect(column.width).toMatch(/^\d+px$/);
      expect(resolved).toHaveProperty(column.key);
    }
  });

  it('authors every label in both languages', () => {
    for (const field of [...SUPPLIER_FIELDS, ...OPTIONAL_COLUMNS]) {
      expect(field.label.sv.trim()).not.toBe('');
      expect(field.label.en.trim()).not.toBe('');
    }
  });
});
