import { useEffect, useState } from "react";
import { getWorldState, travelToWorldLocation } from "./api/worldApi";
import AdventureHubPage from "./features/adventure/AdventureHubPage";
import { adventurePages } from "./features/adventure/adventurePages";
import { TreeHouseDashboard } from "./features/treehouse/TreeHouseDashboard";
import WorldMapPage from "./features/world/WorldMapPage";
import {
  getResumeLocationFromWorldState,
  normalizeWorldLocation,
} from "./features/world/worldLocation";
import DevDashboardPage from "./features/dev/DevDashboardPage";
import "./styles.css";

function ComingSoonScreen({ title, onBack }) {
  return (
    <main className="dashboard">
      <button className="primary-button" type="button" onClick={onBack}>
        Back to World Map
      </button>
      <div className="card state-card">
        <h1>{title}</h1>
        <p>This region is visible on the World Map and will open in a future sprint.</p>
      </div>
    </main>
  );
}

const screenTitles = {
  geography: "Geography Island",
  music: "Music Valley",
};

export default function App() {
  const [screen, setScreen] = useState(null);
  const [worldState, setWorldState] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadWorldState() {
      try {
        const nextWorldState = await getWorldState();
        if (!cancelled) {
          setWorldState(nextWorldState);
          setScreen(getResumeLocationFromWorldState(nextWorldState));
        }
      } catch (error) {
        if (!cancelled) {
          setScreen("treehouse");
        }
      }
    }

    loadWorldState();

    return () => {
      cancelled = true;
    };
  }, []);

  async function navigateTo(nextScreen, options = {}) {
    const normalizedScreen = normalizeWorldLocation(nextScreen);
    const { allowOfflineFallback = true } = options;

    try {
      const nextWorldState = await travelToWorldLocation(normalizedScreen);
      setWorldState(nextWorldState);
    } catch (error) {
      if (!allowOfflineFallback) {
        throw error;
      }
    }

    setScreen(normalizedScreen);
    return normalizedScreen;
  }

  if (screen === null) {
    return <main className="dashboard">Loading EduQuest...</main>;
  }

  if (import.meta.env.DEV && screen === "dev") {
    return <DevDashboardPage onBack={() => setScreen("treehouse")} />;
  }

  if (screen === "world") {
    return (
      <WorldMapPage
        worldState={worldState}
        onBack={() => navigateTo("treehouse")}
        onNavigate={(nextScreen) =>
          navigateTo(nextScreen, { allowOfflineFallback: false })
        }
      />
    );
  }

  const AdventurePage = adventurePages[screen];

  if (AdventurePage) {
    return <AdventurePage onBack={() => navigateTo("world")} />;
  }

  if (screen === "adventures") {
    return (
      <AdventureHubPage
        onBack={() => navigateTo("treehouse")}
        onEnterAdventure={(route) => navigateTo(route)}
      />
    );
  }

  if (screenTitles[screen]) {
    return (
      <ComingSoonScreen
        title={screenTitles[screen]}
        onBack={() => navigateTo("world")}
      />
    );
  }

  return (
    <TreeHouseDashboard
      onGoToAdventures={() => setScreen("adventures")}
      onGoToMath={() => navigateTo("math")}
      onGoToWorld={() => navigateTo("world")}
      onGoToDev={import.meta.env.DEV ? () => setScreen("dev") : undefined}
    />
  );
}
