import { useCompleteQuest } from "../../quests/hooks/useCompleteQuest";

export default function QuestBoard({ quest, isLoading = false }) {
  const completeQuest = useCompleteQuest();

  if (isLoading) {
    return (
      <div className="card state-card" role="status">
        <h2>📖 Today's Adventure</h2>
        <p>Loading today&apos;s quest...</p>
      </div>
    );
  }

  if (!quest) {
    return (
      <div className="card state-card">
        <h2>📖 Today's Adventure</h2>
        <p>No quests are available yet. Check back after new adventures are added.</p>
      </div>
    );
  }

  const isDuplicateBlocked = completeQuest.error?.status === 409;
  const isCompleted = !quest.repeatable && (completeQuest.isSuccess || isDuplicateBlocked);

  return (
    <div className="card">
      <h2>📖 Today's Adventure</h2>

      <h3>{quest.title}</h3>

      <p>{quest.realm}</p>

      <button
        className="primary-button"
        disabled={completeQuest.isPending || isCompleted}
        onClick={() => completeQuest.mutate(quest.id)}
      >
        {completeQuest.isPending
          ? "Completing..."
          : isCompleted
            ? "Adventure Complete"
            : "Complete Adventure"}
      </button>

      {completeQuest.data?.events?.length > 0 && (
        <div className="quest-result quest-result-success" role="status">
          {completeQuest.data.events.map((event) => (
            <p key={event}>✨ {event}</p>
          ))}
        </div>
      )}

      {completeQuest.error && (
        <div className="quest-result quest-result-error" role="status">
          <p>{completeQuest.error.message}</p>
        </div>
      )}
    </div>
  );
}
