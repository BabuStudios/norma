import { describe, expect, it } from 'vitest';
import { formatFileSize } from './format';

describe('formatFileSize', () => {
  it('shows small files in bytes', () => {
    expect(formatFileSize(0)).toBe('0 B');
    expect(formatFileSize(512)).toBe('512 B');
    expect(formatFileSize(1023)).toBe('1023 B');
  });

  it('switches to KB at 1024 bytes', () => {
    expect(formatFileSize(1024)).toBe('1.0 KB');
    expect(formatFileSize(2048)).toBe('2.0 KB');
  });

  it('keeps one decimal under 10 units and rounds to a whole number above it', () => {
    expect(formatFileSize(1536)).toBe('1.5 KB');
    expect(formatFileSize(15 * 1024)).toBe('15 KB');
  });

  it('climbs to MB and GB', () => {
    expect(formatFileSize(5 * 1024 * 1024)).toBe('5.0 MB');
    expect(formatFileSize(2 * 1024 * 1024 * 1024)).toBe('2.0 GB');
  });

  it('does not climb past GB', () => {
    expect(formatFileSize(1024 * 1024 * 1024 * 1024)).toBe('1024 GB');
  });
});
