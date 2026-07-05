import { useState } from "react";

export default function GrammarChoiceActivity({ lesson, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [result, setResult] = useState(null);

  function handleChoice(choice) {
    if (result === "correct") return;

    setSelected(choice);

    const correct = choice === lesson.answer;
    setResult(correct ? "correct" : "incorrect");

    if (correct) {
      onComplete?.({
        xp: lesson.xp,
        correct: true,
      });
    }
  }

  return (
    <section className="card state-card">
      <p className="quest-realm">{lesson.realm}</p>
      <h2>{lesson.title}</h2>

      <p>{lesson.prompt}</p>

      <div className="writing-sentence">{lesson.sentence}</div>

      <div className="writing-choice-grid">
        {lesson.choices.map((choice) => (
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
          Almost! Choose the word that sounds right in the sentence.
        </div>
      )}
    </section>
  );
}