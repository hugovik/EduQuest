export default function AchievementShelf({ achievements = [] }) {
  return (
    <div className="card achievement-shelf">
      <h2>🏆 Achievements</h2>

      {achievements.length === 0 ? (
        <p>Complete your first quest to unlock an achievement.</p>
      ) : (
        <ul className="achievement-list">
          {achievements.map((unlock) => (
            <li key={unlock.id}>
              <span className="achievement-icon">{unlock.achievement?.icon ?? "🏆"}</span>
              <span>
                <strong>{unlock.achievement?.title}</strong>
                <br />
                {unlock.achievement?.description}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
