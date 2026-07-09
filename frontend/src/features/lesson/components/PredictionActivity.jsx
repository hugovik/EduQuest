import { useState } from "react";

export default function PredictionActivity({ lesson, onComplete }) {
  const [selected, setSelected] = useState(null);

  function choose(index) {
    setSelected(index);

    const correct = index === lesson.correctIndex;

    onComplete?.({
      correct,
      score: correct ? 1 : 0,
      attempts: 1,
      xpRequested: correct ? lesson.xp ?? 0 : 0,
    });
  }

  return (
    <section className="card">
      <h2>{lesson.prompt}</h2>

      <div className="activity-options">
        {lesson.options.map((option, index) => (
          <button
            key={option}
            className={selected === index ? "primary-button" : "secondary-button"}
            onClick={() => choose(index)}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}
