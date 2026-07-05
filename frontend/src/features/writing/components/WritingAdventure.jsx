import { useState } from "react";
import { WRITING_LESSONS } from "../writingLessons";
import MissingPunctuationActivity from "./MissingPunctuationActivity";
import WritingQuestLog from "./WritingQuestLog";

export default function WritingAdventure() {
  const [scene, setScene] = useState("quest-log");
  const [activeLesson, setActiveLesson] = useState(null);
  const [completedLessons, setCompletedLessons] = useState([]);
  const [earnedXp, setEarnedXp] = useState(0);

  function handleStartLesson(lesson) {
    setActiveLesson(lesson);
    setScene("activity");
  }

  function handleComplete(result) {
    if (!activeLesson) return;

    if (!completedLessons.includes(activeLesson.id)) {
      setCompletedLessons((current) => [...current, activeLesson.id]);
      setEarnedXp((current) => current + result.xp);
    }

    setScene("reward");
  }

  if (scene === "activity" && activeLesson) {
    return (
      <MissingPunctuationActivity
        lesson={activeLesson}
        onComplete={handleComplete}
      />
    );
  }

  if (scene === "reward" && activeLesson) {
    return (
      <section className="card state-card">
        <h2>📖 Quest Complete!</h2>
        <p>{activeLesson.successMessage}</p>
        <p>
          You earned <strong>{activeLesson.xp} XP</strong>.
        </p>
        <button
          className="primary-button"
          type="button"
          onClick={() => {
            setActiveLesson(null);
            setScene("quest-log");
          }}
        >
          Return to Quest Log
        </button>
      </section>
    );
  }

  return (
    <>
      <div className="writing-progress-grid">
        <div className="mini-stat-card">
          <span>Sentences Restored</span>
          <strong>{completedLessons.length}</strong>
        </div>

        <div className="mini-stat-card">
          <span>Books Saved</span>
          <strong>{completedLessons.length > 0 ? 1 : 0}</strong>
        </div>

        <div className="mini-stat-card">
          <span>Writing XP</span>
          <strong>{earnedXp}</strong>
        </div>
      </div>

      <WritingQuestLog
        lessons={WRITING_LESSONS}
        completedLessons={completedLessons}
        onStartLesson={handleStartLesson}
      />
    </>
  );
}