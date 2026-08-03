import type { Bilingual, PillKind } from './types';

/**
 * Document templates ship with the product — they are starting points, not
 * company data, so they stay when the registers are empty.
 */
export interface DocumentTemplate {
  kicker: Bilingual;
  name: Bilingual;
  meta: Bilingual;
}

export const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  {
    kicker: { sv: 'Mall', en: 'Template' },
    name: { sv: 'Miljöaspektregister', en: 'Aspects register' },
    meta: { sv: '14001 §6.1.2 · Excel', en: '14001 §6.1.2 · Excel' },
  },
  {
    kicker: { sv: 'Mall', en: 'Template' },
    name: { sv: 'Kvalitets- och miljöpolicy', en: 'Quality & environmental policy' },
    meta: { sv: '1 sida · Word', en: '1 page · Word' },
  },
  {
    kicker: { sv: 'Mall', en: 'Template' },
    name: { sv: 'Internrevisionsplan', en: 'Internal audit programme' },
    meta: { sv: '§9.2 · Excel', en: '§9.2 · Excel' },
  },
  {
    kicker: { sv: 'Mall', en: 'Template' },
    name: { sv: 'Protokoll ledningens genomgång', en: 'Management review minutes' },
    meta: { sv: '§9.3 · Word', en: '§9.3 · Word' },
  },
];

export interface ManagedDocument {
  id: string;
  name: Bilingual;
  version: string;
  owner: string;
  /** ISO date; rendered in accent when the review falls due soon. */
  nextReview: string;
  kind: PillKind;
  state: Bilingual;
}

/** A review lands "due soon" — and prints in accent — before this date. */
export const REVIEW_DUE_BEFORE = '2026-09-01';

/** The company's document register. Empty until documents are created. */
export const DOCUMENTS: ManagedDocument[] = [];

/** Documents linked from a requirement's detail rail. Empty until linked. */
export const CLAUSE_LINKED_DOCUMENTS: { id: string; name: Bilingual }[] = [];

/** What the "Nytt dokument" form collects — one language, since this is the
 *  company's own record, not authored catalogue content. */
export interface NewDocumentFields {
  name: string;
  version: string;
  owner: string;
  nextReview: string;
}

/**
 * Turns a filled-in form into a register row. `index` is the register's
 * current length, so ids run D001, D002, … as documents are added.
 */
export function createDocument(fields: NewDocumentFields, index: number): ManagedDocument {
  return {
    id: `D${String(index + 1).padStart(3, '0')}`,
    name: { sv: fields.name, en: fields.name },
    version: fields.version,
    owner: fields.owner,
    nextReview: fields.nextReview,
    kind: 'soft',
    state: { sv: 'Utkast', en: 'Draft' },
  };
}
