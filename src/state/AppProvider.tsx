import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { createDocument, type NewDocumentFields } from '@/data/documents';
import { ORGANIZATIONS } from '@/data/organizations';
import type { SupplierFields } from '@/data/suppliers';
import type { ClauseStatus, Lang } from '@/data/types';
import type { UploadedFile } from '@/domain/evidence';
import type { PageBlock } from '@/domain/page';
import { AppContext, INITIAL_STATE, dictionaryFor, type AppState } from './store';

const STORAGE_KEY = 'norma.state.v1';

/** Stand-in for the API: the demo keeps its state in the browser. */
function load(): AppState {
  if (typeof window === 'undefined') return INITIAL_STATE;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const saved = JSON.parse(raw) as Partial<AppState>;
    return { ...INITIAL_STATE, ...saved };
  } catch {
    return INITIAL_STATE;
  }
}

function save(state: AppState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // A full or blocked storage quota must not take the app down; the session
    // simply stops surviving a reload.
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(load);

  useEffect(() => {
    save(state);
  }, [state]);

  // Keeps assistive tech and the browser's own language handling in step with
  // the SV/EN toggle.
  useEffect(() => {
    document.documentElement.lang = state.lang;
  }, [state.lang]);

  const setLang = useCallback((lang: Lang) => {
    setState((prev) => ({ ...prev, lang }));
  }, []);

  const nextOrg = useCallback(() => {
    setState((prev) => ({ ...prev, orgIndex: (prev.orgIndex + 1) % ORGANIZATIONS.length }));
  }, []);

  const setStatus = useCallback((clauseId: string, status: ClauseStatus) => {
    setState((prev) => ({ ...prev, statuses: { ...prev.statuses, [clauseId]: status } }));
  }, []);

  const toggleStep = useCallback((clauseId: string, stepIndex: number) => {
    const key = `${clauseId}:${stepIndex}`;
    setState((prev) => ({ ...prev, steps: { ...prev.steps, [key]: !prev.steps[key] } }));
  }, []);

  const toggleAuditCheck = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      auditChecks: { ...prev.auditChecks, [index]: !prev.auditChecks[index] },
    }));
  }, []);

  const toggleReviewCheck = useCallback((index: number) => {
    setState((prev) => ({
      ...prev,
      reviewChecks: { ...prev.reviewChecks, [index]: !prev.reviewChecks[index] },
    }));
  }, []);

  const toggleSupplierColumn = useCallback((key: string) => {
    setState((prev) => ({
      ...prev,
      supplierColumns: { ...prev.supplierColumns, [key]: !prev.supplierColumns[key] },
    }));
  }, []);

  const saveSupplier = useCallback((supplierId: string, fields: Partial<SupplierFields>) => {
    setState((prev) => ({
      ...prev,
      supplierOverrides: {
        ...prev.supplierOverrides,
        [supplierId]: { ...prev.supplierOverrides[supplierId], ...fields },
      },
    }));
  }, []);

  const addEvidenceFiles = useCallback((clauseId: string, evidenceIndex: number, files: File[]) => {
    if (files.length === 0) return;
    const key = `${clauseId}:${evidenceIndex}`;
    const uploadedAt = new Date().toISOString();
    // Not crypto.randomUUID(): this only has to be unique within one evidence
    // row's list, and the app already runs without other UUID needs.
    const added: UploadedFile[] = files.map((file, index) => ({
      id: `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 8)}`,
      name: file.name,
      size: file.size,
      uploadedAt,
    }));
    setState((prev) => ({
      ...prev,
      evidenceUploads: {
        ...prev.evidenceUploads,
        [key]: [...(prev.evidenceUploads[key] ?? []), ...added],
      },
    }));
  }, []);

  const removeEvidenceFile = useCallback(
    (clauseId: string, evidenceIndex: number, fileId: string) => {
      const key = `${clauseId}:${evidenceIndex}`;
      setState((prev) => {
        const remaining = (prev.evidenceUploads[key] ?? []).filter((file) => file.id !== fileId);
        const evidenceUploads = { ...prev.evidenceUploads };
        if (remaining.length === 0) {
          delete evidenceUploads[key];
        } else {
          evidenceUploads[key] = remaining;
        }
        return { ...prev, evidenceUploads };
      });
    },
    [],
  );

  const updateManagementSystemBlocks = useCallback(
    (updater: (blocks: PageBlock[]) => PageBlock[]) => {
      setState((prev) => ({
        ...prev,
        managementSystemBlocks: updater(prev.managementSystemBlocks),
      }));
    },
    [],
  );

  const addDocument = useCallback((fields: NewDocumentFields) => {
    setState((prev) => ({
      ...prev,
      documents: [...prev.documents, createDocument(fields, prev.documents.length)],
    }));
  }, []);

  const value = useMemo(
    () => ({
      state,
      t: dictionaryFor(state.lang),
      setLang,
      nextOrg,
      setStatus,
      toggleStep,
      toggleAuditCheck,
      toggleReviewCheck,
      toggleSupplierColumn,
      saveSupplier,
      addEvidenceFiles,
      removeEvidenceFile,
      updateManagementSystemBlocks,
      addDocument,
    }),
    [
      state,
      setLang,
      nextOrg,
      setStatus,
      toggleStep,
      toggleAuditCheck,
      toggleReviewCheck,
      toggleSupplierColumn,
      saveSupplier,
      addEvidenceFiles,
      removeEvidenceFile,
      updateManagementSystemBlocks,
      addDocument,
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
