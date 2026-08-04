import { describe, expect, it } from 'vitest';
import {
  addDocumentTab,
  addTabMetadataField,
  createDocument,
  DEFAULT_DOCUMENT_TABS,
  removeDocument,
  removeTabMetadataField,
  updateTabIdPrefix,
  type DocumentTab,
} from './documents';

const baseFields = {
  name: 'Kvalitetshandbok',
  version: '2.1',
  owner: 'Maja Karlsson',
  nextReview: '2027-01-01',
  tabId: 'governing',
  metadata: {},
  fileName: null,
  fileSize: null,
};

describe('createDocument', () => {
  it('carries the form fields through, in both languages', () => {
    const document = createDocument(baseFields, 0, 'D');
    expect(document.name).toEqual({ sv: 'Kvalitetshandbok', en: 'Kvalitetshandbok' });
    expect(document.version).toBe('2.1');
    expect(document.owner).toBe('Maja Karlsson');
    expect(document.nextReview).toBe('2027-01-01');
    expect(document.tabId).toBe('governing');
  });

  it('starts every new document as a draft', () => {
    const document = createDocument(baseFields, 0, 'D');
    expect(document.kind).toBe('soft');
    expect(document.state).toEqual({ sv: 'Utkast', en: 'Draft' });
  });

  it('numbers ids from the register size, zero-padded, using the given prefix', () => {
    expect(createDocument(baseFields, 0, 'D').id).toBe('D001');
    expect(createDocument(baseFields, 9, 'D').id).toBe('D010');
    expect(createDocument(baseFields, 0, 'POL-').id).toBe('POL-001');
  });

  it('carries the uploaded file and metadata through', () => {
    const document = createDocument(
      { ...baseFields, fileName: 'handbok.pdf', fileSize: 2048, metadata: { 'Godkänd av': 'VD' } },
      0,
      'D',
    );
    expect(document.fileName).toBe('handbok.pdf');
    expect(document.fileSize).toBe(2048);
    expect(document.metadata).toEqual({ 'Godkänd av': 'VD' });
  });
});

describe('removeDocument', () => {
  it('removes only the targeted document', () => {
    const a = createDocument(baseFields, 0, 'D');
    const b = createDocument(baseFields, 1, 'D');
    const removed = removeDocument([a, b], a.id);
    expect(removed).toEqual([b]);
  });
});

describe('document tabs', () => {
  it('ships with Mallar, Styrande and Redovisande, each with its own id prefix', () => {
    expect(DEFAULT_DOCUMENT_TABS.map((tab) => tab.name)).toEqual([
      'Mallar',
      'Styrande',
      'Redovisande',
    ]);
    expect(DEFAULT_DOCUMENT_TABS.map((tab) => tab.idPrefix)).toEqual(['M', 'S', 'R']);
  });

  it('adds a new tab with no metadata fields yet, and a default id prefix', () => {
    const tabs = addDocumentTab(DEFAULT_DOCUMENT_TABS, 'Avtal');
    const added = tabs[tabs.length - 1];
    expect(added.name).toBe('Avtal');
    expect(added.metadataFields).toEqual([]);
    expect(added.idPrefix).toBe('D');
  });

  it('adds and removes a metadata field on one tab without touching the others', () => {
    const tabs: DocumentTab[] = [
      { id: 'a', name: 'A', metadataFields: [], idPrefix: 'D' },
      { id: 'b', name: 'B', metadataFields: [], idPrefix: 'D' },
    ];
    let updated = addTabMetadataField(tabs, 'a', 'Godkänd av');
    expect(updated.find((tab) => tab.id === 'a')?.metadataFields).toEqual(['Godkänd av']);
    expect(updated.find((tab) => tab.id === 'b')?.metadataFields).toEqual([]);

    updated = removeTabMetadataField(updated, 'a', 'Godkänd av');
    expect(updated.find((tab) => tab.id === 'a')?.metadataFields).toEqual([]);
  });

  it('updates one tab id prefix without touching the others', () => {
    const tabs: DocumentTab[] = [
      { id: 'a', name: 'A', metadataFields: [], idPrefix: 'D' },
      { id: 'b', name: 'B', metadataFields: [], idPrefix: 'D' },
    ];
    const updated = updateTabIdPrefix(tabs, 'a', 'POL-');
    expect(updated.find((tab) => tab.id === 'a')?.idPrefix).toBe('POL-');
    expect(updated.find((tab) => tab.id === 'b')?.idPrefix).toBe('D');
  });
});
