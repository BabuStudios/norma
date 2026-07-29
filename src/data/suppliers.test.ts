import { describe, expect, it } from 'vitest';
import {
  OPTIONAL_COLUMNS,
  SUPPLIERS,
  SUPPLIER_FACTS,
  SUPPLIER_FIELDS,
  resolveSupplier,
} from './suppliers';

describe('the supplier register', () => {
  it('has a unique id per supplier', () => {
    const ids = SUPPLIERS.map((s) => s.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('authors every bilingual field in both languages', () => {
    for (const supplier of SUPPLIERS) {
      for (const lang of ['sv', 'en'] as const) {
        expect(supplier.category[lang].trim()).not.toBe('');
        expect(supplier.state[lang].trim()).not.toBe('');
        expect(supplier.risk[lang].trim()).not.toBe('');
        expect(supplier.terms[lang].trim()).not.toBe('');
        for (const doc of supplier.documents) {
          expect(doc.name[lang].trim()).not.toBe('');
          expect(doc.meta[lang].trim()).not.toBe('');
        }
      }
    }
  });

  it('keeps one supplier with no documents, so the empty state is reachable', () => {
    expect(SUPPLIERS.some((s) => s.documents.length === 0)).toBe(true);
  });
});

describe('resolveSupplier', () => {
  const seed = SUPPLIERS[0];

  it('resolves bilingual fields into the chosen language', () => {
    expect(resolveSupplier(seed, 'sv').category).toBe(seed.category.sv);
    expect(resolveSupplier(seed, 'en').category).toBe(seed.category.en);
  });

  it('lets an override win over the seed', () => {
    const resolved = resolveSupplier(seed, 'sv', { contact: 'Astrid Berg', score: 77 });
    expect(resolved.contact).toBe('Astrid Berg');
    expect(resolved.score).toBe(77);
  });

  it('leaves untouched fields alone when overriding', () => {
    const resolved = resolveSupplier(seed, 'sv', { contact: 'Astrid Berg' });
    expect(resolved.name).toBe(seed.name);
    expect(resolved.regNo).toBe(seed.regNo);
  });

  it('keeps an override across a language switch', () => {
    // An edited category is plain text: it should not revert when the user
    // flips language, even though the seed value is bilingual.
    const override = { category: 'Ytbehandling' };
    expect(resolveSupplier(seed, 'en', override).category).toBe('Ytbehandling');
  });
});

describe('the supplier field definitions', () => {
  it('lists eight facts in the read-only aside', () => {
    expect(SUPPLIER_FACTS).toHaveLength(8);
  });

  it('edits twelve fields, and every one exists on a resolved supplier', () => {
    expect(SUPPLIER_FIELDS).toHaveLength(12);
    const resolved = resolveSupplier(SUPPLIERS[0], 'sv');
    for (const field of SUPPLIER_FIELDS) expect(resolved).toHaveProperty(field.key);
  });

  it('omits from the facts what the aside header already shows', () => {
    const keys = SUPPLIER_FACTS.map((f) => f.key);
    expect(keys).not.toContain('name');
    expect(keys).not.toContain('state');
  });

  it('gives every optional column a width and a resolvable key', () => {
    const resolved = resolveSupplier(SUPPLIERS[0], 'sv');
    for (const column of OPTIONAL_COLUMNS) {
      expect(column.width).toMatch(/^\d+px$/);
      expect(resolved).toHaveProperty(column.key);
    }
  });
});
