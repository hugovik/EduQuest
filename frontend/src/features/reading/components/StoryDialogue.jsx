export default function StoryDialogue({ characters = [], selectedChoice }) {
  const guide = characters.find((character) => character.id !== "lena") ?? characters[0];

  return (
    <section className="reading-dialogue" aria-label="Story dialogue">
      <p className="quest-realm">Story Moment</p>
      <p>
        <strong>{guide?.name ?? "Reading Forest"}:</strong>{" "}
        {selectedChoice?.dialogue ?? "Look closely at the story. The forest leaves clues for careful readers."}
      </p>
      {selectedChoice?.outcome_text && <small>{selectedChoice.outcome_text}</small>}
    </section>
  );
}
