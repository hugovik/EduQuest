export default function AchievementToast({ achievement, onClose }) {
  if (!achievement) return null;

  return (
    <section className="achievement-toast">
      <div className="achievement-toast__icon">{achievement.icon}</div>

      <div className="achievement-toast__content">
        <p className="quest-realm">Achievement Unlocked</p>
        <h3>{achievement.title}</h3>
        <p>{achievement.description}</p>
      </div>

      <button className="secondary-button" onClick={onClose}>
        Continue
      </button>
    </section>
  );
}