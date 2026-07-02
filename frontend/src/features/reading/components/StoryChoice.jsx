export default function StoryChoice({ choices = [], selectedChoiceId, isSaving, onChoose }) {
  if (!choices.length) {
    return null;
  }

  return (
    <section className="reading-story-choice-card">
      <p className="quest-realm">Choose Your Path</p>
      <h3>The path splits</h3>
      <div className="reading-choice-grid">
        {choices.map((choice) => (
          <button
            className={choice.id === selectedChoiceId ? "reading-choice-button selected" : "reading-choice-button"}
            disabled={isSaving}
            key={choice.id}
            type="button"
            onClick={() => onChoose(choice)}
          >
            <strong>{choice.label}</strong>
            <small>{choice.outcome_text}</small>
          </button>
        ))}
      </div>
    </section>
  );
}
