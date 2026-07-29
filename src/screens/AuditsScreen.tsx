import { Pill } from '@/components/Pill';
import { Tick } from '@/components/Tick';
import { AUDIT_CHECKLIST, AUDIT_FINDINGS, AUDIT_PROGRAMME } from '@/data/audits';
import { useApp } from '@/state/store';
import styles from './AuditsScreen.module.css';

export function AuditsScreen() {
  const { state, t, toggleAuditCheck } = useApp();
  const lang = state.lang;

  const findings = [
    { count: AUDIT_FINDINGS.major, label: t.majorNc },
    { count: AUDIT_FINDINGS.minor, label: t.minorNc },
    { count: AUDIT_FINDINGS.observations, label: t.observations },
  ];

  return (
    <div className={styles.screen}>
      <div className={styles.columns}>
        <section>
          <div className="sectionHead">
            <h2>{t.auditPlan} 2026</h2>
            <span className="sectionHead__note">{t.auditPlanNote}</span>
          </div>
          {AUDIT_PROGRAMME.map((audit) => (
            <div key={audit.week} className={styles.auditRow}>
              <span className={styles.week}>{audit.week}</span>
              <span className={styles.auditText}>
                <span className={styles.auditArea}>{audit.area[lang]}</span>
                <span className={styles.auditMeta}>
                  {audit.clauses} · {audit.auditor[lang]}
                </span>
              </span>
              <Pill kind={audit.kind}>{audit.state[lang]}</Pill>
            </div>
          ))}
        </section>

        <section>
          <div className="sectionHead">
            <h2>
              {t.checklist} — {t.production}
            </h2>
          </div>
          {AUDIT_CHECKLIST.map((question, index) => {
            const checked = Boolean(state.auditChecks[index]);
            return (
              <label key={question.clause + question.question.en} className={styles.checkRow}>
                <Tick checked={checked} onChange={() => toggleAuditCheck(index)} />
                <span className={styles.checkClause}>§{question.clause}</span>
                <span className={styles.checkQuestion}>{question.question[lang]}</span>
              </label>
            );
          })}

          <section className={styles.findings}>
            <h3 className="microLabel">{t.findings}</h3>
            <div className={styles.findingNumbers}>
              {findings.map((finding) => (
                <div key={finding.label}>
                  <div className={styles.findingCount}>{finding.count}</div>
                  <div className={styles.findingLabel}>{finding.label}</div>
                </div>
              ))}
            </div>
            <p className={styles.findingsNote}>{t.findingsNote}</p>
          </section>
        </section>
      </div>
    </div>
  );
}
