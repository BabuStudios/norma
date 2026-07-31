export type Lang = 'sv' | 'en';

/** A value authored in both languages. Every string the user sees has one. */
export type Bilingual<T = string> = Record<Lang, T>;

export function pick<T>(value: Bilingual<T>, lang: Lang): T {
  return value[lang];
}

/** Which standard a requirement belongs to. `both` is the integrated case. */
export type Standard = 'both' | '9001' | '14001';

/** Per-clause conformity. The prototype has no third state; "not applicable"
 *  is an action in the UI but not yet a stored status. */
export type ClauseStatus = 'prog' | 'met';

export type ChapterId = '4' | '5' | '6' | '7' | '8' | '9' | '10';

/** The four visual weights a status pill can take, shared by every register. */
export type PillKind = 'met' | 'gap' | 'soft' | 'plain';
