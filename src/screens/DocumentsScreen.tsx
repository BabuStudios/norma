import { Pill } from '@/components/Pill';
import { DOCUMENTS, DOCUMENT_TEMPLATES, REVIEW_DUE_BEFORE } from '@/data/documents';
import { useApp } from '@/state/store';
import styles from './DocumentsScreen.module.css';

export function DocumentsScreen() {
  const { state, t } = useApp();
  const lang = state.lang;

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

      <section aria-label={t.documentRegister} className="tableScroll">
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
            {DOCUMENTS.map((document) => (
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
      </section>
    </div>
  );
}
