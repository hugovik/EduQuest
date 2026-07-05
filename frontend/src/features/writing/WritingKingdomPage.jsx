import WritingAdventure from "./components/WritingAdventure";

export default function WritingKingdomPage({ onBack }) {
  return (
    <main className="dashboard writing-kingdom-page">
      <button className="secondary-button" type="button" onClick={onBack}>
        ← Back to World Map
      </button>

      <section className="card state-card writing-kingdom-hero">
        <p className="quest-realm">Royal Library</p>
        <h1>🏰 Writing Kingdom</h1>

        <p className="quest-intro">
          The Royal Library has lost its words. Magical books are scattered,
          punctuation has disappeared, and sentences are broken.
        </p>

        <div className="writing-librarian-card">
          <div className="writing-librarian-avatar">📖</div>

          <div>
            <p className="quest-realm">The Royal Librarian</p>
            <h2>“Welcome, young author.”</h2>
            <p>
              A strange magic has swept across the kingdom. Books have lost
              their words. Sentences have fallen apart. Punctuation has
              vanished.
            </p>
            <p>
              Only a brave writer can restore the Royal Library one sentence at
              a time.
            </p>
          </div>
        </div>

        <WritingAdventure />
      </section>
    </main>
  );
}