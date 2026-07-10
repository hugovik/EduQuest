import TreehouseProgressBar from "./TreehouseProgressBar";
import { getTreeGrowthAsset } from "../treehouseAssets";

export default function TreehouseGrowthPanel({ player, worldSummary }) {
  const currentLevelXp = player?.current_level_xp ?? 0;
  const nextLevelXp = player?.next_level_xp ?? 100;
  const xpProgressPercent = player?.xp_progress_percent ?? 0;
  const worldQuest = worldSummary?.world_quest;
  const stageName = player?.tree_stage ?? "Seedling";
  const growthAsset = getTreeGrowthAsset(stageName);

  return (
    <section className="treehouse-card treehouse-growth-card">
      <div>
        <p className="quest-realm">Tree of Growth</p>
        <h2>🌱 {stageName}</h2>
        <p>Level {player?.level ?? 1}</p>
      </div>

      <div className="treehouse-growth-art" aria-hidden={growthAsset ? undefined : "true"}>
        {growthAsset ? (
          <img alt={growthAsset.alt} draggable="false" src={growthAsset.src} />
        ) : (
          <span role="img" aria-label={`${stageName} placeholder`}>
            🌳
          </span>
        )}
      </div>

      <TreehouseProgressBar
        label="XP toward next growth"
        max={nextLevelXp ?? undefined}
        percent={xpProgressPercent}
        value={player?.xp ?? currentLevelXp}
      />

      {worldQuest ? (
        <div className="treehouse-world-quest-mini">
          <span>Main quest</span>
          <strong>{worldQuest.progress_percent ?? 0}% restored</strong>
        </div>
      ) : (
        <div className="treehouse-world-quest-mini">
          <span>Main quest</span>
          <strong>Ready when you are</strong>
        </div>
      )}
    </section>
  );
}
