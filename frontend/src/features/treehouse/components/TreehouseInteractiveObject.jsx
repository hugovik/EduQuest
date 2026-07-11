import TreehouseObjectPopover from "./TreehouseObjectPopover";

export default function TreehouseInteractiveObject({
  actionLabel,
  children,
  className = "",
  description,
  disabled = false,
  id,
  isOpen = false,
  label,
  onActivate,
  onAction,
  onClose,
  popoverChildren,
  status,
  useOverlay = true,
}) {
  const state = disabled ? "disabled" : isOpen ? "open" : "default";

  return (
    <div
      className={`treehouse-interactive-object ${className}`}
      data-object-id={id}
      data-object-state={state}
    >
      <div className="treehouse-object-content">{children}</div>
      {useOverlay ? (
        <button
          aria-controls={isOpen ? `${id}-popover` : undefined}
          aria-disabled={disabled || undefined}
          aria-expanded={isOpen}
          aria-label={label}
          className="treehouse-object-hit-target"
          disabled={disabled}
          type="button"
          onClick={onActivate}
        >
          <span>{label}</span>
        </button>
      ) : null}
      {isOpen ? (
        <TreehouseObjectPopover
          actionLabel={actionLabel}
          description={description}
          id={id}
          label={label}
          status={status}
          onAction={onAction}
          onClose={onClose}
        >
          {popoverChildren}
        </TreehouseObjectPopover>
      ) : null}
    </div>
  );
}
