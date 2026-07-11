import { useMemo, useState } from "react";

import DashboardLayout from "../../../components/DashboardLayout.jsx";
import PageHeader from "../../../components/PageHeader.jsx";
import ActivityRenderer from "../../lesson/components/ActivityRenderer.jsx";
import { completeScienceTopicReview } from "../../../api/scienceApi.js";

export default function ScienceTopicReview({ experiments, topic, onExit }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [reviewResult, setReviewResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const currentExperiment = experiments[currentIndex];
  const currentActivity = currentExperiment?.lesson?.activities?.[0];
  const resultByExperimentId = useMemo(() => {
    return new Map((reviewResult?.results ?? []).map((result) => [result.experiment_id, result]));
  }, [reviewResult]);

  async function submitReview(nextAnswers) {
    setIsSubmitting(true);
    setError("");

    try {
      const result = await completeScienceTopicReview(topic.id, nextAnswers);
      setReviewResult(result);
    } catch {
      setError("Professor Nova could not check your review right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleComplete(result) {
    if (isSubmitting || !currentExperiment) {
      return;
    }

    const nextAnswers = [
      ...answers.filter((answer) => answer.experiment_id !== currentExperiment.id),
      {
        experiment_id: currentExperiment.id,
        answer: result.answer,
      },
    ];
    setAnswers(nextAnswers);

    if (currentIndex < experiments.length - 1) {
      setCurrentIndex((index) => index + 1);
      return;
    }

    await submitReview(nextAnswers);
  }

  if (reviewResult) {
    return (
      <DashboardLayout>
        <PageHeader
          eyebrow="Science Review"
          title={`${topic.title} Review Results`}
          description="Professor Nova checked your discoveries."
          onBack={onExit}
          backLabel="← Return to Science Lab"
        />

        <section className="card state-card">
          <h2>{reviewResult.score} / {reviewResult.total_questions} correct</h2>
          <p>
            Score: {reviewResult.percentage}% · Best: {reviewResult.best_percentage}% ·
            Mastery: {reviewResult.mastery_level}
          </p>
          <p>Reviews are practice only, so this awarded {reviewResult.xp_awarded} XP.</p>
        </section>

        <section className="card">
          <h2>Review Answers</h2>
          <div className="science-review-results">
            {experiments.map((experiment, index) => {
              const result = resultByExperimentId.get(experiment.id);
              const explanation = experiment.lesson?.reviewExplanation;

              return (
                <article
                  className={`science-review-result ${result?.correct ? "is-correct" : "is-incorrect"}`}
                  key={experiment.id}
                >
                  <strong>Question {index + 1}: {experiment.title}</strong>
                  <p>{result?.correct ? "Great discovery!" : "Almost!"}</p>
                  {!result?.correct && result?.correct_answer !== undefined && (
                    <p>Correct answer: {JSON.stringify(result.correct_answer)}</p>
                  )}
                  {explanation && (
                    <details open={!result?.correct}>
                      <summary>Why?</summary>
                      <p>{explanation}</p>
                    </details>
                  )}
                </article>
              );
            })}
          </div>
        </section>

        <button className="primary-button" type="button" onClick={onExit}>
          Return to Science Lab
        </button>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <PageHeader
        eyebrow="Science Review"
        title={`${topic.title} Review`}
        description={`Question ${currentIndex + 1} of ${experiments.length}`}
        onBack={onExit}
        backLabel="← Return to Science Lab"
      />

      {error && (
        <section className="card state-card state-card-error" role="alert">
          <p>{error}</p>
          <button
            className="primary-button"
            disabled={isSubmitting}
            type="button"
            onClick={() => submitReview(answers)}
          >
            Try Again
          </button>
        </section>
      )}

      {isSubmitting && (
        <section className="card state-card" role="status">
          <p>Checking your discoveries...</p>
        </section>
      )}

      {currentActivity && (
        <ActivityRenderer
          lesson={{
            ...currentActivity,
            xp: 0,
          }}
          onComplete={handleComplete}
        />
      )}
    </DashboardLayout>
  );
}
