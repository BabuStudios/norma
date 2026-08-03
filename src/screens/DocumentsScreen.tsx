import { useState } from 'react';
import { EmptyState } from '@/components/EmptyState';
import { Pill } from '@/components/Pill';
import { DOCUMENT_TEMPLATES, REVIEW_DUE_BEFORE, type NewDocumentFields } from '@/data/documents';
import { useApp } from '@/state/store';
import styles from './DocumentsScreen.module.css';

const EMPTY_DRAFT: NewDocumentFields = { name: '', version: '1.0', owner: '', nextReview: '' };

export function DocumentsScreen() {
  const { state, t, addDocument } = useApp();
  const lang = state.lang;
  const documents = state.documents;
  const [draft, setDraft] = useState<NewDocumentFields | null>(null);

  const commit = () => {
    if (!draft || !draft.name.trim()) return;
    addDocument(draft);
    setDraft(null);
  };

  return (
    <div className={styles.screen}>
      <section aria-label={t.templates} className={styles.templates}>
        {DOCUMENT_TEMPLATES.map((template) => (
          <button key={template.name.en} type="button" className={styles.template}>
            <span className="microLabel">{template.kicker[lang]}</span>
            <span className={styles.templateName}>{template.name[lang]}</span>
            <span className={styles.templateMeta}>{template.meta[lang]}</span>
            <span className={styles.templateAction}>
              {t.useTemplate} <span aria-hidden="true">→</span>
            </span>
          </button>
        ))}
      </section>

      <section aria-label={t.documentRegister}>
        <div className="sectionHead">
          <h2>{t.documentRegister}</h2>
          <button
            type="button"
            className="btn btn-secondary"
            aria-expanded={draft !== null}
            onClick={() => setDraft((current) => (current ? null : EMPTY_DRAFT))}
          >
            + {t.addDocument}
          </button>
        </div>

        {draft ? (
          <form
            className={styles.newDocForm}
            onSubmit={(event) => {
              event.preventDefault();
              commit();
            }}
          >
            <div className={`field ${styles.field}`}>
              <label htmlFor="new-doc-name">{t.docNameLabel}</label>
              <input
                id="new-doc-name"
                className="input"
                value={draft.name}
                onChange={(event) => setDraft({ ...draft, name: event.target.value })}
                required
              />
            </div>
            <div className={`field ${styles.field}`}>
              <label htmlFor="new-doc-version">{t.version}</label>
              <input
                id="new-doc-version"
                className="input"
                value={draft.version}
                onChange={(event) => setDraft({ ...draft, version: event.target.value })}
              />
            </div>
            <div className={`field ${styles.field}`}>
              <label htmlFor="new-doc-owner">{t.owner}</label>
              <input
                id="new-doc-owner"
                className="input"
                value={draft.owner}
                onChange={(event) => setDraft({ ...draft, owner: event.target.value })}
              />
            </div>
            <div className={`field ${styles.field}`}>
              <label htmlFor="new-doc-review">{t.nextReview}</label>
              <input
                id="new-doc-review"
                type="date"
                className="input"
                value={draft.nextReview}
                onChange={(event) => setDraft({ ...draft, nextReview: event.target.value })}
              />
            </div>
            <div className={styles.formActions}>
              <button type="submit" className="btn btn-primary">
                {t.saveDocument}
              </button>
              <button type="button" className="btn btn-secondary" onClick={() => setDraft(null)}>
                {t.cancel}
              </button>
            </div>
          </form>
        ) : null}

        {documents.length === 0 ? (
          !draft ? (
            <EmptyState>{t.emptyDocuments}</EmptyState>
          ) : null
        ) : (
          <div className="tableScroll">
            <table className={`dataTable ${styles.docTable}`}>
              <colgroup>
                <col style={{ width: '126px' }} />
                <col />
                <col style={{ width: '106px' }} />
                <col style={{ width: '166px' }} />
                <col style={{ width: '146px' }} />
                <col style={{ width: '120px' }} />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">{t.docId}</th>
                  <th scope="col">{t.docName}</th>
                  <th scope="col">{t.version}</th>
                  <th scope="col">{t.owner}</th>
                  <th scope="col">{t.nextReview}</th>
                  <th scope="col">{t.status}</th>
                </tr>
              </thead>
              <tbody>
                {documents.map((document) => (
                  <tr key={document.id}>
                    <td className={styles.docId}>{document.id}</td>
                    <td className={styles.docName}>{document.name[lang]}</td>
                    <td className="num">{document.version}</td>
                    <td>{document.owner}</td>
                    <td
                      className={`num ${document.nextReview < REVIEW_DUE_BEFORE ? styles.dueSoon : ''}`}
                    >
                      {document.nextReview}
                    </td>
                    <td>
                      <Pill kind={document.kind}>{document.state[lang]}</Pill>
                    </td>
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
