import type { Bilingual, Lang, PillKind } from './types';

export interface SupplierDocument {
  id: string;
  name: Bilingual;
  meta: Bilingual;
}

/** A supplier as stored: bilingual where the value is prose, plain otherwise. */
export interface SupplierSeed {
  id: string;
  name: string;
  category: Bilingual;
  certs: string;
  lastEvaluated: string;
  nextEvaluation: string;
  score: number;
  /** Drives the pill colour. Not user-editable — only its label is. */
  kind: PillKind;
  state: Bilingual;
  regNo: string;
  contact: string;
  spend: string;
  risk: Bilingual;
  terms: Bilingual;
  documents: SupplierDocument[];
}

/**
 * The editable face of a supplier: one language resolved down to plain
 * strings. The edit form writes this shape, and an override is a partial of
 * it. In production save posts to the API and overrides disappear.
 */
export interface SupplierFields {
  name: string;
  category: string;
  certs: string;
  state: string;
  regNo: string;
  contact: string;
  spend: string;
  score: number;
  lastEvaluated: string;
  nextEvaluation: string;
  risk: string;
  terms: string;
}

export type SupplierOverrides = Record<string, Partial<SupplierFields>>;

/** The supplier register (§8.4). Empty until suppliers are added. */
export const SUPPLIERS: SupplierSeed[] = [];

/** Resolve a stored supplier plus any local edits into one language. */
export function resolveSupplier(
  seed: SupplierSeed,
  lang: Lang,
  override: Partial<SupplierFields> = {},
): SupplierFields {
  return {
    name: seed.name,
    category: seed.category[lang],
    certs: seed.certs,
    state: seed.state[lang],
    regNo: seed.regNo,
    contact: seed.contact,
    spend: seed.spend,
    score: seed.score,
    lastEvaluated: seed.lastEvaluated,
    nextEvaluation: seed.nextEvaluation,
    risk: seed.risk[lang],
    terms: seed.terms[lang],
    ...override,
  };
}

/**
 * Columns the table can show beyond its six fixed ones. Which are on is user
 * preference and persists; "next evaluation" starts on.
 */
export interface OptionalColumn {
  key: keyof SupplierFields;
  label: Bilingual;
  width: string;
}

export const OPTIONAL_COLUMNS: OptionalColumn[] = [
  { key: 'regNo', label: { sv: 'Org.nr', en: 'Reg. no' }, width: '120px' },
  { key: 'contact', label: { sv: 'Kontakt', en: 'Contact' }, width: '140px' },
  { key: 'spend', label: { sv: 'Inköpsvolym', en: 'Spend' }, width: '110px' },
  {
    key: 'nextEvaluation',
    label: { sv: 'Nästa utvärdering', en: 'Next evaluation' },
    width: '140px',
  },
  { key: 'risk', label: { sv: 'Riskklass', en: 'Risk class' }, width: '110px' },
  { key: 'terms', label: { sv: 'Krav i avtal', en: 'Contract terms' }, width: '190px' },
];

/** Fields the detail aside lists, and the form edits, in this order. */
export const SUPPLIER_FIELDS: { key: keyof SupplierFields; label: Bilingual }[] = [
  { key: 'name', label: { sv: 'Namn', en: 'Name' } },
  { key: 'category', label: { sv: 'Kategori', en: 'Category' } },
  { key: 'certs', label: { sv: 'Certifikat', en: 'Certificates' } },
  { key: 'state', label: { sv: 'Status', en: 'Status' } },
  { key: 'regNo', label: { sv: 'Org.nr', en: 'Reg. no' } },
  { key: 'contact', label: { sv: 'Kontaktperson', en: 'Contact' } },
  { key: 'spend', label: { sv: 'Inköpsvolym per år', en: 'Annual spend' } },
  { key: 'score', label: { sv: 'Betyg', en: 'Score' } },
  { key: 'lastEvaluated', label: { sv: 'Senast utvärderad', en: 'Last evaluated' } },
  { key: 'nextEvaluation', label: { sv: 'Nästa utvärdering', en: 'Next evaluation' } },
  { key: 'risk', label: { sv: 'Riskklass', en: 'Risk class' } },
  { key: 'terms', label: { sv: 'Krav i avtal', en: 'Contract terms' } },
];

/** The eight facts the read-only aside shows — everything but name and status,
 *  which already appear in its header. */
export const SUPPLIER_FACTS = SUPPLIER_FIELDS.filter(
  (f) => f.key !== 'name' && f.key !== 'state' && f.key !== 'category' && f.key !== 'certs',
);
