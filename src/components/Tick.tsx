/**
 * The square tick box the design uses for steps, checklists and column menus.
 * It is a real checkbox with the input visually hidden, so it keeps keyboard
 * operation, the checked state for assistive tech, and form semantics.
 *
 * Wrap a whole row in a <label> to make the row clickable — that is what the
 * design asks for and it needs no extra handler.
 */
export function Tick({
  checked,
  onChange,
  size = 'md',
  label,
}: {
  checked: boolean;
  onChange?: () => void;
  size?: 'md' | 'sm' | 'xs';
  /** Only needed when the box is not already inside a labelling element. */
  label?: string;
}) {
  const className = [
    'tick',
    checked ? 'tick--on' : '',
    size === 'sm' ? 'tick--sm' : size === 'xs' ? 'tick--xs' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <span className={className}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange ?? (() => {})}
        readOnly={!onChange}
        aria-label={label}
      />
      <span aria-hidden="true">{checked ? '✓' : ''}</span>
    </span>
  );
}
