import AchievementShelf from "./components/AchievementShelf";
import TreehouseScene from "./components/TreehouseScene";
import WorldAdventureSummary from "./components/WorldAdventureSummary";
import { useDailyGoal } from "../adventure/hooks/useDailyGoal";
import { usePlayer } from "./hooks/usePlayer";
import { useProgressSummary } from "./hooks/useProgressSummary";
import { useQuests } from "./hooks/useQuests";
import { useTreehouseShortcuts } from "./hooks/useTreehouseShortcuts";
import { useWorldProgressSummary } from "./hooks/useWorldProgressSummary";

export default function TreehousePage({ onGoToDev, onGoToReading, onGoToWorld }) {
  const { data: player, isLoading: playerLoading, error: playerError } = usePlayer();
  const { data: quests, isLoading: questsLoading } = useQuests();
  const {
    dailyGoal,
    loading: dailyGoalLoading,
  } = useDailyGoal();
  const {
    data: worldProgressSummary,
    isLoading: worldProgressLoading,
    error: worldProgressError,
  } = useWorldProgressSummary();
  const {
    data: progressSummary,
    isLoading: progressSummaryLoading,
    error: progressSummaryError,
  } = useProgressSummary();
  const {
    contribute,
    contributionError,
    error: shortcutsError,
    isContributing,
    loading: shortcutsLoading,
    shortcuts,
  } = useTreehouseShortcuts();

  if (playerLoading) {
    return <main className="dashboard treehouse-page">Loading Treehouse...</main>;
  }

  if (playerError) {
    return <main className="dashboard treehouse-page">Unable to load Treehouse.</main>;
  }

  const inventoryCount = worldProgressSummary?.inventory_count ?? 0;

  return (
    <main className="dashboard treehouse-page">
      <TreehouseScene
        dailyGoal={dailyGoal}
        inventoryCount={inventoryCount}
        isQuestLoading={dailyGoalLoading || questsLoading}
        isShortcutLoading={shortcutsLoading}
        shortcutError={shortcutsError}
        shortcuts={shortcuts}
        shortcutContributionError={contributionError}
        isShortcutContributing={isContributing}
        onContributeShortcut={contribute}
        onGoToDev={onGoToDev}
        onGoToReading={onGoToReading}
        onGoToWorld={onGoToWorld}
        player={player}
        quest={quests?.[0]}
        worldSummary={worldProgressSummary}
      />

      <section className="treehouse-dashboard-strip" aria-label="Treehouse details">
        <WorldAdventureSummary
          error={worldProgressError}
          isLoading={worldProgressLoading}
          summary={worldProgressSummary}
          onOpenWorld={onGoToWorld}
        />

        {progressSummaryLoading ? (
          <section className="treehouse-card state-card" role="status">
            <h2>🏆 Badges</h2>
            <p>Loading progress...</p>
          </section>
        ) : progressSummaryError ? (
          <section className="treehouse-card state-card state-card-error" role="status">
            <h2>🏆 Badges</h2>
            <p>Unable to load progress right now.</p>
          </section>
        ) : (
          <AchievementShelf achievements={progressSummary?.achievements ?? []} />
        )}
      </section>
    </main>
  );
}
