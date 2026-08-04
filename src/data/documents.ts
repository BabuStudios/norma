import type { Bilingual, PillKind } from './types';

/**
 * A tab groups documents by category — templates vs. governing vs.
 * reporting documents, or whatever the company adds — and defines which
 * metadata fields apply to documents filed under it.
 */
export interface DocumentTab {
  id: string;
  name: string;
  metadataFields: string[];
}

let tabIdCounter = 0;
function genTabId(): string {
  tabIdCounter += 1;
  return `tab-${Date.now()}-${tabIdCounter}`;
}

/** The three tabs the register ships with; the company can add more. */
export const DEFAULT_DOCUMENT_TABS: DocumentTab[] = [
  { id: 'templates', name: 'Mallar', metadataFields: [] },
  { id: 'governing', name: 'Styrande', metadataFields: [] },
  { id: 'reporting', name: 'Redovisande', metadataFields: [] },
];

export function addDocumentTab(tabs: DocumentTab[], name: string): DocumentTab[] {
  return [...tabs, { id: genTabId(), name, metadataFields: [] }];
}

export function addTabMetadataField(
  tabs: DocumentTab[],
  tabId: string,
  field: string,
): DocumentTab[] {
  return tabs.map((tab) =>
    tab.id === tabId ? { ...tab, metadataFields: [...tab.metadataFields, field] } : tab,
  );
}

export function removeTabMetadataField(
  tabs: DocumentTab[],
  tabId: string,
  field: string,
): DocumentTab[] {
  return tabs.map((tab) =>
    tab.id === tabId
      ? { ...tab, metadataFields: tab.metadataFields.filter((existing) => existing !== field) }
      : tab,
  );
}

export interface ManagedDocument {
  id: string;
  name: Bilingual;
  version: string;
  owner: string;
  /** ISO date; rendered in accent when the review falls due soon. */
  nextReview: string;
  kind: PillKind;
  state: Bilingual;
  /** Which tab this document is filed under. */
  tabId: string;
  /** Values for the owning tab's configured metadata fields, keyed by field name. */
  metadata: Record<string, string>;
  /** The uploaded file's name and size — metadata only, the bytes stay on
   *  the user's machine, same as evidence uploads. Null until a file is attached. */
  fileName: string | null;
  fileSize: number | null;
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
  tabId: string;
  metadata: Record<string, string>;
  fileName: string | null;
  fileSize: number | null;
}

/**
 * Turns a filled-in form into a register row. `index` is the register's
 * current length, so ids run `${idPrefix}001`, `${idPrefix}002`, … as
 * documents are added; `idPrefix` is the company's own setting.
 */
export function createDocument(
  fields: NewDocumentFields,
  index: number,
  idPrefix: string,
): ManagedDocument {
  return {
    id: `${idPrefix}${String(index + 1).padStart(3, '0')}`,
    name: { sv: fields.name, en: fields.name },
    version: fields.version,
    owner: fields.owner,
    nextReview: fields.nextReview,
    kind: 'soft',
    state: { sv: 'Utkast', en: 'Draft' },
    tabId: fields.tabId,
    metadata: fields.metadata,
    fileName: fields.fileName,
    fileSize: fields.fileSize,
  };
}

export function removeDocument(documents: ManagedDocument[], id: string): ManagedDocument[] {
  return documents.filter((document) => document.id !== id);
}
