import type { ReactNode } from 'react';
import styles from './EmptyState.module.css';

/**
 * The standing empty state for a register that has nothing in it yet.
 * `action` is the first step the user can take, when there is one.
 */
export function EmptyState({
  children,
  action,
  compact = false,
}: {
  children: ReactNode;
  action?: ReactNode;
  compact?: boolean;
}) {
  return (
    <div className={`${styles.empty} ${compact ? styles['empty--compact'] : ''}`}>
      <p className={styles.body}>{children}</p>
      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  );
}
