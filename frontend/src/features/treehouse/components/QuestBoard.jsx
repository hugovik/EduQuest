import { useCompleteQuest } from "../../reading/useCompleteQuest";

export default function QuestBoard({ quest }) {
  const completeQuest = useCompleteQuest();

  if (!quest) {
    return <div className="card">Loading quest...</div>;
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
        <div className="quest-result">
          {completeQuest.data.events.map((event) => (
            <p key={event}>✨ {event}</p>
          ))}
        </div>
      )}

      {completeQuest.error && (
        <div className="quest-result" role="status">
          <p>{completeQuest.error.message}</p>
        </div>
      )}
    </div>
  );
}
