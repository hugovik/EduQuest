import { useEffect, useState } from "react";
import LearningLevelSelector from "../learning/components/LearningLevelSelector";
import { getAdventureLevelConfig } from "../learning/learningLevelConfig";
import { useLearningLevelPreference } from "../learning/hooks/useLearningLevelPreference";
import { usePlayer } from "../treehouse/hooks/usePlayer";
import ReadingPassage from "./components/ReadingPassage";
import ReadingProgressCard from "./components/ReadingProgressCard";
import ReadingQuestion from "./components/ReadingQuestion";
import ReadingResults from "./components/ReadingResults";
import {
  useReadingPassages,
  useReadingProgress,
  useReadingProgressSummary,
  useSubmitReadingAnswers,
} from "./hooks/useReading";

function getProgressByPassage(progress = []) {
  return new Map(progress.map((item) => [item.passage_id, item]));
}

function formatPercent(value) {
  return Math.round((value ?? 0) * 100);
}

function getCompletedPassageIds(progress = []) {
  return new Set(
    progress.filter((item) => item.completed).map((item) => item.passage_id)
  );
}

export default function ReadingForestPage({ onBack }) {
  const [selectedPassageId, setSelectedPassageId] = useState(null);
  const [answers, setAnswers] = useState({});
  const [result, setResult] = useState(null);
  const { data: player, isLoading: playerLoading, error: playerError } = usePlayer();
  const {
    overrideLevel,
    setOverrideLevel,
    isLoading: preferenceLoading,
    isSaving: preferenceSaving,
    error: preferenceError,
  } = useLearningLevelPreference("reading");
  const readingLevel = getAdventureLevelConfig({
    adventureType: "reading",
    childGrade: player?.grade,
    overrideLevel,
  });
  const {
    data: passages = [],
    isLoading: passagesLoading,
    error: passagesError,
  } = useReadingPassages(readingLevel.effectiveLevel);
  const {
    data: progress = [],
    isLoading: progressLoading,
    error: progressError,
  } = useReadingProgress();
  const {
    data: progressSummary,
    isLoading: progressSummaryLoading,
    error: progressSummaryError,
  } = useReadingProgressSummary();
  const submitReadingAnswers = useSubmitReadingAnswers();
  const progressByPassage = getProgressByPassage(progress);
  const completedPassageIds = getCompletedPassageIds(progress);
  const selectedPassage = passages.find((passage) => passage.id === selectedPassageId);
  const selectedProgress = selectedPassage
    ? progressByPassage.get(selectedPassage.id)
    : null;
  const answeredCount = selectedPassage
    ? selectedPassage.questions.filter((question) => answers[question.id]).length
    : 0;
  const nextRecommendedPassage = passages.find(
    (passage) => !completedPassageIds.has(passage.id) && passage.id !== selectedPassageId
  );

  useEffect(() => {
    setSelectedPassageId(null);
    setAnswers({});
    setResult(null);
  }, [readingLevel.effectiveLevel]);

  useEffect(() => {
    if (selectedPassageId || passages.length === 0) {
      return;
    }

    const firstOpen = passages.find((passage) => !completedPassageIds.has(passage.id));
    setSelectedPassageId((firstOpen ?? passages[0]).id);
  }, [completedPassageIds, passages, selectedPassageId]);

  function choosePassage(passageId) {
    setSelectedPassageId(passageId);
    setAnswers({});
    setResult(null);
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!selectedPassage) {
      return;
    }

    const nextResult = await submitReadingAnswers.mutateAsync({
      passageId: selectedPassage.id,
      answers,
    });
    setResult(nextResult);
  }

  if (
    playerLoading ||
    preferenceLoading ||
    passagesLoading ||
    progressLoading ||
    progressSummaryLoading
  ) {
    return <main className="dashboard">Loading Reading Forest...</main>;
  }

  if (
    playerError ||
    preferenceError ||
    passagesError ||
    progressError ||
    progressSummaryError
  ) {
    return <main className="dashboard">Unable to load Reading Forest.</main>;
  }

  return (
    <main className="dashboard reading-forest-page">
      <button className="primary-button" onClick={onBack}>
        Back to Adventure Hub
      </button>

      <header className="reading-forest-header">
        <p className="quest-realm">Reading Forest</p>
        <h1>📖 Reading Forest</h1>
        <p>Forest Map → Choose Story → Read Story → Questions → Reward</p>
      </header>

      <section className="card reading-step-card">
        <p className="quest-realm">Current Step</p>
        <h2>{result ? "Reward" : selectedPassage ? "Questions" : "Choose Story"}</h2>
        <div className="reading-step-track" aria-label="Reading Forest flow">
          {["Forest Map", "Choose Story", "Read Story", "Questions", "Reward"].map((step) => (
            <span key={step}>{step}</span>
          ))}
        </div>
      </section>

      <ReadingProgressCard summary={progressSummary} />

      <LearningLevelSelector
        childGrade={player?.grade}
        effectiveLevel={readingLevel.effectiveLevel}
        isSaving={preferenceSaving}
        overrideLevel={overrideLevel}
        source={readingLevel.source}
        onOverrideLevelChange={setOverrideLevel}
      />

      <section className="card reading-map-card">
        <p className="quest-realm">Forest Map</p>
        <h2>Choose a story path</h2>
        <div className="reading-story-grid" aria-label="Reading Forest stories">
        {passages.map((passage) => {
          const completed = completedPassageIds.has(passage.id);
          const passageProgress = progressByPassage.get(passage.id);

          return (
            <button
              className={`reading-story-button${
                passage.id === selectedPassageId ? " reading-story-button-active" : ""
              }${completed ? " reading-story-button-completed" : ""}`}
              key={passage.id}
              type="button"
              onClick={() => choosePassage(passage.id)}
            >
              <span>{completed ? "✓" : "✦"}</span>
              <strong>{passage.title}</strong>
              {completed ? (
                <small>
                  Completed · {passageProgress?.correct_answers ?? 0} /{" "}
                  {passageProgress?.questions_answered ?? passage.questions.length} ·{" "}
                  {formatPercent(passageProgress?.accuracy)}% ·{" "}
                  {passageProgress?.xp_awarded ?? 0} XP claimed
                </small>
              ) : (
                <small>{passage.estimated_reading_time} · ready to explore</small>
              )}
            </button>
          );
        })}
        </div>
      </section>

      {selectedPassage ? (
        <>
          {selectedProgress?.completed && (
            <div className="card quest-result success">
              Completed badge earned for this passage. Replay is welcome, but XP has already been claimed.
            </div>
          )}

          <ReadingPassage passage={selectedPassage} />

          <form className="card reading-question-card" onSubmit={handleSubmit}>
            <p className="quest-realm">Comprehension Clues</p>
            <h2>Answer the forest clues</h2>
            <p>
              {answeredCount} / {selectedPassage.questions.length} answers selected
            </p>
            {result && (
              <p>
                Score this try: {result.score} / {result.total_questions}
              </p>
            )}
            {selectedPassage.questions.map((question, index) => (
              <div className="reading-question-shell" key={question.id}>
                <p className="quest-realm">
                  Question {index + 1} of {selectedPassage.questions.length}
                </p>
                <ReadingQuestion
                question={question}
                value={answers[question.id]}
                onChange={(value) =>
                  setAnswers((currentAnswers) => ({
                    ...currentAnswers,
                    [question.id]: value,
                  }))
                }
                />
              </div>
            ))}
            <button
              className="primary-button"
              type="submit"
              disabled={submitReadingAnswers.isPending}
            >
              {submitReadingAnswers.isPending ? "Saving..." : "Collect Story Reward"}
            </button>
          </form>
        </>
      ) : (
        <div className="card state-card">No stories found for this level yet.</div>
      )}

      {submitReadingAnswers.isError && (
        <div className="card quest-result error">
          Story answers could not be saved. Try again.
        </div>
      )}

      <ReadingResults
        result={result}
        nextPassageTitle={nextRecommendedPassage?.title}
        onNextPassage={() => {
          if (nextRecommendedPassage) {
            choosePassage(nextRecommendedPassage.id);
          }
        }}
        onChooseAnother={() => {
          setResult(null);
          setAnswers({});
        }}
      />
    </main>
  );
}
