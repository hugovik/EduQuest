export default function TreehouseGreeting({ player }) {
  const playerName = player?.name ?? "Adventurer";

  return (
    <section className="treehouse-greeting-panel parchment-panel" aria-label="Treehouse welcome">
      <div>
        <p className="quest-realm">Treehouse Home</p>
        <h1>Welcome back, {playerName}</h1>
        <p>
          Your treehouse is ready. Check today&apos;s quest, see how your tree is
          growing, and choose where the next adventure begins.
        </p>
      </div>
    </section>
  );
}
