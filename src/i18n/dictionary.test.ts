import { describe, expect, it } from 'vitest';
import { DICTIONARY } from './dictionary';

describe('the dictionary', () => {
  it('carries the same keys in both languages', () => {
    // The types already enforce this; the test states it for anyone reading
    // the suite and catches a stray cast.
    expect(Object.keys(DICTIONARY.en).sort()).toEqual(Object.keys(DICTIONARY.sv).sort());
  });

  it('leaves no string empty', () => {
    for (const lang of ['sv', 'en'] as const) {
      for (const [key, value] of Object.entries(DICTIONARY[lang])) {
        expect(value.trim(), `${lang}.${key}`).not.toBe('');
      }
    }
  });

  it('actually translates — the two languages are not copies of each other', () => {
    const shared = Object.keys(DICTIONARY.sv).filter(
      (key) =>
        DICTIONARY.sv[key as keyof typeof DICTIONARY.sv] ===
        DICTIONARY.en[key as keyof typeof DICTIONARY.en],
    );
    // Some entries legitimately match: proper nouns, numerals and words spelled
    // the same in both. Anything beyond a handful means a missed translation.
    expect(shared.length).toBeLessThan(8);
  });
});
