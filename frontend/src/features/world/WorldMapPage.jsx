import { useState } from "react";
import WorldRegionNode from "./components/WorldRegionNode";
import { useAdventureProgressSummary } from "./hooks/useAdventureProgressSummary";
import { useAdventureUnlocks } from "./hooks/useAdventureUnlocks";
import { worldRegions } from "./worldRegionConfig";

const locationLabels = {
  treehouse: "Treehouse",
  world: "World Map",
  math: "Math Mountains",
  reading: "Reading Forest",
  writing: "Writing Kingdom",
  science: "Science Lab",
  geography: "Geography Harbor",
  music: "Music Meadow",
};

function formatLocation(location) {
  return locationLabels[location] ?? "EduQuest";
}

function formatSourceRegion(sourceRegion) {
  return formatLocation(sourceRegion);
}

function formatVisitedRegions(visitedRegions = []) {
  if (visitedRegions.length === 0) {
    return "No regions visited yet";
  }

  return visitedRegions.map(formatLocation).join(", ");
}

function formatQuestStatus(status) {
  if (status === "completed") {
    return "World restored";
  }

  if (status === "in_progress") {
    return "Quest in progress";
  }

  return "Ready to begin";
}

function getRegionQuestStatus(overarchingQuest, adventureType) {
  const regionSteps = overarchingQuest?.steps?.filter((step) => step.region === adventureType) ?? [];

  if (regionSteps.length === 0) {
    return null;
  }

  const completedSteps = regionSteps.filter((step) => step.status === "completed").length;

  if (completedSteps === regionSteps.length) {
    return "completed";
  }

  if (completedSteps > 0) {
    return "in_progress";
  }

  return "not_started";
}

function findRegionConfig(region) {
  return worldRegions.find((item) => (
    item.screen === region.region_key ||
    item.adventureType === region.adventure_type ||
    item.id === region.region_key
  ));
}

function getDisplayRegions(worldState) {
  if (!worldState?.regions?.length) {
    return worldRegions;
  }

  return worldState.regions.map((region) => {
    const config = findRegionConfig(region);

    return {
      ...config,
      id: config?.id ?? region.region_key,
      title: region.title,
      adventureType: region.adventure_type,
      screen: region.region_key,
      description: config?.description ?? region.unlock_requirement ?? "Keep exploring EduQuest.",
      icon: config?.icon ?? "✨",
      enabled: region.is_available,
      backendStatus: region.status,
      isUnlocked: region.is_unlocked,
      isAvailable: region.is_available,
      comingSoon: region.coming_soon,
      lockReason: region.lock_reason,
      unlockRequirement: region.unlock_requirement,
      progress: region.progress,
    };
  });
}

