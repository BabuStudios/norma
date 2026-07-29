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

export const SUPPLIERS: SupplierSeed[] = [
  {
    id: 'stalgrossisten-vast',
    name: 'Stålgrossisten Väst AB',
    category: { sv: 'Basmaterial', en: 'Base material' },
    certs: '9001, 14001',
    lastEvaluated: '2026-02-10',
    nextEvaluation: '2027-02-10',
    score: 92,
    kind: 'met',
    state: { sv: 'Godkänd', en: 'Approved' },
    regNo: '556213-4471',
    contact: 'Per Ohlsson',
    spend: '2,4 Mkr',
    risk: { sv: 'Medel', en: 'Medium' },
    terms: { sv: 'Miljökrav i avtal', en: 'Environmental terms in contract' },
    documents: [
      {
        id: 'D-031',
        name: { sv: 'Ramavtal 2025–2028', en: 'Framework agreement 2025–2028' },
        meta: { sv: '2025-03-01', en: '2025-03-01' },
      },
      {
        id: 'D-032',
        name: { sv: 'ISO 9001-certifikat', en: 'ISO 9001 certificate' },
        meta: { sv: 'Giltigt t.o.m. 2027-06', en: 'Valid until 2027-06' },
      },
      {
        id: 'D-033',
        name: { sv: 'Leverantörsbedömning 2026', en: 'Supplier evaluation 2026' },
        meta: { sv: '2026-02-10', en: '2026-02-10' },
      },
    ],
  },
  {
    id: 'kemipartner-nordic',
    name: 'KemiPartner Nordic AB',
    category: { sv: 'Kemikalier', en: 'Chemicals' },
    certs: '9001, 14001',
    lastEvaluated: '2026-04-22',
    nextEvaluation: '2027-04-22',
    score: 88,
    kind: 'met',
    state: { sv: 'Godkänd', en: 'Approved' },
    regNo: '556781-2298',
    contact: 'Ingrid Falk',
    spend: '1,1 Mkr',
    risk: { sv: 'Hög', en: 'High' },
    terms: { sv: 'REACH-intyg krävs', en: 'REACH declaration required' },
    documents: [
      {
        id: 'D-040',
        name: { sv: 'Säkerhetsdatablad, samlingspärm', en: 'Safety data sheets, binder' },
        meta: { sv: 'Uppdaterad 2026-05', en: 'Updated 2026-05' },
      },
      {
        id: 'D-041',
        name: { sv: 'ISO 14001-certifikat', en: 'ISO 14001 certificate' },
        meta: { sv: 'Giltigt t.o.m. 2028-01', en: 'Valid until 2028-01' },
      },
      {
        id: 'D-042',
        name: { sv: 'Leverantörsbedömning 2026', en: 'Supplier evaluation 2026' },
        meta: { sv: '2026-04-22', en: '2026-04-22' },
      },
    ],
  },
  {
    id: 'transport-och-last',
    name: 'Transport & Last AB',
    category: { sv: 'Transport', en: 'Transport' },
    certs: '9001',
    lastEvaluated: '2025-09-30',
    nextEvaluation: '2026-09-30',
    score: 64,
    kind: 'soft',
    state: { sv: 'Omvärderas', en: 'Re-evaluating' },
    regNo: '556334-9910',
    contact: 'Mikael Ström',
    spend: '860 tkr',
    risk: { sv: 'Medel', en: 'Medium' },
    terms: { sv: 'HVO-krav vid ny upphandling', en: 'HVO required in next tender' },
    documents: [
      {
        id: 'D-050',
        name: { sv: 'Transportavtal', en: 'Transport agreement' },
        meta: { sv: '2024-11-01', en: '2024-11-01' },
      },
      {
        id: 'D-051',
        name: { sv: 'Avvikelserapport leveranstid', en: 'Deviation report, lead time' },
        meta: { sv: '2025-09-28', en: '2025-09-28' },
      },
    ],
  },
  {
    id: 'atervinning-syd',
    name: 'Återvinning Syd AB',
    category: { sv: 'Avfallshantering', en: 'Waste handling' },
    certs: '14001',
    lastEvaluated: '2026-06-05',
    nextEvaluation: '2027-06-05',
    score: 95,
    kind: 'met',
    state: { sv: 'Godkänd', en: 'Approved' },
    regNo: '556902-1173',
    contact: 'Sara Hall',
    spend: '410 tkr',
    risk: { sv: 'Låg', en: 'Low' },
    terms: { sv: 'Tillstånd farligt avfall', en: 'Hazardous waste permit' },
    documents: [
      {
        id: 'D-060',
        name: {
          sv: 'Transporttillstånd farligt avfall',
          en: 'Hazardous waste transport permit',
        },
        meta: { sv: 'Giltigt t.o.m. 2029-04', en: 'Valid until 2029-04' },
      },
      {
        id: 'D-061',
        name: { sv: 'Avfallsjournal 2026', en: 'Waste log 2026' },
        meta: { sv: 'Löpande', en: 'Ongoing' },
      },
      {
        id: 'D-062',
        name: { sv: 'Leverantörsbedömning 2026', en: 'Supplier evaluation 2026' },
        meta: { sv: '2026-06-05', en: '2026-06-05' },
      },
    ],
  },
  {
    id: 'verktygsservice-boras',
    name: 'Verktygsservice i Borås',
    category: { sv: 'Underhåll', en: 'Maintenance' },
    certs: '—',
    lastEvaluated: '2024-11-12',
    nextEvaluation: '2026-08-31',
    score: 51,
    kind: 'gap',
    state: { sv: 'Utvärdering saknas', en: 'Evaluation missing' },
    regNo: '556119-8823',
    contact: 'Tomas Nyqvist',
    spend: '190 tkr',
    risk: { sv: 'Hög', en: 'High' },
    terms: { sv: 'Inga skrivna krav ännu', en: 'No written requirements yet' },
    documents: [],
  },
  {
    id: 'kalibrering-matteknik',
    name: 'Kalibrering Mätteknik AB',
    category: { sv: 'Kalibrering', en: 'Calibration' },
    certs: '17025',
    lastEvaluated: '2026-01-18',
    nextEvaluation: '2027-01-18',
    score: 90,
    kind: 'met',
    state: { sv: 'Godkänd', en: 'Approved' },
    regNo: '556448-3390',
    contact: 'Eva Lindqvist',
    spend: '95 tkr',
    risk: { sv: 'Låg', en: 'Low' },
    terms: { sv: 'Spårbar kalibrering enligt 17025', en: 'Traceable calibration per 17025' },
    documents: [
      {
        id: 'D-070',
        name: { sv: 'Ackrediteringsintyg 17025', en: 'Accreditation certificate 17025' },
        meta: { sv: 'Giltigt t.o.m. 2027-09', en: 'Valid until 2027-09' },
      },
      {
        id: 'D-071',
        name: { sv: 'Kalibreringsintyg skjutmått', en: 'Calibration certificate, callipers' },
        meta: { sv: '2026-01-18', en: '2026-01-18' },
      },
    ],
  },
];

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
  { key: 'nextEvaluation', label: { sv: 'Nästa utvärdering', en: 'Next evaluation' }, width: '140px' },
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
