import { useEffect, useState } from "react";

import DashboardLayout from "../../components/DashboardLayout.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import ScienceAdventure from "./components/ScienceAdventure.jsx";
import { SCIENCE_EXPERIMENTS } from "./scienceExperiments.js";
import { SCIENCE_LESSONS } from "./scienceLessons.js";
import { getAdventureStats } from "../progress/progressService.js";
import AdventureProgressCard from "../progress/components/AdventureProgressCard.jsx";
import ProfessorNovaPanel from "./components/ProfessorNovaPanel.jsx";
import StatusBadge from "../adventure/components/StatusBadge.jsx";
import { getScienceProgress } from "../../api/scienceApi.js";
import { SCIENCE_TOPICS } from "./scienceTopics.js";


function groupExperimentsByTopic(experiments) {
  return experiments.reduce((groups, experiment) => {
    const groupName = experiment.group ?? "Other";

    if (!groups[groupName]) {
      groups[groupName] = [];
    }

    groups[groupName].push(experiment);

    return groups;
  }, {});
}

export default function ScienceLabPage({ onBack }) {
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [progressVersion, setProgressVersion] = useState(0);
  const [backendProgress, setBackendProgress] = useState(null);
  const [openTopicId, setOpenTopicId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadBackendProgress() {
      try {
        const progress = await getScienceProgress();
        if (!cancelled) {
          setBackendProgress(progress);
        }
      } catch {
        if (!cancelled) {
          setBackendProgress(null);
        }
      }
    }

    loadBackendProgress();

    return () => {
      cancelled = true;
    };
  }, [progressVersion]);

  let completedLessons = [];
  let completedCount = 0;
  let totalLessons = 0;
  let scienceXp = 0;

try {
  const stats = getAdventureStats({
    adventureKey: "science",
    lessons: SCIENCE_LESSONS,
    progressVersion,
  });

  completedLessons = stats.completedLessons;
  completedCount = stats.completedCount;
  totalLessons = stats.totalLessons;
  scienceXp = stats.xp;
} catch (error) {
  console.error("Science stats error:", error);
  throw error;
}

const backendCompletedLessons = backendProgress?.completed_experiments ?? [];
completedLessons = Array.from(new Set([...completedLessons, ...backendCompletedLessons]));
completedCount = Math.max(completedCount, backendProgress?.experiments_completed ?? completedLessons.length);
totalLessons = Math.max(totalLessons, backendProgress?.total_experiments ?? 0);
scienceXp = backendProgress?.xp_earned ?? scienceXp;

const experimentGroups = groupExperimentsByTopic(SCIENCE_EXPERIMENTS);

  if (activeLessonId) {
    return (
      <ScienceAdventure
        lessonId={activeLessonId}
        onExit={() => {
          setActiveLessonId(null);
          setProgressVersion((current) => current + 1);
        }}
      />
    );
  }

  return (
    <DashboardLayout className="science-lab-page">
      <PageHeader
        eyebrow="Science Lab"
        title="🔬 The Forgotten Science Lab"
        description="Professor Nova needs Lena's help to restart the abandoned lab beneath the Tree House."
        onBack={onBack}
        backLabel="← Back to World Map"
      />

      <ProfessorNovaPanel
          mood="excited"
          message="
        Welcome back, Lena!

        The Forgotten Science Lab has been asleep for many years.

        Every experiment you complete restores another scientific discovery.

        Let's wake the laboratory back to life!
        "
        />

            <AdventureProgressCard
                title="Science Progress"
                completed={completedCount}
                total={totalLessons}
                xp={scienceXp}
            />

      <section className="card">
        <h2>Experiment Log</h2>

        {SCIENCE_TOPICS.map((topic) => {
          const groupName = topic.title;
          const experiments = experimentGroups[topic.title] ?? [];
          const isTopicOpen = openTopicId === topic.id;
          const completedInGroup = experiments.filter((experiment) =>
            completedLessons.includes(experiment.id)
          ).length;

          const totalInGroup = experiments.length;

          const progressPercent =
            totalInGroup === 0
              ? 0
              : Math.round((completedInGroup / totalInGroup) * 100);

          return (
          <section className="science-topic-section" key={groupName}>  
            <button
              type="button"
              className="science-topic-header"
              onClick={() =>
                setOpenTopicId((current) => (current === topic.id ? null : topic.id))
              }
            >
              <div>
                <h3>
                  {topic.icon} {topic.title}
                </h3>
                <p>{topic.description}</p>
                <p>
                  {completedInGroup} / {totalInGroup} Experiments Completed
                </p>
              </div>

              <div className="science-topic-progress">
                <div
                  className="science-topic-progress-bar"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              <span className="science-topic-toggle">
                {isTopicOpen ?  "▼" : "▶"}
              </span>
            </button>

          {isTopicOpen && (
            <div className="science-experiment-grid">
              {experiments.map((experiment) => {
               const topicIndex = experiments.findIndex(
                (item) => item.id === experiment.id
              );

              const previousTopicExperiment =
                topicIndex === 0 ? null : experiments[topicIndex - 1];

              const isUnlocked =
                topicIndex === 0 ||
                completedLessons.includes(previousTopicExperiment.id);

                const isCompleted = completedLessons.includes(experiment.id);

                const hasLesson = SCIENCE_LESSONS.some(
                  (lesson) => lesson.id === experiment.id
                );

                return (
                  <article
                    className={`science-experiment-card ${
                      isUnlocked ? "is-unlocked" : "is-locked"
                    }`}
                    key={experiment.id}
                  >
                    <p className="quest-realm">{experiment.topic}</p>
                    <h3>{experiment.title}</h3>
                    
                     <StatusBadge
                        status={
                          isCompleted
                            ? "completed"
                            : isUnlocked
                              ? "new"
                              : "locked"
                        }
                      />

                    <p>{experiment.description}</p>

                    <div className="science-equipment-list">
                      {(experiment.equipment ?? []).map((item, index) => {
                        const name = typeof item === "string" ? item : item.name;
                        const icon = typeof item === "string" ? "🧪" : item.icon;

                        return (
                          <span key={`${experiment.id}-${name}-${index}`}>
                            {icon} {name}
                          </span>
                        );
                      })}
                    </div>

                    <button
                      className={isCompleted ? "secondary-button" : "primary-button"}
                      disabled={!isUnlocked || !hasLesson}
                      onClick={() => setActiveLessonId(experiment.id)}
                    >
                      {isCompleted
                        ? "Review Experiment"
                        : isUnlocked
                          ? hasLesson
                            ? "Start Experiment"
                            : "Mission Coming Soon"
                          : "Locked"}
                    </button>
                  </article>
                );
              })}
            </div>
          )}
          </section>
        );
      })}
      </section>
    </DashboardLayout>
  );
}
