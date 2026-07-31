import { NavLink } from 'react-router-dom';
import { NAV } from '@/app/navigation';
import { CLAUSES } from '@/data/clauses';
import { ORGANIZATIONS } from '@/data/organizations';
import { notMet } from '@/domain/conformity';
import { useApp } from '@/state/store';
import styles from './Sidebar.module.css';

export function Sidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { state, t, nextOrg } = useApp();
  const org = ORGANIZATIONS[state.orgIndex];

  // The badge slot carries the one figure the app computes for itself: how
  // many requirements are still open. The other items have nothing to count.
  const openRequirements = notMet(CLAUSES, state.statuses).length;

  return (
    <>
      {open ? (
        <button
          type="button"
          className={styles.backdrop}
          onClick={onClose}
          aria-label={t.closeMenu}
        />
      ) : null}

      <aside className={styles.sidebar} data-open={open} id="norma-sidebar">
        <div className={styles.brand}>
          <div className={styles.brandMark}>NORMA</div>
          <div className={`microLabel ${styles.brandStandards}`}>ISO 9001 · ISO 14001</div>
        </div>

        <div className={styles.client}>
          <div className="microLabel">{t.client}</div>
          <button type="button" className={styles.clientButton} onClick={nextOrg}>
            <span className={styles.clientName}>{org.name}</span>
            <span className={styles.clientCaret} aria-hidden="true">
              ▾
            </span>
            <span className="visuallyHidden">{t.switchClient}</span>
          </button>
          {org.meta ? <div className={styles.clientMeta}>{org.meta[state.lang]}</div> : null}
        </div>

        <nav className={styles.nav} aria-label="NORMA">
          {NAV.map((group) => (
            <div key={group.label.en}>
              <div className={styles.groupLabel}>{group.label[state.lang]}</div>
              {group.items.map((item) => (
                <NavLink key={item.id} to={item.path} className={styles.item} onClick={onClose}>
                  <span className={styles.itemLabel}>{item.label[state.lang]}</span>
                  {item.id === 'req' && openRequirements > 0 ? (
                    <span className={styles.badge}>{openRequirements}</span>
                  ) : null}
                </NavLink>
              ))}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
}
