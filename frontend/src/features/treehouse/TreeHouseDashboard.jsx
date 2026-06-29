import PlayerCard from "./components/PlayerCard";
import XPBar from "./components/XPBar";
import TreeOfGrowth from "./components/TreeOfGrowth";
import QuestBoard from "./components/QuestBoard";
import DragonNest from "./components/DragonNest";
import AchievementShelf from "./components/AchievementShelf";

export function TreeHouseDashboard() {
  return (
    <main className="dashboard">

      <h1>🌳 EduQuest</h1>

      <PlayerCard />

      <XPBar />

      <TreeOfGrowth />

      <QuestBoard />

      <DragonNest />

      <AchievementShelf />

    </main>
  );
}