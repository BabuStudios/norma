import type { Clause } from '@/data/clauses';
import type { ManagedDocument } from '@/data/documents';
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
const LINK_DOCUMENT: Bilingual = { sv: 'Koppla dokument', en: 'Link document' };

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
  linkedDocuments: ManagedDocument[];
  /** The company's own note on this evidence item — where to find it, who
   *  owns it, what's still missing. Empty until someone writes one. */
  comment: string;
}

/**
 * Whether an artifact is on file stands in for the document store: nothing is
 * on file until the company links a document to it from the register, or the
 * clause is met — the one status that asserts the artifacts already exist.
 * Once a document is linked to a specific evidence item, that item reads "on
 * file" regardless of the clause's overall status, since the artifact is now
 * demonstrably there.
 */
export function evidenceRows(
  clause: Clause,
  status: ClauseStatus | undefined,
  lang: Lang,
  linkedByIndex: Record<number, ManagedDocument[]> = {},
  commentsByIndex: Record<number, string> = {},
): EvidenceRow[] {
  return clause[lang].evidence.map((item, index) => {
    const kind = evidenceKind(clause.sv.evidence[index]?.label ?? item.label);
    const linkedDocuments = linkedByIndex[index] ?? [];
    const onFile = status === 'met' || linkedDocuments.length > 0;
    return {
      kind,
      kindLabel: KIND_LABEL[kind][lang],
      name: item.label,
      description: item.ask,
      onFile,
      stateLabel: onFile ? ON_FILE[lang] : MISSING[lang],
      actionLabel: LINK_DOCUMENT[lang],
      linkedDocuments,
      comment: commentsByIndex[index] ?? '',
    };
  });
}

/**
 * Evidence-to-document links are stored globally keyed by
 * `${clauseId}:${evidenceIndex}` (see AppState.evidenceDocumentLinks) as
 * document ids; this narrows that map to one clause, re-keys it by evidence
 * index, and resolves the ids against the document register — which is what
 * evidenceRows needs.
 */
export function linkedDocumentsForClause(
  evidenceDocumentLinks: Record<string, string[]>,
  documents: ManagedDocument[],
  clauseId: string,
): Record<number, ManagedDocument[]> {
  const prefix = `${clauseId}:`;
  const result: Record<number, ManagedDocument[]> = {};
  for (const [key, documentIds] of Object.entries(evidenceDocumentLinks)) {
    if (!key.startsWith(prefix) || documentIds.length === 0) continue;
    const linked = documentIds
      .map((id) => documents.find((document) => document.id === id))
      .filter((document): document is ManagedDocument => document !== undefined);
    if (linked.length > 0) result[Number(key.slice(prefix.length))] = linked;
  }
  return result;
}

/**
 * Evidence comments are stored globally keyed by `${clauseId}:${evidenceIndex}`
 * (see AppState.evidenceComments), same as the document links; this narrows
 * that map to one clause and re-keys it by evidence index for evidenceRows.
 */
export function commentsForClause(
  evidenceComments: Record<string, string>,
  clauseId: string,
): Record<number, string> {
  const prefix = `${clauseId}:`;
  const result: Record<number, string> = {};
  for (const [key, comment] of Object.entries(evidenceComments)) {
    if (!key.startsWith(prefix) || comment.trim() === '') continue;
    result[Number(key.slice(prefix.length))] = comment;
  }
  return result;
}
