import { useState } from "react";
import { useQuests } from "../treehouse/hooks/useQuests";
import { useCompleteQuest } from "../quests/hooks/useCompleteQuest";
import MathObstacleQuest from "./components/MathObstacleQuest";
import MathOperationSelector from "./components/MathOperationSelector";
import { mathObstacles } from "./data/mathObstacles";
import TrailMap from "../adventure/components/TrailMap";

export default function MathMountainsPage({ onBack }) {
  const [currentObstacleIndex, setCurrentObstacleIndex] = useState(0);
  const [selectedOperation, setSelectedOperation] = useState("addition");
  const { data: quests, isLoading, error } = useQuests();
  const completeQuest = useCompleteQuest();

  const mathQuest = quests?.find((quest) => quest.subject === "math");
  const currentObstacle = mathObstacles[currentObstacleIndex];

  function handleObstacleComplete() {
    if (currentObstacleIndex < mathObstacles.length - 1) {
      setCurrentObstacleIndex((currentIndex) => currentIndex + 1);
      return;
    }

    if (!mathQuest || completeQuest.isSuccess) {
      return;
    }

    completeQuest.mutate(mathQuest.id);
  }

  if (isLoading) {
    return <main className="dashboard">Loading Math Mountains...</main>;
  }

  if (error) {
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

      <p>
        Obstacle {currentObstacleIndex + 1} of {mathObstacles.length}
      </p>

      <MathOperationSelector
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
        key={`${currentObstacle.id}-${selectedOperation}`}
        obstacle={currentObstacle}
        selectedOperation={selectedOperation}
        onObstacleComplete={handleObstacleComplete}
      />

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
