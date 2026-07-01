import { usePlayer } from "../hooks/usePlayer";

export default function PlayerCard({ player }) {
  return (
    <div className="card">
      <h2>👧 {player.name}</h2>

      <p>Level {player.level}</p>

      <p>XP {player.xp} / 100</p>

      <p>🌱 Tree Stage: {player.tree_stage}</p>
    </div>
  );
}