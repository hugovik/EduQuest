import { useState } from "react";
import { ADVENTURE_SCENES } from "../adventureScenes";

export default function useAdventureFlow(
  initialScene = ADVENTURE_SCENES.QUEST_LOG
) {
  const [scene, setScene] = useState(initialScene);

  return {
    scene,
    goTo: setScene,
  };
}