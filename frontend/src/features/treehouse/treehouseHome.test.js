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
  const interactiveObject = readTreehouseFile("components/TreehouseInteractiveObject.jsx");
  const objectPopover = readTreehouseFile("components/TreehouseObjectPopover.jsx");
  const shortcutPanel = readTreehouseFile("components/TreehouseShortcutPanel.jsx");
  const interactions = readTreehouseFile("treehouseInteractions.js");
  const shortcutApi = readTreehouseFile("../../api/treehouseShortcutsApi.js");
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
  assert(scene.includes("activeObjectId"), "Treehouse scene should coordinate the active object popover.");
  assert(scene.includes("Escape"), "Treehouse scene should close the active object with Escape.");
  assert(scene.includes("treehouse-mobile-object-list"), "Treehouse scene should expose explicit mobile object controls.");
  assert(scene.includes("treehouse-scene-hotspots"), "Treehouse scene should expose desktop scene hotspots.");
  assert(scene.includes('"world-map"'), "Treehouse scene should include an interactive World Map object.");
  assert(scene.includes('"inventory"'), "Treehouse scene should include an interactive inventory object.");
  assert(scene.includes('"daily-quest"'), "Treehouse scene should include an interactive quest object.");
  assert(scene.includes('"tree-growth"'), "Treehouse scene should include an interactive growth object.");
  assert(scene.includes('"professor-owl"'), "Treehouse scene should include an interactive Professor Owl object.");
  assert(scene.includes('"spark-dragon"'), "Treehouse scene should include an interactive Spark Dragon object.");
  assert(scene.includes('"settings"'), "Treehouse scene should include an interactive settings object.");
  assert(scene.includes('"reading-forest-shortcut"'), "Treehouse scene should include the Reading Forest shortcut object.");
  assert(scene.includes("TreehouseShortcutPanel"), "Treehouse scene should render shortcut construction details.");
  assert(scene.includes("readingShortcut?.completed"), "Incomplete shortcut should not navigate directly to Reading Forest.");
  assert(scene.includes("onContributeShortcut"), "Treehouse scene should call backend shortcut contribution.");
  assert(assets.includes("treehouse-scene-desktop.jpg"), "Treehouse assets should include the desktop scene crop.");
  assert(assets.includes("treehouse-scene-mobile.jpg"), "Treehouse assets should include the mobile scene crop.");
  assert(assets.includes("professor-owl.jpg"), "Treehouse assets should include Professor Owl artwork.");
  assert(assets.includes("spark-dragon.jpg"), "Treehouse assets should include Spark Dragon artwork.");
  assert(existsSync(resolve(assetRoot, "backgrounds/treehouse-scene-desktop.jpg")), "Desktop scene asset should exist.");
  assert(existsSync(resolve(assetRoot, "backgrounds/treehouse-scene-mobile.jpg")), "Mobile scene asset should exist.");
  assert(existsSync(resolve(assetRoot, "characters/professor-owl.jpg")), "Professor Owl asset should exist.");
  assert(existsSync(resolve(assetRoot, "characters/spark-dragon.jpg")), "Spark Dragon asset should exist.");
  assert(characters.includes("Professor Owl"), "Treehouse characters should define Professor Owl copy.");
  assert(characters.includes("Spark Dragon"), "Treehouse characters should define Spark Dragon copy.");
  assert(professorOwl.includes("onError"), "Professor Owl should handle image failure.");
  assert(sparkDragon.includes("onError"), "Spark Dragon should handle image failure.");
  assert(page.includes("useDailyGoal"), "Treehouse page should use daily goal data.");
  assert(page.includes("useWorldProgressSummary"), "Treehouse page should use world progress data.");
  assert(dashboard.includes("TreehousePage"), "TreeHouseDashboard should delegate to the new Treehouse page.");
  assert(navigation.includes("onGoToWorld"), "Treehouse navigation should open the World Map.");
  assert(navigation.includes("onOpenObject"), "Treehouse navigation should be able to open object popovers.");
  assert(!navigation.includes("onGoToMath"), "Treehouse navigation should not add permanent subject shortcuts.");
  assert(!scene.includes("onGoToMath"), "Treehouse scene should not add permanent subject shortcuts.");
  assert(scene.includes("readingShortcut?.completed"), "Treehouse scene should guard Reading Forest shortcut navigation behind completion.");
  assert(!scene.includes("onGoToWriting"), "Treehouse scene should not add direct Writing Kingdom shortcuts.");
  assert(!scene.includes("onGoToScience"), "Treehouse scene should not add direct Science Lab shortcuts.");
  assert(!scene.includes('"math-mountains-shortcut"'), "Treehouse scene should not add a Math shortcut yet.");
  assert(!scene.includes('"writing-kingdom-shortcut"'), "Treehouse scene should not add a Writing shortcut yet.");
  assert(!scene.includes('"science-lab-shortcut"'), "Treehouse scene should not add a Science shortcut yet.");
  assert(questCard.includes("Today&apos;s Quest"), "Treehouse should include a Today's Quest panel.");
  assert(questCard.includes("Correct answers"), "Today's Quest should show daily goal progress.");
  assert(growthPanel.includes("xp_progress_percent"), "Tree growth panel should use backend XP progress fields.");
  assert(growthPanel.includes("getTreeGrowthAsset"), "Tree growth panel should select stage artwork through the asset helper.");
  assert(interactiveObject.includes("aria-expanded"), "Interactive objects should expose expanded state.");
  assert(interactiveObject.includes("disabled"), "Interactive objects should support disabled state.");
  assert(interactiveObject.includes("TreehouseObjectPopover"), "Interactive objects should reuse the shared popover.");
  assert(objectPopover.includes("role=\"dialog\""), "Object popovers should use a dialog role.");
  assert(objectPopover.includes("onClose"), "Object popovers should be dismissible.");
  assert(interactions.includes("treehouseInteractions"), "Treehouse interactions should be registry-driven.");
  assert(interactions.includes("reading-forest-shortcut"), "Treehouse interactions should register the Reading shortcut.");
  assert(interactions.includes("getProfessorOwlMessage"), "Professor Owl messages should stay in interaction configuration.");
  assert(interactions.includes("getSparkDragonMessage"), "Spark Dragon messages should stay in interaction configuration.");
  assert(shortcutPanel.includes("Build Next Stage"), "Shortcut panel should expose construction action copy.");
  assert(shortcutPanel.includes("owned"), "Shortcut panel should render backend resource quantity.");
  assert(shortcutPanel.includes("current_progress"), "Shortcut panel should render backend progress quantity.");
  assert(shortcutApi.includes("/treehouse/shortcuts"), "Shortcut API should use backend Treehouse shortcut endpoints.");
}
