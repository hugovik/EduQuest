import { useState } from "react";
import { WRITING_LESSONS } from "../writingLessons";
import ActivityRenderer from "../../lesson/components/ActivityRenderer";
import WritingQuestLog from "./WritingQuestLog";
import WritingBookProgress from "./WritingBookProgress";
import { loadWritingProgress, saveWritingProgress } from "../writingStorage";
import useAdventureFlow from "../../adventure/hooks/useAdventureFlow";
import { ADVENTURE_SCENES } from "../../adventure/adventureScenes";
import LessonRewardScene from "../../lesson/components/LessonRewardScene";
import { getEarnedLessonXp, getCompletedBooks, } from "../../lesson/lessonUtils";
import WritingStoryProgress from "./WritingStoryProgress";

export default function WritingAdventure() {
  const { scene, goTo } = useAdventureFlow();
  const [activeLesson, setActiveLesson] = useState(null);
  const [progress, setProgress] = useState(() => loadWritingProgress());

  const completedLessons = progress.completedLessons;
  const earnedXp = getEarnedLessonXp( WRITING_LESSONS, completedLessons );
  const completedBooks = getCompletedBooks( WRITING_LESSONS, completedLessons);

  function handleStartLesson(lesson) {
    setActiveLesson(lesson);
    goTo(ADVENTURE_SCENES.ACTIVITY);
  }

  function handleComplete(result) {
    if (!activeLesson) return;

    if (!completedLessons.includes(activeLesson.id)) {
        const nextProgress = { completedLessons: [...completedLessons, activeLesson.id], };

        setProgress(nextProgress);
        saveWritingProgress(nextProgress);
    }

    goTo(ADVENTURE_SCENES.REWARD);
  }

  if (scene === ADVENTURE_SCENES.ACTIVITY && activeLesson) {
    return (
        <ActivityRenderer
            lesson={activeLesson}
            onComplete={handleComplete}
        />
    );
  }

  if (scene === ADVENTURE_SCENES.REWARD && activeLesson) {
  return (
    <WritingRewardScene
      lesson={activeLesson}
      onContinue={() => {
        setActiveLesson(null);
        goTo(ADVENTURE_SCENES.QUEST_LOG);
      }}
    />
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
          <strong>{completedBooks}</strong>
        </div>

        <div className="mini-stat-card">
          <span>Writing XP</span>
          <strong>{earnedXp}</strong>
        </div>
      </div>

      <WritingBookProgress completedLessons={completedLessons} />
      
      <WritingStoryProgress completedLessons={completedLessons} />

      <WritingQuestLog
        lessons={WRITING_LESSONS}
        completedLessons={completedLessons}
        onStartLesson={handleStartLesson}
      />
    </>
  );
}