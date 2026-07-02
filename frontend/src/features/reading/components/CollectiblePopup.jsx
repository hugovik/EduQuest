export default function CollectiblePopup({ collectible, onClose }) {
  if (!collectible) {
    return null;
  }

  return (
    <div className="reading-collectible-popup" role="status">
      <div>
        <p className="quest-realm">Collectible Found</p>
        <strong>{collectible.name}</strong>
        <p>{collectible.description}</p>
      </div>
      <button className="primary-button" type="button" onClick={onClose}>
        Nice!
      </button>
    </div>
  );
}
