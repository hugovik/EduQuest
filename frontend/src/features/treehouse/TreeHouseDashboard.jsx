import PlayerCard from "./components/PlayerCard";
import XPBar from "./components/XPBar";
import TreeOfGrowth from "./components/TreeOfGrowth";
import QuestBoard from "./components/QuestBoard";
import DragonNest from "./components/DragonNest";
import AchievementShelf from "./components/AchievementShelf";

import { usePlayer } from "./hooks/usePlayer";
import { useQuests } from "./hooks/useQuests";
import { useProgressSummary } from "./hooks/useProgressSummary";

export function TreeHouseDashboard({ onGoToMath }) {
  const { data: player, isLoading, error } = usePlayer();
  const { data: quests, isLoading: questsLoading } = useQuests();
  const {
    data: progressSummary,
    isLoading: progressSummaryLoading,
    error: progressSummaryError,
  } = useProgressSummary();

  if (isLoading) {
    return <main className="dashboard">Loading Tree House...</main>;
  }

  if (error) {
    return <main className="dashboard">Unable to load Tree House.</main>;
  }

  return (
    <main className="dashboard">
      <h1>🌳 EduQuest</h1>

      <PlayerCard player={player} />

      <XPBar player={player} />

      <TreeOfGrowth player={player} />

      <QuestBoard quest={quests?.[0]} isLoading={questsLoading} onGoToMath={onGoToMath} />

      <DragonNest />

      {progressSummaryLoading ? (
        <div className="card state-card" role="status">
          <h2>🏆 Achievements</h2>
          <p>Loading progress...</p>
        </div>
      ) : progressSummaryError ? (
        <div className="card state-card state-card-error" role="status">
          <h2>🏆 Achievements</h2>
          <p>Unable to load progress right now.</p>
        </div>
      ) : (
        <AchievementShelf achievements={progressSummary?.achievements ?? []} />
      )}
    </main>
  );
}
