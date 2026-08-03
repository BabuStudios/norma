import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { EmptyState } from '@/components/EmptyState';
import { CHANGE_LOG } from '@/data/changeLog';
import type { Clause } from '@/data/clauses';
import { NEXT_EXTERNAL_AUDIT } from '@/data/organizations';
import { inStandard, notMet } from '@/domain/conformity';
import { useDismissable } from '@/hooks/useDismissable';
import { useApp } from '@/state/store';
import styles from './OverviewScreen.module.css';

type Panel = '9001' | '14001' | null;

export function OverviewScreen() {
  const { state, t } = useApp();
  const navigate = useNavigate();
  const [openPanel, setOpenPanel] = useState<Panel>(null);

  const closePanel = useCallback(() => setOpenPanel(null), []);
  const bandRef = useDismissable<HTMLDivElement>(openPanel !== null, closePanel);

  const clauses9001 = inStandard('9001');
  const clauses14001 = inStandard('14001');
  const open9001 = notMet(clauses9001, state.statuses);
  const open14001 = notMet(clauses14001, state.statuses);

  const openClause = (clause: Clause) => {
    setOpenPanel(null);
    navigate(`/requirements/${clause.id}`);
  };

  const renderCell = (
    standard: Exclude<Panel, null>,
    label: string,
    open: Clause[],
    total: number,
  ) => {
    const isOpen = openPanel === standard;
    const panelId = `not-met-${standard}`;
    return (
      <div className={styles.cell}>
        <div className="microLabel microLabel--wide">{label}</div>
        <button
          type="button"
          className={styles.countRow}
          onClick={() => setOpenPanel(isOpen ? null : standard)}
          aria-expanded={isOpen}
          aria-controls={panelId}
        >
          <span className={styles.count}>{open.length}</span>
          <span className={styles.countOf}>
            {t.ofRequirements} {total}
          </span>
          <span className={`btn btn-secondary ${styles.countToggle}`}>
            <span aria-hidden="true">{isOpen ? '▴' : '▾'}</span> {t.viewList}
          </span>
        </button>

        {isOpen ? (
          <div className={`dropdown ${styles.dropdown}`} id={panelId}>
            {open.length === 0 ? (
              <p className={styles.dropdownEmpty}>{t.allMet}</p>
            ) : (
              open.map((clause) => (
                <button
                  key={clause.id}
                  type="button"
                  className={styles.dropdownRow}
                  onClick={() => openClause(clause)}
                >
                  <span className={styles.dropdownId}>{clause.number}</span>
                  <span className={styles.dropdownTitle}>{clause[state.lang].title}</span>
                </button>
              ))
            )}
          </div>
        ) : null}
      </div>
    );
  };

  return (
    <div className={styles.screen}>
      <div className={styles.band} ref={bandRef}>
        {renderCell('9001', t.notYetMet9, open9001, clauses9001.length)}
        {renderCell('14001', t.notYetMet14, open14001, clauses14001.length)}
        <div className={styles.cell}>
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
        </div>
      </div>

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
