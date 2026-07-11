import { useState } from "react";
import { treehouseCharacterAssets } from "../treehouseAssets";

export default function ProfessorOwl({ character, isActive = false, onInteract }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <article className="treehouse-character treehouse-professor-owl">
      <button
        aria-expanded={isActive}
        aria-label={`Talk to ${character.name}`}
        className="treehouse-character-button"
        data-object-state={isActive ? "open" : "default"}
        type="button"
        onClick={onInteract}
      >
        {imageFailed ? (
          <span className="treehouse-character-portrait" role="img" aria-label={character.alt}>
            {character.icon}
          </span>
        ) : (
          <img
            alt={character.alt}
            className="treehouse-character-image"
            draggable="false"
            src={treehouseCharacterAssets.professorOwl}
            onError={() => setImageFailed(true)}
          />
        )}
      </button>
      <div className="treehouse-character-message parchment-panel">
        <strong>{character.name}</strong>
        <p>{character.message}</p>
      </div>
    </article>
  );
}
