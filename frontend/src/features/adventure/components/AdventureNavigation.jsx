export default function AdventureNavigation({ onBack, backLabel = "Back to World Map", children }) {
  return (
    <nav className="adventure-framework-navigation" aria-label="Adventure navigation">
      {onBack && (
        <button className="primary-button" type="button" onClick={onBack}>
          {backLabel}
        </button>
      )}
      {children}
    </nav>
  );
}
