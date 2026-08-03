import { describe, expect, it } from 'vitest';
import { createDocument } from './documents';

describe('createDocument', () => {
  it('carries the form fields through, in both languages', () => {
    const document = createDocument(
      {
        name: 'Kvalitetshandbok',
        version: '2.1',
        owner: 'Maja Karlsson',
        nextReview: '2027-01-01',
      },
      0,
    );
    expect(document.name).toEqual({ sv: 'Kvalitetshandbok', en: 'Kvalitetshandbok' });
    expect(document.version).toBe('2.1');
    expect(document.owner).toBe('Maja Karlsson');
    expect(document.nextReview).toBe('2027-01-01');
  });

  it('starts every new document as a draft', () => {
    const document = createDocument({ name: 'A', version: '1.0', owner: '', nextReview: '' }, 0);
    expect(document.kind).toBe('soft');
    expect(document.state).toEqual({ sv: 'Utkast', en: 'Draft' });
  });

  it('numbers ids from the register size, zero-padded', () => {
    expect(createDocument({ name: 'A', version: '1.0', owner: '', nextReview: '' }, 0).id).toBe(
      'D001',
    );
    expect(createDocument({ name: 'A', version: '1.0', owner: '', nextReview: '' }, 9).id).toBe(
      'D010',
    );
  });
});
