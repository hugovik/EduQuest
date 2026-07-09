export default function LessonRewardScene({
  lesson,
  onContinue,
}) {
  return (
    <section className="card state-card">
      <h2>🚀 Mission Complete!</h2>

      <p>{lesson.successMessage}</p>

      {lesson.unlockMessage && (
        <p>{lesson.unlockMessage}</p>
      )}

      <p>
        You earned <strong>{lesson.xp} XP</strong>.
      </p>

      <button
        className="primary-button"
        type="button"
        onClick={onContinue}
      >
        Return to Mission Log
      </button>
    </section>
  );
}
