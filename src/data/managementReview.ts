import type { Bilingual } from './types';

/**
 * Management review (§9.3). The agenda inputs and the required outputs are
 * what the standard asks the meeting to cover, so they ship with the product.
 * What the company has to supply is the substance behind each one — the
 * summary line stays empty until they compile it, and nothing starts ticked.
 */
export interface ReviewInput {
  label: Bilingual;
  /** The figures behind the item. Absent until the company compiles them. */
  source?: Bilingual;
  defaultChecked: boolean;
}

export const REVIEW_INPUTS: ReviewInput[] = [
  {
    label: {
      sv: 'Status på beslut från förra genomgången',
      en: 'Status of actions from the previous review',
    },
    defaultChecked: false,
  },
  {
    label: {
      sv: 'Förändringar i sammanhang och intressentkrav',
      en: 'Changes in context and interested party requirements',
    },
    defaultChecked: false,
  },
  {
    label: { sv: 'Kundnöjdhet och återkoppling', en: 'Customer satisfaction and feedback' },
    defaultChecked: false,
  },
  {
    label: { sv: 'Resultat från internrevisioner', en: 'Internal audit results' },
    defaultChecked: false,
  },
  {
    label: { sv: 'Avvikelser och korrigerande åtgärder', en: 'Nonconformities and corrective action' },
    defaultChecked: false,
  },
  {
    label: { sv: 'Uppfyllnad av mål och nyckeltal', en: 'Performance against objectives and KPIs' },
    defaultChecked: false,
  },
  {
    label: {
      sv: 'Resursbehov och förbättringsmöjligheter',
      en: 'Resource needs and improvement opportunities',
    },
    defaultChecked: false,
  },
];

/** Outputs the standard requires the meeting to produce. */
export const REVIEW_OUTPUTS: Bilingual[] = [
  {
    sv: 'Beslut om ändringar i ledningssystemet',
    en: 'Decisions on changes to the management system',
  },
  { sv: 'Beslut om resurser', en: 'Decisions on resources' },
  { sv: 'Förbättringsmöjligheter att gå vidare med', en: 'Improvement opportunities to pursue' },
  { sv: 'Slutsats: systemets ändamålsenlighet', en: 'Conclusion: suitability of the system' },
];

/** Null until a review is booked. */
export const NEXT_REVIEW_MEETING: { date: string; participants: number } | null = null;
