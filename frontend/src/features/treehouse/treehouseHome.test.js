import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

const currentDir = dirname(fileURLToPath(import.meta.url));

function readTreehouseFile(filePath) {
  return readFileSync(resolve(currentDir, filePath), "utf8");
}

export async function runTreehouseHomeTests() {
  const page = readTreehouseFile("TreehousePage.jsx");
  const dashboard = readTreehouseFile("TreeHouseDashboard.jsx");
  const scene = readTreehouseFile("components/TreehouseScene.jsx");
  const assets = readTreehouseFile("treehouseAssets.js");
  const characters = readTreehouseFile("treehouseCharacters.js");
  const professorOwl = readTreehouseFile("components/ProfessorOwl.jsx");
  const sparkDragon = readTreehouseFile("components/SparkDragon.jsx");
  const navigation = readTreehouseFile("components/TreehouseNavigation.jsx");
  const questCard = readTreehouseFile("components/TreehouseQuestCard.jsx");
  const growthPanel = readTreehouseFile("components/TreehouseGrowthPanel.jsx");
  const assetRoot = resolve(currentDir, "../../assets/treehouse");

  assert(page.includes("TreehouseScene"), "Treehouse page should render the visual scene.");
  assert(scene.includes("TreehouseGreeting"), "Treehouse scene should render the personalized greeting.");
  assert(scene.includes("ProfessorOwl"), "Treehouse scene should render Professor Owl.");
  assert(scene.includes("SparkDragon"), "Treehouse scene should render Spark Dragon.");
  assert(scene.includes("Choose Adventure"), "Treehouse scene should keep the primary adventure action.");
  assert(scene.includes("treehouse-scene-greeting"), "Treehouse scene should expose ordered scene regions.");
  assert(scene.includes("treehouse-scene-primary-action"), "Treehouse scene should expose a primary action region.");
  assert(scene.includes("treehouseSceneAssets"), "Treehouse scene should use the available scene artwork registry.");
  assert(scene.includes("sceneImageFailed"), "Treehouse scene should keep a failed-image fallback.");
  assert(assets.includes("treehouse-scene-desktop.png"), "Treehouse assets should include the desktop scene crop.");
  assert(assets.includes("treehouse-scene-mobile.png"), "Treehouse assets should include the mobile scene crop.");
  assert(assets.includes("professor-owl.png"), "Treehouse assets should include Professor Owl artwork.");
  assert(assets.includes("spark-dragon.png"), "Treehouse assets should include Spark Dragon artwork.");
  assert(existsSync(resolve(assetRoot, "backgrounds/treehouse-scene-desktop.png")), "Desktop scene asset should exist.");
  assert(existsSync(resolve(assetRoot, "backgrounds/treehouse-scene-mobile.png")), "Mobile scene asset should exist.");
  assert(existsSync(resolve(assetRoot, "characters/professor-owl.png")), "Professor Owl asset should exist.");
  assert(existsSync(resolve(assetRoot, "characters/spark-dragon.png")), "Spark Dragon asset should exist.");
  assert(characters.includes("Professor Owl"), "Treehouse characters should define Professor Owl copy.");
  assert(characters.includes("Spark Dragon"), "Treehouse characters should define Spark Dragon copy.");
  assert(professorOwl.includes("onError"), "Professor Owl should handle image failure.");
  assert(sparkDragon.includes("onError"), "Spark Dragon should handle image failure.");
  assert(page.includes("useDailyGoal"), "Treehouse page should use daily goal data.");
  assert(page.includes("useWorldProgressSummary"), "Treehouse page should use world progress data.");
  assert(dashboard.includes("TreehousePage"), "TreeHouseDashboard should delegate to the new Treehouse page.");
  assert(navigation.includes("onGoToWorld"), "Treehouse navigation should open the World Map.");
  assert(!navigation.includes("onGoToMath"), "Treehouse navigation should not add permanent subject shortcuts.");
  assert(!scene.includes("onGoToMath"), "Treehouse scene should not add permanent subject shortcuts.");
  assert(questCard.includes("Today&apos;s Quest"), "Treehouse should include a Today's Quest panel.");
  assert(questCard.includes("Correct answers"), "Today's Quest should show daily goal progress.");
  assert(growthPanel.includes("xp_progress_percent"), "Tree growth panel should use backend XP progress fields.");
  assert(growthPanel.includes("getTreeGrowthAsset"), "Tree growth panel should select stage artwork through the asset helper.");
}
