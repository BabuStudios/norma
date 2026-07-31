import { describe, expect, it } from 'vitest';
import { ASPECTS } from './aspects';
import { AUDIT_CHECKLIST, AUDIT_FINDINGS, AUDIT_PROGRAMME } from './audits';
import { CHANGE_LOG } from './changeLog';
import { CLAUSES } from './clauses';
import { CLAUSE_LINKED_DOCUMENTS, DOCUMENTS, DOCUMENT_TEMPLATES } from './documents';
import { FIELD_CHECKS, FIELD_TASKS, FIELD_WALK } from './fieldMode';
import { PERSONAL_DATA, PROTECTION_CONTROLS, ROLES } from './governance';
import { NEXT_REVIEW_MEETING, REVIEW_INPUTS, REVIEW_OUTPUTS } from './managementReview';
import { CURRENT_USER, NEXT_EXTERNAL_AUDIT, ORGANIZATIONS } from './organizations';
import { SUPPLIERS } from './suppliers';

/**
 * This installation is set up for one company with nothing entered yet. These
 * tests draw the line between the two kinds of content: what the company owns
 * and must fill in, and what ships with the product.
 */

describe('the client', () => {
  it('is Awimex International, and only Awimex International', () => {
    expect(ORGANIZATIONS).toHaveLength(1);
    expect(ORGANIZATIONS[0].name).toBe('Awimex International');
  });

  it('invents no details about the company', () => {
    expect(ORGANIZATIONS[0].meta).toBeUndefined();
  });

  it('invents no signed-in user — the change log needs a real identity', () => {
    expect(CURRENT_USER).toBeNull();
  });
});

describe('company data starts empty', () => {
  it.each([
    ['documents', DOCUMENTS],
    ['documents linked to a requirement', CLAUSE_LINKED_DOCUMENTS],
    ['environmental aspects', ASPECTS],
    ['audit programme', AUDIT_PROGRAMME],
    ['audit checklist', AUDIT_CHECKLIST],
    ['suppliers', SUPPLIERS],
    ['change log', CHANGE_LOG],
    ['field checks', FIELD_CHECKS],
    ['field tasks', FIELD_TASKS],
  ])('%s', (_name, register) => {
    expect(register).toHaveLength(0);
  });

  it('has nothing booked and nothing in flight', () => {
    expect(NEXT_EXTERNAL_AUDIT).toBeNull();
    expect(NEXT_REVIEW_MEETING).toBeNull();
    expect(FIELD_WALK).toBeNull();
  });

  it('has found nothing, because nothing has been audited', () => {
    expect(AUDIT_FINDINGS).toEqual({ major: 0, minor: 0, observations: 0 });
  });

  it('has no clause pre-assessed', () => {
    // Conformity has to be earned; nothing is seeded as met or in progress.
    for (const clause of CLAUSES) {
      expect(clause).not.toHaveProperty('defaultStatus');
    }
  });

  it('leaves the management review agenda unticked and unsourced', () => {
    for (const input of REVIEW_INPUTS) {
      expect(input.defaultChecked).toBe(false);
      expect(input.source).toBeUndefined();
    }
  });
});

describe('product content stays', () => {
  it('keeps the requirements catalogue', () => {
    expect(CLAUSES.length).toBeGreaterThan(0);
  });

  it('keeps the document templates, which are starting points not records', () => {
    expect(DOCUMENT_TEMPLATES).toHaveLength(4);
  });

  it('keeps what the standard requires the management review to cover', () => {
    expect(REVIEW_INPUTS.length).toBeGreaterThan(0);
    expect(REVIEW_OUTPUTS.length).toBeGreaterThan(0);
  });

  it('keeps the GDPR and permission model, which describes the system itself', () => {
    expect(PERSONAL_DATA.length).toBeGreaterThan(0);
    expect(PROTECTION_CONTROLS.length).toBeGreaterThan(0);
    expect(ROLES.length).toBeGreaterThan(0);
  });
});
