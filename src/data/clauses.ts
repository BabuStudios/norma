import type { Bilingual, ChapterId, Standard } from './types';

/**
 * The requirements catalogue: chapters 4–10 of ISO 9001 and ISO 14001.
 *
 * Compliance note — read before editing:
 * none of this text reproduces the standards. Every explanation, step and
 * evidence line is our own paraphrase; only clause numbers are cited. The
 * standards are copyrighted and licensed through SIS, and the requirement
 * detail pane carries a disclaimer saying so. Keep it that way.
 *
 * In production this catalogue is static and versioned per standard edition,
 * so it ships with the app. Everything else in src/data is per-organization
 * sample data standing in for the API.
 */

export interface Chapter {
  id: ChapterId;
  label: Bilingual;
}

export const CHAPTERS: Chapter[] = [
  { id: '4', label: { sv: 'Organisationens förutsättningar', en: 'Context of the organization' } },
  { id: '5', label: { sv: 'Ledarskap', en: 'Leadership' } },
  { id: '6', label: { sv: 'Planering', en: 'Planning' } },
  { id: '7', label: { sv: 'Stöd', en: 'Support' } },
  { id: '8', label: { sv: 'Verksamhet', en: 'Operation' } },
  { id: '9', label: { sv: 'Utvärdering av prestation', en: 'Performance evaluation' } },
  { id: '10', label: { sv: 'Förbättring', en: 'Improvement' } },
];

/** An artifact an auditor will ask to see. */
export interface EvidenceItem {
  /** What the artifact is called. */
  label: string;
  /**
   * What the artifact specifically has to be to count — authored per item,
   * not a generic per-type template. "Process map" alone tells nobody what to
   * actually bring, and a template covering only half of a compound name like
   * "Revisionsprogram och revisionsrapporter" is worse than no description.
   */
  ask: string;
}

export interface ClauseText {
  /** Requirement title. */
  title: string;
  /** Plain-language explanation of what the requirement actually asks for. */
  what: string;
  /** Numbered things to do, each independently tickable. */
  steps: string[];
  /** Artifacts an auditor will ask to see. */
  evidence: EvidenceItem[];
}

export interface Clause {
  /** Unique key. Environment-only variants of a shared number carry an `e`
   *  suffix (8.2e, 9.1.2e) so they don't collide with the 9001 clause. */
  id: string;
  /** The clause number as printed in the UI. */
  number: string;
  chapter: ChapterId;
  standard: Standard;
  /** Clause references, cited by number only. */
  refs: string;
  sv: ClauseText;
  en: ClauseText;
}

