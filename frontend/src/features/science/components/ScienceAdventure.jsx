import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

import DashboardLayout from "../../../components/DashboardLayout.jsx";
import PageHeader from "../../../components/PageHeader.jsx";
import { invalidateGlobalProgress } from "../../../api/invalidateGlobalProgress.js";
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
import LessonBriefing from "../../../components/LessonBriefing.jsx";

export default function ScienceAdventure({ lessonId, onExit }) {
  const queryClient = useQueryClient();
  const [activeLessonId, setActiveLessonId] = useState(lessonId);
  const [showIntro, setShowIntro] = useState(true);
  const [showBriefing, setShowBriefing] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [unlockedAchievement, setUnlockedAchievement] = useState(null);
  const [completionError, setCompletionError] = useState("");
  const [activityFeedback, setActivityFeedback] = useState("");
  const [isCompleting, setIsCompleting] = useState(false);
  const [hasStartedLesson, setHasStartedLesson] = useState(false);

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

  const currentActivity = {
    ...activeLesson.activities[0],
    xp: activeLesson.xp,
    successMessage: activeLesson.successMessage,
  };

  async function completeLesson(result = { correct: true }) {
    if (isCompleting) {
      return;
    }

    if (!result.correct) {
      setActivityFeedback(dialogue.retry ?? "Good try! Take another look and try again.");
      return;
    }

    setIsCompleting(true);
    setCompletionError("");
    setActivityFeedback("");

    try {
      const result = await completeScienceExperiment(activeLesson.id);

      completeAdventureLesson({
        adventureKey: "science",
        lessonId: activeLesson.id,
      });

      queryClient.setQueryData(queryKeys.player, result.child);
      invalidateGlobalProgress(queryClient);
      queryClient.invalidateQueries({ queryKey: queryKeys.adventureProgress("science-lab") });

      const unlockedScienceAchievement = result.achievements_unlocked?.[0];

      if (unlockedScienceAchievement) {
        setUnlockedAchievement(unlockedScienceAchievement);
        setIsCompleting(false);
        return;
      }
    } catch (error) {
      setCompletionError("The lab notebook could not save this experiment. Please try again.");
      setIsCompleting(false);
      return;
    }

    setShowReward(true);
    setIsCompleting(false);
  }

  function handleContinue() {
    setShowReward(false);
    setShowBriefing(false);
    setShowIntro(true);
    setActiveLessonId(null);
    onExit?.();
  }

  if (showIntro) {
    return (
      <ExperimentIntro
        experiment={activeExperiment}
        onBegin={() => {
          setShowIntro(false);
          setShowBriefing(true);
        }}
      />
    );
  }
  if (showBriefing) {
    return (
      <DashboardLayout>
        <PageHeader
          eyebrow={activeExperiment.topic}
          title={activeExperiment.title}
          description={activeExperiment.description}
        />

        <LessonBriefing
          title={activeLesson.title}
          icon={activeExperiment.equipment?.[0]?.icon ?? "🔬"}
          guideName="Professor Nova"
          guideAvatar="👩‍🔬"
          guideMessage={activeLesson.professorMessage}
          learningObjective={activeLesson.learningObjective}
          vocabulary={activeLesson.vocabulary}
          funFact={activeLesson.funFact}
          estimatedMinutes={activeLesson.estimatedMinutes}
          difficulty={activeLesson.difficulty}
          onBack={() => {
            setShowBriefing(false);
            setShowIntro(true);
          }}
          onStart={() => setShowBriefing(false)}
        />
      </DashboardLayout>
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
        dialogue.success ?? activeLesson.successMessage,
      unlockMessage: dialogue.unlock,
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

      {activityFeedback && (
        <section className="card state-card" role="status">
          <p>{activityFeedback}</p>
        </section>
      )}

      <ActivityRenderer
        lesson={currentActivity}
        onComplete={completeLesson}
      />
    </DashboardLayout>
  );
}
