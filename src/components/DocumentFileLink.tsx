import { useState, type MouseEvent, type ReactNode } from 'react';
import { isDocx } from '@/domain/docxPreview';
import { getFileUrl } from '@/domain/fileStore';
import type { Dictionary } from '@/i18n/dictionary';
import { DocumentPreviewModal } from './DocumentPreviewModal';

export interface DocumentFileLinkProps {
  documentId: string;
  fileName: string | null;
  className?: string;
  t: Dictionary;
  children: ReactNode;
}

/**
 * A document register entry's file, wherever it's referenced (the register
 * itself, a linked-evidence row, a diagram box). A browser has no built-in
 * viewer for .docx, so clicking one would just download it — this opens an
 * in-app preview instead. Every other file type keeps opening in a new tab,
 * since the browser already renders those (PDF, images) well enough itself.
 */
export function DocumentFileLink({
  documentId,
  fileName,
  className,
  t,
  children,
}: DocumentFileLinkProps) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const url = getFileUrl(documentId);

  if (!url) return <span className={className}>{children}</span>;

  if (isDocx(fileName)) {
    const openPreview = (event: MouseEvent) => {
      event.preventDefault();
      setPreviewOpen(true);
    };
    return (
      <>
        <a className={className} href={url} download={fileName ?? undefined} onClick={openPreview}>
          {children}
        </a>
        {previewOpen ? (
          <DocumentPreviewModal
            fileName={fileName ?? ''}
            url={url}
            t={t}
            onClose={() => setPreviewOpen(false)}
          />
        ) : null}
      </>
    );
  }

  return (
    <a className={className} href={url} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  );
}