export const CLAUSES: Clause[] = [
  {
    id: '4.1',
    number: '4.1',
    chapter: '4',
    standard: 'both',
    refs: '9001 §4.1 · 14001 §4.1',
    sv: {
      title: 'Organisationens sammanhang',
      what: 'Ni ska ha en enkel, dokumenterad bild av vad utanför och inuti företaget som påverkar er förmåga att leverera med rätt kvalitet och sköta miljöfrågorna. Ingen lång rapport — en lista som ni faktiskt använder.',
      steps: [
        'Lista externa faktorer: kunder, konkurrenter, lagstiftning, råvarupriser, klimat och väder.',
        'Lista interna faktorer: kompetens, utrustning, lokaler, ekonomi, kultur.',
        'Skriv en rad per faktor om hur den påverkar kvalitet respektive miljö.',
        'Ta upp listan på ledningens genomgång minst en gång per år och datera revideringen.',
      ],
      evidence: [
        { label: 'Omvärldsanalys (SWOT eller PESTLE)', ask: 'Omvärldsanalys (SWOT eller PESTLE) är själva listan över externa och interna faktorer och hur de påverkar kvalitet och miljö — inte bara en rubrik i ett dokument.' },
        { label: 'Protokoll där analysen behandlats', ask: 'Protokoll där analysen behandlats visar att ni faktiskt tog upp listan på ett möte och daterade revideringen — inte bara att den finns någonstans på disken.' },
      ],
    },
    en: {
      title: 'Context of the organization',
      what: 'You need a short, documented picture of what inside and outside the company affects your ability to deliver quality and manage environmental issues. Not a long report — a list you actually use.',
      steps: [
        'List external factors: customers, competitors, legislation, raw material prices, climate and weather.',
        'List internal factors: competence, equipment, premises, finances, culture.',
        'Write one line per factor on how it affects quality and environment respectively.',
        'Review the list in management review at least yearly and date the revision.',
      ],
      evidence: [
        { label: 'Context analysis (SWOT or PESTLE)', ask: 'Context analysis (SWOT or PESTLE) is the actual list of external and internal factors and how each affects quality and environment — not just a heading in a document.' },
        { label: 'Minutes where the analysis was reviewed', ask: 'Minutes where the analysis was reviewed show you actually brought the list to a meeting and dated the revision — not just that it exists somewhere on a drive.' },
      ],
    },
  },
  {
    id: '4.2',
    number: '4.2',
    chapter: '4',
    standard: 'both',
    refs: '9001 §4.2 · 14001 §4.2',
    sv: {
      title: 'Intressenter och deras krav',
      what: 'Bestäm vilka som har berättigade förväntningar på er — kunder, myndigheter, ägare, medarbetare, grannar — och vad de kräver. De krav ni väljer att följa blir bindande för er.',
      steps: [
        'Lista intressenterna och vad var och en förväntar sig.',
        'Markera vilka förväntningar som är krav ni binder er till (lag, avtal, kundkrav).',
        'Koppla varje bindande krav till en ansvarig och en uppföljningsrutin.',
        'Uppdatera listan när ni får nya kunder, avtal eller regler.',
      ],
      evidence: [
        { label: 'Intressentanalys med bindande krav', ask: 'Intressentanalysen är listan över vilka som förväntar sig något av er och vilka av de förväntningarna som är krav ni faktiskt bundit er till.' },
        { label: 'Kopplingar till lagkravsregistret', ask: 'Kopplingar till lagkravsregistret visar var varje bindande krav går att hitta i registret — inte bara att ett register finns.' },
      ],
    },
    en: {
      title: 'Interested parties and their requirements',
      what: 'Decide who holds legitimate expectations of you — customers, authorities, owners, employees, neighbours — and what they require. The requirements you accept become binding on you.',
      steps: [
        'List the interested parties and what each one expects.',
        'Mark which expectations are requirements you commit to (law, contract, customer demand).',
        'Link every binding requirement to an owner and a follow-up routine.',
        'Update the list when you take on new customers, contracts or rules.',
      ],
      evidence: [
        { label: 'Interested party analysis with binding requirements', ask: 'The interested party analysis is the list of who expects something from you and which of those expectations are requirements you have actually committed to.' },
        { label: 'Links to the legal register', ask: 'Links to the legal register show where each binding requirement can be found in the register — not just that a register exists.' },
      ],
    },
  },
  {
    id: '4.3',
    number: '4.3',
    chapter: '4',
    standard: 'both',
    refs: '9001 §4.3 · 14001 §4.3',
    sv: {
      title: 'Ledningssystemets omfattning',
      what: 'Skriv ner vad systemet gäller: vilka verksamheter, platser, produkter och tjänster. Undantag måste kunna motiveras — och i 14001 får ni inte undanta något ni har rådighet över.',
      steps: [
        'Beskriv platser, processer, produkter och tjänster som omfattas.',
        'Skriv en motivering för allt som lämnas utanför.',
        'Gör omfattningen tillgänglig för intressenter, till exempel på webbplatsen.',
        'Kontrollera vid varje förändring av verksamheten att omfattningen fortfarande stämmer.',
      ],
      evidence: [
        { label: 'Omfattningsdokument, godkänt av ledningen', ask: 'Omfattningsdokumentet skriver ut platserna, processerna, produkterna och tjänsterna som omfattas — och en motivering för allt som lämnats utanför — godkänt och daterat av ledningen.' },
      ],
    },
    en: {
      title: 'Scope of the management system',
      what: 'Write down what the system covers: which operations, sites, products and services. Exclusions must be justified — and in 14001 you cannot exclude what you control.',
      steps: [
        'Describe the sites, processes, products and services covered.',
        'Write a justification for anything left out.',
        'Make the scope available to interested parties, for example on your website.',
        'Whenever the business changes, check that the scope still holds.',
      ],
      evidence: [
        { label: 'Scope statement, approved by management', ask: 'The scope statement writes out the sites, processes, products and services covered — and a justification for anything left out — approved and dated by management.' },
      ],
    },
  },
  {
    id: '4.4',
    number: '4.4',
    chapter: '4',
    standard: 'both',
    refs: '9001 §4.4 · 14001 §4.4',
    sv: {
      title: 'Processer och deras samspel',
      what: 'Beskriv verksamheten som processer med in- och utdata, ansvarig och mått. En processkarta på en sida slår femtio sidor text.',
      steps: [
        'Rita en processkarta: kundprocesser, stödprocesser, ledningsprocesser.',
        'Ange för varje process: syfte, ägare, indata, utdata, mått.',
        'Beskriv gränssnitten — var lämnas jobbet över och vad ska följa med?',
        'Koppla ihop varje process med de risker och mål som gäller för den.',
      ],
      evidence: [
        { label: 'Processkarta', ask: 'Processkartan är den visuella bilden av kund-, stöd- och ledningsprocesserna och hur de hänger ihop — en sida, inte en rapport.' },
        { label: 'Processbeskrivningar med ägare och mått', ask: 'Processbeskrivningarna anger för varje process syfte, ägare, in- och utdata och vilket mått som visar om den fungerar.' },
      ],
    },
    en: {
      title: 'Processes and their interaction',
      what: 'Describe the business as processes with inputs, outputs, an owner and measures. A one-page process map beats fifty pages of text.',
      steps: [
        'Draw a process map: customer processes, support processes, management processes.',
        'For each process state purpose, owner, inputs, outputs and measures.',
        'Describe the interfaces — where is work handed over and what must travel with it?',
        'Connect each process to the risks and objectives that apply to it.',
      ],
      evidence: [
        { label: 'Process map', ask: 'The process map is the visual picture of customer, support and management processes and how they connect — one page, not a report.' },
        { label: 'Process descriptions with owner and measures', ask: 'The process descriptions state, for each process, purpose, owner, inputs and outputs and the measure that shows whether it works.' },
      ],
    },
  },
  {
    id: '5.1',
    number: '5.1',
    chapter: '5',
    standard: 'both',
    refs: '9001 §5.1 · 14001 §5.1',
    sv: {
      title: 'Ledarskap och åtagande',
      what: 'Ledningen ska bevisligen driva systemet, inte delegera det till en kvalitetssamordnare. Revisorn intervjuar vd:n och letar efter spår i beslut och budget.',
      steps: [
        'Skriv in ledningssystemet som stående punkt på ledningsgruppens agenda.',
        'Avsätt tid och budget: internrevision, utbildning, mätutrustning.',
        'Låt vd kommunicera policy och mål till alla medarbetare minst en gång per år.',
        'Dokumentera besluten — protokollen är ert bevis.',
      ],
      evidence: [
        { label: 'Protokoll från ledningsgruppen', ask: 'Protokoll från ledningsgruppen visar att ledningssystemet är en stående punkt på agendan, med beslut som går att spåra till en person och ett datum.' },
        { label: 'Budget för kvalitets- och miljöarbete', ask: 'Budgeten för kvalitets- och miljöarbete visar att internrevision, utbildning och mätutrustning faktiskt fått pengar avsatta — inte bara ett löfte.' },
      ],
    },
    en: {
      title: 'Leadership and commitment',
      what: 'Top management must visibly drive the system, not delegate it to a quality coordinator. The auditor interviews the CEO and looks for traces in decisions and budget.',
      steps: [
        'Put the management system as a standing item on the leadership agenda.',
        'Allocate time and budget: internal audit, training, measuring equipment.',
        'Have the CEO communicate policy and objectives to all staff at least yearly.',
        'Document the decisions — the minutes are your evidence.',
      ],
      evidence: [
        { label: 'Leadership team minutes', ask: 'Leadership team minutes show the management system is a standing agenda item, with decisions traceable to a person and a date.' },
        { label: 'Budget for quality and environmental work', ask: 'The budget for quality and environmental work shows that internal audit, training and measuring equipment have actually been allocated money — not just a promise.' },
      ],
    },
  },
  {
    id: '5.2',
    number: '5.2',
    chapter: '5',
    standard: 'both',
    refs: '9001 §5.2 · 14001 §5.2',
    sv: {
      title: 'Kvalitets- och miljöpolicy',
      what: 'En policy på max en sida som passar er verksamhet och innehåller åtaganden om att följa krav, ständigt förbättra och — för miljön — skydda miljön och förebygga förorening.',
      steps: [
        'Skriv policyn i egna ord, kort och konkret; slå ihop kvalitet och miljö till en om ni vill.',
        'Se till att åtagandena om lagefterlevnad, förbättring och miljöskydd finns med.',
        'Låt vd datera och signera.',
        'Publicera internt och externt, och gå igenom den vid introduktion av nyanställda.',
      ],
      evidence: [
        { label: 'Signerad policy', ask: 'Den signerade policyn är dokumentet i sin helhet — daterat och undertecknat av vd, med åtagandena om lagefterlevnad, förbättring och miljöskydd med i texten.' },
        { label: 'Bevis på kommunikation (intranät, anslag, introduktion)', ask: 'Bevis på kommunikation är till exempel en skärmdump från intranätet, ett anslag eller introduktionsmaterialet — något som visar att policyn faktiskt nått medarbetarna, inte bara publicerats.' },
      ],
    },
    en: {
      title: 'Quality and environmental policy',
      what: 'A one-page policy that fits your business and commits you to meeting requirements, continual improvement and — for environment — protecting the environment and preventing pollution.',
      steps: [
        'Write the policy in your own words, short and concrete; combine quality and environment into one if you like.',
        'Make sure the commitments to compliance, improvement and environmental protection are present.',
        'Have the CEO date and sign it.',
        'Publish it internally and externally, and cover it in onboarding.',
      ],
      evidence: [
        { label: 'Signed policy', ask: 'The signed policy is the document in full — dated and signed by the CEO, with the commitments to compliance, improvement and environmental protection actually in the text.' },
        { label: 'Evidence of communication (intranet, notice board, onboarding)', ask: 'Evidence of communication is, for example, a screenshot from the intranet, a notice board photo, or the onboarding material — something showing the policy actually reached staff, not just that it was published.' },
      ],
    },
  },
  {
    id: '5.3',
    number: '5.3',
    chapter: '5',
    standard: 'both',
    refs: '9001 §5.3 · 14001 §5.3',
    sv: {
      title: 'Roller, ansvar och befogenheter',
      what: 'Alla ska veta vem som gör vad i systemet — och vem som får stoppa en leverans eller ett utsläpp. Otydligt ansvar är en av de vanligaste avvikelserna vid revision.',
      steps: [
        'Gör en ansvarsmatris för kvalitets- och miljöuppgifter.',
        'Peka ut vem som rapporterar systemets prestation till ledningen.',
        'Skriv in ansvaren i befattningsbeskrivningar eller i processbeskrivningarna.',
        'Bekräfta att var och en känner till sitt ansvar, till exempel via signering.',
      ],
      evidence: [
        { label: 'Ansvarsmatris', ask: 'Ansvarsmatrisen listar kvalitets- och miljöuppgifterna och vem som är ansvarig för var och en, inklusive vem som får stoppa en leverans eller ett utsläpp.' },
        { label: 'Befattningsbeskrivningar', ask: 'Befattningsbeskrivningarna är dokumenten där ansvaret faktiskt står inskrivet per roll — inte bara att en separat ansvarsmatris finns.' },
      ],
    },
    en: {
      title: 'Roles, responsibilities and authorities',
      what: 'Everyone must know who does what in the system — and who may stop a delivery or a discharge. Unclear responsibility is one of the most common audit findings.',
      steps: [
        'Build a responsibility matrix for quality and environmental duties.',
        'Name who reports system performance to top management.',
        'Write the responsibilities into job descriptions or process descriptions.',
        'Confirm that each person knows their responsibility, for example by signature.',
      ],
      evidence: [
        { label: 'Responsibility matrix', ask: 'The responsibility matrix lists the quality and environmental duties and who is responsible for each one, including who may stop a delivery or a discharge.' },
        { label: 'Job descriptions', ask: 'The job descriptions are the documents where the responsibility is actually written in per role — not just that a separate responsibility matrix exists.' },
      ],
    },
  },
  {
    id: '6.1',
    number: '6.1',
    chapter: '6',
    standard: 'both',
    refs: '9001 §6.1 · 14001 §6.1.1',
    sv: {
      title: 'Risker och möjligheter',
      what: 'Utifrån sammanhanget och intressenterna ska ni bestämma vad som kan gå fel och vad ni kan vinna — och planera åtgärder. Ingen formell riskmetod krävs, men bedömningen ska gå att följa.',
      steps: [
        'Gå igenom varje process och lista risker och möjligheter.',
        'Bedöm dem enkelt, till exempel sannolikhet × konsekvens i skala 1–5.',
        'Bestäm åtgärd, ansvarig och datum för de högsta.',
        'Följ upp om åtgärderna gav effekt vid ledningens genomgång.',
      ],
      evidence: [
        { label: 'Risk- och möjlighetsregister med åtgärder', ask: 'Risk- och möjlighetsregistret listar vad som identifierats per process, hur det bedömts, och vilken åtgärd, ansvarig och datum som satts för de högst rankade.' },
        { label: 'Uppföljning av effekt', ask: 'Uppföljningen av effekt visar att åtgärderna faktiskt kontrollerades vid ledningens genomgång — inte bara att de bockades av som klara.' },
      ],
    },
    en: {
      title: 'Risks and opportunities',
      what: 'From your context and interested parties you must decide what can go wrong and what you can gain — and plan actions. No formal risk method is required, but the reasoning must be traceable.',
      steps: [
        'Walk through each process and list risks and opportunities.',
        'Score them simply, for example likelihood × consequence on a 1–5 scale.',
        'Decide action, owner and date for the highest ones.',
        'Check whether the actions worked at management review.',
      ],
      evidence: [
        { label: 'Risk and opportunity register with actions', ask: 'The risk and opportunity register lists what was identified per process, how it was scored, and the action, owner and date set for the highest-ranked ones.' },
        { label: 'Follow-up of effectiveness', ask: 'The follow-up of effectiveness shows the actions were actually checked at management review — not just ticked off as done.' },
      ],
    },
  },
  {
    id: '6.1.2',
    number: '6.1.2',
    chapter: '6',
    standard: '14001',
    refs: '14001 §6.1.2',
    sv: {
      title: 'Miljöaspekter och påverkan',
      what: 'Kartlägg hur verksamheten påverkar miljön — utsläpp, avfall, energi, kemikalier, transporter — i ett livscykelperspektiv, och avgör vilka aspekter som är betydande. Detta är hjärtat i 14001.',
      steps: [
        'Lista aktiviteter, produkter och tjänster, inklusive inköp och avfallsledet.',
        'Ange aspekt och miljöpåverkan för varje, samt om den gäller normal drift, avvikande drift eller nödläge.',
        'Sätt kriterier för betydande aspekt (omfattning, allvar, lagkrav, intressentkrav) och betygsätt.',
        'Styr de betydande aspekterna med rutin, mål eller mätning — och håll registret uppdaterat.',
      ],
      evidence: [
        { label: 'Miljöaspektregister med bedömningskriterier', ask: 'Miljöaspektregistret listar aktiviteter, produkter och tjänster med aspekt och påverkan för var och en, plus kriterierna ni satt för att avgöra vad som är betydande.' },
        { label: 'Beslut om betydande aspekter', ask: 'Beslutet om betydande aspekter visar vilka aspekter som bedömts betydande utifrån kriterierna, och att de styrs med rutin, mål eller mätning.' },
      ],
    },
    en: {
      title: 'Environmental aspects and impacts',
      what: 'Map how the business affects the environment — emissions, waste, energy, chemicals, transport — from a life cycle perspective, and determine which aspects are significant. This is the heart of 14001.',
      steps: [
        'List activities, products and services, including purchasing and the waste stage.',
        'State aspect and impact for each, and whether it applies to normal, abnormal or emergency conditions.',
        'Set criteria for significance (scale, severity, legal requirement, stakeholder concern) and score them.',
        'Control the significant aspects with a routine, objective or measurement — and keep the register current.',
      ],
      evidence: [
        { label: 'Environmental aspects register with scoring criteria', ask: 'The environmental aspects register lists activities, products and services with the aspect and impact for each, plus the criteria you set for deciding what counts as significant.' },
        { label: 'Decision on significant aspects', ask: 'The decision on significant aspects shows which aspects were scored significant against the criteria, and that they are controlled with a routine, objective or measurement.' },
      ],
    },
  },
  {
    id: '6.1.3',
    number: '6.1.3',
    chapter: '6',
    standard: '14001',
    refs: '14001 §6.1.3',
    sv: {
      title: 'Bindande krav och lagefterlevnad',
      what: 'Ni ska veta vilka lagar och andra krav som gäller era miljöaspekter, hur de gäller er konkret, och kunna visa att ni kontrollerar efterlevnaden regelbundet.',
      steps: [
        'Bygg ett lagkravsregister: miljöbalken, avfallsförordningen, kemikalie- och köldmedieregler, tillstånd och villkor.',
        'Skriv för varje krav vad det innebär för er i praktiken.',
        'Sätt ansvarig och intervall för efterlevnadskontroll.',
        'Bevaka ändringar, till exempel via en lagbevakningstjänst, och dokumentera kontrollerna.',
      ],
      evidence: [
        { label: 'Lagkravsregister', ask: 'Lagkravsregistret listar de lagar och andra krav som gäller era miljöaspekter, och vad varje krav innebär för er konkret — inte bara en hänvisning till lagtexten.' },
        { label: 'Genomförda efterlevnadskontroller med datum', ask: 'Genomförda efterlevnadskontroller med datum visar att ni faktiskt kontrollerat efterlevnaden mot verkligheten, med resultat och datum per krav.' },
      ],
    },
    en: {
      title: 'Compliance obligations',
      what: 'You must know which laws and other requirements apply to your environmental aspects, how they apply in practice, and be able to show that you check compliance regularly.',
      steps: [
        'Build a legal register: environmental code, waste regulation, chemical and refrigerant rules, permits and conditions.',
        'For each requirement, write what it means for you in practice.',
        'Set an owner and an interval for compliance evaluation.',
        'Monitor changes, for example via a legal monitoring service, and document the checks.',
      ],
      evidence: [
        { label: 'Legal and other requirements register', ask: 'The legal register lists the laws and other requirements that apply to your environmental aspects, and what each requirement means for you in practice — not just a reference to the statute.' },
        { label: 'Completed compliance evaluations with dates', ask: 'Completed compliance evaluations with dates show you actually checked compliance against reality, with a result and a date per requirement.' },
      ],
    },
  },
  {
    id: '6.2',
    number: '6.2',
    chapter: '6',
    standard: 'both',
    refs: '9001 §6.2 · 14001 §6.2',
    sv: {
      title: 'Mål och handlingsplaner',
      what: 'Mål ska vara mätbara, kopplade till policyn och till betydande miljöaspekter, och ha en plan: vad, vem, när, med vilka resurser och hur resultatet mäts.',
      steps: [
        'Sätt 3–6 mål; hellre få och skarpa än många och luddiga.',
        'Ange nuläge, målvärde och mätmetod för varje mål.',
        'Bryt ner till aktiviteter med ansvarig och datum.',
        'Följ upp minst kvartalsvis och ändra plan när trenden pekar fel.',
      ],
      evidence: [
        { label: 'Målplan med nyckeltal', ask: 'Målplanen anger nuläge, målvärde och mätmetod för varje mål, nedbrutet till aktiviteter med ansvarig och datum.' },
        { label: 'Uppföljning per kvartal', ask: 'Uppföljningen per kvartal visar hur nyckeltalen faktiskt utvecklats, och att planen justerats när trenden pekat fel.' },
      ],
    },
    en: {
      title: 'Objectives and action plans',
      what: 'Objectives must be measurable, tied to the policy and to significant environmental aspects, and carry a plan: what, who, when, with what resources and how results are measured.',
      steps: [
        'Set 3–6 objectives; few and sharp beats many and vague.',
        'State baseline, target and measurement method for each.',
        'Break them down into activities with owner and date.',
        'Follow up at least quarterly and change the plan when the trend goes wrong.',
      ],
      evidence: [
        { label: 'Objectives plan with KPIs', ask: 'The objectives plan states baseline, target and measurement method for each objective, broken down into activities with an owner and a date.' },
        { label: 'Quarterly follow-up', ask: 'The quarterly follow-up shows how the KPIs actually developed, and that the plan was adjusted when the trend went wrong.' },
      ],
    },
  },
  {
    id: '6.3',
    number: '6.3',
    chapter: '6',
    standard: '9001',
    refs: '9001 §6.3',
    sv: {
      title: 'Planering av ändringar',
      what: 'När ni ändrar något i systemet — ny process, ny lokal, ny roll — ska ändringen planeras, inte bara hända. Syfte, konsekvenser, resurser och ansvar ska vara genomtänkta.',
      steps: [
        'Använd en enkel ändringsmall: vad, varför, konsekvens, resurser, ansvarig.',
        'Bedöm hur ändringen påverkar processer, risker, dokument och kompetens.',
        'Besluta i ledningsgruppen och informera berörda.',
        'Utvärdera efter genomförandet att ändringen gav önskad effekt.',
      ],
      evidence: [
        { label: 'Ändringsbeslut med konsekvensbedömning', ask: 'Ändringsbeslutet med konsekvensbedömning är det ifyllda underlaget — vad, varför, konsekvens, resurser, ansvarig — beslutat i ledningsgruppen, inte bara en muntlig överenskommelse.' },
      ],
    },
    en: {
      title: 'Planning of changes',
      what: 'When you change something in the system — a new process, new premises, a new role — the change must be planned, not just happen. Purpose, consequences, resources and responsibility must be thought through.',
      steps: [
        'Use a simple change form: what, why, consequence, resources, owner.',
        'Assess how the change affects processes, risks, documents and competence.',
        'Decide it in the leadership team and inform those affected.',
        'After implementation, evaluate whether the change had the intended effect.',
      ],
      evidence: [
        { label: 'Change decision with impact assessment', ask: 'The change decision with impact assessment is the filled-in form — what, why, consequence, resources, owner — decided in the leadership team, not just a verbal agreement.' },
      ],
    },
  },
  {
    id: '7.1',
    number: '7.1',
    chapter: '7',
    standard: 'both',
    refs: '9001 §7.1 · 14001 §7.1',
    sv: {
      title: 'Resurser och utrustning',
      what: 'Personal, lokaler, utrustning och IT ska räcka för att göra jobbet rätt. Mätutrustning som avgör om en produkt godkänns ska vara kalibrerad och spårbar.',
      steps: [
        'Inventera vilka resurser varje process kräver och var det saknas.',
        'Lista mät- och kontrollutrustning med kalibreringsintervall.',
        'Kalibrera mot spårbar standard och märk utrustningen med status.',
        'Bestäm vad ni gör med tidigare resultat om utrustning visar sig felaktig.',
      ],
      evidence: [
        { label: 'Utrustningsregister med kalibreringsintyg', ask: 'Utrustningsregistret listar mät- och kontrollutrustningen med kalibreringsintervall, och kalibreringsintygen visar att den faktiskt kalibrerats mot en spårbar standard.' },
      ],
    },
    en: {
      title: 'Resources and equipment',
      what: 'People, premises, equipment and IT must be sufficient to do the job right. Measuring equipment that decides whether a product passes must be calibrated and traceable.',
      steps: [
        'Inventory what resources each process needs and where there is a shortfall.',
        'List measuring and monitoring equipment with calibration intervals.',
        'Calibrate against traceable standards and label equipment with its status.',
        'Decide what you do with earlier results if equipment turns out to be faulty.',
      ],
      evidence: [
        { label: 'Equipment register with calibration certificates', ask: 'The equipment register lists the measuring and monitoring equipment with calibration intervals, and the calibration certificates show it was actually calibrated against a traceable standard.' },
      ],
    },
  },
  {
    id: '7.2',
    number: '7.2',
    chapter: '7',
    standard: 'both',
    refs: '9001 §7.2 · 14001 §7.2',
    sv: {
      title: 'Kompetens',
      what: 'Bestäm vilken kompetens varje roll kräver, säkerställ att den finns och spara beviset. Gäller även inhyrda och entreprenörer som kan påverka kvalitet eller miljö.',
      steps: [
        'Skriv kompetenskrav per roll, inklusive lagstadgade behörigheter.',
        'Jämför med nuläget i en kompetensmatris och hitta luckorna.',
        'Planera utbildning eller upplärning med datum och ansvarig.',
        'Spara intyg och utvärdera om utbildningen gav effekt.',
      ],
      evidence: [
        { label: 'Kompetensmatris', ask: 'Kompetensmatrisen jämför kompetenskraven per roll med vem som faktiskt har vad, så att luckorna syns direkt — uppdaterad, inte ett engångsdokument.' },
        { label: 'Utbildningsintyg och utvärderingar', ask: 'Utbildningsintyg och utvärderingar är både de sparade kursintygen och en bedömning av om utbildningen faktiskt gav den kompetens som saknades.' },
      ],
    },
    en: {
      title: 'Competence',
      what: 'Determine what competence each role requires, make sure it exists and keep the evidence. This also covers agency staff and contractors who can affect quality or environment.',
      steps: [
        'Write competence requirements per role, including statutory licences.',
        'Compare with the current state in a competence matrix and find the gaps.',
        'Plan training or coaching with dates and an owner.',
        'Keep certificates and evaluate whether the training was effective.',
      ],
      evidence: [
        { label: 'Competence matrix', ask: 'The competence matrix compares the competence requirements per role with who actually has what, so the gaps are visible at a glance — kept current, not a one-off document.' },
        { label: 'Training certificates and evaluations', ask: 'Training certificates and evaluations are both the kept course certificates and an assessment of whether the training actually closed the gap it was meant to close.' },
      ],
    },
  },
  {
    id: '7.3',
    number: '7.3',
    chapter: '7',
    standard: 'both',
    refs: '9001 §7.3 · 14001 §7.3',
    sv: {
      title: 'Medvetenhet',
      what: 'Medarbetarna ska känna till policyn, sina betydande miljöaspekter, sitt bidrag till systemet och vad som händer om krav inte följs. Revisorn frågar på golvet, inte i mötesrummet.',
      steps: [
        'Håll en kort genomgång av policy och mål med varje arbetslag.',
        'Förklara de betydande miljöaspekter som just deras arbete påverkar.',
        'Beskriv konsekvenser av att inte följa rutiner — för kund, miljö och företag.',
        'Repetera vid introduktion och när något ändras.',
      ],
      evidence: [
        { label: 'Närvarolistor', ask: 'Närvarolistorna visar vilka som deltog i genomgången av policy och mål — inte bara att en genomgång planerades.' },
        { label: 'Introduktionsmaterial', ask: 'Introduktionsmaterialet är det som faktiskt visas för nyanställda om policy, betydande miljöaspekter och konsekvenser av att inte följa rutiner.' },
      ],
    },
    en: {
      title: 'Awareness',
      what: 'Staff must know the policy, their significant environmental aspects, their contribution to the system and what happens if requirements are not met. The auditor asks on the shop floor, not in the meeting room.',
      steps: [
        'Run a short briefing on policy and objectives with each team.',
        'Explain the significant environmental aspects their own work affects.',
        'Describe the consequences of not following routines — for customer, environment and company.',
        'Repeat at onboarding and whenever something changes.',
      ],
      evidence: [
        { label: 'Attendance lists', ask: 'The attendance lists show who took part in the briefing on policy and objectives — not just that a briefing was planned.' },
        { label: 'Onboarding material', ask: 'The onboarding material is what is actually shown to new hires about the policy, significant environmental aspects and the consequences of not following routines.' },
      ],
    },
  },
  {
    id: '7.4',
    number: '7.4',
    chapter: '7',
    standard: 'both',
    refs: '9001 §7.4 · 14001 §7.4',
    sv: {
      title: 'Kommunikation',
      what: 'Bestäm vad ni kommunicerar om kvalitet och miljö, när, till vem och hur — internt och externt. I 14001 ska ni också kunna visa att informationen är tillförlitlig.',
      steps: [
        'Gör en kommunikationsplan: budskap, mottagare, kanal, frekvens, ansvarig.',
        'Beskriva hur medarbetare kan lämna förslag och rapportera problem.',
        'Bestäm hur ni svarar på frågor och klagomål utifrån, till exempel från grannar eller myndigheter.',
        'Spara det ni skickat ut som bevis.',
      ],
      evidence: [
        { label: 'Kommunikationsplan', ask: 'Kommunikationsplanen anger budskap, mottagare, kanal, frekvens och ansvarig — och hur ni svarar på frågor och klagomål utifrån.' },
        { label: 'Exempel på utskick och svar', ask: 'Exempel på utskick och svar är faktiska kopior av det ni skickat och svarat — bevis att planen används, inte bara att den finns.' },
      ],
    },
    en: {
      title: 'Communication',
      what: 'Decide what you communicate about quality and environment, when, to whom and how — internally and externally. In 14001 you must also be able to show the information is reliable.',
      steps: [
        'Make a communication plan: message, audience, channel, frequency, owner.',
        'Describe how staff can raise suggestions and report problems.',
        'Decide how you answer external questions and complaints, for example from neighbours or authorities.',
        'Keep what you sent out as evidence.',
      ],
      evidence: [
        { label: 'Communication plan', ask: 'The communication plan states message, audience, channel, frequency and owner — and how you respond to external questions and complaints.' },
        { label: 'Examples of communications and replies', ask: 'Examples of communications and replies are actual copies of what you sent and answered — proof the plan is used, not just that it exists.' },
      ],
    },
  },
  {
    id: '7.5',
    number: '7.5',
    chapter: '7',
    standard: 'both',
    refs: '9001 §7.5 · 14001 §7.5',
    sv: {
      title: 'Dokumenterad information',
      what: 'Dokument ska vara godkända, aktuella, tillgängliga där arbetet sker och skyddade mot oavsiktlig ändring. Standarderna kräver mindre dokumentation än de flesta tror.',
      steps: [
        'Rensa: behåll bara det som styr arbetet eller krävs som bevis.',
        'Ge varje dokument ID, version, ägare och godkännandedatum.',
        'Bestäm var det publiceras och hur gamla versioner arkiveras.',
        'Sätt granskningsintervall och lagringstid, även för digitala loggar.',
      ],
      evidence: [
        { label: 'Dokumentförteckning med versioner', ask: 'Dokumentförteckningen listar varje styrande dokument med ID, version, ägare och godkännandedatum — den samlade bilden av vad som gäller just nu.' },
        { label: 'Rutin för dokumentstyrning', ask: 'Rutinen för dokumentstyrning beskriver var dokument publiceras, hur gamla versioner arkiveras och vilka gransknings- och lagringstider som gäller.' },
      ],
    },
    en: {
      title: 'Documented information',
      what: 'Documents must be approved, current, available where the work happens and protected from unintended change. The standards require less documentation than most people think.',
      steps: [
        'Prune: keep only what steers the work or is required as evidence.',
        'Give every document an ID, version, owner and approval date.',
        'Decide where it is published and how old versions are archived.',
        'Set review intervals and retention times, including for digital logs.',
      ],
      evidence: [
        { label: 'Document index with versions', ask: 'The document index lists every governing document with its ID, version, owner and approval date — the single view of what currently applies.' },
        { label: 'Document control procedure', ask: 'The document control procedure describes where documents are published, how old versions are archived, and what review and retention intervals apply.' },
      ],
    },
  },
  {
    id: '8.1',
    number: '8.1',
    chapter: '8',
    standard: 'both',
    refs: '9001 §8.1 · 14001 §8.1',
    sv: {
      title: 'Planering och styrning av verksamheten',
      what: 'Arbetet ska styras så att kraven uppfylls varje gång: kända rutiner, rätt kriterier, dokumentation i den omfattning som behövs. I 14001 gäller styrningen även livscykelperspektivet och entreprenörer.',
      steps: [
        'Beskriv rutiner för de processer där fel kostar mest.',
        'Sätt acceptanskriterier: vad är godkänt, vad är underkänt?',
        'Ställ krav på entreprenörer och leverantörer som utför arbete hos er.',
        'Bestäm vilken dokumentation som ska sparas per order eller sats.',
      ],
      evidence: [
        { label: 'Arbets- och skötselinstruktioner', ask: 'Arbets- och skötselinstruktionerna är de konkreta rutinerna för processerna där fel kostar mest, med tydliga acceptanskriterier för vad som är godkänt.' },
        { label: 'Krav i entreprenörsavtal', ask: 'Krav i entreprenörsavtal visar att era krav på entreprenörer och leverantörer som arbetar hos er faktiskt är skrivna in i avtalen — inte bara sagda muntligt.' },
      ],
    },
    en: {
      title: 'Operational planning and control',
      what: 'Work must be controlled so requirements are met every time: known routines, clear criteria, documentation to the extent needed. In 14001 control also covers the life cycle perspective and contractors.',
      steps: [
        'Describe routines for the processes where errors cost most.',
        'Set acceptance criteria: what passes and what fails?',
        'Place requirements on contractors and suppliers working on your site.',
        'Decide what documentation is kept per order or batch.',
      ],
      evidence: [
        { label: 'Work and maintenance instructions', ask: 'The work and maintenance instructions are the concrete routines for the processes where errors cost most, with clear acceptance criteria for what passes.' },
        { label: 'Requirements in contractor agreements', ask: 'Requirements in contractor agreements show your requirements for contractors and suppliers working on your site are actually written into the contracts — not just said out loud.' },
      ],
    },
  },
  {
    id: '8.2',
    number: '8.2',
    chapter: '8',
    standard: '9001',
    refs: '9001 §8.2',
    sv: {
      title: 'Kundkrav och kundkommunikation',
      what: 'Innan ni lovar något ska ni ha koll på vad kunden begär, vad lagen kräver och att ni klarar det. Ändringar i order ska fångas upp och nå fram till produktionen.',
      steps: [
        'Standardisera hur förfrågningar tas emot och registreras.',
        'Granska varje order mot kapacitet, kompetens och lagkrav innan bekräftelse.',
        'Dokumentera muntliga överenskommelser i orderbekräftelsen.',
        'Ha en rutin för orderändringar som når alla berörda.',
      ],
      evidence: [
        { label: 'Orderbekräftelser med granskningsspår', ask: 'Orderbekräftelser med granskningsspår visar att varje order granskats mot kapacitet, kompetens och lagkrav innan den bekräftades — inklusive muntliga överenskommelser i skrift.' },
        { label: 'Rutin för orderändring', ask: 'Rutinen för orderändring beskriver hur en ändring i en order fångas upp och når fram till produktionen, till alla som berörs.' },
      ],
    },
    en: {
      title: 'Customer requirements and communication',
      what: 'Before you promise anything you must know what the customer asks for, what the law requires and that you can deliver it. Order changes must be captured and reach production.',
      steps: [
        'Standardise how enquiries are received and registered.',
        'Review every order against capacity, competence and legal requirements before confirming.',
        'Document verbal agreements in the order confirmation.',
        'Have a routine for order changes that reaches everyone affected.',
      ],
      evidence: [
        { label: 'Order confirmations with review trail', ask: 'Order confirmations with a review trail show every order was checked against capacity, competence and legal requirements before it was confirmed — including verbal agreements in writing.' },
        { label: 'Order change routine', ask: 'The order change routine describes how a change to an order is captured and reaches production, and everyone affected.' },
      ],
    },
  },
  {
    id: '8.2e',
    number: '8.2',
    chapter: '8',
    standard: '14001',
    refs: '14001 §8.2',
    sv: {
      title: 'Nödläge och beredskap',
      what: 'Ni ska veta vilka miljöolyckor som kan inträffa — läckage, brand, utsläpp till dagvatten — och ha planer som är övade, inte bara skrivna.',
      steps: [
        'Identifiera möjliga nödlägen utifrån aspektregistret.',
        'Skriv korta åtgärdskort: larma, begränsa, sanera, rapportera till myndighet.',
        'Placera utrustning (absorbenter, invallning, spillkit) där risken finns.',
        'Öva minst en gång per år och dokumentera erfarenheterna.',
      ],
      evidence: [
        { label: 'Nödlägesrutiner och åtgärdskort', ask: 'Nödlägesrutinerna och åtgärdskorten är de korta, konkreta instruktionerna för varje identifierat nödläge: larma, begränsa, sanera, rapportera.' },
        { label: 'Övningsprotokoll', ask: 'Övningsprotokollet dokumenterar att ni faktiskt övat på ett nödläge minst en gång per år, och vilka erfarenheter övningen gav.' },
      ],
    },
    en: {
      title: 'Emergency preparedness and response',
      what: 'You must know which environmental incidents can occur — spills, fire, discharge to storm water — and hold plans that are practised, not just written.',
      steps: [
        'Identify potential emergencies from the aspects register.',
        'Write short action cards: alert, contain, clean up, report to the authority.',
        'Place equipment (absorbents, bunding, spill kits) where the risk is.',
        'Practise at least yearly and document the lessons learned.',
      ],
      evidence: [
        { label: 'Emergency procedures and action cards', ask: 'The emergency procedures and action cards are the short, concrete instructions for each identified emergency: alert, contain, clean up, report.' },
        { label: 'Drill records', ask: 'The drill record documents that you actually practised an emergency at least once a year, and what the drill taught you.' },
      ],
    },
  },
  {
    id: '8.4',
    number: '8.4',
    chapter: '8',
    standard: '9001',
    refs: '9001 §8.4',
    sv: {
      title: 'Externa leverantörer',
      what: 'Det ni köper in påverkar det ni levererar. Välj, bedöm och följ upp leverantörer utifrån hur mycket de kan påverka slutresultatet — inte alla behöver samma kontroll.',
      steps: [
        'Klassa leverantörerna efter påverkan på kvalitet och miljö.',
        'Sätt kriterier för godkännande och utvärdering.',
        'Skriv in era krav i beställning eller avtal, inklusive miljökrav.',
        'Utvärdera regelbundet och agera på det som inte håller.',
      ],
      evidence: [
        { label: 'Godkänd leverantörslista', ask: 'Den godkända leverantörslistan visar hur leverantörerna klassats efter påverkan på kvalitet och miljö, och vilka kriterier som avgjort godkännandet.' },
        { label: 'Utvärderingar med åtgärder', ask: 'Utvärderingar med åtgärder visar att leverantörerna faktiskt följts upp regelbundet, och vad som gjorts när en leverantör inte höll måttet.' },
      ],
    },
    en: {
      title: 'Externally provided processes and suppliers',
      what: 'What you buy affects what you deliver. Select, assess and follow up suppliers based on how much they can affect the end result — not everyone needs the same control.',
      steps: [
        'Classify suppliers by their impact on quality and environment.',
        'Set criteria for approval and evaluation.',
        'Write your requirements into the order or contract, including environmental ones.',
        'Evaluate regularly and act on what falls short.',
      ],
      evidence: [
        { label: 'Approved supplier list', ask: 'The approved supplier list shows how suppliers were classified by their impact on quality and environment, and the criteria that decided approval.' },
        { label: 'Evaluations with actions', ask: 'Evaluations with actions show suppliers were actually followed up regularly, and what was done when one fell short.' },
      ],
    },
  },
  {
    id: '8.5',
    number: '8.5',
    chapter: '8',
    standard: '9001',
    refs: '9001 §8.5',
    sv: {
      title: 'Produktion och tjänsteleverans',
      what: 'Styr själva utförandet: rätt instruktion, rätt utrustning, spårbarhet där det behövs, skydd av kundens egendom och kontrollerade ändringar under leverans.',
      steps: [
        'Se till att gällande instruktion finns där arbetet utförs.',
        'Bestäm vad som märks och spåras, och hur långt bakåt.',
        'Skydda och redovisa material som kunden äger.',
        'Dokumentera ändringar som görs under pågående leverans.',
      ],
      evidence: [
        { label: 'Tillverkningsunderlag med spårbarhet', ask: 'Tillverkningsunderlaget med spårbarhet visar vilken instruktion som gällde, vad som märktes och spårades, och hur långt bakåt — per order eller sats.' },
        { label: 'Ändringsloggar', ask: 'Ändringsloggarna dokumenterar de ändringar som gjordes under en pågående leverans — vad som ändrades, av vem och varför.' },
      ],
    },
    en: {
      title: 'Production and service provision',
      what: 'Control the doing: the right instruction, the right equipment, traceability where needed, protection of customer property and controlled changes during delivery.',
      steps: [
        'Make sure the valid instruction is where the work is done.',
        'Decide what is marked and traced, and how far back.',
        'Protect and account for material owned by the customer.',
        'Document changes made during ongoing delivery.',
      ],
      evidence: [
        { label: 'Production records with traceability', ask: 'Production records with traceability show which instruction applied, what was marked and traced, and how far back — per order or batch.' },
        { label: 'Change logs', ask: 'The change logs document the changes made during an ongoing delivery — what changed, by whom and why.' },
      ],
    },
  },
  {
    id: '8.7',
    number: '8.7',
    chapter: '8',
    standard: '9001',
    refs: '9001 §8.7',
    sv: {
      title: 'Avvikande produkter och tjänster',
      what: 'Det som inte uppfyller kraven ska stoppas, märkas och hanteras med ett medvetet beslut — inte glida vidare i flödet. Beslutet ska gå att spåra i efterhand.',
      steps: [
        'Bestäm hur avvikande material märks och avskiljs fysiskt.',
        'Ange vem som får besluta om kassation, omarbetning eller dispens.',
        'Informera kunden när det krävs enligt avtal eller lag.',
        'Registrera varje fall så att mönster syns över tid.',
      ],
      evidence: [
        { label: 'Register över avvikande utfall med beslut', ask: 'Registret listar varje avvikande produkt eller tjänst med beslutet som togs — kassation, omarbetning eller dispens — och om kunden informerades.' },
      ],
    },
    en: {
      title: 'Nonconforming outputs',
      what: 'What fails requirements must be stopped, marked and handled by a deliberate decision — not slide onward through the flow. The decision must be traceable afterwards.',
      steps: [
        'Decide how nonconforming material is marked and physically separated.',
        'State who may decide on scrapping, rework or concession.',
        'Inform the customer when contract or law requires it.',
        'Record every case so patterns become visible over time.',
      ],
      evidence: [
        { label: 'Register of nonconforming outputs with decisions', ask: 'The register lists every nonconforming product or service with the decision taken — scrap, rework or concession — and whether the customer was informed.' },
      ],
    },
  },
  {
    id: '9.1',
    number: '9.1',
    chapter: '9',
    standard: 'both',
    refs: '9001 §9.1 · 14001 §9.1',
    sv: {
      title: 'Övervakning och mätning',
      what: 'Bestäm vad ni mäter, med vilken metod, hur ofta och när resultatet analyseras. Mät få saker som styr beslut istället för många som bara fyller en pärm.',
      steps: [
        'Välj nyckeltal per process, kopplade till mål och betydande aspekter.',
        'Ange metod, ansvarig och frekvens för varje mätning.',
        'Analysera trender, inte enskilda värden.',
        'Rapportera resultaten till ledningen och besluta om åtgärder.',
      ],
      evidence: [
        { label: 'Mätplan', ask: 'Mätplanen anger vilka nyckeltal som mäts per process, med metod, ansvarig och frekvens — kopplade till mål och betydande aspekter.' },
        { label: 'Analyser och trendrapporter', ask: 'Analyser och trendrapporter visar hur nyckeltalen utvecklats över tid, inte bara enstaka mätvärden, och vilka beslut analysen ledde till.' },
      ],
    },
    en: {
      title: 'Monitoring and measurement',
      what: 'Decide what you measure, by what method, how often and when results are analysed. Measure a few things that drive decisions rather than many that only fill a binder.',
      steps: [
        'Choose KPIs per process, tied to objectives and significant aspects.',
        'State method, owner and frequency for each measurement.',
        'Analyse trends, not single values.',
        'Report results to management and decide on actions.',
      ],
      evidence: [
        { label: 'Measurement plan', ask: 'The measurement plan states which KPIs are measured per process, with method, owner and frequency — tied to objectives and significant aspects.' },
        { label: 'Analyses and trend reports', ask: 'Analyses and trend reports show how the KPIs developed over time, not just single readings, and what decisions the analysis led to.' },
      ],
    },
  },
  {
    id: '9.1.2',
    number: '9.1.2',
    chapter: '9',
    standard: '9001',
    refs: '9001 §9.1.2',
    sv: {
      title: 'Kundtillfredsställelse',
      what: 'Ni ska följa hur kunderna uppfattar er — inte bara gissa. Klagomål, reklamationer, leveransprecision och en enkel enkät räcker långt för ett litet företag.',
      steps: [
        'Välj två eller tre källor: enkät, klagomål, leveransprecision, kundmöten.',
        'Bestäm frekvens och vem som sammanställer.',
        'Analysera resultatet och jämför över tid.',
        'Ta med slutsatserna till ledningens genomgång och koppla till förbättringar.',
      ],
      evidence: [
        { label: 'Sammanställd kundnöjdhetsdata', ask: 'Sammanställd kundnöjdhetsdata slår ihop era valda källor — enkät, klagomål, leveransprecision — till en bild som går att jämföra över tid.' },
        { label: 'Åtgärder från analysen', ask: 'Åtgärder från analysen visar vad slutsatserna faktiskt ledde till — kopplat till ledningens genomgång, inte bara noterat och glömt.' },
      ],
    },
    en: {
      title: 'Customer satisfaction',
      what: 'You must track how customers perceive you — not just guess. Complaints, claims, delivery precision and one simple survey go a long way in a small company.',
      steps: [
        'Pick two or three sources: survey, complaints, delivery precision, customer meetings.',
        'Decide frequency and who compiles the data.',
        'Analyse the result and compare over time.',
        'Take the conclusions into management review and link them to improvements.',
      ],
      evidence: [
        { label: 'Compiled customer satisfaction data', ask: 'Compiled customer satisfaction data pulls your chosen sources — survey, complaints, delivery precision — into a picture you can compare over time.' },
        { label: 'Actions arising from the analysis', ask: 'Actions arising from the analysis show what the conclusions actually led to — linked to management review, not just noted and forgotten.' },
      ],
    },
  },
  {
    id: '9.1.2e',
    number: '9.1.2',
    chapter: '9',
    standard: '14001',
    refs: '14001 §9.1.2',
    sv: {
      title: 'Utvärdering av lagefterlevnad',
      what: 'Regelbundet, planerat och dokumenterat ska ni kontrollera att ni verkligen följer era bindande krav — och veta läget innan myndigheten frågar.',
      steps: [
        'Sätt intervall per lagkrav, oftare där konsekvensen är stor.',
        'Kontrollera mot verkligheten: mätvärden, journaler, kvitton, tillståndsvillkor.',
        'Dokumentera resultat, avvikelser och åtgärder med datum.',
        'Rapportera efterlevnadsläget till ledningen.',
      ],
      evidence: [
        { label: 'Efterlevnadskontroller per krav', ask: 'Efterlevnadskontrollerna visar, krav för krav, att ni kontrollerat mot verkligheten — mätvärden, journaler, kvitton, tillståndsvillkor — med datum.' },
        { label: 'Åtgärder vid brister', ask: 'Åtgärder vid brister dokumenterar vad som gjordes när en kontroll visade att ett krav inte var uppfyllt, och att ledningen fick veta.' },
      ],
    },
    en: {
      title: 'Evaluation of compliance',
      what: 'Regularly, on a plan and in writing, you must check that you actually meet your compliance obligations — and know your status before the authority asks.',
      steps: [
        'Set an interval per legal requirement, more often where consequences are large.',
        'Check against reality: readings, logs, receipts, permit conditions.',
        'Document result, deviations and actions with dates.',
        'Report the compliance status to management.',
      ],
      evidence: [
        { label: 'Compliance evaluations per requirement', ask: 'The compliance evaluations show, requirement by requirement, that you checked against reality — readings, logs, receipts, permit conditions — with dates.' },
        { label: 'Actions on shortfalls', ask: 'Actions on shortfalls document what was done when a check showed a requirement was not met, and that management was informed.' },
      ],
    },
  },
  {
    id: '9.2',
    number: '9.2',
    chapter: '9',
    standard: 'both',
    refs: '9001 §9.2 · 14001 §9.2',
    sv: {
      title: 'Internrevision',
      what: 'Egna revisioner enligt ett program ska visa om systemet följs och fungerar. Revisorn får inte granska sitt eget arbete — men behöver inte vara extern.',
      steps: [
        'Gör ett revisionsprogram som täcker alla krav och processer över tre år.',
        'Utbilda eller anlita en revisor som är oberoende av området.',
        'Revidera mot checklista, samla objektiva bevis, skriv rapport.',
        'Registrera avvikelser i avvikelsehanteringen och följ upp effekten.',
      ],
      evidence: [
        { label: 'Revisionsprogram och revisionsrapporter', ask: 'Revisionsprogrammet är planen som täcker alla krav och processer över tre år; revisionsrapporterna är de faktiskt genomförda revisionerna, med objektiva bevis och skriftlig rapport per tillfälle.' },
        { label: 'Avvikelser med korrigerande åtgärder', ask: 'Avvikelser med korrigerande åtgärder visar att fynden från revisionerna registrerats i avvikelsehanteringen och följts upp — inte bara noterade i rapporten.' },
      ],
    },
    en: {
      title: 'Internal audit',
      what: 'Your own audits, run to a programme, must show whether the system is followed and works. An auditor may not audit their own work — but need not be external.',
      steps: [
        'Build an audit programme covering all requirements and processes across three years.',
        'Train or hire an auditor independent of the area.',
        'Audit against a checklist, gather objective evidence, write a report.',
        'Register findings in deviation handling and follow up effectiveness.',
      ],
      evidence: [
        { label: 'Audit programme and audit reports', ask: 'The audit programme is the plan covering all requirements and processes across three years; the audit reports are the audits actually carried out, with objective evidence and a written report each time.' },
        { label: 'Findings with corrective actions', ask: 'Findings with corrective actions show the audit findings were registered in deviation handling and followed up — not just noted in the report.' },
      ],
    },
  },
  {
    id: '9.3',
    number: '9.3',
    chapter: '9',
    standard: 'both',
    refs: '9001 §9.3 · 14001 §9.3',
    sv: {
      title: 'Ledningens genomgång',
      what: 'Minst en gång per år går ledningen igenom hela systemet mot en bestämd agenda och fattar beslut om resurser, ändringar och förbättringar. Protokollet är ett av de första dokument en revisor ber om.',
      steps: [
        'Använd standardagendan: status på tidigare beslut, förändringar, prestation, revisioner, avvikelser, kundnöjdhet, resurser, risker, förbättringsmöjligheter.',
        'Sammanställ underlaget i förväg så mötet handlar om beslut.',
        'Dokumentera beslut med ansvarig och datum.',
        'Följ upp besluten vid nästa genomgång.',
      ],
      evidence: [
        { label: 'Protokoll från ledningens genomgång med beslutslista', ask: 'Protokollet är mötesanteckningarna från ledningens genomgång själva — datum, deltagare, vad som gicks igenom enligt agendan, och besluten med ansvarig och datum.' },
      ],
    },
    en: {
      title: 'Management review',
      what: 'At least once a year management reviews the whole system against a set agenda and decides on resources, changes and improvements. The minutes are among the first documents an auditor asks for.',
      steps: [
        'Use the standard agenda: status of previous actions, changes, performance, audits, deviations, customer satisfaction, resources, risks, improvement opportunities.',
        'Compile the inputs in advance so the meeting is about decisions.',
        'Document decisions with owner and date.',
        'Follow up the decisions at the next review.',
      ],
      evidence: [
        { label: 'Management review minutes with a decision list', ask: 'The minutes are the management review meeting record itself — date, attendees, what was covered against the agenda, and the decisions with an owner and a date.' },
      ],
    },
  },
  {
    id: '10.2',
    number: '10.2',
    chapter: '10',
    standard: 'both',
    refs: '9001 §10.2 · 14001 §10.2',
    sv: {
      title: 'Avvikelser och korrigerande åtgärder',
      what: 'När något går fel: åtgärda direkt, utred varför det kunde hända, ta bort orsaken och kontrollera att åtgärden höll. Det är skillnaden mellan att städa och att sluta spilla.',
      steps: [
        'Registrera avvikelsen med vad som hände, var och när.',
        'Gör omedelbar åtgärd och bedöm om liknande fall finns någon annanstans.',
        'Sök grundorsak, till exempel med fem varför.',
        'Besluta korrigerande åtgärd, sätt datum, och verifiera effekten innan ärendet stängs.',
      ],
      evidence: [
        { label: 'Avvikelseregister med grundorsak och effektkontroll', ask: 'Avvikelseregistret dokumenterar varje avvikelse från vad som hände till grundorsak, beslutad åtgärd och att effekten verifierades innan ärendet stängdes.' },
      ],
    },
    en: {
      title: 'Nonconformity and corrective action',
      what: 'When something goes wrong: fix it now, investigate why it could happen, remove the cause and verify the fix held. That is the difference between mopping up and stopping the spill.',
      steps: [
        'Register the deviation with what happened, where and when.',
        'Take immediate action and judge whether similar cases exist elsewhere.',
        'Find the root cause, for example with five whys.',
        'Decide the corrective action, set a date, and verify effectiveness before closing.',
      ],
      evidence: [
        { label: 'Deviation register with root cause and effectiveness check', ask: 'The deviation register documents each nonconformity from what happened to the root cause, the decided action, and that the effect was verified before the case was closed.' },
      ],
    },
  },
  {
    id: '10.3',
    number: '10.3',
    chapter: '10',
    standard: 'both',
    refs: '9001 §10.3 · 14001 §10.3',
    sv: {
      title: 'Fortlöpande förbättring',
      what: 'Systemet ska bli bättre över tid, och det ska kunna visas. Trender på nyckeltal, genomförda förbättringar och färre återkommande avvikelser är beviset.',
      steps: [
        'Samla förbättringsförslag från medarbetarna löpande.',
        'Prioritera utifrån effekt på kund, miljö och kostnad.',
        'Genomför och mät före och efter.',
        'Visa utvecklingen över flera år vid ledningens genomgång.',
      ],
      evidence: [
        { label: 'Förbättringslogg med mätt effekt', ask: 'Förbättringsloggen listar genomförda förbättringar med mätning före och efter — beviset att systemet faktiskt blivit bättre, inte bara att förslag kom in.' },
      ],
    },
    en: {
      title: 'Continual improvement',
      what: 'The system must get better over time, and that must be demonstrable. KPI trends, completed improvements and fewer repeat deviations are the evidence.',
      steps: [
        'Collect improvement suggestions from staff continuously.',
        'Prioritise by effect on customer, environment and cost.',
        'Implement and measure before and after.',
        'Show the development across several years at management review.',
      ],
      evidence: [
        { label: 'Improvement log with measured effect', ask: 'The improvement log lists completed improvements with measurements before and after — the proof the system actually got better, not just that suggestions came in.' },
      ],
    },
  },
];

/** The clause shown when no requirement has been chosen yet. */
export const DEFAULT_CLAUSE_ID = '6.1.2';
