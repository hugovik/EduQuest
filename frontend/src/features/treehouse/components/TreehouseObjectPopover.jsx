export default function TreehouseObjectPopover({
  actionLabel,
  children,
  description,
  id,
  label,
  onAction,
  onClose,
  status,
}) {
  return (
    <aside
      aria-label={`${label} details`}
      className="treehouse-object-popover"
      id={`${id}-popover`}
      role="dialog"
    >
      <div className="treehouse-object-popover-header">
        <strong>{label}</strong>
        <button
          aria-label={`Close ${label}`}
          className="treehouse-popover-close"
          type="button"
          onClick={onClose}
        >
          x
        </button>
      </div>
      <p>{description}</p>
      {status ? <p className="treehouse-object-status">{status}</p> : null}
      {children}
      {onAction ? (
        <button className="secondary-button" type="button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </aside>
  );
}
