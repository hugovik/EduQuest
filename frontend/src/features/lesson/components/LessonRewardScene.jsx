export default function LessonRewardScene({
  lesson,
  onContinue,
}) {
  return (
    <section className="card state-card">
      <h2>📖 Quest Complete!</h2>

      <p>{lesson.successMessage}</p>

      <p>
        You earned <strong>{lesson.xp} XP</strong>.
      </p>

      <button
        className="primary-button"
        type="button"
        onClick={onContinue}
      >
        Return to Quest Log
      </button>
    </section>
  );
}