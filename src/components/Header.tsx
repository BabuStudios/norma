import { useLocation } from 'react-router-dom';
import { locate } from '@/app/navigation';
import { CURRENT_USER, ORGANIZATIONS } from '@/data/organizations';
import type { Lang } from '@/data/types';
import { useApp } from '@/state/store';
import styles from './Header.module.css';

const LANGUAGES: { code: Lang; label: string }[] = [
  { code: 'sv', label: 'SV' },
  { code: 'en', label: 'EN' },
];

export function Header({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { state, t, setLang } = useApp();
  const { pathname } = useLocation();
  const { item, group } = locate(pathname);
  const org = ORGANIZATIONS[state.orgIndex];

  return (
    <header className={styles.header}>
      <button type="button" className={styles.menuButton} onClick={onOpenMenu} aria-controls="norma-sidebar">
        <span aria-hidden="true">≡</span>
        <span className="visuallyHidden">{t.openMenu}</span>
      </button>

      <div className={styles.titles}>
        <div className="microLabel">
          {group.label[state.lang]} · {org.name}
        </div>
        <h1 className={styles.title}>{item.label[state.lang]}</h1>
      </div>

      <div className={styles.actions}>
        <div className="segmented" role="group" aria-label={t.changeLanguage}>
          {LANGUAGES.map((language) => (
            <button
              key={language.code}
              type="button"
              className="segmented__opt"
              aria-pressed={state.lang === language.code}
              onClick={() => setLang(language.code)}
            >
              {language.label}
            </button>
          ))}
        </div>

        <button type="button" className={`btn btn-secondary ${styles.exportButton}`}>
          {t.export}
        </button>

        <span className={styles.avatar} title={CURRENT_USER.name}>
          {CURRENT_USER.initials}
        </span>
      </div>
    </header>
  );
}
