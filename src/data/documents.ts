import type { Bilingual, PillKind } from './types';

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

export const DOCUMENTS: ManagedDocument[] = [
  {
    id: 'D-001',
    name: { sv: 'Kvalitets- och miljöpolicy', en: 'Quality & environmental policy' },
    version: '3.0',
    owner: 'Maja Karlsson',
    nextReview: '2027-02-01',
    kind: 'met',
    state: { sv: 'Gällande', en: 'Current' },
  },
  {
    id: 'D-004',
    name: { sv: 'Processkarta', en: 'Process map' },
    version: '2.1',
    owner: 'Erik Lund',
    nextReview: '2026-11-15',
    kind: 'met',
    state: { sv: 'Gällande', en: 'Current' },
  },
  {
    id: 'D-007',
    name: { sv: 'Rutin dokumentstyrning', en: 'Document control procedure' },
    version: '1.4',
    owner: 'Maja Karlsson',
    nextReview: '2026-09-30',
    kind: 'met',
    state: { sv: 'Gällande', en: 'Current' },
  },
  {
    id: 'D-011',
    name: { sv: 'Miljöaspektregister', en: 'Environmental aspects register' },
    version: '0.3',
    owner: 'Sara Nyberg',
    nextReview: '2026-08-15',
    kind: 'gap',
    state: { sv: 'Utkast', en: 'Draft' },
  },
  {
    id: 'D-014',
    name: { sv: 'Nödlägesrutin & åtgärdskort', en: 'Emergency routine & action cards' },
    version: '1.2',
    owner: 'Anders Persson',
    nextReview: '2026-10-01',
    kind: 'soft',
    state: { sv: 'Granskas', en: 'In review' },
  },
  {
    id: 'D-019',
    name: { sv: 'Kommunikationsplan', en: 'Communication plan' },
    version: '—',
    owner: 'Maja Karlsson',
    nextReview: '2026-08-31',
    kind: 'gap',
    state: { sv: 'Saknas', en: 'Missing' },
  },
  {
    id: 'D-022',
    name: { sv: 'Kompetensmatris', en: 'Competence matrix' },
    version: '4.2',
    owner: 'Lena Ek',
    nextReview: '2026-12-01',
    kind: 'met',
    state: { sv: 'Gällande', en: 'Current' },
  },
  {
    id: 'D-028',
    name: { sv: 'Leverantörsbedömning', en: 'Supplier evaluation' },
    version: '2.0',
    owner: 'Erik Lund',
    nextReview: '2026-09-15',
    kind: 'soft',
    state: { sv: 'Granskas', en: 'In review' },
  },
];

/** Documents linked from the requirement detail rail. */
export const CLAUSE_LINKED_DOCUMENTS: { id: string; name: Bilingual }[] = [
  { id: 'D-001', name: { sv: 'Policy', en: 'Policy' } },
  { id: 'D-004', name: { sv: 'Processkarta', en: 'Process map' } },
  { id: 'D-011', name: { sv: 'Aspektregister', en: 'Aspects register' } },
];
