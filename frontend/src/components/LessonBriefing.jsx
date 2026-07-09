export default function LessonBriefing({
  title,
  icon = "✨",
  guideName,
  guideAvatar = "✨",
  guideMessage,
  learningObjective,
  vocabulary = [],
  funFact,
  estimatedMinutes,
  difficulty = 1,
  onStart,
  onBack,
}) {
  const difficultyLabel =
    difficulty <= 1 ? "Easy" : difficulty === 2 ? "Medium" : "Challenge";

  return (
    <section className="lesson-briefing card">
      <div className="lesson-briefing-header">
        {guideMessage && (
            <div className="lesson-briefing-guide">
                <span className="lesson-briefing-guide-avatar">{guideAvatar}</span>
                <div>
                <h3>{guideName ?? "Your Guide"} says...</h3>
                <p>{guideMessage}</p>
                </div>
            </div>
            )}
        <span className="lesson-briefing-icon">{icon}</span>
        <div>
          <p className="quest-realm">Mission Briefing</p>
          <h2>{title}</h2>
        </div>
      </div>

      {learningObjective && (
        <div className="lesson-briefing-block">
          <h3>🎯 Your Mission</h3>
          <p>{learningObjective}</p>
        </div>
      )}

      {vocabulary.length > 0 && (
        <div className="lesson-briefing-block">
          <h3>📚 Science Words</h3>
          <div className="lesson-vocabulary-list">
            {vocabulary.map((word) => (
              <span key={word}>{word}</span>
            ))}
          </div>
        </div>
      )}

      {funFact && (
        <div className="lesson-briefing-block">
          <h3>💡 Amazing Fact</h3>
          <p>{funFact}</p>
        </div>
      )}

      <div className="lesson-briefing-meta">
        {estimatedMinutes && (
          <span>
            Mission Time: ⏱ About {estimatedMinutes} minutes
          </span>
        )}
        <span>Mission Difficulty: ⭐ {difficultyLabel}</span>
      </div>

      <div className="lesson-briefing-actions">
        <button type="button" className="secondary-button" onClick={onBack}>
          Back
        </button>
        <button type="button" className="primary-button" onClick={onStart}>
          🚀 Start Mission
        </button>
      </div>
    </section>
  );
}
