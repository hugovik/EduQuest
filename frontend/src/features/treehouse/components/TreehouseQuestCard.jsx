import TreehouseProgressBar from "./TreehouseProgressBar";

export default function TreehouseQuestCard({
  dailyGoal,
  isLoading,
  quest,
}) {
  if (isLoading) {
    return (
      <section className="treehouse-card" aria-live="polite">
        <p className="quest-realm">Today&apos;s Quest</p>
        <h2>Loading today&apos;s quest...</h2>
      </section>
    );
  }

  if (dailyGoal) {
    const current = dailyGoal.current_correct_answers ?? 0;
    const target = dailyGoal.target_correct_answers ?? 10;
    const progressPercent = target > 0 ? Math.round((current / target) * 100) : 0;

    return (
      <section className="treehouse-card treehouse-today-card">
        <p className="quest-realm">Today&apos;s Quest</p>
        <h2>{dailyGoal.completed ? "Daily quest complete" : "Practice a little today"}</h2>
        <p>
          {dailyGoal.completed
            ? "Great work. Today&apos;s learning goal is complete."
            : "Complete learning activities in any adventure to fill this up."}
        </p>
        <TreehouseProgressBar
          label="Correct answers"
          max={target}
          percent={progressPercent}
          value={current}
        />
      </section>
    );
  }

  if (quest) {
    return (
      <section className="treehouse-card treehouse-today-card">
        <p className="quest-realm">Today&apos;s Quest</p>
        <h2>{quest.title}</h2>
        <p>{quest.realm ? `${quest.realm} is waiting on the World Map.` : "Open the World Map to begin."}</p>
      </section>
    );
  }

  return (
    <section className="treehouse-card treehouse-today-card">
      <p className="quest-realm">Today&apos;s Quest</p>
      <h2>No quest is waiting right now</h2>
      <p>Open the World Map and pick an adventure when you are ready.</p>
    </section>
  );
}
