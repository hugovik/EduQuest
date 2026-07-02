import React, { useState } from "react";
import AdventureHubPage from "./features/adventure/AdventureHubPage";
import { TreeHouseDashboard } from "./features/treehouse/TreeHouseDashboard";
import MathMountainsPage from "./features/math/MathMountainsPage";
import ReadingForestPage from "./features/reading/ReadingForestPage";
import WorldMapPage from "./features/world/WorldMapPage";
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
  const [screen, setScreen] = useState("treehouse");

  if (screen === "world") {
    return (
      <WorldMapPage
        onBack={() => setScreen("treehouse")}
        onNavigate={(nextScreen) => setScreen(nextScreen)}
      />
    );
  }

  if (screen === "math") {
    return <MathMountainsPage onBack={() => setScreen("world")} />;
  }

  if (screen === "reading") {
    return <ReadingForestPage onBack={() => setScreen("world")} />;
  }

  if (screen === "adventures") {
    return (
      <AdventureHubPage
        onBack={() => setScreen("treehouse")}
        onEnterAdventure={(route) => setScreen(route)}
      />
    );
  }

  if (screenTitles[screen]) {
    return (
      <ComingSoonScreen
        title={screenTitles[screen]}
        onBack={() => setScreen("world")}
      />
    );
  }

  return (
    <TreeHouseDashboard
      onGoToAdventures={() => setScreen("adventures")}
      onGoToMath={() => setScreen("math")}
      onGoToWorld={() => setScreen("world")}
    />
  );
}
