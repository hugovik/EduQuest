export default function TreehouseCompanions() {
  return (
    <section className="treehouse-companions" aria-label="Treehouse companions">
      <article className="treehouse-companion-card">
        <div className="treehouse-companion-icon" aria-hidden="true">
          🦉
        </div>
        <div>
          <h2>Professor Owl</h2>
          <p>Ready with hints, reminders, and a calm little nudge when you need one.</p>
        </div>
      </article>

      <article className="treehouse-companion-card">
        <div className="treehouse-companion-icon" aria-hidden="true">
          🐉
        </div>
        <div>
          <h2>Spark Dragon</h2>
          <p>Keeping watch over your rewards until it is time to head out.</p>
        </div>
      </article>
    </section>
  );
}
