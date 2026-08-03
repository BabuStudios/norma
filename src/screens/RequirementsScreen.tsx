import { useCallback, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Pill } from '@/components/Pill';
import { Tick } from '@/components/Tick';
import { CHAPTERS, CLAUSES, DEFAULT_CLAUSE_ID, type Clause } from '@/data/clauses';
import { CLAUSE_LINKED_DOCUMENTS } from '@/data/documents';
import { CURRENT_USER } from '@/data/organizations';
import type { ClauseStatus } from '@/data/types';
import {
  chapterProgress,
  findClause,
  inStandard,
  notMet,
  standardLabel,
  statusOf,
} from '@/domain/conformity';
import { evidenceRows, uploadsForClause } from '@/domain/evidence';
import { formatFileSize } from '@/domain/format';
import { useDismissable } from '@/hooks/useDismissable';
import { useApp } from '@/state/store';
import styles from './RequirementsScreen.module.css';

type Filter = 'all' | '9001' | '14001';
type NotMetPanel = '9001' | '14001' | null;

/**
 * Last edit to this requirement. Null until something is changed — in
 * production this comes from the server-held change log, not from the client.
 */
const lastChanged: string | null = null;

export function RequirementsScreen() {
  const { state, t, setStatus, toggleStep, addEvidenceFiles, removeEvidenceFile } = useApp();
  const navigate = useNavigate();
  const { clauseId } = useParams();

  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [chapterPanelOpen, setChapterPanelOpen] = useState(true);
  const [openNotMet, setOpenNotMet] = useState<NotMetPanel>(null);

  const closeNotMet = useCallback(() => setOpenNotMet(null), []);
  const notMetBandRef = useDismissable<HTMLDivElement>(openNotMet !== null, closeNotMet);

  const clause = findClause(clauseId) ?? findClause(DEFAULT_CLAUSE_ID) ?? CLAUSES[0];
  const lang = state.lang;
  const text = clause[lang];
  const status = statusOf(clause, state.statuses);

  const visible = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return CLAUSES.filter((candidate) => {
      if (filter === '9001' && candidate.standard === '14001') return false;
      if (filter === '14001' && candidate.standard === '9001') return false;
      if (!needle) return true;
      return (
        candidate[lang].title.toLowerCase().includes(needle) || candidate.number.includes(needle)
      );
    });
  }, [query, filter, lang]);

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: t.filterAll },
    { key: '9001', label: '9001' },
    { key: '14001', label: '14001' },
  ];

  const statusOptions: { key: ClauseStatus; label: string }[] = [
    { key: 'prog', label: t.stProg },
    { key: 'met', label: t.stMet },
  ];

  const uploads = uploadsForClause(state.evidenceUploads, clause.id);
  const evidence = evidenceRows(clause, status, lang, uploads);
  const doneSteps = text.steps.filter((_, i) => state.steps[`${clause.id}:${i}`]).length;

  const openChapter = (chapterId: string) => {
    const first = CLAUSES.find((candidate) => candidate.chapter === chapterId);
    if (first) navigate(`/requirements/${first.id}`);
  };

  const clauses9001 = inStandard('9001');
  const clauses14001 = inStandard('14001');
  const open9001 = notMet(clauses9001, state.statuses);
  const open14001 = notMet(clauses14001, state.statuses);

  const openNotMetClause = (target: Clause) => {
    setOpenNotMet(null);
    navigate(`/requirements/${target.id}`);
  };

  const renderNotMetCell = (
    standard: Exclude<NotMetPanel, null>,
    label: string,
    open: Clause[],
    total: number,
  ) => {
    const isOpen = openNotMet === standard;
    const panelId = `not-met-${standard}`;
    return (
      <div className={styles.notMetCell}>
        <div className="microLabel microLabel--wide">{label}</div>
        <button
          type="button"
          className={styles.countRow}
          onClick={() => setOpenNotMet(isOpen ? null : standard)}
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
          <div className={`dropdown ${styles.notMetDropdown}`} id={panelId}>
            {open.length === 0 ? (
              <p className={styles.notMetDropdownEmpty}>{t.allMet}</p>
            ) : (
              open.map((candidate) => (
                <button
                  key={candidate.id}
                  type="button"
                  className={styles.notMetDropdownRow}
                  onClick={() => openNotMetClause(candidate)}
                >
                  <span className={styles.notMetDropdownId}>{candidate.number}</span>
                  <span className={styles.notMetDropdownTitle}>{candidate[lang].title}</span>
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
      <div className={styles.notMetBand} ref={notMetBandRef}>
        {renderNotMetCell('9001', t.notYetMet9, open9001, clauses9001.length)}
        {renderNotMetCell('14001', t.notYetMet14, open14001, clauses14001.length)}
      </div>

      <section className={styles.chapterPanel}>
        <button
          type="button"
          className={styles.chapterPanelToggle}
          onClick={() => setChapterPanelOpen((open) => !open)}
          aria-expanded={chapterPanelOpen}
          aria-controls="chapter-panel-body"
        >
          <span className={styles.chapterPanelHeading}>
            <span className={styles.chapterPanelTitle}>{t.byChapter}</span>
            <span className="sectionHead__note">{t.integrated}</span>
          </span>
          <span aria-hidden="true">{chapterPanelOpen ? '▴' : '▾'}</span>
        </button>
        {chapterPanelOpen ? (
          <div className={styles.chapterPanelBody} id="chapter-panel-body">
            {chapterProgress(state.statuses).map(({ chapter, percent, behind }) => (
              <button
                key={chapter.id}
                type="button"
                className={styles.chapterRow}
                data-behind={behind}
                onClick={() => openChapter(chapter.id)}
              >
                <span className={styles.chapterNumber}>{chapter.id}</span>
                <span className={styles.chapterLabel}>{chapter.label[lang]}</span>
                <span className={styles.track} aria-hidden="true">
                  <span className={styles.fill} style={{ width: `${percent}%` }} />
                </span>
                <span className={styles.chapterPercent}>
                  {percent}
                  <span aria-hidden="true">%</span>
                  <span className="visuallyHidden"> % {t.requirementProgress}</span>
                </span>
              </button>
            ))}
          </div>
        ) : null}
      </section>

      <div className={styles.panes} data-view={clauseId ? 'detail' : 'list'}>
        <div className={styles.tree}>
          <div className={styles.treeHeader}>
            <input
              className={`input ${styles.search}`}
              type="search"
              placeholder={t.searchReq}
              aria-label={t.searchReq}
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <div className={styles.filters} role="group" aria-label="ISO">
              {filters.map((option) => (
                <button
                  key={option.key}
                  type="button"
                  className="chip"
                  aria-pressed={filter === option.key}
                  onClick={() => setFilter(option.key)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          {visible.length === 0 ? <p className={styles.treeEmpty}>{t.noRequirements}</p> : null}

          {CHAPTERS.map((chapter) => {
            const items = visible.filter((candidate) => candidate.chapter === chapter.id);
            if (items.length === 0) return null;
            return (
              <section key={chapter.id}>
                <h2 className={styles.chapterHeader}>
                  {chapter.id}&nbsp;&nbsp;{chapter.label[lang]}
                </h2>
                {items.map((item) => (
                  <ClauseRow
                    key={item.id}
                    clause={item}
                    status={statusOf(item, state.statuses)}
                    active={item.id === clause.id}
                    onSelect={() => navigate(`/requirements/${item.id}`)}
                    lang={lang}
                  />
                ))}
              </section>
            );
          })}
        </div>

        <div className={styles.detailPane}>
          <article className={styles.detail}>
            <button
              type="button"
              className={styles.backLink}
              onClick={() => navigate('/requirements')}
            >
              <span aria-hidden="true">←</span> {t.backToRequirements}
            </button>

            <header className={styles.detailHeader}>
              <div className={styles.detailHeading}>
                <div className={styles.clauseBadgeRow}>
                  <span className={`tag ${styles.clauseBadge}`}>
                    {t.clause} {clause.number}
                  </span>
                  <span className={styles.standardLabel}>{standardLabel(clause.standard)}</span>
                </div>
                <h2 className={styles.clauseHeading}>{text.title}</h2>
              </div>

              <div className={styles.statusControl}>
                <span className="microLabel" id="clause-status-label">
                  {t.status}
                </span>
                <div
                  className="segmented segmented--caps"
                  role="group"
                  aria-labelledby="clause-status-label"
                >
                  {statusOptions.map((option) => (
                    <button
                      key={option.key}
                      type="button"
                      className="segmented__opt"
                      aria-pressed={status === option.key}
                      onClick={() => setStatus(clause.id, option.key)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </header>

            <div className={styles.body}>
              <div className={styles.bodyMain}>
                <section className={styles.explainer}>
                  <h3 className="microLabel">{t.whatItMeans}</h3>
                  <p className={styles.explainerBody}>{text.what}</p>
                </section>

                <section className={styles.block}>
                  <div className="sectionHead">
                    <h3>{t.howTo}</h3>
                    <span className="sectionHead__note">
                      {doneSteps}/{text.steps.length} {t.doneWord}
                    </span>
                  </div>
                  {text.steps.map((step, index) => {
                    const done = Boolean(state.steps[`${clause.id}:${index}`]);
                    return (
                      <label key={step} className={styles.step} data-done={done}>
                        <Tick checked={done} onChange={() => toggleStep(clause.id, index)} />
                        <span className={styles.stepNumber} aria-hidden="true">
                          {index + 1}.
                        </span>
                        <span className={styles.stepText}>{step}</span>
                      </label>
                    );
                  })}
                </section>

                <section className={styles.block}>
                  <div className="sectionHead">
                    <h3>{t.evidence}</h3>
                  </div>
                  <p className={styles.evidenceHelp}>{t.evidenceHelp}</p>
                  {evidence.map((row, index) => (
                    <div key={row.name} className={styles.evidenceRow}>
                      <span className={`tag tag-neutral ${styles.evidenceKind}`}>
                        {row.kindLabel}
                      </span>
                      <span className={styles.evidenceText}>
                        <span className={styles.evidenceName}>{row.name}</span>
                        <span className={styles.evidenceAsk}>{row.description}</span>
                        {row.files.length > 0 ? (
                          <ul className={styles.evidenceFiles}>
                            {row.files.map((file) => (
                              <li key={file.id} className={styles.evidenceFile}>
                                <span className={styles.evidenceFileName}>{file.name}</span>
                                <span className={styles.evidenceFileSize}>
                                  {formatFileSize(file.size)}
                                </span>
                                <button
                                  type="button"
                                  className={styles.evidenceFileRemove}
                                  onClick={() => removeEvidenceFile(clause.id, index, file.id)}
                                >
                                  <span aria-hidden="true">×</span>
                                  <span className="visuallyHidden">
                                    {t.removeFile} {file.name}
                                  </span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </span>
                      <span className={styles.evidencePill}>
                        <Pill kind={row.onFile ? 'met' : 'gap'}>{row.stateLabel}</Pill>
                      </span>
                      <label className={`btn btn-secondary ${styles.evidenceAction}`}>
                        {row.actionLabel}
                        <input
                          type="file"
                          multiple
                          className="visuallyHidden"
                          onChange={(event) => {
                            const files = event.target.files;
                            if (files && files.length > 0) {
                              addEvidenceFiles(clause.id, index, Array.from(files));
                            }
                            event.target.value = '';
                          }}
                        />
                      </label>
                    </div>
                  ))}
                </section>

                <div className={styles.actions}>
                  <button type="button" className="btn btn-primary">
                    {t.createTask}
                  </button>
                  <button type="button" className="btn btn-secondary">
                    {t.fromTemplate}
                  </button>
                  <button type="button" className="btn btn-secondary">
                    {t.markNA}
                  </button>
                </div>
              </div>

              <aside>
                <div className="boxStack">
                  <section>
                    <h3 className="microLabel">{t.refs}</h3>
                    <p className={styles.railBody}>{clause.refs}</p>
                    <p className={styles.railNote}>{t.paraphrase}</p>
                  </section>

                  <section>
                    <h3 className="microLabel">{t.owner}</h3>
                    {CURRENT_USER ? (
                      <>
                        <div className={styles.railName}>{CURRENT_USER.name}</div>
                        <div className={styles.railRole}>{t.qhseManager}</div>
                      </>
                    ) : (
                      <div className={styles.railEmpty}>{t.noOwner}</div>
                    )}
                    <div className={styles.railRule} />
                    <h3 className="microLabel">{t.lastChange}</h3>
                    <div className={lastChanged ? styles.railDate : styles.railEmpty}>
                      {lastChanged ?? t.noChangesYet}
                    </div>
                  </section>

                  <section>
                    <h3 className="microLabel">{t.linked}</h3>
                    {CLAUSE_LINKED_DOCUMENTS.length === 0 ? (
                      <div className={styles.railEmpty}>{t.noDocs}</div>
                    ) : (
                      CLAUSE_LINKED_DOCUMENTS.map((document) => (
                        <Link key={document.id} className={styles.railDoc} to="/documents">
                          <span className={styles.railDocId}>{document.id}</span>
                          <span>{document.name[lang]}</span>
                        </Link>
                      ))
                    )}
                  </section>
                </div>

                <p className={`hintBox ${styles.hint}`}>
                  <span className={styles.hintClause}>{clause.number}</span>
                  <span>{t.navHelp}</span>
                </p>
              </aside>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

function ClauseRow({
  clause,
  status,
  active,
  onSelect,
  lang,
}: {
  clause: Clause;
  status: ClauseStatus | undefined;
  active: boolean;
  onSelect: () => void;
  lang: 'sv' | 'en';
}) {
  return (
    <button type="button" className={styles.clauseRow} aria-current={active} onClick={onSelect}>
      <span className={styles.dot} data-status={status ?? 'none'} aria-hidden="true" />
      <span className={styles.clauseId}>{clause.number}</span>
      <span className={styles.clauseTitle}>{clause[lang].title}</span>
      {clause.standard !== 'both' ? (
        <span className={`tag tag-outline ${styles.standardTag}`}>{clause.standard}</span>
      ) : null}
    </button>
  );
}
