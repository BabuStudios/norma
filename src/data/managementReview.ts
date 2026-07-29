import type { Bilingual } from './types';

/** Agenda inputs per §9.3.2, each ticked off as it is prepared. */
export interface ReviewInput {
  label: Bilingual;
  source: Bilingual;
  defaultChecked: boolean;
}

export const REVIEW_INPUTS: ReviewInput[] = [
  {
    label: {
      sv: 'Status på beslut från förra genomgången',
      en: 'Status of actions from the previous review',
    },
    source: { sv: '6 av 8 beslut genomförda', en: '6 of 8 decisions implemented' },
    defaultChecked: true,
  },
  {
    label: {
      sv: 'Förändringar i sammanhang och intressentkrav',
      en: 'Changes in context and interested party requirements',
    },
    source: {
      sv: 'Två nya kundkrav, skärpt VOC-remiss',
      en: 'Two new customer requirements, tighter VOC consultation',
    },
    defaultChecked: true,
  },
  {
    label: { sv: 'Kundnöjdhet och återkoppling', en: 'Customer satisfaction and feedback' },
    source: {
      sv: 'Index 4,3 · 3 klagomål under perioden',
      en: 'Index 4.3 · 3 complaints in the period',
    },
    defaultChecked: true,
  },
  {
    label: { sv: 'Resultat från internrevisioner', en: 'Internal audit results' },
    source: { sv: '3 revisioner klara, 7 avvikelser', en: '3 audits complete, 7 findings' },
    defaultChecked: false,
  },
  {
    label: {
      sv: 'Resursbehov och förbättringsmöjligheter',
      en: 'Resource needs and improvement opportunities',
    },
    source: {
      sv: 'Nivåvakter, värmeåtervinning, revisorsutbildning',
      en: 'Level switches, heat recovery, auditor training',
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
  {
    sv: 'Förbättringsmöjligheter att gå vidare med',
    en: 'Improvement opportunities to pursue',
  },
  { sv: 'Slutsats: systemets ändamålsenlighet', en: 'Conclusion: suitability of the system' },
];

export const NEXT_REVIEW_MEETING = { date: '2026-08-20', participants: 6 };
