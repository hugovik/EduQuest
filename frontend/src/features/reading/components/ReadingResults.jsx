function getAchievementName(achievement) {
  return achievement?.name || achievement?.title || "Badge";
}

function formatPercent(value) {
  return Math.round((value ?? 0) * 100);
}

export default function ReadingResults({ result, nextPassageTitle, onChooseAnother, onNextPassage }) {
  if (!result) {
    return null;
  }

  const vocabularyLearned = result.progress?.vocabulary_learned ?? 0;
  const rewardsClaimed = !result.duplicate && result.rewards.xp > 0;

  return (
    <section className="card reading-results-card">
      <p className="quest-realm">Forest Reward</p>
      <h2>{result.duplicate ? "Story replay complete" : "Story complete!"}</h2>
      <div className="reading-results-grid">
        <span>{result.score} / {result.total_questions} answers correct</span>
        <span>{formatPercent(result.accuracy)}% accuracy</span>
        <span>{result.rewards.xp} XP earned this try</span>
        <span>{vocabularyLearned} vocabulary words learned</span>
      </div>
      <p className={rewardsClaimed ? "quest-result success" : "quest-result error"}>
        {result.duplicate
          ? "Rewards were already claimed for this passage, so replay gives no duplicate XP."
          : "Rewards claimed for this passage."}
      </p>
      {result.achievements_unlocked?.length > 0 && (
        <p className="quest-result success">
          Badge unlocked: {getAchievementName(result.achievements_unlocked[0])}!
        </p>
      )}
      <div className="reading-result-actions">
        {nextPassageTitle && (
          <button className="primary-button" type="button" onClick={onNextPassage}>
            Next: {nextPassageTitle}
          </button>
        )}
        <button className="primary-button" type="button" onClick={onChooseAnother}>
          Choose another story
        </button>
      </div>
    </section>
  );
}
