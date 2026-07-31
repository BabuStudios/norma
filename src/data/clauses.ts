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

export interface ClauseText {
  /** Requirement title. */
  title: string;
  /** Plain-language explanation of what the requirement actually asks for. */
  what: string;
  /** Numbered things to do, each independently tickable. */
  steps: string[];
  /** Artifacts an auditor will ask to see. */
  evidence: string[];
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
      evidence: ['Omvärldsanalys (SWOT eller PESTLE)', 'Protokoll där analysen behandlats'],
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
      evidence: ['Context analysis (SWOT or PESTLE)', 'Minutes where the analysis was reviewed'],
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
      evidence: ['Intressentanalys med bindande krav', 'Kopplingar till lagkravsregistret'],
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
      evidence: ['Interested party analysis with binding requirements', 'Links to the legal register'],
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
      evidence: ['Omfattningsdokument, godkänt av ledningen'],
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
      evidence: ['Scope statement, approved by management'],
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
      evidence: ['Processkarta', 'Processbeskrivningar med ägare och mått'],
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
      evidence: ['Process map', 'Process descriptions with owner and measures'],
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
      evidence: ['Protokoll från ledningsgruppen', 'Budget för kvalitets- och miljöarbete'],
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
      evidence: ['Leadership team minutes', 'Budget for quality and environmental work'],
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
      evidence: ['Signerad policy', 'Bevis på kommunikation (intranät, anslag, introduktion)'],
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
      evidence: ['Signed policy', 'Evidence of communication (intranet, notice board, onboarding)'],
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
      evidence: ['Ansvarsmatris', 'Befattningsbeskrivningar'],
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
      evidence: ['Responsibility matrix', 'Job descriptions'],
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
      evidence: ['Risk- och möjlighetsregister med åtgärder', 'Uppföljning av effekt'],
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
      evidence: ['Risk and opportunity register with actions', 'Follow-up of effectiveness'],
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
      evidence: ['Miljöaspektregister med bedömningskriterier', 'Beslut om betydande aspekter'],
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
      evidence: ['Environmental aspects register with scoring criteria', 'Decision on significant aspects'],
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
      evidence: ['Lagkravsregister', 'Genomförda efterlevnadskontroller med datum'],
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
      evidence: ['Legal and other requirements register', 'Completed compliance evaluations with dates'],
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
      evidence: ['Målplan med nyckeltal', 'Uppföljning per kvartal'],
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
      evidence: ['Objectives plan with KPIs', 'Quarterly follow-up'],
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
      evidence: ['Ändringsbeslut med konsekvensbedömning'],
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
      evidence: ['Change decision with impact assessment'],
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
      evidence: ['Utrustningsregister med kalibreringsintyg'],
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
      evidence: ['Equipment register with calibration certificates'],
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
      evidence: ['Kompetensmatris', 'Utbildningsintyg och utvärderingar'],
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
      evidence: ['Competence matrix', 'Training certificates and evaluations'],
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
      evidence: ['Närvarolistor', 'Introduktionsmaterial'],
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
      evidence: ['Attendance lists', 'Onboarding material'],
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
      evidence: ['Kommunikationsplan', 'Exempel på utskick och svar'],
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
      evidence: ['Communication plan', 'Examples of communications and replies'],
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
      evidence: ['Dokumentförteckning med versioner', 'Rutin för dokumentstyrning'],
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
      evidence: ['Document index with versions', 'Document control procedure'],
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
      evidence: ['Arbets- och skötselinstruktioner', 'Krav i entreprenörsavtal'],
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
      evidence: ['Work and maintenance instructions', 'Requirements in contractor agreements'],
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
      evidence: ['Orderbekräftelser med granskningsspår', 'Rutin för orderändring'],
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
      evidence: ['Order confirmations with review trail', 'Order change routine'],
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
      evidence: ['Nödlägesrutiner och åtgärdskort', 'Övningsprotokoll'],
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
      evidence: ['Emergency procedures and action cards', 'Drill records'],
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
      evidence: ['Godkänd leverantörslista', 'Utvärderingar med åtgärder'],
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
      evidence: ['Approved supplier list', 'Evaluations with actions'],
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
      evidence: ['Tillverkningsunderlag med spårbarhet', 'Ändringsloggar'],
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
      evidence: ['Production records with traceability', 'Change logs'],
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
      evidence: ['Register över avvikande utfall med beslut'],
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
      evidence: ['Register of nonconforming outputs with decisions'],
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
      evidence: ['Mätplan', 'Analyser och trendrapporter'],
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
      evidence: ['Measurement plan', 'Analyses and trend reports'],
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
      evidence: ['Sammanställd kundnöjdhetsdata', 'Åtgärder från analysen'],
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
      evidence: ['Compiled customer satisfaction data', 'Actions arising from the analysis'],
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
      evidence: ['Efterlevnadskontroller per krav', 'Åtgärder vid brister'],
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
      evidence: ['Compliance evaluations per requirement', 'Actions on shortfalls'],
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
      evidence: ['Revisionsprogram och revisionsrapporter', 'Avvikelser med korrigerande åtgärder'],
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
      evidence: ['Audit programme and audit reports', 'Findings with corrective actions'],
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
      evidence: ['Protokoll från ledningens genomgång med beslutslista'],
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
      evidence: ['Management review minutes with a decision list'],
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
      evidence: ['Avvikelseregister med grundorsak och effektkontroll'],
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
      evidence: ['Deviation register with root cause and effectiveness check'],
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
      evidence: ['Förbättringslogg med mätt effekt'],
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
      evidence: ['Improvement log with measured effect'],
    },
  },
];

/** The clause shown when no requirement has been chosen yet. */
export const DEFAULT_CLAUSE_ID = '6.1.2';
