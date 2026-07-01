import { useEffect, useState } from "react";
import LearningLevelSelector from "../learning/components/LearningLevelSelector";
import { getAdventureLevelConfig } from "../learning/learningLevelConfig";
import { useLearningLevelPreference } from "../learning/hooks/useLearningLevelPreference";
import { usePlayer } from "../treehouse/hooks/usePlayer";
import ReadingPassage from "./components/ReadingPassage";
import ReadingQuestion from "./components/ReadingQuestion";
import ReadingResults from "./components/ReadingResults";
import {
  useReadingPassages,
  useReadingProgress,
  useSubmitReadingAnswers,
} from "./hooks/useReading";

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
  const submitReadingAnswers = useSubmitReadingAnswers();
  const completedPassageIds = getCompletedPassageIds(progress);
  const selectedPassage = passages.find((passage) => passage.id === selectedPassageId);

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

  if (playerLoading || preferenceLoading || passagesLoading || progressLoading) {
    return <main className="dashboard">Loading Reading Forest...</main>;
  }

  if (playerError || preferenceError || passagesError || progressError) {
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
        <p>Follow story paths, learn new words, and answer forest clues.</p>
      </header>

      <LearningLevelSelector
        childGrade={player?.grade}
        effectiveLevel={readingLevel.effectiveLevel}
        isSaving={preferenceSaving}
        overrideLevel={overrideLevel}
        source={readingLevel.source}
        onOverrideLevelChange={setOverrideLevel}
      />

      <section className="reading-story-grid" aria-label="Reading Forest stories">
        {passages.map((passage) => {
          const completed = completedPassageIds.has(passage.id);

          return (
            <button
              className={`reading-story-button${
                passage.id === selectedPassageId ? " reading-story-button-active" : ""
              }`}
              key={passage.id}
              type="button"
              onClick={() => choosePassage(passage.id)}
            >
              <span>{completed ? "✓" : "✦"}</span>
              {passage.title}
            </button>
          );
        })}
      </section>

      {selectedPassage ? (
        <>
          <ReadingPassage passage={selectedPassage} />

          <form className="card reading-question-card" onSubmit={handleSubmit}>
            <p className="quest-realm">Comprehension Clues</p>
            <h2>Answer the forest clues</h2>
            {selectedPassage.questions.map((question) => (
              <ReadingQuestion
                key={question.id}
                question={question}
                value={answers[question.id]}
                onChange={(value) =>
                  setAnswers((currentAnswers) => ({
                    ...currentAnswers,
                    [question.id]: value,
                  }))
                }
              />
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
        onChooseAnother={() => {
          setResult(null);
          setAnswers({});
        }}
      />
    </main>
  );
}
