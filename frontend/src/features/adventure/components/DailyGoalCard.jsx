function getProgressPercent(dailyGoal) {
  if (!dailyGoal?.target_correct_answers) {
    return 0;
  }

  return Math.min(
    100,
    Math.round(
      (dailyGoal.current_correct_answers / dailyGoal.target_correct_answers) * 100
    )
  );
}

export default function DailyGoalCard({ dailyGoal, streak }) {
  const progressPercent = getProgressPercent(dailyGoal);
  const streakDays = streak?.current_streak_days ?? 0;

  return (
    <section className="card daily-goal-card">
      <div>
        <p className="quest-realm">Daily Goal</p>
        <h2>{dailyGoal?.completed ? "Daily Goal Complete!" : "Today's Learning Goal"}</h2>
      </div>

      <strong>
        {dailyGoal?.current_correct_answers ?? 0} /{" "}
        {dailyGoal?.target_correct_answers ?? 10} correct answers
      </strong>

      <div className="daily-goal-progress-bar" aria-hidden="true">
        <div
          className="daily-goal-progress-fill"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <p>🔥 {streakDays}-day streak</p>

      {dailyGoal?.completed && (
        <p className="quest-result success">
          Great job! Today's learning goal is complete.
        </p>
      )}
    </section>
  );
}
