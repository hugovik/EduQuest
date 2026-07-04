function getPercent(progress) {
  if (typeof progress?.completion_percent === "number") {
    return Math.min(100, Math.max(0, progress.completion_percent));
  }

  if (!progress?.total_quests) {
    return 0;
  }

  return Math.min(100, Math.round((progress.completed_quests / progress.total_quests) * 100));
}

export default function AdventureProgressCard({ progress, title = "Adventure Progress" }) {
  const percent = getPercent(progress);

  return (
    <section className="card adventure-framework-progress-card" aria-label={title}>
      <p className="quest-realm">Progress</p>
      <h2>{title}</h2>
      <div className="adventure-progress-bar" aria-hidden="true">
        <div className="adventure-progress-fill" style={{ width: `${percent}%` }} />
      </div>
      <div className="adventure-framework-stat-grid">
        <span>{progress?.activities_completed ?? progress?.completed_quests ?? 0} completed</span>
        <span>{progress?.xp_earned ?? 0} XP earned</span>
        <span>{percent}% complete</span>
      </div>
    </section>
  );
}
