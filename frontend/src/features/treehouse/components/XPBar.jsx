export default function XPBar({ player }) {
  const percent = Math.min((player.xp / 100) * 100, 100);

  return (
    <div className="card">
      <h2>⭐ XP</h2>

      <div className="xp-track">
        <div
          className="xp-fill"
          style={{ width: `${percent}%` }}
        />
      </div>

      <p>{player.xp} / 100 XP</p>
    </div>
  );
}