function formatStatus(status) {
  if (status === "in_progress") {
    return "In progress";
  }

  if (status === "completed") {
    return "Completed";
  }

  return "Not started";
}

function getProgressPercent(progress) {
  if (!progress?.total_quests) {
    return 0;
  }

  return Math.min(100, Math.round((progress.completed_quests / progress.total_quests) * 100));
}

function formatQuestStatus(status) {
  if (status === "completed") {
    return "World quest step complete";
  }

  if (status === "in_progress") {
    return "World quest in progress";
  }

  return "World quest not started";
}

export default function WorldRegionNode({ region, progress, questStatus, unlock, onEnter }) {
  const comingSoon = !region.enabled;
  const unlocked = region.unlockedByDefault || unlock?.unlocked || region.adventureType === "achievements";
  const disabled = comingSoon || !unlocked;
  const progressPercent = getProgressPercent(progress);
  const totalCount = progress?.total_quests ?? 0;
  const completedCount = progress?.completed_quests ?? 0;
  const progressLabel = totalCount > 0
    ? `${completedCount} / ${totalCount} complete`
    : "No quests yet";

  return (
    <article className={`world-region-node${disabled ? " world-region-node-disabled" : ""}`}>
      <div className="world-region-node-header">
        <span className="world-region-icon" aria-hidden="true">{region.icon}</span>
        <div>
          <p className="quest-realm">{comingSoon ? region.comingSoonLabel : formatStatus(progress?.status)}</p>
          <h2>{region.title}</h2>
        </div>
      </div>

      <p>{region.description}</p>

      <div className="world-region-progress" aria-label={`${region.title} progress`}>
        <div className="world-region-progress-bar">
          <div
            className="world-region-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <span>{progressLabel}</span>
      </div>

      <div className="world-region-meta">
        <span>{progress?.xp_earned ?? 0} XP earned</span>
        {questStatus && <span>{formatQuestStatus(questStatus)}</span>}
        {!comingSoon && !unlocked && <span>{unlock?.reason ?? "Keep exploring to unlock."}</span>}
      </div>

      <button
        className="primary-button"
        disabled={disabled}
        type="button"
        onClick={() => onEnter(region.screen)}
      >
        {comingSoon ? "Coming Soon" : unlocked ? "Travel" : "Locked"}
      </button>
    </article>
  );
}
