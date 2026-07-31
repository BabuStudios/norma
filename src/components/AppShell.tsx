import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { locate } from '@/app/navigation';
import { useApp } from '@/state/store';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import styles from './AppShell.module.css';

/** Screens that lay out as two scrolling panes rather than one long page. */
const PANE_SCREENS = new Set(['req', 'sup']);

export function AppShell() {
  const { t } = useApp();
  const { pathname } = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  // A route change on a small screen means the drawer has done its job.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  const { item } = locate(pathname);

  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#norma-content">
        {t.skipToContent}
      </a>

      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />

      <div className={styles.main}>
        <Header onOpenMenu={() => setMenuOpen(true)} />
        <main
          className={styles.content}
          id="norma-content"
          data-panes={PANE_SCREENS.has(item.id)}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
}
