export default function CharacterCard({ character }) {
  return (
    <article className="reading-character-card">
      <div className="reading-character-portrait" aria-hidden="true">
        {character.name?.slice(0, 1) || "?"}
      </div>
      <div>
        <strong>{character.name}</strong>
        <p>{character.role}</p>
        <small>{character.description}</small>
      </div>
    </article>
  );
}
