import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { registerFile } from '@/domain/fileStore';
import { DICTIONARY } from '@/i18n/dictionary';
import { DocumentFileLink } from './DocumentFileLink';

vi.mock('@/domain/docxPreview', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/domain/docxPreview')>();
  return { ...actual, docxToHtml: vi.fn() };
});

const t = DICTIONARY.sv;

beforeEach(() => {
  URL.createObjectURL = vi.fn((file: File) => `blob:mock/${file.name}`);
  URL.revokeObjectURL = vi.fn();
});

describe('a document with no file registered this session', () => {
  it('renders plain text, not a link', () => {
    render(
      <DocumentFileLink documentId="unregistered" fileName="handbok.pdf" t={t}>
        Kvalitetshandbok
      </DocumentFileLink>,
    );
    expect(screen.getByText('Kvalitetshandbok')).toBeInTheDocument();
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });
});

describe('a non-docx file', () => {
  it('opens in a new tab like before', () => {
    registerFile('D001', new File(['content'], 'handbok.pdf'));
    render(
      <DocumentFileLink documentId="D001" fileName="handbok.pdf" t={t}>
        Kvalitetshandbok
      </DocumentFileLink>,
    );
    const link = screen.getByRole('link', { name: 'Kvalitetshandbok' });
    expect(link).toHaveAttribute('href', 'blob:mock/handbok.pdf');
    expect(link).toHaveAttribute('target', '_blank');
  });
});

describe('a .docx file', () => {
  it('opens an in-app preview instead of downloading on click', async () => {
    const { docxToHtml } = await import('@/domain/docxPreview');
    vi.mocked(docxToHtml).mockResolvedValue('<p>Vår kvalitetspolicy</p>');
    registerFile('D002', new File(['content'], 'policy.docx'));
    const user = userEvent.setup();

    render(
      <DocumentFileLink documentId="D002" fileName="policy.docx" t={t}>
        Kvalitetspolicy
      </DocumentFileLink>,
    );
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Kvalitetspolicy' }));

    const dialog = await screen.findByRole('dialog', { name: 'policy.docx' });
    expect(await screen.findByText('Vår kvalitetspolicy')).toBeInTheDocument();
    expect(dialog).toBeInTheDocument();
  });

  it('offers a download link if the conversion fails', async () => {
    const { docxToHtml } = await import('@/domain/docxPreview');
    vi.mocked(docxToHtml).mockRejectedValue(new Error('corrupt file'));
    registerFile('D003', new File(['content'], 'broken.docx'));
    const user = userEvent.setup();

    render(
      <DocumentFileLink documentId="D003" fileName="broken.docx" t={t}>
        Trasigt dokument
      </DocumentFileLink>,
    );
    await user.click(screen.getByRole('link', { name: 'Trasigt dokument' }));

    expect(await screen.findByText(t.previewError, { exact: false })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: t.downloadInstead })).toHaveAttribute(
      'href',
      'blob:mock/broken.docx',
    );
  });

  it('closes the preview on Escape', async () => {
    const { docxToHtml } = await import('@/domain/docxPreview');
    vi.mocked(docxToHtml).mockResolvedValue('<p>Innehåll</p>');
    registerFile('D004', new File(['content'], 'rutin.docx'));
    const user = userEvent.setup();

    render(
      <DocumentFileLink documentId="D004" fileName="rutin.docx" t={t}>
        Rutin
      </DocumentFileLink>,
    );
    await user.click(screen.getByRole('link', { name: 'Rutin' }));
    await screen.findByRole('dialog');

    await user.keyboard('{Escape}');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
