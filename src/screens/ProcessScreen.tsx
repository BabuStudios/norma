import { Navigate, useParams } from 'react-router-dom';
import { PageBlocksEditor } from '@/components/PageBlocksEditor';
import { findProcessPage } from '@/data/processPages';
import { useApp } from '@/state/store';
import styles from './ProcessScreen.module.css';

/**
 * One page per mandatory ISO 9001/14001 process that isn't about running the
 * company's own operations — context, objectives, communication,
 * competence, compliance, emergency preparedness, improvement. Same
 * editable text/diagram blocks as Ledningssystem, one independent set per
 * page, resolved from `data/processPages.ts` by the route's `:pageId`.
 */
export function ProcessScreen() {
  const { pageId } = useParams<{ pageId: string }>();
  const { state, t, updateProcessPageBlocks } = useApp();
  const page = pageId ? findProcessPage(pageId) : undefined;

  if (!page) return <Navigate to="/overview" replace />;

  return (
    <div className={styles.screen}>
      <section className={styles.intro}>
        <div className="sectionHead">
          <h2>{page.title[state.lang]}</h2>
          <span className="sectionHead__note">{page.standardRefs}</span>
        </div>
        <p className={styles.introText}>{page.intro[state.lang]}</p>
      </section>

      <section className={styles.blocks}>
        <PageBlocksEditor
          blocks={state.processPages[page.id] ?? []}
          onUpdateBlocks={(updater) => updateProcessPageBlocks(page.id, updater)}
          documents={state.documents}
          lang={state.lang}
          t={t}
        />
      </section>
    </div>
  );
}
