function formatPercent(value) {
  return Math.round((value ?? 0) * 100);
}

export default function ReadingProgressCard({ summary }) {
  const passagesCompleted = summary?.passages_completed ?? 0;
  const questionsAnswered = summary?.questions_answered ?? 0;
  const vocabularyLearned = summary?.vocabulary_learned ?? 0;
  const xpEarned = summary?.total_xp_earned ?? 0;

  return (
    <section className="card reading-progress-card">
      <p className="quest-realm">Parent Progress Snapshot</p>
      <h2>Reading Forest Progress</h2>
      <div className="reading-progress-metrics">
        <span>{passagesCompleted} passages completed</span>
        <span>{questionsAnswered} questions answered</span>
        <span>{formatPercent(summary?.accuracy)}% accuracy</span>
        <span>{vocabularyLearned} vocabulary words</span>
        <span>{xpEarned} XP earned</span>
      </div>
    </section>
  );
}
