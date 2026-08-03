import { createContext, useContext } from 'react';
import { AUDIT_CHECKLIST } from '@/data/audits';
import { DOCUMENTS, type ManagedDocument, type NewDocumentFields } from '@/data/documents';
import { REVIEW_INPUTS } from '@/data/managementReview';
import type { SupplierFields, SupplierOverrides } from '@/data/suppliers';
import type { ClauseStatus, Lang } from '@/data/types';
import { DICTIONARY, type Dictionary } from '@/i18n/dictionary';
import type { StatusMap } from '@/domain/conformity';
import type { UploadedFile } from '@/domain/evidence';
import type { PageBlock } from '@/domain/page';

/**
 * Application state.
 *
 * Everything here is client-side in this build. In production the slices split
 * three ways:
 *   - `lang` and `supplierColumns` are user preferences,
 *   - `statuses`, `steps`, `auditChecks`, `reviewChecks` and `evidenceUploads`
 *     are per-organization data behind the API, each write landing in the
 *     append-only change log,
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
   * Files attached to a requirement's evidence rows, keyed
   * `${clauseId}:${evidenceIndex}`. Metadata only — in production the actual
   * bytes go to the document store and this becomes the link to that record.
   */
  evidenceUploads: Record<string, UploadedFile[]>;
  /** Editable content on Ledningssystem: text blocks and process diagrams. */
  managementSystemBlocks: PageBlock[];
  /** The document register — starts from the (empty) seed and grows as the
   *  company adds documents. */
  documents: ManagedDocument[];
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
  addEvidenceFiles: (clauseId: string, evidenceIndex: number, files: File[]) => void;
  removeEvidenceFile: (clauseId: string, evidenceIndex: number, fileId: string) => void;
  /** Applies a pure update from `domain/page.ts` to the Ledningssystem blocks. */
  updateManagementSystemBlocks: (updater: (blocks: PageBlock[]) => PageBlock[]) => void;
  addDocument: (fields: NewDocumentFields) => void;
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
  evidenceUploads: {},
  managementSystemBlocks: [],
  documents: DOCUMENTS,
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
