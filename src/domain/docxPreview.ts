/** Whether a file name is a .docx Word document, the one format browsers
 *  can't render inline and would otherwise just download on click. */
export function isDocx(fileName: string | null): boolean {
  return (fileName ?? '').toLowerCase().endsWith('.docx');
}

/**
 * Renders a .docx file (reached via its object URL) as HTML for an in-app
 * preview. Runs entirely client-side — there is no server to convert it on.
 * Mammoth (and its zip/XML parsing dependencies) is a few hundred KB, so it's
 * loaded on first use rather than bundled into every page view.
 */
export async function docxToHtml(url: string): Promise<string> {
  const [response, mammoth] = await Promise.all([fetch(url), import('mammoth')]);
  const arrayBuffer = await response.arrayBuffer();
  const result = await mammoth.convertToHtml({ arrayBuffer });
  return result.value;
}
