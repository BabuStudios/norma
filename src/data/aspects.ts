import type { Bilingual } from './types';

/**
 * The environmental aspects register (ISO 14001 §6.1.2), assessed across the
 * life cycle: purchasing, operation, transport and waste.
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

export const SIGNIFICANT_AT = 12;
export const ELEVATED_AT = 8;

export const ASPECTS: EnvironmentalAspect[] = [
  {
    significance: 16,
    activity: { sv: 'Avfettning i badlinje', en: 'Degreasing in bath line' },
    aspect: { sv: 'Utsläpp av VOC till luft', en: 'VOC emissions to air' },
    impact: {
      sv: 'Försämrad luftkvalitet, hälsopåverkan',
      en: 'Reduced air quality, health effects',
    },
    stage: { sv: 'Drift', en: 'Operation' },
    control: {
      sv: 'Punktutsug, mätning kvartalsvis, mål M-02',
      en: 'Local extraction, quarterly measurement, objective M-02',
    },
  },
  {
    significance: 15,
    activity: { sv: 'Kemikalieförvaring', en: 'Chemical storage' },
    aspect: { sv: 'Risk för spill till dagvatten', en: 'Risk of spill to storm water' },
    impact: { sv: 'Förorening av mark och vatten', en: 'Soil and water contamination' },
    stage: { sv: 'Drift / nödläge', en: 'Operation / emergency' },
    control: {
      sv: 'Invallning, nivåvakt, spillkit, årlig övning',
      en: 'Bunding, level switch, spill kit, annual drill',
    },
  },
  {
    significance: 12,
    activity: { sv: 'Härdugnar', en: 'Curing ovens' },
    aspect: { sv: 'Energianvändning, el och gas', en: 'Energy use, electricity and gas' },
    impact: { sv: 'Klimatpåverkan, resursanvändning', en: 'Climate impact, resource use' },
    stage: { sv: 'Drift', en: 'Operation' },
    control: {
      sv: 'Timmätning per ugn, värmeåtervinning utreds',
      en: 'Hourly metering per oven, heat recovery under review',
    },
  },
  {
    significance: 9,
    activity: { sv: 'Slam från reningsanläggning', en: 'Sludge from treatment plant' },
    aspect: { sv: 'Farligt avfall', en: 'Hazardous waste' },
    impact: { sv: 'Deponibehov, spridningsrisk', en: 'Landfill demand, dispersal risk' },
    stage: { sv: 'Avfall', en: 'Waste' },
    control: {
      sv: 'Godkänd transportör, journalföring, viktuppföljning',
      en: 'Approved carrier, waste log, weight tracking',
    },
  },
  {
    significance: 8,
    activity: { sv: 'Inköp av metallgods', en: 'Purchase of metal goods' },
    aspect: { sv: 'Resursuttag i leverantörskedjan', en: 'Resource extraction upstream' },
    impact: { sv: 'Råvaruförbrukning, koldioxid', en: 'Raw material use, carbon' },
    stage: { sv: 'Uppströms', en: 'Upstream' },
    control: {
      sv: 'Miljökrav i avtal, andel återvunnet material följs',
      en: 'Environmental terms in contracts, recycled share tracked',
    },
  },
  {
    significance: 6,
    activity: { sv: 'Utleveranser med lastbil', en: 'Outbound truck deliveries' },
    aspect: { sv: 'Utsläpp från transport', en: 'Transport emissions' },
    impact: { sv: 'Klimatpåverkan', en: 'Climate impact' },
    stage: { sv: 'Nedströms', en: 'Downstream' },
    control: {
      sv: 'Fyllnadsgrad följs, HVO-krav vid ny upphandling',
      en: 'Load factor tracked, HVO required in next tender',
    },
  },
  {
    significance: 4,
    activity: { sv: 'Kontor och belysning', en: 'Offices and lighting' },
    aspect: { sv: 'Elanvändning', en: 'Electricity use' },
    impact: { sv: 'Klimatpåverkan', en: 'Climate impact' },
    stage: { sv: 'Drift', en: 'Operation' },
    control: {
      sv: 'LED utbytt, ingen ytterligare styrning',
      en: 'LED replaced, no further control needed',
    },
  },
];
