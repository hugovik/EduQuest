import { useState } from "react";

import DashboardLayout from "../../../components/DashboardLayout.jsx";
import PageHeader from "../../../components/PageHeader.jsx";
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
  const [activeLessonId, setActiveLessonId] = useState(lessonId);
  const [showIntro, setShowIntro] = useState(true);
  const [showReward, setShowReward] = useState(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState(null);

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

  function completeLesson() {
    completeAdventureLesson({
      adventureKey: "science",
      lessonId: activeLesson.id,
    });

    const didUnlock = unlockAchievement("science-first-experiment");

    if (didUnlock) {
      setUnlockedAchievement(
        getAchievement("science-first-experiment")
      );
      return;
    }


    setShowReward(true);
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

      <ActivityRenderer
        lesson={currentActivity}
        onComplete={completeLesson}
      />
    </DashboardLayout>
  );
}