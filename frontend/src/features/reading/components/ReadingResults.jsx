function getAchievementName(achievement) {
  return achievement?.name || achievement?.title || "Badge";
}

function formatPercent(value) {
  return Math.round((value ?? 0) * 100);
}

function formatAnswer(value) {
  if (Array.isArray(value)) {
    return value.join(" → ");
  }

  if (value === null || value === undefined || value === "") {
    return "No answer selected";
  }

  return String(value);
}

export default function ReadingResults({ result, nextPassageTitle, onChooseAnother, onNextPassage }) {
  if (!result) {
    return null;
  }

  const vocabularyLearned = result.progress?.vocabulary_learned ?? 0;
  const rewardsClaimed = !result.duplicate && result.rewards.xp > 0;
  const collectiblesFound = result.collectibles_found ?? [];

  return (
    <section className="card reading-results-card">
      <p className="quest-realm">Forest Reward</p>
      <h2>{result.duplicate ? "Story replay complete" : "Story complete!"}</h2>
      <div className="reading-results-grid">
        <span>{result.score} / {result.total_questions} answers correct</span>
        <span>{formatPercent(result.accuracy)}% accuracy</span>
        <span>{result.rewards.xp} XP earned this try</span>
        <span>{vocabularyLearned} vocabulary words learned</span>
        <span>{collectiblesFound.length} collectibles found</span>
      </div>
      <p className={rewardsClaimed ? "quest-result success" : "quest-result error"}>
        {result.duplicate
          ? "Rewards were already claimed for this passage, so replay gives no duplicate XP."
          : "Rewards claimed for this passage."}
      </p>
      {result.next_chapter_unlocked && (
        <p className="quest-result success">Next chapter unlocked: {result.next_chapter_unlocked}</p>
      )}

      {collectiblesFound.length > 0 && (
        <section className="reading-review-section">
          <p className="quest-realm">Collectibles</p>
          {collectiblesFound.map((item) => (
            <article className="reading-review-card correct" key={item.id}>
              <strong>{item.name}</strong>
              <p>{item.description}</p>
            </article>
          ))}
        </section>
      )}

      {result.achievements_unlocked?.length > 0 && (
        <p className="quest-result success">
          Badge unlocked: {getAchievementName(result.achievements_unlocked[0])}!
        </p>
      )}

      {result.question_results?.length > 0 && (
        <section className="reading-review-section">
          <p className="quest-realm">Review Answers</p>
          <h3>Let&apos;s learn from the clues</h3>
          {result.question_results.map((item) => (
            <article
              className={item.correct ? "reading-review-card correct" : "reading-review-card incorrect"}
              key={item.question_id}
            >
              <strong>{item.correct ? "Great job!" : "Good try!"}</strong>
              <p>{item.prompt}</p>
              <p>Your answer: {formatAnswer(item.player_answer)}</p>
              {!item.correct && (
                <p>The correct answer was: {formatAnswer(item.correct_answer)}</p>
              )}
              {Array.isArray(item.correct_answer) && (
                <p>Correct order: {formatAnswer(item.correct_answer)}</p>
              )}
              <p>{item.explanation}</p>
            </article>
          ))}
        </section>
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
