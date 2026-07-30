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
