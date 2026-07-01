import { useEffect, useState } from "react";
import { useQuests } from "../treehouse/hooks/useQuests";
import { usePlayer } from "../treehouse/hooks/usePlayer";
import { useCompleteQuest } from "../quests/hooks/useCompleteQuest";
import InventoryBar from "./components/InventoryBar";
import LearningLevelSelector from "../learning/components/LearningLevelSelector";
import MathObstacleQuest from "./components/MathObstacleQuest";
import MathOperationSelector from "./components/MathOperationSelector";
import { mathObstacles } from "./data/mathObstacles";
import { useIncorrectAnswerPenalty } from "./hooks/useIncorrectAnswerPenalty";
import { useInventory } from "./hooks/useInventory";
import { useObstacleProgress } from "./hooks/useObstacleProgress";
import { useRewardCorrectAnswer } from "./hooks/useRewardCorrectAnswer";
import { getAdventureLevelConfig } from "../learning/learningLevelConfig";
import { useLearningLevelPreference } from "../learning/hooks/useLearningLevelPreference";
import TrailMap from "../adventure/components/TrailMap";

export default function MathMountainsPage({ onBack }) {
  const [currentObstacleIndex, setCurrentObstacleIndex] = useState(0);
  const [selectedOperation, setSelectedOperation] = useState("addition");
  const { data: player, isLoading: playerLoading, error: playerError } = usePlayer();
  const { data: quests, isLoading, error } = useQuests();
  const {
    data: inventory,
    isLoading: inventoryLoading,
    error: inventoryError,
  } = useInventory();
  const {
    data: obstacleProgress = [],
    isLoading: progressLoading,
    error: progressError,
  } = useObstacleProgress();
  const {
    overrideLevel: mathOverrideLevel,
    setOverrideLevel: setMathOverrideLevel,
    isLoading: preferenceLoading,
    isSaving: preferenceSaving,
    error: preferenceError,
  } = useLearningLevelPreference("math");
  const completeQuest = useCompleteQuest();
  const rewardCorrectAnswer = useRewardCorrectAnswer();
  const incorrectAnswerPenalty = useIncorrectAnswerPenalty();
  const mathLevel = getAdventureLevelConfig({
    adventureType: "math",
    childGrade: player?.grade,
    overrideLevel: mathOverrideLevel,
  });
  const availableOperations = mathLevel.config?.operations ?? [];

  const mathQuest = quests?.find((quest) => quest.subject === "math");
  const currentObstacle = mathObstacles[currentObstacleIndex];
  const currentObstacleProgress = obstacleProgress.find(
    (progress) => progress.obstacle_id === currentObstacle.id
  );

  useEffect(() => {
    if (selectedOperation === "mixed" || availableOperations.includes(selectedOperation)) {
      return;
    }

    setSelectedOperation(availableOperations[0] ?? "addition");
  }, [availableOperations, selectedOperation]);

  useEffect(() => {
    if (!obstacleProgress.length) {
      return;
    }

    const firstIncompleteIndex = mathObstacles.findIndex((obstacle) => {
      const progress = obstacleProgress.find(
        (item) => item.obstacle_id === obstacle.id
      );

      return !progress?.completed;
    });

    if (firstIncompleteIndex >= 0 && firstIncompleteIndex !== currentObstacleIndex) {
      setCurrentObstacleIndex(firstIncompleteIndex);
    }
  }, [currentObstacleIndex, obstacleProgress]);

  async function handleCorrectAnswer(obstacleId) {
    return rewardCorrectAnswer.mutateAsync({ obstacleId });
  }

  async function handleIncorrectAnswer(obstacleId) {
    return incorrectAnswerPenalty.mutateAsync({ obstacleId });
  }

  function handleObstacleComplete() {
    if (currentObstacleIndex < mathObstacles.length - 1) {
      setCurrentObstacleIndex((currentIndex) => currentIndex + 1);
      return;
    }

    if (!mathQuest || completeQuest.isSuccess || completeQuest.isPending) {
      return;
    }

    completeQuest.mutate(mathQuest.id);
  }

  if (
    playerLoading ||
    isLoading ||
    inventoryLoading ||
    progressLoading ||
    preferenceLoading
  ) {
    return <main className="dashboard">Loading Math Mountains...</main>;
  }

  if (playerError || error || inventoryError || progressError || preferenceError) {
    return <main className="dashboard">Unable to load Math Mountains.</main>;
  }

  if (!mathQuest) {
    return (
      <main className="dashboard">
        <button className="primary-button" onClick={onBack}>
          Back to Tree House
        </button>

        <div className="card">No Math Mountains quest found yet.</div>
      </main>
    );
  }

  return (
    <main className="dashboard math-mountains-page">
      <button className="primary-button" onClick={onBack}>
        Back to Tree House
      </button>

      <h1>⛰️ Math Mountains</h1>

      <InventoryBar inventory={inventory} />

      <LearningLevelSelector
        childGrade={player?.grade}
        effectiveLevel={mathLevel.effectiveLevel}
        isSaving={preferenceSaving}
        overrideLevel={mathOverrideLevel}
        source={mathLevel.source}
        onOverrideLevelChange={setMathOverrideLevel}
      />

      <p>
        Obstacle {currentObstacleIndex + 1} of {mathObstacles.length}
      </p>

      <MathOperationSelector
        availableOperations={availableOperations}
        effectiveLevel={mathLevel.effectiveLevel}
        selectedOperation={selectedOperation}
        onSelectOperation={setSelectedOperation}
      />

      <TrailMap
        title="Rescue Trail"
        emoji="⛰️"
        obstacles={mathObstacles}
        currentObstacleIndex={currentObstacleIndex}
      />

      <MathObstacleQuest
        key={`${currentObstacle.id}-${selectedOperation}-${mathLevel.effectiveLevel}-${currentObstacleProgress?.current_progress ?? 0}`}
        levelConfig={mathLevel.config}
        obstacle={currentObstacle}
        obstacleProgress={currentObstacleProgress}
        selectedOperation={selectedOperation}
        isAnswerPending={
          rewardCorrectAnswer.isPending || incorrectAnswerPenalty.isPending
        }
        onCorrectAnswer={handleCorrectAnswer}
        onIncorrectAnswer={handleIncorrectAnswer}
        onObstacleComplete={handleObstacleComplete}
      />

      {rewardCorrectAnswer.isError && (
        <div className="card quest-result error">
          Materials could not be saved. Try the answer again.
        </div>
      )}

      {incorrectAnswerPenalty.isError && (
        <div className="card quest-result error">
          The try was saved locally, but XP could not be updated yet.
        </div>
      )}

      {completeQuest.isSuccess && (
        <div className="card quest-result success">
          ⭐ Math Mountains quest complete! XP has been added to Lena&apos;s
          progress.
        </div>
      )}

      {completeQuest.isError && (
        <div className="card quest-result error">
          {completeQuest.error?.message ||
            "This quest may already be completed."}
        </div>
      )}
    </main>
  );
}
