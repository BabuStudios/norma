import type { Clause } from '@/data/clauses';
import type { Bilingual, ClauseStatus, Lang } from '@/data/types';

/**
 * Evidence rows carry a type chip and a line explaining what the artifact
 * specifically has to be — because "process map" tells an auditor nothing
 * about whether the thing you hand over is the right thing. The description
 * is authored per evidence item in the catalogue (see EvidenceItem.ask), not
 * generated from a template: a template covering only half of a compound
 * name like "Revisionsprogram och revisionsrapporter" is worse than none.
 *
 * The type chip is still derived automatically, from the Swedish label, which
 * is the source language for the catalogue, so a requirement shows the same
 * chip in both languages.
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

const ON_FILE: Bilingual = { sv: 'Finns', en: 'On file' };
const MISSING: Bilingual = { sv: 'Saknas', en: 'Missing' };
const UPLOAD: Bilingual = { sv: 'Ladda upp', en: 'Upload' };

export function evidenceKind(swedishLabel: string): EvidenceKind {
  const text = swedishLabel.toLowerCase();
  return KIND_PATTERNS.find((p) => p.test.test(text))?.kind ?? 'document';
}

/** A file the user has attached to one evidence item. Metadata only — the
 *  bytes stay on the user's machine; nothing here is a document store. */
export interface UploadedFile {
  id: string;
  name: string;
  size: number;
  uploadedAt: string;
}

export interface EvidenceRow {
  kind: EvidenceKind;
  kindLabel: string;
  name: string;
  description: string;
  onFile: boolean;
  stateLabel: string;
  actionLabel: string;
  files: UploadedFile[];
}

/**
 * Whether an artifact is on file stands in for the document store, which is
 * empty: nothing is on file until the company uploads it, or the clause is met
 * — the one status that asserts the artifacts already exist. Once a file is
 * attached to a specific evidence item, that item reads "on file" regardless
 * of the clause's overall status, since the artifact is now demonstrably there.
 */
export function evidenceRows(
  clause: Clause,
  status: ClauseStatus | undefined,
  lang: Lang,
  uploadsByIndex: Record<number, UploadedFile[]> = {},
): EvidenceRow[] {
  return clause[lang].evidence.map((item, index) => {
    const kind = evidenceKind(clause.sv.evidence[index]?.label ?? item.label);
    const files = uploadsByIndex[index] ?? [];
    const onFile = status === 'met' || files.length > 0;
    return {
      kind,
      kindLabel: KIND_LABEL[kind][lang],
      name: item.label,
      description: item.ask,
      onFile,
      stateLabel: onFile ? ON_FILE[lang] : MISSING[lang],
      actionLabel: UPLOAD[lang],
      files,
    };
  });
}

/**
 * Uploads are stored globally keyed by `${clauseId}:${evidenceIndex}` (see
 * AppState.evidenceUploads); this narrows that map to one clause and re-keys
 * it by evidence index, which is what evidenceRows needs.
 */
export function uploadsForClause(
  evidenceUploads: Record<string, UploadedFile[]>,
  clauseId: string,
): Record<number, UploadedFile[]> {
  const prefix = `${clauseId}:`;
  const result: Record<number, UploadedFile[]> = {};
  for (const [key, files] of Object.entries(evidenceUploads)) {
    if (!key.startsWith(prefix) || files.length === 0) continue;
    result[Number(key.slice(prefix.length))] = files;
  }
  return result;
}
