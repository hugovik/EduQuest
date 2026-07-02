import WorldRegionNode from "./components/WorldRegionNode";
import { useAdventureProgressSummary } from "./hooks/useAdventureProgressSummary";
import { useAdventureUnlocks } from "./hooks/useAdventureUnlocks";
import { worldRegions } from "./worldRegionConfig";

export default function WorldMapPage({ onBack, onNavigate }) {
  const {
    data: progressSummary = {},
    isLoading: progressLoading,
    error: progressError,
  } = useAdventureProgressSummary();
  const {
    data: unlocks = {},
    isLoading: unlocksLoading,
    error: unlocksError,
  } = useAdventureUnlocks();

  if (progressLoading || unlocksLoading) {
    return <main className="dashboard world-map-page">Loading World Map...</main>;
  }

  if (progressError || unlocksError) {
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
      </header>

      <section className="world-map-grid" aria-label="EduQuest world regions">
        {worldRegions.map((region) => (
          <WorldRegionNode
            key={region.id}
            progress={progressSummary[region.adventureType]}
            region={region}
            unlock={unlocks[region.adventureType]}
            onEnter={onNavigate}
          />
        ))}
      </section>
    </main>
  );
}
