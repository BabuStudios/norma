import type { Bilingual, PillKind } from './types';

/** The audit walk running on the phone, mid-round. The area name comes from
 *  the dictionary, so only the clause it covers lives here. */
export const FIELD_WALK = { clause: '§8.5', done: 6, total: 10 };

export interface FieldCheck {
  question: Bilingual;
  checked: boolean;
}

export const FIELD_CHECKS: FieldCheck[] = [
  {
    question: {
      sv: 'Gällande instruktion finns vid stationen',
      en: 'Valid instruction available at the station',
    },
    checked: true,
  },
  {
    question: { sv: 'Kalibreringsmärkning giltig', en: 'Calibration label valid' },
    checked: true,
  },
  {
    question: {
      sv: 'Avvikande gods avskilt och märkt',
      en: 'Nonconforming goods separated and marked',
    },
    checked: false,
  },
  {
    question: { sv: 'Spillkit komplett och plomberat', en: 'Spill kit complete and sealed' },
    checked: false,
  },
];

export interface FieldTask {
  clause: string;
  title: Bilingual;
  due: Bilingual;
  kind: PillKind;
}

export const FIELD_TASKS: FieldTask[] = [
  {
    clause: '§8.2',
    title: { sv: 'Montera nivåvakt tank 2', en: 'Fit level switch on tank 2' },
    due: { sv: 'Idag', en: 'Today' },
    kind: 'gap',
  },
  {
    clause: '§6.1.2',
    title: { sv: 'Uppdatera aspektregistret', en: 'Update the aspects register' },
    due: { sv: '2 dagar', en: '2 days' },
    kind: 'gap',
  },
  {
    clause: '§7.4',
    title: { sv: 'Skriv utkast till kommunikationsplan', en: 'Draft the communication plan' },
    due: { sv: 'Fredag', en: 'Friday' },
    kind: 'soft',
  },
];
