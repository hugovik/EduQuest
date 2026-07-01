import { useCompleteQuest } from "../../reading/useCompleteQuest";

export default function QuestBoard({ quest }) {
  const completeQuest = useCompleteQuest();

  if (!quest) {
    return <div className="card">Loading quest...</div>;
  }

  return (
    <div className="card">
      <h2>📖 Today's Adventure</h2>

      <h3>{quest.title}</h3>

      <p>{quest.realm}</p>

      <button
        className="primary-button"
        disabled={completeQuest.isPending}
        onClick={() => completeQuest.mutate(quest.id)}
      >
        {completeQuest.isPending ? "Completing..." : "Complete Adventure"}
      </button>

      {completeQuest.data?.events?.length > 0 && (
        <div className="quest-result">
          {completeQuest.data.events.map((event) => (
            <p key={event}>✨ {event}</p>
          ))}
        </div>
      )}
    </div>
  );
}
