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

export default function WorldRegionNode({
  region,
  progress,
  questStatus,
  unlock,
  currentLocation,
  visited,
  isTraveling,
  travelingTo,
  onEnter,
}) {
  const comingSoon = region.comingSoon ?? !region.enabled;
  const unlocked = region.isUnlocked ?? region.unlockedByDefault ?? unlock?.unlocked ?? region.adventureType === "achievements";
  const available = region.isAvailable ?? (region.enabled && unlocked);
  const disabled = isTraveling || comingSoon || !unlocked || !available;
  const current = currentLocation === region.screen;
  const travelingHere = travelingTo === region.screen;
  const progressPercent = getProgressPercent(progress);
  const totalCount = progress?.total_quests ?? 0;
  const completedCount = progress?.completed_quests ?? 0;
  const progressLabel = totalCount > 0
    ? `${completedCount} / ${totalCount} complete`
    : "No quests yet";
  const stateLabels = [
    current ? "Current location" : null,
    visited ? "Visited" : null,
    comingSoon ? "Coming soon" : null,
    !comingSoon && !unlocked ? "Locked" : null,
  ].filter(Boolean);
  const statusClass = [
    "world-region-node",
    disabled ? "world-region-node-disabled" : "",
    current ? "world-region-node-current" : "",
    visited ? "world-region-node-visited" : "",
    comingSoon ? "world-region-node-coming-soon" : "",
    !comingSoon && !unlocked ? "world-region-node-locked" : "",
  ].filter(Boolean).join(" ");

  return (
    <article className={statusClass} aria-label={`${region.title} region`}>
      <div className="world-region-node-header">
        <span className="world-region-icon" aria-hidden="true">{region.icon}</span>
        <div>
          <p className="quest-realm">{comingSoon ? region.comingSoonLabel ?? "Coming soon" : formatStatus(progress?.status)}</p>
          <h2>{region.title}</h2>
        </div>
      </div>

      {stateLabels.length > 0 && (
        <div className="world-region-badges" aria-label={`${region.title} map markers`}>
          {stateLabels.map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>
      )}

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
        {comingSoon && <span>{region.lockReason ?? region.comingSoonLabel ?? "Coming soon"}</span>}
        {!comingSoon && !unlocked && <span>{region.unlockRequirement ?? unlock?.reason ?? "Keep exploring to unlock."}</span>}
      </div>

      <button
        className="primary-button"
        disabled={disabled}
        type="button"
        aria-label={disabled ? `${region.title} is not available for travel` : `Travel to ${region.title}`}
        onClick={() => onEnter(region.screen)}
      >
        {travelingHere ? `Traveling to ${region.title}...` : comingSoon ? "Coming Soon" : unlocked && available ? "Travel" : "Locked"}
      </button>
    </article>
  );
}