export default function WorldMapPage({ worldState, onBack, onNavigate }) {
  const [travelingTo, setTravelingTo] = useState(null);
  const [travelError, setTravelError] = useState("");
  const {
    data: progressSummaryResponse = {},
    isLoading: progressLoading,
    error: progressError,
  } = useAdventureProgressSummary();
  const {
    data: unlocksResponse = {},
    isLoading: unlocksLoading,
    error: unlocksError,
  } = useAdventureUnlocks();
  const progressSummary = worldState?.progress_summary ?? progressSummaryResponse;
  const unlocks = worldState?.unlocks ?? unlocksResponse;
  const overarchingQuest = worldState?.overarching_quest;
  const questSteps = overarchingQuest?.steps ?? [];
  const questRewardItems = overarchingQuest?.reward_items ?? [];
  const questProgressPercent = overarchingQuest?.progress_percent ?? 0;
  const displayRegions = getDisplayRegions(worldState);
  const visitedRegions = worldState?.visited_regions ?? [];
  const currentLocation = worldState?.active_location ?? "world";
  const currentLocationLabel = formatLocation(currentLocation);

  async function handleNavigate(nextScreen) {
    const destinationLabel = formatLocation(nextScreen);
    setTravelError("");
    setTravelingTo(nextScreen);

    try {
      await onNavigate(nextScreen);
    } catch (error) {
      setTravelError(error.message || `Travel to ${destinationLabel} is not available yet.`);
    } finally {
      setTravelingTo(null);
    }
  }

  if ((progressLoading || unlocksLoading) && !worldState) {
    return <main className="dashboard world-map-page">Loading World Map...</main>;
  }

  if ((progressError || unlocksError) && !worldState) {
    return (
      <main className="dashboard world-map-page">
        <button className="primary-button" type="button" onClick={onBack}>
          Back to Treehouse
        </button>
        <div className="card state-card state-card-error">
          <h1>World Map</h1>
          <p>World progress is unavailable right now.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="dashboard world-map-page">
      <button className="primary-button" type="button" onClick={onBack}>
        Back to Treehouse
      </button>

      <header className="world-map-header">
        <p className="quest-realm">EduQuest World Engine</p>
        <h1>🗺️ World Map</h1>
        <p>Choose a region, follow your progress, and open new learning worlds.</p>
        <strong className="world-current-location-label">Current location: {currentLocationLabel}</strong>
      </header>

      {(travelingTo || travelError) && (
        <section
          aria-live="polite"
          className={`card world-travel-feedback${travelError ? " world-travel-feedback-error" : ""}`}
        >
          {travelingTo ? (
            <p>Traveling to {formatLocation(travelingTo)}...</p>
          ) : (
            <p>{travelError}</p>
          )}
        </section>
      )}

      {worldState && (
        <section className="card world-state-card" aria-label={`Current location: ${currentLocationLabel}`}>
          <div>
            <p className="quest-realm">Current Location</p>
            <h2>{formatLocation(worldState.active_location)}</h2>
          </div>
          <div className="world-state-meta">
            <span>Last region: {worldState.last_region ? formatLocation(worldState.last_region) : "None yet"}</span>
            <span>Visited: {formatVisitedRegions(worldState.visited_regions)}</span>
            <span>{worldState.visited_regions?.length ?? 0} visited region{worldState.visited_regions?.length === 1 ? "" : "s"}</span>
          </div>
        </section>
      )}

      <section className="world-overview-grid" aria-label="World quest and inventory">
      {overarchingQuest && (
        <section className="card world-quest-card" aria-label="Main world quest">
          <div className="world-quest-header">
            <div>
              <p className="quest-realm">{formatQuestStatus(overarchingQuest.status)}</p>
              <h2>{overarchingQuest.title}</h2>
              <p>{overarchingQuest.description}</p>
            </div>
            <div className="world-quest-progress-badge">
              <strong>{questProgressPercent}%</strong>
              <span>restored</span>
            </div>
          </div>

          <div className="world-region-progress" aria-label="World quest progress">
            <div className="world-region-progress-bar">
              <div
                className="world-region-progress-fill"
                style={{ width: `${questProgressPercent}%` }}
              />
            </div>
          </div>

          <div className="world-quest-steps">
            {questSteps.map((step) => (
              <div
                className={`world-quest-step world-quest-step-${step.status}`}
                key={step.key}
              >
                <span aria-hidden="true">{step.status === "completed" ? "✓" : "○"}</span>
                <div>
                  <strong>{step.title}</strong>
                  <small>{step.description}</small>
                </div>
              </div>
            ))}
          </div>

          <div className="world-quest-reward">
            <span>Reward: {overarchingQuest.reward_xp} XP</span>
            {questRewardItems.map((item) => (
              <span key={item.item_key}>{item.item_name}</span>
            ))}
          </div>
        </section>
      )}

      {worldState?.inventory ? (
        <section className="card world-inventory-card" aria-label="World inventory">
          <div>
            <p className="quest-realm">Inventory</p>
            <h2>Collected Items</h2>
          </div>
          {worldState.inventory.items?.length > 0 ? (
            <div className="world-inventory-list">
              {worldState.inventory.items.map((item) => (
                <article className="world-inventory-item" key={item.item_key}>
                  <div>
                    <strong>{item.item_name}</strong>
                    <small>{item.description}</small>
                  </div>
                  <span>Qty {item.quantity}</span>
                  <span>{formatSourceRegion(item.source_region)}</span>
                </article>
              ))}
            </div>
          ) : (
            <p>No items yet. Complete quests to collect rewards.</p>
          )}
        </section>
      ) : (
        <section className="card world-inventory-card" aria-label="World inventory">
          <div>
            <p className="quest-realm">Inventory</p>
            <h2>Collected Items</h2>
          </div>
          <p>No items yet. Complete quests to collect rewards.</p>
        </section>
      )}
      </section>

      <section className="world-region-map" aria-label="Connected EduQuest world regions">
        {displayRegions.map((region) => (
          <WorldRegionNode
            key={region.id}
            currentLocation={currentLocation}
            isTraveling={travelingTo !== null}
            progress={region.progress ?? progressSummary[region.adventureType]}
            questStatus={getRegionQuestStatus(overarchingQuest, region.adventureType)}
            region={region}
            travelingTo={travelingTo}
            unlock={unlocks[region.adventureType]}
            visited={visitedRegions.includes(region.screen)}
            onEnter={handleNavigate}
          />
        ))}
      </section>
    </main>
  );
}
