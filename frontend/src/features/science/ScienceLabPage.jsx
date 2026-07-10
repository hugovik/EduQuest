import { useEffect, useState } from "react";

import DashboardLayout from "../../components/DashboardLayout.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import ScienceAdventure from "./components/ScienceAdventure.jsx";
import ScienceTopicReview from "./components/ScienceTopicReview.jsx";
import { SCIENCE_EXPERIMENTS } from "./scienceExperiments.js";
import { SCIENCE_LESSONS } from "./scienceLessons.js";
import AdventureProgressCard from "../progress/components/AdventureProgressCard.jsx";
import ProfessorNovaPanel from "./components/ProfessorNovaPanel.jsx";
import StatusBadge from "../adventure/components/StatusBadge.jsx";
import { getScienceExperiments, getScienceProgress } from "../../api/scienceApi.js";
import { SCIENCE_TOPICS } from "./scienceTopics.js";
import {
  buildScienceExperiments,
  groupScienceExperimentsByTopic,
  isScienceExperimentUnlocked,
} from "./utils/buildScienceExperiments.js";

export default function ScienceLabPage({ onBack }) {
  const [activeLessonId, setActiveLessonId] = useState(null);
  const [progressVersion, setProgressVersion] = useState(0);
  const [registryExperiments, setRegistryExperiments] = useState([]);
  const [backendProgress, setBackendProgress] = useState(null);
  const [isLoadingScienceData, setIsLoadingScienceData] = useState(true);
  const [scienceDataError, setScienceDataError] = useState("");
  const [openTopicId, setOpenTopicId] = useState(null);
  const [activeReviewTopicId, setActiveReviewTopicId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function loadScienceData() {
      setIsLoadingScienceData(true);
      setScienceDataError("");

      try {
        const [experiments, progress] = await Promise.all([
          getScienceExperiments(),
          getScienceProgress(),
        ]);

        if (!cancelled) {
          setRegistryExperiments(experiments);
          setBackendProgress(progress);
        }
      } catch {
        if (!cancelled) {
          setRegistryExperiments([]);
          setBackendProgress(null);
          setScienceDataError("Science missions could not be loaded. Please try again.");
        }
      } finally {
        if (!cancelled) {
          setIsLoadingScienceData(false);
        }
      }
    }

    loadScienceData();

    return () => {
      cancelled = true;
    };
  }, [progressVersion]);

const completedLessons = backendProgress?.completed_experiments ?? [];
const scienceExperiments = buildScienceExperiments({
  registryExperiments,
  richExperiments: SCIENCE_EXPERIMENTS,
  lessons: SCIENCE_LESSONS,
  topics: SCIENCE_TOPICS,
  completedExperimentIds: completedLessons,
});
const completedCount = backendProgress?.experiments_completed ?? 0;
const totalLessons = registryExperiments.length;
const scienceXp = backendProgress?.xp_earned ?? 0;
const experimentGroups = groupScienceExperimentsByTopic(scienceExperiments);
const topicSummaryById = new Map(
  (backendProgress?.topics ?? []).map((topic) => [topic.id, topic])
);
const activeExperiment = scienceExperiments.find(
  (experiment) => experiment.id === activeLessonId
);
const activeReviewTopic = SCIENCE_TOPICS.find((topic) => topic.id === activeReviewTopicId);
const activeReviewExperiments = activeReviewTopic
  ? experimentGroups[activeReviewTopic.id] ?? []
  : [];

  if (isLoadingScienceData) {
    return <main className="dashboard">Loading Science missions...</main>;
  }

  if (scienceDataError) {
    return (
      <main className="dashboard">
        <button className="primary-button" onClick={onBack}>
          Back to Adventure Hub
        </button>
        <div className="card state-card" role="alert">
          {scienceDataError}
        </div>
      </main>
    );
  }

  if (activeLessonId) {
    return (
      <ScienceAdventure
        lessonId={activeLessonId}
        experiment={activeExperiment}
        onExit={() => {
          setActiveLessonId(null);
          setProgressVersion((current) => current + 1);
        }}
      />
    );
  }

  if (activeReviewTopic) {
    return (
      <ScienceTopicReview
        experiments={activeReviewExperiments}
        topic={activeReviewTopic}
        onExit={() => {
          setActiveReviewTopicId(null);
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
          const experiments = experimentGroups[topic.id] ?? [];
          const isTopicOpen = openTopicId === topic.id;
          const topicSummary = topicSummaryById.get(topic.id);
          const completedInGroup =
            topicSummary?.completed_experiments ??
            experiments.filter((experiment) =>
              completedLessons.includes(experiment.id)
            ).length;

          const totalInGroup =
            topicSummary?.total_experiments ?? experiments.length;
          const isTopicCompleted = Boolean(topicSummary?.completed);

          const progressPercent =
            topicSummary?.progress_percent ??
            (totalInGroup === 0
                ? 0
                : Math.round((completedInGroup / totalInGroup) * 100));

          return (
          <section className="science-topic-section" key={groupName}>  
            <button
              type="button"
              className="science-topic-header"
              aria-controls={`science-topic-panel-${topic.id}`}
              aria-expanded={isTopicOpen}
              onClick={() =>
                setOpenTopicId((current) => (current === topic.id ? null : topic.id))
              }
            >
              <div>
                <h3>
                  {topic.icon} {topic.title}
                </h3>
                <StatusBadge status={isTopicCompleted ? "completed" : "new"} />
                <p>{topic.description}</p>
                <p>
                  {completedInGroup} / {totalInGroup} Missions Completed
                </p>
                {topicSummary?.review && (
                  <p>
                    Review best: {topicSummary.review.best_percentage}% ·
                    Mastery: {topicSummary.review.mastery_level}
                  </p>
                )}
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
            <div id={`science-topic-panel-${topic.id}`}>
            {isTopicCompleted && (
              <div className="science-review-action">
                <button
                  className="secondary-button"
                  type="button"
                  onClick={() => setActiveReviewTopicId(topic.id)}
                >
                  Start Review
                </button>
              </div>
            )}
            <div className="science-experiment-grid">
              {experiments.map((experiment) => {
                const isUnlocked = isScienceExperimentUnlocked(
                  experiment,
                  completedLessons
                );
                const isCompleted = completedLessons.includes(experiment.id);
                const hasLesson = experiment.hasLesson;

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
            </div>
          )}
          </section>
        );
      })}
      </section>
    </DashboardLayout>
  );
}
