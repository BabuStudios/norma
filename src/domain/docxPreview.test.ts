import { afterEach, describe, expect, it, vi } from 'vitest';
import { docxToHtml, isDocx } from './docxPreview';

vi.mock('mammoth', () => ({
  convertToHtml: vi.fn(),
}));

describe('isDocx', () => {
  it('recognizes a .docx file name, case-insensitively', () => {
    expect(isDocx('kvalitetspolicy.docx')).toBe(true);
    expect(isDocx('KVALITETSPOLICY.DOCX')).toBe(true);
  });

  it('rejects other file types and null', () => {
    expect(isDocx('kvalitetspolicy.pdf')).toBe(false);
    expect(isDocx('report.docx.pdf')).toBe(false);
    expect(isDocx(null)).toBe(false);
    expect(isDocx('')).toBe(false);
  });
});

describe('docxToHtml', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('fetches the object url and hands the bytes to mammoth', async () => {
    const arrayBuffer = new ArrayBuffer(4);
    const fetchMock = vi.fn().mockResolvedValue({ arrayBuffer: async () => arrayBuffer });
    vi.stubGlobal('fetch', fetchMock);
    const mammoth = await import('mammoth');
    vi.mocked(mammoth.convertToHtml).mockResolvedValue({ value: '<p>Hej</p>', messages: [] });

    const html = await docxToHtml('blob:mock/policy.docx');

    expect(fetchMock).toHaveBeenCalledWith('blob:mock/policy.docx');
    expect(mammoth.convertToHtml).toHaveBeenCalledWith({ arrayBuffer });
    expect(html).toBe('<p>Hej</p>');
  });

  it('propagates a conversion failure so the caller can show an error state', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ arrayBuffer: async () => new ArrayBuffer(0) }),
    );
    const mammoth = await import('mammoth');
    vi.mocked(mammoth.convertToHtml).mockRejectedValue(new Error('not a valid docx'));

    await expect(docxToHtml('blob:mock/broken.docx')).rejects.toThrow('not a valid docx');
  });
});
