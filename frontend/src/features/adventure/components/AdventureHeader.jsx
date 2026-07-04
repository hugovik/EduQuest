export default function AdventureHeader({ adventure, eyebrow, children }) {
  return (
    <header className="adventure-framework-header">
      <p className="quest-realm">{eyebrow ?? adventure?.theme ?? "Adventure"}</p>
      <h1>{adventure?.icon} {adventure?.title}</h1>
      {adventure?.description && <p>{adventure.description}</p>}
      {children}
    </header>
  );
}
