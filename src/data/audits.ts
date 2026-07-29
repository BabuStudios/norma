import type { Bilingual, PillKind } from './types';

export interface PlannedAudit {
  week: string;
  area: Bilingual;
  auditor: Bilingual;
  clauses: string;
  kind: PillKind;
  state: Bilingual;
}

export const AUDIT_PROGRAMME: PlannedAudit[] = [
  {
    week: 'v.12',
    area: { sv: 'Inköp & leverantörer', en: 'Purchasing & suppliers' },
    auditor: { sv: 'Erik Lund', en: 'Erik Lund' },
    clauses: '§8.4',
    kind: 'met',
    state: { sv: 'Klar', en: 'Done' },
  },
  {
    week: 'v.18',
    area: { sv: 'Ledningsprocesser', en: 'Management processes' },
    auditor: { sv: 'Extern revisor', en: 'External auditor' },
    clauses: '§4–6, §9.3',
    kind: 'met',
    state: { sv: 'Klar', en: 'Done' },
  },
  {
    week: 'v.24',
    area: { sv: 'Miljö: aspekter & lagkrav', en: 'Environment: aspects & legal' },
    auditor: { sv: 'Sara Nyberg', en: 'Sara Nyberg' },
    clauses: '§6.1.2, §6.1.3',
    kind: 'met',
    state: { sv: 'Klar', en: 'Done' },
  },
  {
    week: 'v.38',
    area: { sv: 'Produktion & ytbehandling', en: 'Production & coating' },
    auditor: { sv: 'Anders Persson', en: 'Anders Persson' },
    clauses: '§8.1, §8.5, §8.7',
    kind: 'soft',
    state: { sv: 'Planerad', en: 'Planned' },
  },
  {
    week: 'v.42',
    area: { sv: 'Kompetens & medvetenhet', en: 'Competence & awareness' },
    auditor: { sv: 'Lena Ek', en: 'Lena Ek' },
    clauses: '§7.2, §7.3',
    kind: 'soft',
    state: { sv: 'Planerad', en: 'Planned' },
  },
  {
    week: 'v.46',
    area: { sv: 'Nödläge & beredskap', en: 'Emergency preparedness' },
    auditor: { sv: 'Extern revisor', en: 'External auditor' },
    clauses: '§8.2',
    kind: 'gap',
    state: { sv: 'Ej bokad', en: 'Not booked' },
  },
];

export interface ChecklistQuestion {
  clause: string;
  question: Bilingual;
  /** Seeded answer; the first four are ticked in the demo data. */
  defaultChecked: boolean;
}

export const AUDIT_CHECKLIST: ChecklistQuestion[] = [
  {
    clause: '8.1',
    question: {
      sv: 'Finns gällande arbetsinstruktion tillgänglig vid stationen?',
      en: 'Is the valid work instruction available at the station?',
    },
    defaultChecked: true,
  },
  {
    clause: '8.5',
    question: {
      sv: 'Kan operatören visa hur en sats spåras bakåt till råvara?',
      en: 'Can the operator show how a batch is traced back to raw material?',
    },
    defaultChecked: true,
  },
  {
    clause: '7.1',
    question: {
      sv: 'Är mätutrustningen märkt med giltig kalibrering?',
      en: 'Is the measuring equipment marked with valid calibration?',
    },
    defaultChecked: true,
  },
  {
    clause: '8.7',
    question: {
      sv: 'Hur avskiljs och märks avvikande produkter i praktiken?',
      en: 'How are nonconforming products separated and marked in practice?',
    },
    defaultChecked: true,
  },
  {
    clause: '7.3',
    question: {
      sv: 'Känner operatören till de betydande miljöaspekterna i sitt arbete?',
      en: 'Does the operator know the significant environmental aspects of their work?',
    },
    defaultChecked: false,
  },
  {
    clause: '8.2',
    question: {
      sv: 'Finns spillberedskap på plats och är den använd senaste året?',
      en: 'Is spill response equipment in place and has it been used in the past year?',
    },
    defaultChecked: false,
  },
];

/** Year-to-date findings, shown under the checklist. */
export const AUDIT_FINDINGS = { major: 2, minor: 5, observations: 3 };
