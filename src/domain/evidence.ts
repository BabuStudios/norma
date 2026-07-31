import type { Clause } from '@/data/clauses';
import type { Bilingual, ClauseStatus, Lang } from '@/data/types';

/**
 * Evidence rows carry a type chip and a line explaining what the artifact
 * actually is — because "process map" tells an auditor nothing about whether
 * the thing you hand over is the right thing.
 *
 * The chip is derived from the Swedish label, which is the source language for
 * the catalogue, so a requirement shows the same type in both languages.
 */
export type EvidenceKind = 'minutes' | 'register' | 'certificate' | 'analysis' | 'document';

const KIND_PATTERNS: { kind: EvidenceKind; test: RegExp }[] = [
  { kind: 'minutes', test: /protokoll/ },
  { kind: 'register', test: /register|logg|matris/ },
  { kind: 'certificate', test: /intyg|certifik/ },
  { kind: 'analysis', test: /analys|utvärdering|bedömning/ },
];

export const KIND_LABEL: Record<EvidenceKind, Bilingual> = {
  minutes: { sv: 'Protokoll', en: 'Minutes' },
  register: { sv: 'Register', en: 'Register' },
  certificate: { sv: 'Intyg', en: 'Certificate' },
  analysis: { sv: 'Analys', en: 'Analysis' },
  document: { sv: 'Dokument', en: 'Document' },
};

/** What the artifact has to be, said plainly. `{name}` is the evidence name. */
const KIND_DESCRIPTION: Record<EvidenceKind, Bilingual> = {
  minutes: {
    sv: '{name} är mötesanteckningarna själva: datum, deltagare och de beslut som togs — inte en sammanfattning skriven i efterhand.',
    en: '{name} is the meeting record itself: date, attendees and the decisions made — not a summary written afterwards.',
  },
  register: {
    sv: '{name} är en levande lista eller tabell som uppdateras löpande, med ansvarig och senaste ändringsdatum synliga för varje rad.',
    en: '{name} is a live list or table kept current, with an owner and last-changed date visible per row.',
  },
  certificate: {
    sv: '{name} är det undertecknade intyget eller certifikatet från utfärdaren, med giltighetstid och vem det gäller.',
    en: '{name} is the signed certificate from the issuer, showing validity period and who it covers.',
  },
  analysis: {
    sv: '{name} är själva genomförda analysen eller bedömningen i sin helhet, med datum, metod och vem som utfört den.',
    en: '{name} is the completed analysis or assessment in full, with date, method and who carried it out.',
  },
  document: {
    sv: '{name} är det styrande dokumentet i sig — godkänt, daterat och i den version som faktiskt används i verksamheten.',
    en: '{name} is the governing document itself — approved, dated, and the version actually in use in the business.',
  },
};

const ON_FILE: Bilingual = { sv: 'Finns', en: 'On file' };
const MISSING: Bilingual = { sv: 'Saknas', en: 'Missing' };
const UPLOAD: Bilingual = { sv: 'Ladda upp', en: 'Upload' };

export function evidenceKind(swedishLabel: string): EvidenceKind {
  const text = swedishLabel.toLowerCase();
  return KIND_PATTERNS.find((p) => p.test.test(text))?.kind ?? 'document';
}

export interface EvidenceRow {
  kind: EvidenceKind;
  kindLabel: string;
  name: string;
  description: string;
  onFile: boolean;
  stateLabel: string;
  actionLabel: string;
}

/**
 * Whether an artifact is on file stands in for the document store, which is
 * empty: nothing is on file until the company uploads it. A met clause is the
 * one case where the artifacts must exist, since that is what "met" asserts.
 */
export function evidenceRows(
  clause: Clause,
  status: ClauseStatus | undefined,
  lang: Lang,
): EvidenceRow[] {
  return clause[lang].evidence.map((name, index) => {
    const kind = evidenceKind(clause.sv.evidence[index] ?? name);
    const onFile = status === 'met';
    return {
      kind,
      kindLabel: KIND_LABEL[kind][lang],
      name,
      description: KIND_DESCRIPTION[kind][lang].replace('{name}', name),
      onFile,
      stateLabel: onFile ? ON_FILE[lang] : MISSING[lang],
      actionLabel: UPLOAD[lang],
    };
  });
}
