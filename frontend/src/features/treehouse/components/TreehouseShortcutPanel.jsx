export default function TreehouseShortcutPanel({
  error,
  isSubmitting = false,
  onBuild,
  onEnter,
  shortcut,
}) {
  if (!shortcut) {
    return (
      <section className="treehouse-shortcut-panel" aria-live="polite">
        <p>Shortcut details are loading.</p>
      </section>
    );
  }

  const progressPercent = shortcut.maximum_stage > 0
    ? Math.round((shortcut.stage / shortcut.maximum_stage) * 100)
    : 0;
  const canEnter = shortcut.completed;
  const canBuild = shortcut.can_contribute && !isSubmitting;
  const buttonLabel = canEnter
    ? "Enter Reading Forest"
    : shortcut.can_contribute
      ? "Build Next Stage"
      : shortcut.action_label;

  return (
    <section
      className={`treehouse-shortcut-panel shortcut-status-${shortcut.status}`}
      aria-live="polite"
    >
      <div className="treehouse-shortcut-stage-visual" data-shortcut-stage={shortcut.stage}>
        <span aria-hidden="true">{shortcut.completed ? "📚" : shortcut.stage <= 1 ? "📜" : "🔨"}</span>
        <strong>Stage {shortcut.stage} of {shortcut.maximum_stage}</strong>
      </div>

      <p>{shortcut.status_message}</p>

      <div className="treehouse-shortcut-meter" aria-label={`Construction is ${progressPercent}% complete`}>
        <span style={{ width: `${progressPercent}%` }} />
      </div>

      <dl className="treehouse-shortcut-requirements">
        <div>
          <dt>Reading progress</dt>
          <dd>{shortcut.current_progress} / {shortcut.required_progress} passages</dd>
        </div>
        <div>
          <dt>{shortcut.required_resource_name}</dt>
          <dd>
            {shortcut.owned_resource_quantity} owned
            {shortcut.required_resource_quantity > 0
              ? ` · ${shortcut.required_resource_quantity} required`
              : ""}
          </dd>
        </div>
      </dl>

      {error ? <p className="treehouse-shortcut-error">{error.message}</p> : null}

      <button
        className={canEnter ? "primary-button" : "secondary-button"}
        disabled={!canEnter && !canBuild}
        type="button"
        onClick={canEnter ? onEnter : onBuild}
      >
        {isSubmitting ? "Building..." : buttonLabel}
      </button>
    </section>
  );
}
