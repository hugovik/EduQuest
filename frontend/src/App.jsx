import React, { useEffect, useState } from "react";
import { getWorldState, travelToWorldLocation } from "./api/worldApi";
import AdventureHubPage from "./features/adventure/AdventureHubPage";
import { TreeHouseDashboard } from "./features/treehouse/TreeHouseDashboard";
import MathMountainsPage from "./features/math/MathMountainsPage";
import ReadingForestPage from "./features/reading/ReadingForestPage";
import WorldMapPage from "./features/world/WorldMapPage";
import { getResumeLocationFromWorldState, normalizeWorldLocation } from "./features/world/worldLocation";
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
  writing: "Writing Kingdom",
  science: "Science Lab",
  geography: "Geography Harbor",
  music: "Music Meadow",
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

  if (screen === "world") {
    return (
      <WorldMapPage
        worldState={worldState}
        onBack={() => navigateTo("treehouse")}
        onNavigate={(nextScreen) => navigateTo(nextScreen, { allowOfflineFallback: false })}
      />
    );
  }

  if (screen === "math") {
    return <MathMountainsPage onBack={() => navigateTo("world")} />;
  }

  if (screen === "reading") {
    return <ReadingForestPage onBack={() => navigateTo("world")} />;
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
    />
  );
}
