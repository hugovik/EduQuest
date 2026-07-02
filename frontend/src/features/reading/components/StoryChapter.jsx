import CharacterCard from "./CharacterCard";
import ReadingPassage from "./ReadingPassage";
import StoryDialogue from "./StoryDialogue";

export default function StoryChapter({ passage, selectedChoice }) {
  return (
    <section className="reading-story-chapter">
      <div className="card reading-chapter-hero">
        <p className="quest-realm">{passage.story_arc_title}</p>
        <h2>{passage.chapter_title ?? passage.title}</h2>
        <p>{passage.title}</p>
        <div className="reading-art-placeholder" aria-label="Chapter illustration placeholder">
          <span>Story illustration placeholder</span>
          <small>{passage.artwork?.background ?? "Future AI artwork will appear here."}</small>
        </div>
      </div>

      <div className="reading-character-grid">
        {passage.characters?.map((character) => (
          <CharacterCard character={character} key={character.id} />
        ))}
      </div>

      <StoryDialogue characters={passage.characters} selectedChoice={selectedChoice} />
      <ReadingPassage passage={passage} />
    </section>
  );
}
