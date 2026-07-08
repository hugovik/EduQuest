import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import DashboardLayout from "../../../components/DashboardLayout.jsx";
import PageHeader from "../../../components/PageHeader.jsx";
import { completeScienceExperiment } from "../../../api/scienceApi";
import { queryKeys } from "../../../api/queryKeys";
import ActivityRenderer from "../../lesson/components/ActivityRenderer";
import LessonRewardScene from "../../lesson/components/LessonRewardScene";
import ExperimentIntro from "./ExperimentIntro";

import { SCIENCE_LESSONS } from "../scienceLessons";
import { SCIENCE_EXPERIMENTS } from "../scienceExperiments";
import { completeAdventureLesson } from "../../progress/progressService.js";
import ProfessorNovaPanel from "./ProfessorNovaPanel";
import AchievementToast from "../../achievements/AchievementToast.jsx";
import {
  getAchievement,
  unlockAchievement,
} from "../../achievements/achievementService.js";

export default function ScienceAdventure({ lessonId, onExit }) {
  const queryClient = useQueryClient();
  const [activeLessonId, setActiveLessonId] = useState(lessonId);
  const [showIntro, setShowIntro] = useState(true);
  const [showReward, setShowReward] = useState(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState(null);
  const [completionError, setCompletionError] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);

  const activeLesson = SCIENCE_LESSONS.find(
    (lesson) => lesson.id === activeLessonId
  );

  const activeExperiment = SCIENCE_EXPERIMENTS.find(
    (experiment) => experiment.id === activeLessonId
  );

  const dialogue = activeExperiment.dialogue ?? {};

  if (!activeLesson || !activeExperiment) {
    return null;
  }

  const currentActivity = activeLesson.activities[0];

  async function completeLesson() {
    if (isCompleting) {
      return;
    }

    setIsCompleting(true);
    setCompletionError("");

    try {
      const result = await completeScienceExperiment(activeLesson.id);

      completeAdventureLesson({
        adventureKey: "science",
        lessonId: activeLesson.id,
      });

      queryClient.setQueryData(queryKeys.player, result.child);
      queryClient.invalidateQueries({ queryKey: queryKeys.player });
      queryClient.invalidateQueries({ queryKey: queryKeys.progressSummary });
      queryClient.invalidateQueries({ queryKey: queryKeys.adventureProgressSummary });
      queryClient.invalidateQueries({ queryKey: queryKeys.worldProgressSummary });
      queryClient.invalidateQueries({ queryKey: queryKeys.worldState });
      queryClient.invalidateQueries({ queryKey: queryKeys.adventureProgress("science-lab") });
    } catch (error) {
      setCompletionError("The lab notebook could not save this experiment. Please try again.");
      setIsCompleting(false);
      return;
    }

    const didUnlock = unlockAchievement("science-first-experiment");

    if (didUnlock) {
      setUnlockedAchievement(
        getAchievement("science-first-experiment")
      );
      setIsCompleting(false);
      return;
    }


    setShowReward(true);
    setIsCompleting(false);
  }

  function handleContinue() {
    setShowReward(false);
    setShowIntro(true);
    setActiveLessonId(null);
    onExit?.();
  }

  if (showIntro) {
    return (
      <ExperimentIntro
        experiment={activeExperiment}
        onBegin={() => setShowIntro(false)}
      />
    );
  }

  if (unlockedAchievement) {
    return (
      <DashboardLayout>
        <AchievementToast
          achievement={unlockedAchievement}
          onClose={() => {
            setUnlockedAchievement(null);
            setShowReward(true);
          }}
        />
      </DashboardLayout>
    );
  }

  if (showReward) {
    const rewardLesson = {
      ...activeLesson,
      successMessage:
        activeExperiment.intro?.success ?? activeLesson.successMessage,
    };

    return (
      <LessonRewardScene
        lesson={rewardLesson}
        onContinue={handleContinue}
      />
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow={activeExperiment.topic}
        title={activeExperiment.title}
        description={activeExperiment.description}
      />

      {dialogue.encouragement && (
        <ProfessorNovaPanel
          mood="curious"
          message={dialogue.encouragement}
        />
      )}

      {isCompleting && (
        <section className="card state-card" role="status">
          <p>Saving your science discovery...</p>
        </section>
      )}

      {completionError && (
        <section className="card state-card state-card-error" role="alert">
          <p>{completionError}</p>
        </section>
      )}

      <ActivityRenderer
        lesson={currentActivity}
        onComplete={completeLesson}
      />
    </DashboardLayout>
  );
}
