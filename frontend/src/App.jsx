import React, { useState } from "react";
import { TreeHouseDashboard } from "./features/treehouse/TreeHouseDashboard";
import MathMountainsPage from "./features/math/MathMountainsPage";
import "./styles.css";

export default function App() {
  const [screen, setScreen] = useState("treehouse");

  if (screen === "math") {
    return <MathMountainsPage onBack={() => setScreen("treehouse")} />;
  }

  return <TreeHouseDashboard onGoToMath={() => setScreen("math")} />;
}