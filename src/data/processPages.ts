import type { ScreenId } from '@/app/navigation';
import type { Bilingual } from './types';

/**
 * The mandatory ISO 9001/14001 processes that aren't about running the
 * company's actual operations — context, objectives, communication,
 * competence, legal compliance, emergency preparedness, improvement — but
 * that the standards require a management system to cover. Each gets its
 * own page, built from the same editable text/diagram blocks as
 * Ledningssystem, seeded per page rather than shared.
 */
export interface ProcessPageDef {
  id: ScreenId;
  title: Bilingual;
  intro: Bilingual;
  /** Plain, not bilingual — clause numbers read the same in both languages. */
  standardRefs: string;
}

export const PROCESS_PAGES: ProcessPageDef[] = [
  {
    id: 'context',
    title: { sv: 'Verksamhetens förutsättningar', en: 'Context & interested parties' },
    intro: {
      sv: 'Här dokumenterar ni de interna och externa frågor samt de intressenters behov och förväntningar som påverkar ledningssystemet — utgångspunkten för hela verksamhetens omfattning.',
      en: 'Document the internal and external issues, and the needs and expectations of interested parties, that shape the management system — the starting point for its whole scope.',
    },
    standardRefs: 'ISO 9001 §4.1, §4.2 · ISO 14001 §4.1, §4.2',
  },
  {
    id: 'objectives',
    title: { sv: 'Mål och handlingsplaner', en: 'Objectives & action plans' },
    intro: {
      sv: 'Kvalitets- och miljömål ska vara mätbara, kommunicerade och uppföljda. Här samlar ni årets mål, vem som är ansvarig och handlingsplanen för att nå dem.',
      en: "Quality and environmental objectives must be measurable, communicated and monitored. Collect this year's objectives, who owns them, and the action plan to reach them.",
    },
    standardRefs: 'ISO 9001 §6.2 · ISO 14001 §6.2',
  },
  {
    id: 'communication',
    title: { sv: 'Kommunikation', en: 'Communication' },
    intro: {
      sv: 'Vad som ska kommuniceras, när, med vem och hur — internt i organisationen och externt mot kunder, myndigheter och andra intressenter.',
      en: 'What needs communicating, when, with whom, and how — internally across the organization and externally to customers, authorities and other interested parties.',
    },
    standardRefs: 'ISO 9001 §7.4 · ISO 14001 §7.4',
  },
  {
    id: 'competence',
    title: { sv: 'Kompetens och medvetenhet', en: 'Competence & awareness' },
    intro: {
      sv: 'Vilken kompetens varje roll kräver, hur den säkerställs genom utbildning eller erfarenhet, och hur medarbetare görs medvetna om kvalitets- och miljöpolicyn och sitt eget bidrag.',
      en: "The competence each role requires, how it's ensured through training or experience, and how staff are made aware of the quality and environmental policy and their own contribution.",
    },
    standardRefs: 'ISO 9001 §7.2, §7.3 · ISO 14001 §7.2, §7.3',
  },
  {
    id: 'compliance',
    title: { sv: 'Efterlevnad av lagkrav', en: 'Compliance obligations' },
    intro: {
      sv: 'Register över de lagar, förordningar och andra krav som gäller verksamheten, samt hur ni regelbundet kontrollerar att ni lever upp till dem.',
      en: 'A register of the laws, regulations and other requirements that apply to the business, and how you regularly check that you meet them.',
    },
    standardRefs: 'ISO 14001 §6.1.3, §9.1.2 · ISO 9001 §4.2',
  },
  {
    id: 'emergency',
    title: { sv: 'Beredskap och agerande vid nödläge', en: 'Emergency preparedness' },
    intro: {
      sv: 'Hur ni identifierar potentiella nödlägen (till exempel utsläpp eller brand), samt er beredskap, insatsplaner och rutiner för att testa dem.',
      en: 'How you identify potential emergency situations (such as spills or fire), and your preparedness, response plans and routines for testing them.',
    },
    standardRefs: 'ISO 14001 §8.2',
  },
  {
    id: 'improvement',
    title: { sv: 'Avvikelser och ständiga förbättringar', en: 'Nonconformity & improvement' },
    intro: {
      sv: 'Hur avvikelser hanteras — grundorsaksanalys, korrigerande åtgärder — och hur ni driver ständig förbättring av ledningssystemet över tid.',
      en: 'How nonconformities are handled — root-cause analysis, corrective action — and how you drive continual improvement of the management system over time.',
    },
    standardRefs: 'ISO 9001 §10.2, §10.3 · ISO 14001 §10.2, §10.3',
  },
];

export function findProcessPage(id: string): ProcessPageDef | undefined {
  return PROCESS_PAGES.find((page) => page.id === id);
}
