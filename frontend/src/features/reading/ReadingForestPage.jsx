import { useEffect, useState } from "react";
import LearningLevelSelector from "../learning/components/LearningLevelSelector";
import { getAdventureLevelConfig } from "../learning/learningLevelConfig";
import { useLearningLevelPreference } from "../learning/hooks/useLearningLevelPreference";
import { usePlayer } from "../treehouse/hooks/usePlayer";
import ReadingProgressCard from "./components/ReadingProgressCard";
import ReadingQuestion from "./components/ReadingQuestion";
import ReadingResults from "./components/ReadingResults";
import CollectiblePopup from "./components/CollectiblePopup";
import StoryChapter from "./components/StoryChapter";
import StoryChoice from "./components/StoryChoice";
import StoryJournal from "./components/StoryJournal";
import {
  useReadingPassages,
  useReadingProgress,
  useReadingProgressSummary,
  useReadingStoryState,
  useSaveReadingStoryChoice,
  useSaveReadingStoryInteraction,
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
  const [choiceFeedback, setChoiceFeedback] = useState(null);
  const [collectiblePopup, setCollectiblePopup] = useState(null);
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
  } = useReadingProgressSummary(readingLevel.effectiveLevel);
  const {
    data: storyState,
    isLoading: storyStateLoading,
    error: storyStateError,
  } = useReadingStoryState();
  const saveStoryChoice = useSaveReadingStoryChoice();
  const saveStoryInteraction = useSaveReadingStoryInteraction();
  const submitReadingAnswers = useSubmitReadingAnswers();
  const progressByPassage = getProgressByPassage(progress);
  const completedPassageIds = getCompletedPassageIds(progress);
  const selectedPassage = passages.find((passage) => passage.id === selectedPassageId);
  const selectedProgress = selectedPassage
    ? progressByPassage.get(selectedPassage.id)
    : null;
  const selectedChoiceId = selectedPassage
    ? storyState?.choices_made?.[selectedPassage.id]
    : null;
  const selectedChoice = selectedPassage?.choices?.find(
    (choice) => choice.id === selectedChoiceId
  );
  const answeredCount = selectedPassage
    ? selectedPassage.questions.filter((question) => answers[question.id]).length
    : 0;
  const nextRecommendedPassage = passages.find(
    (passage) => passage.unlocked && !passage.completed && passage.id !== selectedPassageId
  );
  const recommendedPassage = passages.find(
    (passage) => passage.unlocked && !passage.completed
  );

  useEffect(() => {
    setSelectedPassageId(null);
    setAnswers({});
    setResult(null);
    setChoiceFeedback(null);
    setCollectiblePopup(null);
  }, [readingLevel.effectiveLevel]);

  useEffect(() => {
    if (selectedPassageId || passages.length === 0) {
      return;
    }

    const firstOpen = passages.find((passage) => passage.unlocked && !passage.completed);
    const firstUnlocked = passages.find((passage) => passage.unlocked);
    setSelectedPassageId((firstOpen ?? firstUnlocked ?? passages[0]).id);
  }, [passages, selectedPassageId]);

  function choosePassage(passageId) {
    const passage = passages.find((item) => item.id === passageId);

    if (!passage || passage.locked) {
      return;
    }

    setSelectedPassageId(passageId);
    setAnswers({});
    setResult(null);
    setChoiceFeedback(null);
    setCollectiblePopup(null);
  }

  async function handleChoice(choice) {
    if (!selectedPassage) {
      return;
    }

    const response = await saveStoryChoice.mutateAsync({
      passageId: selectedPassage.id,
      choiceId: choice.id,
    });
    setChoiceFeedback(response.choice);
  }

  async function handleInteraction(interaction) {
    if (!selectedPassage) {
      return;
    }

    const response = await saveStoryInteraction.mutateAsync({
      passageId: selectedPassage.id,
      interactionId: interaction.id,
    });

    if (response.collectible_awarded) {
      setCollectiblePopup(response.collectible_awarded);
    } else {
      setChoiceFeedback({
        dialogue: interaction.result_text,
        outcome_text: response.duplicate
          ? "You already found this keepsake. It is safe in your journal."
          : interaction.result_text,
      });
    }
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
    progressSummaryLoading ||
    storyStateLoading
  ) {
    return <main className="dashboard">Loading Reading Forest...</main>;
  }

  if (
    playerError ||
    preferenceError ||
    passagesError ||
    progressError ||
    progressSummaryError ||
    storyStateError
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
      <StoryJournal storyState={storyState} onReplayChapter={choosePassage} />

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
        <div className="reading-story-grid reading-forest-map" aria-label="Reading Forest stories">
        {passages.map((passage) => {
          const completed = passage.completed || completedPassageIds.has(passage.id);
          const locked = passage.locked || !passage.unlocked;
          const recommended = recommendedPassage?.id === passage.id;
          const passageProgress = progressByPassage.get(passage.id);
          const bestScore = passage.best_score ?? passageProgress?.correct_answers ?? 0;
          const bestTotal = passageProgress?.questions_answered ?? passage.questions.length;
          const bestAccuracy = passage.best_accuracy ?? passageProgress?.accuracy ?? 0;
          const xpAwarded = passage.xp_awarded ?? passageProgress?.xp_awarded ?? 0;

          return (
            <button
              aria-disabled={locked}
              className={`reading-story-button reading-map-node${
                passage.id === selectedPassageId ? " reading-story-button-active" : ""
              }${completed ? " reading-story-button-completed" : ""}${
                locked ? " reading-story-button-locked" : ""
              }${recommended ? " reading-story-button-recommended" : ""}`}
              disabled={locked}
              key={passage.id}
              type="button"
              onClick={() => choosePassage(passage.id)}
            >
              <span className="reading-map-node-icon">
                {locked ? "🔒" : completed ? "✓" : recommended ? "★" : "✦"}
              </span>
              <span className="reading-map-node-label">
                <strong>{passage.map_node_name ?? passage.title}</strong>
                <small>{passage.title}</small>
              </span>
              {completed ? (
                <small>
                  Completed · Best {bestScore} / {bestTotal} · {formatPercent(bestAccuracy)}% · {xpAwarded} XP claimed
                </small>
              ) : locked ? (
                <small>Complete the previous story with 60% accuracy to unlock.</small>
              ) : recommended ? (
                <small>{passage.estimated_reading_time} · recommended next story</small>
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
          {(selectedPassage.completed || selectedProgress?.completed) && (
            <div className="card quest-result success">
              Completed badge earned for this passage. Replay is welcome, but XP has already been claimed.
            </div>
          )}

          <StoryChapter
            passage={selectedPassage}
            selectedChoice={choiceFeedback ?? selectedChoice}
          />

          <StoryChoice
            choices={selectedPassage.choices}
            isSaving={saveStoryChoice.isPending}
            selectedChoiceId={selectedChoiceId}
            onChoose={handleChoice}
          />

          {selectedPassage.interactive_elements?.length > 0 && (
            <section className="card reading-interactions-card">
              <p className="quest-realm">Explore the Chapter</p>
              <h2>Find the hidden clue</h2>
              <div className="reading-interaction-grid">
                {selectedPassage.interactive_elements.map((interaction) => (
                  <button
                    className="reading-interaction-button"
                    disabled={saveStoryInteraction.isPending}
                    key={interaction.id}
                    type="button"
                    onClick={() => handleInteraction(interaction)}
                  >
                    <strong>{interaction.label}</strong>
                    <small>{interaction.description}</small>
                    <span>{interaction.action_label}</span>
                  </button>
                ))}
              </div>
            </section>
          )}

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
          Story answers could not be saved. If this story is locked, complete the previous forest stop first.
        </div>
      )}

      <CollectiblePopup
        collectible={collectiblePopup}
        onClose={() => setCollectiblePopup(null)}
      />

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
