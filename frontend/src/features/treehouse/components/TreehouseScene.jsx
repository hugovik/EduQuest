import { useState } from "react";
import ProfessorOwl from "./ProfessorOwl";
import SparkDragon from "./SparkDragon";
import TreehouseGreeting from "./TreehouseGreeting";
import TreehouseGrowthPanel from "./TreehouseGrowthPanel";
import TreehouseNavigation from "./TreehouseNavigation";
import TreehouseQuestCard from "./TreehouseQuestCard";
import TreehouseProgressBar from "./TreehouseProgressBar";
import { treehouseSceneAssets } from "../treehouseAssets";
import { treehouseCharacters } from "../treehouseCharacters";

export default function TreehouseScene({
  dailyGoal,
  inventoryCount,
  isQuestLoading,
  onGoToDev,
  onGoToWorld,
  player,
  quest,
  worldSummary,
}) {
  const xpPercent = player?.xp_progress_percent ?? 0;
  const nextLevelXp = player?.next_level_xp;
  const [sceneImageFailed, setSceneImageFailed] = useState(false);

  return (
    <section
      className={`treehouse-scene${sceneImageFailed ? "" : " has-scene-art"}`}
      aria-label="Treehouse home scene"
    >
      <div className="treehouse-scene-sky" aria-hidden="true" />
      {!sceneImageFailed && (
        <picture className="treehouse-scene-art" aria-hidden="true">
          <source media="(max-width: 720px)" srcSet={treehouseSceneAssets.mobile} />
          <source media="(max-width: 1100px)" srcSet={treehouseSceneAssets.tablet} />
          <img
            alt=""
            draggable="false"
            fetchPriority="high"
            src={treehouseSceneAssets.desktop}
            onError={() => setSceneImageFailed(true)}
          />
        </picture>
      )}
      <div className="treehouse-scene-tree" aria-hidden="true">
        <div className="treehouse-scene-canopy" />
        <div className="treehouse-scene-house">
          <span className="treehouse-house-window" />
          <span className="treehouse-house-door" />
        </div>
        <div className="treehouse-scene-trunk" />
        <div className="treehouse-scene-bridge" />
      </div>
      <div className="treehouse-lantern-glow" aria-hidden="true" />
      <div className="treehouse-foreground-leaves" aria-hidden="true" />

      <div className="treehouse-scene-region treehouse-scene-greeting">
        <TreehouseGreeting player={player} />
      </div>

      <div className="treehouse-scene-region treehouse-scene-utilities">
        <TreehouseNavigation
          inventoryCount={inventoryCount}
          onGoToDev={onGoToDev}
          onGoToWorld={onGoToWorld}
        />
      </div>

      <div className="treehouse-scene-region treehouse-scene-owl">
        <ProfessorOwl character={treehouseCharacters.professorOwl} />
      </div>

      <div className="treehouse-scene-region treehouse-scene-quest">
        <TreehouseQuestCard
          dailyGoal={dailyGoal}
          isLoading={isQuestLoading}
          quest={quest}
        />
      </div>

      <div className="treehouse-scene-region treehouse-scene-growth">
        <TreehouseGrowthPanel player={player} worldSummary={worldSummary} />
      </div>

      <div className="treehouse-scene-region treehouse-scene-dragon">
        <SparkDragon character={treehouseCharacters.sparkDragon} />
      </div>

      <div className="treehouse-scene-region treehouse-scene-primary-action">
        <div className="treehouse-xp-panel wooden-panel">
          <TreehouseProgressBar
            label={`Level ${player?.level ?? 1} XP`}
            max={nextLevelXp ?? undefined}
            percent={xpPercent}
            value={player?.xp ?? 0}
          />
        </div>
        <button
          className="primary-button treehouse-scene-adventure-button"
          type="button"
          onClick={onGoToWorld}
        >
          Choose Adventure
        </button>
      </div>
    </section>
  );
}
