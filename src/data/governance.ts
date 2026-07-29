import type { Bilingual, PillKind } from './types';

/**
 * GDPR and access control. The retention periods, legal bases, EU-only
 * storage and the append-only change log are product requirements, not
 * decoration — the settings screen is where the company can show an auditor
 * or a data subject how the system actually handles personal data.
 */

export interface PersonalDataRow {
  data: Bilingual;
  basis: Bilingual;
  retention: Bilingual;
}

export const PERSONAL_DATA: PersonalDataRow[] = [
  {
    data: { sv: 'Namn, roll, e-post (användarkonto)', en: 'Name, role, email (user account)' },
    basis: {
      sv: 'Berättigat intresse — driva ledningssystemet',
      en: 'Legitimate interest — operating the management system',
    },
    retention: { sv: '3 år', en: '3 years' },
  },
  {
    data: {
      sv: 'Utbildningsintyg och behörigheter',
      en: 'Training certificates and licences',
    },
    basis: {
      sv: 'Rättslig förpliktelse — ISO 9001 §7.2, arbetsmiljöregler',
      en: 'Legal obligation — ISO 9001 §7.2, work environment rules',
    },
    retention: { sv: '10 år', en: '10 years' },
  },
  {
    data: {
      sv: 'Namn i revisionsrapporter och åtgärder',
      en: 'Names in audit reports and actions',
    },
    basis: {
      sv: 'Berättigat intresse — spårbarhet vid revision',
      en: 'Legitimate interest — traceability at audit',
    },
    retention: { sv: '5 år', en: '5 years' },
  },
  {
    data: {
      sv: 'Signaturer och tidsstämplar i ändringsloggen',
      en: 'Signatures and timestamps in the change log',
    },
    basis: { sv: 'Rättslig förpliktelse — bevisvärde', en: 'Legal obligation — evidential value' },
    retention: { sv: '2 år', en: '2 years' },
  },
  {
    data: {
      sv: 'Anonym förbättringsidé (ingen identifiering)',
      en: 'Anonymous improvement idea (no identification)',
    },
    basis: { sv: 'Samtycke — frivillig rapportering', en: 'Consent — voluntary reporting' },
    retention: { sv: '30 dagar', en: '30 days' },
  },
];

export interface ProtectionControl {
  label: Bilingual;
  body: Bilingual;
  state: Bilingual;
  kind: PillKind;
}

export const PROTECTION_CONTROLS: ProtectionControl[] = [
  {
    kind: 'met',
    label: { sv: 'Oföränderlig ändringslogg', en: 'Immutable change log' },
    body: {
      sv: 'Varje ändring sparas med användare, tid och tidigare värde. Ingen kan redigera historiken, bara lägga till.',
      en: 'Every change is stored with user, time and previous value. Nobody can edit history, only append.',
    },
    state: { sv: 'Aktiv', en: 'Active' },
  },
  {
    kind: 'met',
    label: { sv: 'Datalagring inom EU', en: 'Data residency in the EU' },
    body: {
      sv: 'Servrar i Stockholm och Frankfurt. Inga underbiträden utanför EU/EES.',
      en: 'Servers in Stockholm and Frankfurt. No sub-processors outside the EU/EEA.',
    },
    state: { sv: 'Aktiv', en: 'Active' },
  },
  {
    kind: 'met',
    label: { sv: 'Registerutdrag och radering', en: 'Subject access and erasure' },
    body: {
      sv: 'Export av en persons uppgifter som PDF, samt radering med bevarad revisionsspårbarhet.',
      en: 'Export one person’s data as PDF, and erase with audit traceability preserved.',
    },
    state: { sv: 'Aktiv', en: 'Active' },
  },
  {
    kind: 'met',
    label: { sv: 'Tvåfaktorsinloggning och BankID', en: 'Two-factor login and BankID' },
    body: {
      sv: 'Krävs för godkännande och signering av dokument.',
      en: 'Required for approving and signing documents.',
    },
    state: { sv: 'Aktiv', en: 'Active' },
  },
  {
    kind: 'soft',
    label: { sv: 'Personuppgiftsbiträdesavtal', en: 'Data processing agreement' },
    body: {
      sv: 'Genereras automatiskt per kund och versioneras.',
      en: 'Generated automatically per customer and versioned.',
    },
    state: { sv: 'Mall klar', en: 'Template ready' },
  },
  {
    kind: 'soft',
    label: { sv: 'Anonym rapporteringskanal', en: 'Anonymous reporting channel' },
    body: {
      sv: 'Visselblåsarläge utan spårning av avsändare.',
      en: 'Whistleblower mode with no sender tracing.',
    },
    state: { sv: 'I test', en: 'In testing' },
  },
];

/** Permission matrix: read, write, approve, audit, admin — in that order. */
export interface RoleRow {
  role: Bilingual;
  permissions: [boolean, boolean, boolean, boolean, boolean];
}

export const ROLES: RoleRow[] = [
  { role: { sv: 'Medarbetare', en: 'Employee' }, permissions: [true, true, false, false, false] },
  {
    role: { sv: 'Processägare', en: 'Process owner' },
    permissions: [true, true, true, false, false],
  },
  {
    role: { sv: 'Kvalitets- och miljöchef', en: 'Quality & environment manager' },
    permissions: [true, true, true, true, false],
  },
  {
    role: { sv: 'Internrevisor', en: 'Internal auditor' },
    permissions: [true, false, false, true, false],
  },
  {
    role: { sv: 'Konsult (extern)', en: 'Consultant (external)' },
    permissions: [true, true, false, true, false],
  },
  {
    role: { sv: 'Systemadministratör', en: 'System administrator' },
    permissions: [true, true, false, false, true],
  },
];
