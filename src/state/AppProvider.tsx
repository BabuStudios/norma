import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { ORGANIZATIONS } from '@/data/organizations';
import type { SupplierFields } from '@/data/suppliers';
import type { ClauseStatus, Lang } from '@/data/types';
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
    ],
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}
