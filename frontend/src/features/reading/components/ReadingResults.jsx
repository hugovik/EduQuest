function getAchievementName(achievement) {
  return achievement?.name || achievement?.title || "Badge";
}

export default function ReadingResults({ result, onChooseAnother }) {
  if (!result) {
    return null;
  }

  return (
    <section className="card reading-results-card">
      <p className="quest-realm">Forest Reward</p>
      <h2>{result.duplicate ? "Story already completed" : "Story complete!"}</h2>
      <p>
        {result.score} / {result.total_questions} questions correct
      </p>
      <p>{result.rewards.xp} XP earned</p>
      {result.achievements_unlocked?.length > 0 && (
        <p className="quest-result success">
          Badge unlocked: {getAchievementName(result.achievements_unlocked[0])}!
        </p>
      )}
      <button className="primary-button" type="button" onClick={onChooseAnother}>
        Choose another story
      </button>
    </section>
  );
}
