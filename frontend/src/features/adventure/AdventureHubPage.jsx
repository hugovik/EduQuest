import { useQuery } from "@tanstack/react-query";
import { getLearningPreferences } from "../../api/learningPreferencesApi";
import { queryKeys } from "../../api/queryKeys";
import { usePlayer } from "../treehouse/hooks/usePlayer";
import { getAdventureLevelConfig } from "../learning/learningLevelConfig";
import { adventures } from "./adventureConfig";
import { useAdventureProgressSummary } from "./hooks/useAdventureProgressSummary";

const statusLabels = {
  not_started: "Not started yet",
  in_progress: "Adventure in progress",
  completed: "Completed",
};

function getPreference(preferences = [], adventureType) {
  return preferences.find((preference) => preference.adventure_type === adventureType);
}

function getLevelLabel(level) {
  return level.source === "override"
    ? `Challenge Level ${level.effectiveLevel}`
    : `Using Grade ${level.effectiveLevel} Level`;
}

function getQuestProgressLabel(progress) {
  if (!progress || progress.total_quests <= 0) {
    return "Not started yet";
  }

  return `${progress.completed_quests} / ${progress.total_quests} quests complete`;
}

function getProgressPercent(progress) {
  if (!progress || progress.total_quests <= 0) {
    return 0;
  }

  return Math.min(
    100,
    Math.round((progress.completed_quests / progress.total_quests) * 100)
  );
}

export default function AdventureHubPage({ onBack, onEnterAdventure }) {
  const { data: player, isLoading: playerLoading, error: playerError } = usePlayer();
  const {
    data: preferences = [],
    isLoading: preferencesLoading,
    error: preferencesError,
  } = useQuery({
    queryKey: queryKeys.learningPreferences,
    queryFn: getLearningPreferences,
  });
  const {
    progressSummary,
    loading: progressLoading,
    error: progressError,
  } = useAdventureProgressSummary();

  if (playerLoading || preferencesLoading || progressLoading) {
    return <main className="dashboard">Loading Adventure Hub...</main>;
  }

  if (playerError || preferencesError) {
    return <main className="dashboard">Unable to load Adventure Hub.</main>;
  }

  return (
    <main className="dashboard adventure-hub-page">
      <button className="primary-button" onClick={onBack}>
        Back to Tree House
      </button>

      <header className="adventure-hub-header">
        <p className="quest-realm">World Selection</p>
        <h1>🧭 Adventure Hub</h1>
        <p>Choose a learning world and begin today&apos;s quest.</p>
      </header>

      <section className="adventure-grid" aria-label="Learning worlds">
        {adventures.map((adventure) => {
          const preference = getPreference(preferences, adventure.id);
          const level = getAdventureLevelConfig({
            adventureType: adventure.id,
            childGrade: player?.grade,
            overrideLevel: preference?.override_level ?? null,
          });
          const progress = progressSummary?.[adventure.id];
          const statusLabel = statusLabels[progress?.status] ?? "Not started yet";
          const progressPercent = getProgressPercent(progress);

          return (
            <article
              className={`card adventure-card${!adventure.enabled ? " adventure-card-disabled" : ""}`}
              key={adventure.id}
            >
              <div className="adventure-card-icon" aria-hidden="true">
                {adventure.icon}
              </div>
              <div>
                <p className="quest-realm">{adventure.status}</p>
                <h2>{adventure.name}</h2>
                <p>{adventure.description}</p>
              </div>

              <div className="adventure-card-meta">
                <span>{getLevelLabel(level)}</span>
                {progressError ? (
                  <span>Progress unavailable</span>
                ) : (
                  <>
                    <span>{statusLabel}</span>
                    <span>{getQuestProgressLabel(progress)}</span>
                    <span>{progress?.xp_earned ?? 0} XP earned</span>
                    {progress?.total_quests > 0 && (
                      <div className="adventure-progress-bar" aria-hidden="true">
                        <div
                          className="adventure-progress-fill"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    )}
                  </>
                )}
              </div>

              <button
                className="primary-button"
                type="button"
                disabled={!adventure.enabled}
                onClick={() => onEnterAdventure(adventure.route)}
              >
                {adventure.enabled ? "Enter" : "Coming Soon"}
              </button>
            </article>
          );
        })}
      </section>
    </main>
  );
}
