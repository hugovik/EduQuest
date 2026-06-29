import { usePlayer } from "../hooks/usePlayer";

export default function PlayerCard() {
  const { data, isLoading, error } = usePlayer();

  if (isLoading) {
    return <div className="card">Loading player...</div>;
  }

  if (error) {
    return <div className="card">Unable to load player.</div>;
  }

  return (
    <div className="card">
      <h2>👧 {data.name}</h2>

      <p>Level {data.level}</p>

      <p>XP {data.xp} / 100</p>

      <p>🌱 Tree Stage: {data.tree_stage}</p>
    </div>
  );
}