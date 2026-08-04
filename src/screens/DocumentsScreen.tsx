import { useState } from 'react';
import { EmptyState } from '@/components/EmptyState';
import { Pill } from '@/components/Pill';
import { REVIEW_DUE_BEFORE, type NewDocumentFields } from '@/data/documents';
import { getFileUrl } from '@/domain/fileStore';
import { formatFileSize } from '@/domain/format';
import { useApp } from '@/state/store';
import styles from './DocumentsScreen.module.css';

const emptyDraft = (tabId: string): NewDocumentFields => ({
  name: '',
  version: '1.0',
  owner: '',
  nextReview: '',
  tabId,
  metadata: {},
  fileName: null,
  fileSize: null,
});

export function DocumentsScreen() {
  const {
    state,
    t,
    addDocument,
    removeDocument,
    setDocumentIdPrefix,
    addDocumentTab,
    addTabMetadataField,
    removeTabMetadataField,
  } = useApp();
  const lang = state.lang;
  const [activeTabId, setActiveTabId] = useState(state.documentTabs[0]?.id ?? '');
  const [draft, setDraft] = useState<NewDocumentFields | null>(null);
  const [draftFile, setDraftFile] = useState<File | null>(null);
  const [newTabOpen, setNewTabOpen] = useState(false);
  const [newTabName, setNewTabName] = useState('');
  const [editingMetadata, setEditingMetadata] = useState(false);
  const [newFieldName, setNewFieldName] = useState('');

  const activeTab = state.documentTabs.find((tab) => tab.id === activeTabId);
  const documents = state.documents.filter((document) => document.tabId === activeTabId);

  const commit = () => {
    if (!draft || !draft.name.trim()) return;
    addDocument(draft, draftFile ?? undefined);
    setDraft(null);
    setDraftFile(null);
  };

  const commitTab = () => {
    if (!newTabName.trim()) return;
    addDocumentTab(newTabName.trim());
    setNewTabName('');
    setNewTabOpen(false);
  };

  const commitField = () => {
    if (!activeTab || !newFieldName.trim()) return;
    addTabMetadataField(activeTab.id, newFieldName.trim());
    setNewFieldName('');
  };

  return (
    <div className={styles.screen}>
      <section aria-label={t.documentRegister}>
        <div className="sectionHead">
          <h2>{t.documentRegister}</h2>
          <div className={styles.headActions}>
            <label className={styles.idPrefixField}>
              {t.idPrefixLabel}
              <input
                className="input"
                value={state.documentIdPrefix}
                onChange={(event) => setDocumentIdPrefix(event.target.value)}
              />
            </label>
            <button
              type="button"
              className="btn btn-secondary"
              aria-expanded={draft !== null}
              onClick={() => {
                setDraft((current) => (current ? null : emptyDraft(activeTabId)));
                setDraftFile(null);
              }}
            >
              + {t.addDocument}
            </button>
          </div>
        </div>

        <div className={styles.tabBar} role="tablist" aria-label={t.documentRegister}>
          {state.documentTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={tab.id === activeTabId}
              className={styles.tab}
              onClick={() => {
                setActiveTabId(tab.id);
                setEditingMetadata(false);
              }}
            >
              {tab.name}
            </button>
          ))}
          {newTabOpen ? (
            <form
              className={styles.newTabForm}
              onSubmit={(event) => {
                event.preventDefault();
                commitTab();
              }}
            >
              <input
                className="input"
                value={newTabName}
                onChange={(event) => setNewTabName(event.target.value)}
                aria-label={t.newTabNameLabel}
                autoFocus
              />
              <button type="submit" className="btn btn-secondary">
                {t.saveTab}
              </button>
            </form>
          ) : (
            <button type="button" className={styles.addTab} onClick={() => setNewTabOpen(true)}>
              + {t.addTab}
            </button>
          )}
        </div>

        {activeTab ? (
          <div className={styles.metadataBar}>
            <button
              type="button"
              className="btn btn-secondary"
              aria-expanded={editingMetadata}
              onClick={() => setEditingMetadata((current) => !current)}
            >
              {t.editMetadataFields}
            </button>
            {editingMetadata ? (
              <div className={styles.metadataEditor}>
                <span className="microLabel">{t.metadataFieldsHeading}</span>
                {activeTab.metadataFields.length === 0 ? (
                  <p className={styles.metadataEmpty}>{t.noMetadataFields}</p>
                ) : (
                  <ul className={styles.metadataFieldList}>
                    {activeTab.metadataFields.map((field) => (
                      <li key={field} className={styles.metadataFieldChip}>
                        {field}
                        <button
                          type="button"
                          onClick={() => removeTabMetadataField(activeTab.id, field)}
                        >
                          <span aria-hidden="true">×</span>
                          <span className="visuallyHidden">
                            {t.removeMetadataField} {field}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
                <form
                  className={styles.metadataAddField}
                  onSubmit={(event) => {
                    event.preventDefault();
                    commitField();
                  }}
                >
                  <input
                    className="input"
                    value={newFieldName}
                    onChange={(event) => setNewFieldName(event.target.value)}
                    aria-label={t.metadataFieldNameLabel}
                  />
                  <button type="submit" className="btn btn-secondary">
                    {t.addMetadataField}
                  </button>
                </form>
              </div>
            ) : null}
          </div>
        ) : null}

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
            <div className={`field ${styles.field}`}>
              <label htmlFor="new-doc-file">{t.uploadFileLabel}</label>
              <input
                id="new-doc-file"
                type="file"
                className="input"
                onChange={(event) => {
                  const file = event.target.files?.[0] ?? null;
                  setDraftFile(file);
                  setDraft({
                    ...draft,
                    fileName: file?.name ?? null,
                    fileSize: file?.size ?? null,
                  });
                }}
              />
            </div>
            {(activeTab?.metadataFields ?? []).map((field) => (
              <div key={field} className={`field ${styles.field}`}>
                <label htmlFor={`new-doc-meta-${field}`}>{field}</label>
                <input
                  id={`new-doc-meta-${field}`}
                  className="input"
                  value={draft.metadata[field] ?? ''}
                  onChange={(event) =>
                    setDraft({
                      ...draft,
                      metadata: { ...draft.metadata, [field]: event.target.value },
                    })
                  }
                />
              </div>
            ))}
            <div className={styles.formActions}>
              <button type="submit" className="btn btn-primary">
                {t.saveDocument}
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setDraft(null);
                  setDraftFile(null);
                }}
              >
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
                <col style={{ width: '146px' }} />
                <col style={{ width: '146px' }} />
                <col style={{ width: '110px' }} />
                <col style={{ width: '48px' }} />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">{t.docId}</th>
                  <th scope="col">{t.docName}</th>
                  <th scope="col">{t.version}</th>
                  <th scope="col">{t.owner}</th>
                  <th scope="col">{t.nextReview}</th>
                  <th scope="col">{t.status}</th>
                  <th scope="col" className="visuallyHidden">
                    {t.deleteDocument}
                  </th>
                </tr>
              </thead>
              <tbody>
                {documents.map((document) => (
                  <tr key={document.id}>
                    <td className={styles.docId}>{document.id}</td>
                    <td className={styles.docName}>
                      {document.name[lang]}
                      {document.fileName ? (
                        <span className={styles.docFile}>
                          {getFileUrl(document.id) ? (
                            <a
                              href={getFileUrl(document.id)}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              {document.fileName}
                            </a>
                          ) : (
                            document.fileName
                          )}
                          {document.fileSize != null
                            ? ` · ${formatFileSize(document.fileSize)}`
                            : ''}
                        </span>
                      ) : null}
                    </td>
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
                    <td>
                      <button
                        type="button"
                        className={styles.deleteButton}
                        onClick={() => removeDocument(document.id)}
                      >
                        <span aria-hidden="true">×</span>
                        <span className="visuallyHidden">
                          {t.deleteDocument} {document.id}
                        </span>
                      </button>
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
