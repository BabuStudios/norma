import type { Bilingual } from './types';

/**
 * The environmental aspects register (ISO 14001 §6.1.2), assessed across the
 * life cycle: purchasing, operation, transport and waste.
 *
 * Empty — this register is the heart of 14001 and has to be built from the
 * company's own activities. The template on the Documents screen is the
 * starting point.
 */
export interface EnvironmentalAspect {
  activity: Bilingual;
  aspect: Bilingual;
  impact: Bilingual;
  stage: Bilingual;
  control: Bilingual;
  /** Significance score. 12 and above is significant and prints in accent. */
  significance: number;
}

/** Scoring thresholds. Criteria are the company's to set per §6.1.2. */
export const SIGNIFICANT_AT = 12;
export const ELEVATED_AT = 8;

export const ASPECTS: EnvironmentalAspect[] = [];
