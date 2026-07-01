import { useQuests } from "../treehouse/hooks/useQuests";
import { useCompleteQuest } from "../quests/hooks/useCompleteQuest";
import LearningQuestCard from "../quests/components/LearningQuestCard";

export default function MathMountainsPage({ onBack }) {
  const { data: quests, isLoading, error } = useQuests();
  const completeQuest = useCompleteQuest();

  const mathQuest = quests?.find((quest) => quest.subject === "math");

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

        <div className="card">
          No Math Mountains quest found yet.
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard math-mountains-page">
      <button className="primary-button" onClick={onBack}>
        Back to Tree House
      </button>

      <h1>⛰️ Math Mountains</h1>

      <LearningQuestCard
        quest={mathQuest}
        onCorrectAnswer={(questId) => completeQuest.mutate(questId)}
        />

      {completeQuest.isSuccess && (
        <div className="card quest-result success">
          🎉 Quest complete! XP has been added.
        </div>
      )}

      {completeQuest.isError && (
        <div className="card quest-result error">
            {completeQuest.error?.message || "This quest may already be completed."}
        </div>
    )}
    </main>
  );
}