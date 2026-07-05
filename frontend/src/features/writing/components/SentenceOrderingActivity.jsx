import { useState } from "react";

export default function SentenceOrderingActivity({ lesson, onComplete }) {
  const [selectedWords, setSelectedWords] = useState([]);
  const [result, setResult] = useState(null);

  function handleWordClick(word) {
    if (result === "correct") return;
    if (selectedWords.includes(word)) return;

    setSelectedWords((current) => [...current, word]);
    setResult(null);
  }

  function handleReset() {
    if (result === "correct") return;
    setSelectedWords([]);
    setResult(null);
  }

  function handleCheck() {
    const correct = selectedWords.join(" ") === lesson.answer;
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

      <p>Put the words in the correct order.</p>

      <div className="writing-sentence">
        {selectedWords.length > 0 ? selectedWords.join(" ") : "Build your sentence here..."}
      </div>

      <div className="writing-choice-grid">
        {lesson.words.map((word) => (
          <button
            key={word}
            className="primary-button"
            type="button"
            disabled={selectedWords.includes(word)}
            onClick={() => handleWordClick(word)}
          >
            {word}
          </button>
        ))}
      </div>

      <div className="writing-choice-grid">
        <button className="secondary-button" type="button" onClick={handleReset}>
          Reset
        </button>

        <button
          className="primary-button"
          type="button"
          disabled={selectedWords.length !== lesson.words.length}
          onClick={handleCheck}
        >
          Check Sentence
        </button>
      </div>

      {result === "correct" && (
        <div className="success-message">
          ✨ {lesson.successMessage}
          <br />+{lesson.xp} XP
        </div>
      )}

      {result === "incorrect" && (
        <div className="error-message">
          Not quite. Try arranging the words so the sentence makes sense.
        </div>
      )}
    </section>
  );
}