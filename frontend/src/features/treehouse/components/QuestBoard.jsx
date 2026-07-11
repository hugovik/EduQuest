export default function QuestBoard({ quest, isLoading = false, onOpenWorld }) {
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

  return (
    <div className="card">
      <h2>📖 Today's Adventure</h2>

      <h3>{quest.title}</h3>

      <p>{quest.realm}</p>

      <button className="primary-button" type="button" onClick={onOpenWorld}>
        Open World Map
      </button>
    </div>
  );
}
