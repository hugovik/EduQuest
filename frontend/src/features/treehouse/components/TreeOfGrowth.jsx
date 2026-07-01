export default function TreeOfGrowth({ player }) {
  const nextGrowth = Math.max(100 - player.xp, 0);

  return (
    <div className="card">
      <h2>🌱 Tree of Growth</h2>

      <p>Stage: {player.tree_stage}</p>

      <p>Next growth: {nextGrowth} XP</p>
    </div>
  );
}