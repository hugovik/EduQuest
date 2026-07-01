import { useState } from "react";

export default function LearningQuestCard({ quest, onCorrectAnswer }) {
  const [answer, setAnswer] = useState("");
  const [result, setResult] = useState(null);

  function normalize(value) {
    return String(value || "").trim().toLowerCase();
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (result === "correct") {
      return;
    }

    if (normalize(answer) === normalize(quest.answer)) {
      setResult("correct");
      onCorrectAnswer(quest.id);
      return;
    }

    setResult("incorrect");
  }

  return (
    <div className="card learning-quest-card">
      <p className="quest-realm">{quest.realm}</p>

      <h2>{quest.title}</h2>

      {quest.passage && <p>{quest.passage}</p>}

      <h3>{quest.question}</h3>

      <form onSubmit={handleSubmit}>
        <input
          className="answer-input"
          value={answer}
          onChange={(event) => setAnswer(event.target.value)}
          placeholder="Type your answer"
          disabled={result === "correct"}
        />

        <button
          className="primary-button"
          type="submit"
          disabled={result === "correct"}
        >
          Check Answer
        </button>
      </form>

      {result === "correct" && (
        <div className="quest-result success">✅ Correct! Great job.</div>
      )}

      {result === "incorrect" && (
        <div className="quest-result error">❌ Try again. You can do it!</div>
      )}
    </div>
  );
}