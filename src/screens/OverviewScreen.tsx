import { EmptyState } from '@/components/EmptyState';
import { CHANGE_LOG } from '@/data/changeLog';
import { NEXT_EXTERNAL_AUDIT } from '@/data/organizations';
import { useApp } from '@/state/store';
import styles from './OverviewScreen.module.css';

export function OverviewScreen() {
  const { state, t } = useApp();

  return (
    <div className={styles.screen}>
      <section className={styles.auditPanel}>
        <div className="microLabel microLabel--wide">{t.nextAudit}</div>
        {NEXT_EXTERNAL_AUDIT ? (
          <>
            <div className={styles.auditDate}>{NEXT_EXTERNAL_AUDIT.date}</div>
            <div className={styles.auditMeta}>
              {t.certAudit} · {NEXT_EXTERNAL_AUDIT.body}
            </div>
          </>
        ) : (
          <div className={`${styles.auditDate} ${styles.auditDateEmpty}`}>{t.noAuditBooked}</div>
        )}
      </section>

      <section className={styles.trail}>
        <div className="sectionHead">
          <h2>{t.trail}</h2>
        </div>
        {CHANGE_LOG.length === 0 ? (
          <EmptyState>{t.emptyChangeLog}</EmptyState>
        ) : (
          <div className="tableScroll">
            <table className={`dataTable ${styles.trailTable}`}>
              <colgroup>
                <col style={{ width: '156px' }} />
                <col style={{ width: '136px' }} />
                <col />
                <col style={{ width: '160px' }} />
              </colgroup>
              <thead className="visuallyHidden">
                <tr>
                  <th scope="col">{t.logWhen}</th>
                  <th scope="col">{t.logWho}</th>
                  <th scope="col">{t.logWhat}</th>
                  <th scope="col">{t.logRef}</th>
                </tr>
              </thead>
              <tbody>
                {CHANGE_LOG.map((entry) => (
                  <tr key={`${entry.when}-${entry.ref}`}>
                    <td className={`num ${styles.trailWhen}`}>{entry.when}</td>
                    <td className={styles.trailWho}>{entry.who}</td>
                    <td>{entry.what[state.lang]}</td>
                    <td className={styles.trailRef}>{entry.ref}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
