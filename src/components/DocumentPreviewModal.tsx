import { useEffect, useState } from 'react';
import { docxToHtml } from '@/domain/docxPreview';
import type { Dictionary } from '@/i18n/dictionary';
import { useDismissable } from '@/hooks/useDismissable';
import styles from './DocumentPreviewModal.module.css';

export interface DocumentPreviewModalProps {
  fileName: string;
  url: string;
  t: Dictionary;
  onClose: () => void;
}

type Status = 'loading' | 'ready' | 'error';

/** In-app preview for a .docx file, converted to HTML client-side — there is
 *  no server to render it for us, and a plain link to a .docx object URL
 *  just downloads it instead of opening it. */
export function DocumentPreviewModal({ fileName, url, t, onClose }: DocumentPreviewModalProps) {
  const [status, setStatus] = useState<Status>('loading');
  const [html, setHtml] = useState('');
  const ref = useDismissable<HTMLDivElement>(true, onClose);

  useEffect(() => {
    let cancelled = false;
    setStatus('loading');
    docxToHtml(url)
      .then((value) => {
        if (cancelled) return;
        setHtml(value);
        setStatus('ready');
      })
      .catch(() => {
        if (!cancelled) setStatus('error');
      });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <div className={styles.backdrop}>
      <div ref={ref} role="dialog" aria-modal="true" aria-label={fileName} className={styles.panel}>
        <div className={styles.head}>
          <span className={styles.fileName}>{fileName}</span>
          <button type="button" className="btn btn-secondary btn-icon" onClick={onClose}>
            <span aria-hidden="true">×</span>
            <span className="visuallyHidden">{t.closePreview}</span>
          </button>
        </div>
        <div className={styles.body}>
          {status === 'loading' ? <p className={styles.status}>{t.previewLoading}</p> : null}
          {status === 'error' ? (
            <p className={styles.status}>
              {t.previewError}{' '}
              <a href={url} download={fileName}>
                {t.downloadInstead}
              </a>
            </p>
          ) : null}
          {status === 'ready' ? (
            <div className={styles.document} dangerouslySetInnerHTML={{ __html: html }} />
          ) : null}
        </div>
      </div>
    </div>
  );
}
