export default function AdventureProgressCard({
  title = "Progress",
  completed,
  total,
  xp,
}) {
  return (
    <section className="card">
      <h2>{title}</h2>

      <div className="science-progress-grid">
        <div className="science-progress-item">
          <strong>{completed}</strong>
          <span>Completed</span>
        </div>

        <div className="science-progress-item">
          <strong>{xp}</strong>
          <span>XP</span>
        </div>

        <div className="science-progress-item">
          <strong>{total}</strong>
          <span>Total Missions</span>
        </div>
      </div>
    </section>
  );
}
