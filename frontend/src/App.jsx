import React, { useState } from "react";
import AdventureHubPage from "./features/adventure/AdventureHubPage";
import { TreeHouseDashboard } from "./features/treehouse/TreeHouseDashboard";
import MathMountainsPage from "./features/math/MathMountainsPage";
import "./styles.css";

export default function App() {
  const [screen, setScreen] = useState("treehouse");

  if (screen === "math") {
    return <MathMountainsPage onBack={() => setScreen("adventures")} />;
  }

  if (screen === "adventures") {
    return (
      <AdventureHubPage
        onBack={() => setScreen("treehouse")}
        onEnterAdventure={(route) => setScreen(route)}
      />
    );
  }

  return (
    <TreeHouseDashboard
      onGoToAdventures={() => setScreen("adventures")}
      onGoToMath={() => setScreen("math")}
    />
  );
}
