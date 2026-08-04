/**
 * In-memory object URLs for uploaded files, keyed by the id of the record
 * they belong to — an evidence upload's id, or a document's id. Never
 * persisted: File/Blob data can't survive JSON.stringify, so these urls only
 * last the current session, same as the rest of the app's "the bytes stay on
 * the user's machine" approach to uploads. A reload loses the ability to
 * open a previously uploaded file, same as it already loses the file itself.
 */
const urls = new Map<string, string>();

function canUseObjectUrls(): boolean {
  return typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function';
}

/** Registers `file` under `id`, replacing whatever was registered before it. */
export function registerFile(id: string, file: File): void {
  if (!canUseObjectUrls()) return;
  releaseFile(id);
  urls.set(id, URL.createObjectURL(file));
}

/** The openable url for `id`, if a file was registered under it this session. */
export function getFileUrl(id: string): string | undefined {
  return urls.get(id);
}

export function releaseFile(id: string): void {
  const previous = urls.get(id);
  if (previous && canUseObjectUrls()) URL.revokeObjectURL(previous);
  urls.delete(id);
}
