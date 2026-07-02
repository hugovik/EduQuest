export default function StoryJournal({ storyState, onReplayChapter }) {
  const chaptersCompleted = storyState?.journal_entries?.filter(
    (entry) => entry.type === "chapter_complete"
  ) ?? [];
  const charactersMet = storyState?.characters_met ?? [];
  const collectibles = storyState?.collectibles_found ?? [];

  return (
    <section className="card reading-journal-card">
      <p className="quest-realm">Story Journal</p>
      <h2>Adventure Notes</h2>
      <div className="reading-journal-metrics">
        <span>{chaptersCompleted.length} chapters completed</span>
        <span>{charactersMet.length} characters met</span>
        <span>{collectibles.length} collectibles found</span>
      </div>
      <div className="reading-journal-columns">
        <section>
          <h3>Characters</h3>
          {charactersMet.length ? (
            charactersMet.map((character) => <p key={character.id}>{character.name}</p>)
          ) : (
            <p>No forest friends met yet.</p>
          )}
        </section>
        <section>
          <h3>Collectibles</h3>
          {collectibles.length ? (
            collectibles.map((item) => <p key={item.id}>{item.name}</p>)
          ) : (
            <p>No keepsakes found yet.</p>
          )}
        </section>
        <section>
          <h3>Journal</h3>
          {storyState?.journal_entries?.length ? (
            storyState.journal_entries.slice(-3).map((entry) => (
              <article key={entry.id}>
                <strong>{entry.title}</strong>
                <p>{entry.text}</p>
                {entry.passage_id && (
                  <button
                    className="primary-button"
                    type="button"
                    onClick={() => onReplayChapter?.(entry.passage_id)}
                  >
                    Replay chapter
                  </button>
                )}
              </article>
            ))
          ) : (
            <p>Your story notes will appear here.</p>
          )}
        </section>
      </div>
    </section>
  );
}
