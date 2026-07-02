function getAchievementName(achievement) {
  return achievement?.name || achievement?.title || "Badge";
}

export default function RecentBadgesCard({ allAchievements = [], earnedAchievements = [] }) {
  const earnedKeys = new Set(
    earnedAchievements.map((unlock) => unlock.achievement_id || unlock.achievement?.id)
  );
  const visibleAchievements = allAchievements.slice(0, 8);

  return (
    <section className="card achievement-shelf recent-badges-card">
      <p className="quest-realm">Badges</p>
      <h2>Recent Badges</h2>

      {visibleAchievements.length === 0 ? (
        <p>Badges will appear as adventures are completed.</p>
      ) : (
        <ul className="achievement-list badge-list">
          {visibleAchievements.map((achievement) => {
            const isEarned = earnedKeys.has(achievement.id);

            return (
              <li
                className={isEarned ? "badge-earned" : "badge-unearned"}
                key={achievement.id}
              >
                <span className="achievement-icon" aria-hidden="true">
                  {achievement.icon ?? "🏆"}
                </span>
                <span>
                  <strong>{getAchievementName(achievement)}</strong>
                  <br />
                  {achievement.description}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
