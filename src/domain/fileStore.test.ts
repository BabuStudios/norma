import { beforeEach, describe, expect, it, vi } from 'vitest';
import { getFileUrl, registerFile, releaseFile } from './fileStore';

describe('fileStore', () => {
  beforeEach(() => {
    URL.createObjectURL = vi.fn((file: File) => `blob:mock/${file.name}`);
    URL.revokeObjectURL = vi.fn();
  });

  it('has no url for a file that was never registered', () => {
    expect(getFileUrl('missing')).toBeUndefined();
  });

  it('returns the url a registered file was given', () => {
    const file = new File(['content'], 'handbok.pdf');
    registerFile('D001', file);
    expect(getFileUrl('D001')).toBe('blob:mock/handbok.pdf');
  });

  it('replaces the url when the same id is registered again', () => {
    registerFile('D001', new File(['a'], 'a.pdf'));
    registerFile('D001', new File(['b'], 'b.pdf'));
    expect(getFileUrl('D001')).toBe('blob:mock/b.pdf');
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock/a.pdf');
  });

  it('revokes and forgets the url on release', () => {
    registerFile('D002', new File(['content'], 'c.pdf'));
    releaseFile('D002');
    expect(getFileUrl('D002')).toBeUndefined();
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob:mock/c.pdf');
  });

  it('does nothing when releasing an id that was never registered', () => {
    expect(() => releaseFile('never-registered')).not.toThrow();
  });
});
