export default function WritingQuestLog({
  lessons,
  completedLessons,
  onStartLesson,
}) {
  function isCompleted(lesson) {
    return completedLessons.includes(lesson.id);
  }

  function isUnlocked(lesson) {
    return !lesson.prerequisite || completedLessons.includes(lesson.prerequisite);
  }

  return (
    <section className="writing-quest-log">
      <p className="quest-realm">Available Quests</p>
      <h2>Royal Library Quest Log</h2>

      <div className="writing-quest-list">
        {lessons.map((lesson) => {
          const completed = isCompleted(lesson);
          const unlocked = isUnlocked(lesson);

          return (
            <article
              key={lesson.id}
              className={`writing-quest-card ${
                completed ? "completed" : ""
              } ${!unlocked ? "locked" : ""}`}
            >
              <div>
                <p className="quest-realm">{lesson.realm}</p>
                <h3>{completed ? "✅ " : unlocked ? "📖 " : "🔒 "}{lesson.title}</h3>
                <p>{lesson.description}</p>
                <p>
                  <strong>{lesson.difficulty}</strong> · Reward: +{lesson.xp} XP
                </p>
              </div>

              <button
                className="primary-button"
                type="button"
                disabled={!unlocked || completed}
                onClick={() => onStartLesson(lesson)}
              >
                {completed ? "Complete" : unlocked ? "Start" : "Locked"}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}