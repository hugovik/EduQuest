import { getLessonStatus } from "../../lesson/lessonUtils";
import { LESSON_STATUS } from "../../lesson/lessonTypes";

export default function WritingQuestLog({
  lessons,
  completedLessons,
  onStartLesson,
}) {
  return (
    <section className="writing-quest-log">
      <p className="quest-realm">Available Quests</p>
      <h2>Royal Library Quest Log</h2>

      <div className="writing-quest-list">
        {lessons.map((lesson) => {
          const status = getLessonStatus(lesson, completedLessons);
          const completed = status === LESSON_STATUS.completed;
          const unlocked = status === LESSON_STATUS.available;

          return (
            <article
              key={lesson.id}
              className={`writing-quest-card ${
                completed ? "completed" : ""
              } ${status === LESSON_STATUS.locked ? "locked" : ""}`}
            >
              <div>
                <p className="quest-realm">{lesson.realm}</p>
                <h3>
                  {completed ? "✅ " : unlocked ? "📖 " : "🔒 "}
                  {lesson.title}
                </h3>
                <p>{lesson.description}</p>
                <p>
                  <strong>{lesson.difficulty}</strong> · Reward: +{lesson.xp} XP
                </p>
              </div>

              <button
                className="primary-button"
                type="button"
                disabled={!unlocked}
                onClick={() => onStartLesson(lesson)}
              >
                {completed ? "Mission Complete" : unlocked ? "Start Mission" : "Locked"}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}
