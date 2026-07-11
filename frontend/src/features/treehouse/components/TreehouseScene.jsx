import { useEffect, useMemo, useRef, useState } from "react";
import ProfessorOwl from "./ProfessorOwl";
import SparkDragon from "./SparkDragon";
import TreehouseInteractiveObject from "./TreehouseInteractiveObject";
import TreehouseGreeting from "./TreehouseGreeting";
import TreehouseGrowthPanel from "./TreehouseGrowthPanel";
import TreehouseNavigation from "./TreehouseNavigation";
import TreehouseQuestCard from "./TreehouseQuestCard";
import TreehouseShortcutPanel from "./TreehouseShortcutPanel";
import TreehouseProgressBar from "./TreehouseProgressBar";
import { treehouseSceneAssets } from "../treehouseAssets";
import { treehouseCharacters } from "../treehouseCharacters";
import {
  getProfessorOwlMessage,
  getSparkDragonMessage,
  getTreehouseInteraction,
  getTreehouseObjectStatus,
  treehouseInteractions,
} from "../treehouseInteractions";

export default function TreehouseScene({
  dailyGoal,
  inventoryCount,
  isQuestLoading,
  isShortcutContributing,
  isShortcutLoading,
  shortcutContributionError,
  shortcutError,
  shortcuts = [],
  onContributeShortcut,
  onGoToDev,
  onGoToReading,
  onGoToWorld,
  player,
  quest,
  worldSummary,
}) {
  const xpPercent = player?.xp_progress_percent ?? 0;
  const nextLevelXp = player?.next_level_xp;
  const [sceneImageFailed, setSceneImageFailed] = useState(false);
  const [activeObjectId, setActiveObjectId] = useState(null);
  const [shortcutSuccessMessage, setShortcutSuccessMessage] = useState("");
  const sceneRef = useRef(null);
  const readingShortcut = shortcuts.find(
    (shortcut) => shortcut.shortcut_id === "reading-forest-shortcut",
  );

  const objectContext = useMemo(
    () => ({
      dailyGoal,
      inventoryCount,
      player,
      quest,
      readingShortcut,
      worldSummary,
    }),
    [dailyGoal, inventoryCount, player, quest, readingShortcut, worldSummary],
  );

  const activeInteraction = activeObjectId ? getTreehouseInteraction(activeObjectId) : null;

  useEffect(() => {
    if (!activeObjectId) {
      return undefined;
    }

    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setActiveObjectId(null);
      }
    }

    function handlePointerDown(event) {
      const target = event.target;
      if (target instanceof Element && target.closest("[data-object-id]")) {
        return;
      }
      setActiveObjectId(null);
    }

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [activeObjectId]);

  function openObject(objectId) {
    setActiveObjectId((currentObjectId) => (currentObjectId === objectId ? null : objectId));
  }

  function closeObject() {
    setActiveObjectId(null);
  }

  function runObjectAction(objectId) {
    if (objectId === "world-map" || objectId === "inventory") {
      onGoToWorld?.();
      return;
    }

    if (objectId === "reading-forest-shortcut" && readingShortcut?.completed) {
      onGoToReading?.();
      return;
    }

    if (objectId === "settings") {
      onGoToDev?.();
      return;
    }

    closeObject();
  }

  async function buildReadingShortcut() {
    if (!onContributeShortcut || !readingShortcut) {
      return;
    }

    setShortcutSuccessMessage("");
    const nextShortcut = await onContributeShortcut(readingShortcut.shortcut_id);
    setShortcutSuccessMessage(
      nextShortcut.completed
        ? "We did it! The shortcut is glowing."
        : "Look! We built another part.",
    );
  }

  function getPopoverChildren(objectId) {
    if (objectId === "daily-quest" && dailyGoal) {
      const current = dailyGoal.current_correct_answers ?? 0;
      const target = dailyGoal.target_correct_answers ?? 10;
      return (
        <p>
          Today&apos;s quest is {current} of {target} answers complete.
        </p>
      );
    }

    if (objectId === "tree-growth") {
      return (
        <p>
          {player?.xp ?? 0} XP earned. Next growth target: {nextLevelXp ?? 100} XP.
        </p>
      );
    }

    if (objectId === "professor-owl") {
      return <p>{getProfessorOwlMessage(objectContext)}</p>;
    }

    if (objectId === "spark-dragon") {
      return <p>{getSparkDragonMessage(objectContext)}</p>;
    }

    if (objectId === "inventory") {
      return <p>Open the World Map to view your collected items panel.</p>;
    }

    if (objectId === "reading-forest-shortcut") {
      if (isShortcutLoading) {
        return <p>Loading shortcut construction...</p>;
      }

      if (shortcutError) {
        return <p>Shortcut construction is unavailable right now.</p>;
      }

      return (
        <>
          {shortcutSuccessMessage ? (
            <p className="treehouse-shortcut-success">{shortcutSuccessMessage}</p>
          ) : null}
          <TreehouseShortcutPanel
            error={shortcutContributionError}
            isSubmitting={isShortcutContributing}
            shortcut={readingShortcut}
            onBuild={buildReadingShortcut}
            onEnter={onGoToReading}
          />
        </>
      );
    }

    return null;
  }

  function renderInteractiveObject(id, children, className = "", options = {}) {
    const interaction = getTreehouseInteraction(id);
    const disabled = id === "settings" && !onGoToDev;

    return (
      <TreehouseInteractiveObject
        actionLabel={
          id === "reading-forest-shortcut" && readingShortcut?.completed
            ? "Enter Reading Forest"
            : interaction.actionLabel
        }
        className={className}
        description={interaction.description}
        disabled={disabled}
        id={id}
        isOpen={activeObjectId === id}
        label={interaction.label}
        popoverChildren={getPopoverChildren(id)}
        status={getTreehouseObjectStatus(id, objectContext)}
        useOverlay={options.useOverlay}
        onAction={() => runObjectAction(id)}
        onActivate={() => openObject(id)}
        onClose={closeObject}
      >
        {children}
      </TreehouseInteractiveObject>
    );
  }

  const mobileInteractions = treehouseInteractions
    .slice()
    .sort((first, second) => first.mobileOrder - second.mobileOrder);

  return (
    <section
      ref={sceneRef}
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

      <div className="treehouse-scene-hotspots" aria-label="Interactive Treehouse objects">
        {renderInteractiveObject(
          "world-map",
          <span className="treehouse-hotspot-icon" aria-hidden="true">🧭</span>,
          "treehouse-hotspot treehouse-hotspot-map",
        )}
        {renderInteractiveObject(
          "inventory",
          <span className="treehouse-hotspot-icon" aria-hidden="true">🎒</span>,
          "treehouse-hotspot treehouse-hotspot-inventory",
        )}
        {renderInteractiveObject(
          "settings",
          <span className="treehouse-hotspot-icon" aria-hidden="true">⚙️</span>,
          "treehouse-hotspot treehouse-hotspot-settings",
        )}
        {renderInteractiveObject(
          "reading-forest-shortcut",
          <span className="treehouse-shortcut-object-visual" data-shortcut-status={readingShortcut?.status ?? "locked"} data-shortcut-stage={readingShortcut?.stage ?? 0} aria-hidden="true">
            📚
          </span>,
          "treehouse-hotspot treehouse-hotspot-reading-shortcut",
        )}
      </div>

      <div className="treehouse-scene-region treehouse-scene-greeting">
        <TreehouseGreeting player={player} />
      </div>

      <div className="treehouse-scene-region treehouse-scene-utilities">
        <TreehouseNavigation
          inventoryCount={inventoryCount}
          onGoToDev={onGoToDev}
          onGoToWorld={onGoToWorld}
          onOpenObject={openObject}
        />
      </div>

      <div className="treehouse-scene-region treehouse-scene-owl">
        {renderInteractiveObject(
          "professor-owl",
          <ProfessorOwl
            character={{
              ...treehouseCharacters.professorOwl,
              message: getProfessorOwlMessage(objectContext),
            }}
            isActive={activeObjectId === "professor-owl"}
            onInteract={() => openObject("professor-owl")}
          />,
          "treehouse-character-object",
          { useOverlay: false },
        )}
      </div>

      <div className="treehouse-scene-region treehouse-scene-quest">
        {renderInteractiveObject(
          "daily-quest",
          <TreehouseQuestCard
            dailyGoal={dailyGoal}
            isLoading={isQuestLoading}
            quest={quest}
          />,
          "treehouse-card-object",
        )}
      </div>

      <div className="treehouse-scene-region treehouse-scene-growth">
        {renderInteractiveObject(
          "tree-growth",
          <TreehouseGrowthPanel player={player} worldSummary={worldSummary} />,
          "treehouse-card-object",
        )}
      </div>

      <div className="treehouse-scene-region treehouse-scene-dragon">
        {renderInteractiveObject(
          "spark-dragon",
          <SparkDragon
            character={{
              ...treehouseCharacters.sparkDragon,
              message: getSparkDragonMessage(objectContext),
            }}
            isActive={activeObjectId === "spark-dragon"}
            onInteract={() => openObject("spark-dragon")}
          />,
          "treehouse-character-object",
          { useOverlay: false },
        )}
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

      <div className="treehouse-mobile-object-list" aria-label="Interactive Treehouse objects">
        {mobileInteractions.map((interaction) => {
          const disabled = interaction.id === "settings" && !onGoToDev;
          return (
            <button
              aria-controls={activeObjectId === interaction.id ? `${interaction.id}-popover` : undefined}
              aria-expanded={activeObjectId === interaction.id}
              className="treehouse-mobile-object-card"
              data-object-state={activeObjectId === interaction.id ? "open" : "default"}
              disabled={disabled}
              key={interaction.id}
              type="button"
              onClick={() => openObject(interaction.id)}
            >
              <span aria-hidden="true">{interaction.icon}</span>
              <span>
                <strong>{interaction.label}</strong>
                <small>{getTreehouseObjectStatus(interaction.id, objectContext) ?? interaction.description}</small>
              </span>
            </button>
          );
        })}
      </div>

      {activeInteraction ? (
        <div className="treehouse-global-popover" data-object-id={activeObjectId}>
          <div className="treehouse-global-popover-inner">
            <strong>{activeInteraction.label}</strong>
            <p>{activeInteraction.description}</p>
            {getTreehouseObjectStatus(activeObjectId, objectContext) ? (
              <p className="treehouse-object-status">
                {getTreehouseObjectStatus(activeObjectId, objectContext)}
              </p>
            ) : null}
            {getPopoverChildren(activeObjectId)}
            <div className="treehouse-popover-actions">
              <button className="secondary-button" type="button" onClick={closeObject}>
                Close
              </button>
              <button className="primary-button" type="button" onClick={() => runObjectAction(activeObjectId)}>
                {activeInteraction.actionLabel}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
