const locationLabels = {
  treehouse: "Tree House",
  world: "World Map",
  math: "Math Mountains",
  reading: "Reading Forest",
  writing: "Writing Kingdom",
  science: "Science Lab",
  geography: "Geography Harbor",
  music: "Music Meadow",
};

function formatLocation(location) {
  return locationLabels[location] ?? "EduQuest";
}

function formatQuestStatus(status) {
  if (status === "completed") {
    return "World quest complete";
  }

  if (status === "in_progress") {
    return "World quest in progress";
  }

  return "World quest ready";
}

export default function WorldAdventureSummary({
  summary,
  isLoading,
  error,
  onOpenWorld,
}) {
  const worldQuest = summary?.world_quest;
  const questProgressPercent = worldQuest?.progress_percent ?? 0;

  return (
    <section className="card world-adventure-summary-card" aria-label="World adventure summary">
      <div>
        <p className="quest-realm">World Adventure</p>
        <h2>EduQuest World Progress</h2>
      </div>

      {isLoading ? (
        <p>Loading world progress...</p>
      ) : error ? (
        <p>World progress will appear after the first adventure.</p>
      ) : summary ? (
        <>
          <div className="world-adventure-summary-grid">
            <span>Current location: {formatLocation(summary.active_location ?? "treehouse")}</span>
            <span>Last visited: {summary.last_region ? formatLocation(summary.last_region) : "None yet"}</span>
            <span>{summary.unlocked_regions ?? 0} / {summary.total_regions ?? 0} regions open</span>
            <span>{summary.inventory_count ?? 0} collected item{summary.inventory_count === 1 ? "" : "s"}</span>
          </div>

          {worldQuest ? (
            <div className="world-adventure-quest-progress">
              <div>
                <strong>{worldQuest.title}</strong>
                <small>{formatQuestStatus(worldQuest.status)}</small>
              </div>
              <span>{questProgressPercent}%</span>
            </div>
          ) : (
            <p>World quest progress will appear after the first adventure.</p>
          )}

          <div className="world-region-progress" aria-label="World quest progress">
            <div className="world-region-progress-bar">
              <div
                className="world-region-progress-fill"
                style={{ width: `${questProgressPercent}%` }}
              />
            </div>
          </div>
        </>
      ) : (
        <p>World progress will appear after the first adventure.</p>
      )}

      <button className="primary-button" type="button" onClick={onOpenWorld}>
        Open World Map
      </button>
    </section>
  );
}
