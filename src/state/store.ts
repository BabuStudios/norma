import { createContext, useContext } from 'react';
import { AUDIT_CHECKLIST } from '@/data/audits';
import {
  DEFAULT_DOCUMENT_TABS,
  DOCUMENTS,
  type DocumentTab,
  type ManagedDocument,
  type NewDocumentFields,
} from '@/data/documents';
import { REVIEW_INPUTS } from '@/data/managementReview';
import type { SupplierFields, SupplierOverrides } from '@/data/suppliers';
import type { ClauseStatus, Lang } from '@/data/types';
import { DICTIONARY, type Dictionary } from '@/i18n/dictionary';
import type { StatusMap } from '@/domain/conformity';
import type { PageBlock } from '@/domain/page';

/**
 * Application state.
 *
 * Everything here is client-side in this build. In production the slices split
 * three ways:
 *   - `lang` and `supplierColumns` are user preferences,
 *   - `statuses`, `steps`, `auditChecks`, `reviewChecks` and
 *     `evidenceDocumentLinks` are per-organization data behind the API, each
 *     write landing in the append-only change log,
 *   - `supplierOverrides` disappears entirely — saving a supplier posts to the
 *     API and the table re-reads the record.
 */
export interface AppState {
  lang: Lang;
  /** Index into ORGANIZATIONS — the consultant's active client. */
  orgIndex: number;
  statuses: StatusMap;
  /** Ticked how-to steps, keyed `${clauseId}:${stepIndex}`. */
  steps: Record<string, boolean>;
  auditChecks: Record<number, boolean>;
  reviewChecks: Record<number, boolean>;
  supplierColumns: Record<string, boolean>;
  supplierOverrides: SupplierOverrides;
  /**
   * Document register ids linked to a requirement's evidence rows, keyed
   * `${clauseId}:${evidenceIndex}`.
   */
  evidenceDocumentLinks: Record<string, string[]>;
  /** Editable content on Ledningssystem: text blocks and process diagrams. */
  managementSystemBlocks: PageBlock[];
  /** Editable content on each of the mandatory-process pages (§4.1, §6.2,
   *  §7.4, §7.2/7.3, §6.1.3, §8.2, §10.2 — see `data/processPages.ts`),
   *  keyed by page id. Starts empty like every other register. */
  processPages: Record<string, PageBlock[]>;
  /** The document register — starts from the (empty) seed and grows as the
   *  company adds documents. */
  documents: ManagedDocument[];
  /** The document register's tabs — each with its own metadata fields and id
   *  prefix — for documents filed under it. */
  documentTabs: DocumentTab[];
}

export interface AppActions {
  setLang: (lang: Lang) => void;
  nextOrg: () => void;
  setStatus: (clauseId: string, status: ClauseStatus) => void;
  toggleStep: (clauseId: string, stepIndex: number) => void;
  toggleAuditCheck: (index: number) => void;
  toggleReviewCheck: (index: number) => void;
  toggleSupplierColumn: (key: string) => void;
  saveSupplier: (supplierId: string, fields: Partial<SupplierFields>) => void;
  toggleEvidenceDocumentLink: (clauseId: string, evidenceIndex: number, documentId: string) => void;
  /** Applies a pure update from `domain/page.ts` to the Ledningssystem blocks. */
  updateManagementSystemBlocks: (updater: (blocks: PageBlock[]) => PageBlock[]) => void;
  /** Applies a pure update from `domain/page.ts` to one process page's blocks. */
  updateProcessPageBlocks: (pageId: string, updater: (blocks: PageBlock[]) => PageBlock[]) => void;
  addDocument: (fields: NewDocumentFields, file?: File) => void;
  removeDocument: (id: string) => void;
  addDocumentTab: (name: string) => void;
  addTabMetadataField: (tabId: string, field: string) => void;
  removeTabMetadataField: (tabId: string, field: string) => void;
  setTabIdPrefix: (tabId: string, idPrefix: string) => void;
}

export const INITIAL_STATE: AppState = {
  lang: 'sv',
  orgIndex: 0,
  statuses: {},
  steps: {},
  auditChecks: Object.fromEntries(AUDIT_CHECKLIST.map((q, i) => [i, q.defaultChecked])),
  reviewChecks: Object.fromEntries(REVIEW_INPUTS.map((r, i) => [i, r.defaultChecked])),
  supplierColumns: { nextEvaluation: true },
  supplierOverrides: {},
  evidenceDocumentLinks: {},
  managementSystemBlocks: [],
  processPages: {},
  documents: DOCUMENTS,
  documentTabs: DEFAULT_DOCUMENT_TABS,
};

export interface AppContextValue extends AppActions {
  state: AppState;
  t: Dictionary;
}

export const AppContext = createContext<AppContextValue | null>(null);

export function useApp(): AppContextValue {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp must be used inside <AppProvider>');
  return value;
}

export function useLang(): Lang {
  return useApp().state.lang;
}

/** The dictionary for the current language. */
export function useT(): Dictionary {
  return useApp().t;
}

export function dictionaryFor(lang: Lang): Dictionary {
  return DICTIONARY[lang];
}
