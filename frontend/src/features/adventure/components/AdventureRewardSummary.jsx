import { useAdventureRewards } from "../hooks/useAdventureRewards";

export default function AdventureRewardSummary({ reward }) {
  const { xp, items, achievements, hasRewards } = useAdventureRewards(reward);

  return (
    <section className="card adventure-framework-reward-card" aria-label="Adventure rewards">
      <p className="quest-realm">Rewards</p>
      <h2>Reward Summary</h2>
      {hasRewards ? (
        <div className="adventure-framework-stat-grid">
          <span>{xp} XP</span>
          <span>{items.length} item{items.length === 1 ? "" : "s"}</span>
          <span>{achievements.length} badge{achievements.length === 1 ? "" : "s"}</span>
        </div>
      ) : (
        <p>Rewards will appear after the next activity.</p>
      )}
    </section>
  );
}
