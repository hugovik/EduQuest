import { useState } from "react";

export default function MissingPunctuationActivity({ lesson, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  function handleChoice(choice) {
    if (result === "correct") return;

    setSelected(choice);

    const correct = choice === lesson.payload.answer;
    setResult(correct ? "correct" : "incorrect");

    if (correct) {
      onComplete?.({
        correct: true,
        score: 1,
        attempts: 1,
        xpRequested: lesson.xp ?? 0,
      });
    }
  }

  return (
    <section className="card state-card">
      <p className="quest-realm">{lesson.realm}</p>
      <h2>{lesson.title}</h2>

      <p>Which punctuation belongs at the end?</p>

      <div className="writing-sentence">{lesson.payload.sentence}</div>

      <div className="writing-choice-grid">
        {lesson.payload.choices.map((choice) => (
          <button
            key={choice}
            className={`primary-button ${selected === choice ? "selected" : ""}`}
            type="button"
            onClick={() => handleChoice(choice)}
          >
            {choice}
          </button>
        ))}
      </div>

      {result === "correct" && (
        <div className="success-message">
          ✨ {lesson.successMessage}
          <br />+{lesson.xp} XP
        </div>
      )}

      {result === "incorrect" && (
        <div className="error-message">
          Not quite. Try reading the sentence again.
        </div>
      )}
    </section>
  );
}
