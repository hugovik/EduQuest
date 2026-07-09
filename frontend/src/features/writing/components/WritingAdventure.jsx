import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import { invalidateGlobalProgress } from "../../../api/invalidateGlobalProgress.js";
import { completeWritingLesson, getWritingProgress } from "../../../api/writingApi.js";
import { queryKeys } from "../../../api/queryKeys.js";
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
  const queryClient = useQueryClient();
  const { scene, goTo } = useAdventureFlow();
  const [activeLesson, setActiveLesson] = useState(null);
  const [progress, setProgress] = useState(() => loadWritingProgress());
  const [backendProgress, setBackendProgress] = useState(null);
  const [completionResult, setCompletionResult] = useState(null);
  const [completionError, setCompletionError] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadBackendProgress() {
      try {
        const nextProgress = await getWritingProgress();
        if (!cancelled) {
          setBackendProgress(nextProgress);
        }
      } catch {
        if (!cancelled) {
          setBackendProgress(null);
        }
      }
    }

    loadBackendProgress();

    return () => {
      cancelled = true;
    };
  }, []);

  const completedLessons = Array.from(new Set([
    ...(progress.completedLessons ?? []),
    ...(backendProgress?.completed_lessons ?? []),
  ]));
  const earnedXp = backendProgress?.xp_earned ?? getEarnedLessonXp( WRITING_LESSONS, completedLessons );
  const completedBooks = getCompletedBooks( WRITING_LESSONS, completedLessons);

  function handleStartLesson(lesson) {
    setActiveLesson(lesson);
    goTo(ADVENTURE_SCENES.ACTIVITY);
  }

  async function handleComplete(result) {
    if (!activeLesson) return;
    if (isCompleting) return;

    setIsCompleting(true);
    setCompletionError("");

    try {
      const completion = await completeWritingLesson(activeLesson.id);
      setCompletionResult(completion);
      setBackendProgress(completion.progress);
      queryClient.setQueryData(queryKeys.player, completion.child);
      invalidateGlobalProgress(queryClient);
      queryClient.invalidateQueries({ queryKey: queryKeys.adventureProgress("writing-kingdom") });

      if (!completedLessons.includes(activeLesson.id)) {
        const nextProgress = { completedLessons: [...completedLessons, activeLesson.id] };
        setProgress(nextProgress);
        saveWritingProgress(nextProgress);
      }
    } catch {
      setCompletionError("The Royal Library could not save this lesson. Please try again.");
      setIsCompleting(false);
      return;
    }

    setIsCompleting(false);
    goTo(ADVENTURE_SCENES.REWARD);
  }

  if (scene === ADVENTURE_SCENES.ACTIVITY && activeLesson) {
    return (
      <>
        {isCompleting && (
          <section className="card state-card" role="status">
            <p>Saving your restored sentence...</p>
          </section>
        )}
        {completionError && (
          <section className="card state-card state-card-error" role="alert">
            <p>{completionError}</p>
          </section>
        )}
        <ActivityRenderer
            lesson={activeLesson}
            onComplete={handleComplete}
        />
      </>
    );
  }

  if (scene === ADVENTURE_SCENES.REWARD && activeLesson) {
  const rewardLesson = {
    ...activeLesson,
    xp: completionResult?.xp_awarded ?? activeLesson.xp,
  };

  return (
    <LessonRewardScene
      lesson={rewardLesson}
      onContinue={() => {
        setActiveLesson(null);
        setCompletionResult(null);
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

      {isCompleting && (
        <section className="card state-card" role="status">
          <p>Saving your restored sentence...</p>
        </section>
      )}

      {completionError && (
        <section className="card state-card state-card-error" role="alert">
          <p>{completionError}</p>
        </section>
      )}

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
