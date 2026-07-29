import type { PillKind } from '@/data/types';

/** The status chip every register uses: ink for met, accent for a gap. */
export function Pill({ kind, children }: { kind: PillKind; children: React.ReactNode }) {
  return <span className={`pill pill--${kind}`}>{children}</span>;
}
