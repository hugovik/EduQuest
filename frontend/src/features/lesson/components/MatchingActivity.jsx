import { useState } from "react";

export default function MatchingActivity({
  lesson,
  onComplete,
}) {
  const [matches, setMatches] = useState({});

  function updateMatch(leftId, rightValue) {
    setMatches((previous) => ({
      ...previous,
      [leftId]: rightValue,
    }));
  }

  function checkAnswers() {
    const correct = lesson.pairs.every(
      (pair) => matches[pair.left] === pair.right
    );

    if (correct) {
      onComplete?.({
        correct: true,
        score: 1,
        attempts: 1,
        xpRequested: lesson.xp ?? 0,
      });
    } else {
      alert("Not quite! Try again.");
    }
  }

  return (
    <section className="card">
      <h2>{lesson.prompt}</h2>

      {lesson.pairs.map((pair) => (
        <div
          key={pair.left}
          className="matching-row"
        >
          <strong>{pair.left}</strong>

          <select
            value={matches[pair.left] ?? ""}
            onChange={(event) =>
              updateMatch(pair.left, event.target.value)
            }
          >
            <option value="">Choose...</option>

            {lesson.options.map((option) => (
              <option
                key={option}
                value={option}
              >
                {option}
              </option>
            ))}
          </select>
        </div>
      ))}

      <button
        className="primary-button"
        onClick={checkAnswers}
      >
        Check Answers
      </button>
    </section>
  );
}
