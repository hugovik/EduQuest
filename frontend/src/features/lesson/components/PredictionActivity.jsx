import { useState } from "react";

export default function PredictionActivity({ lesson, onComplete }) {
  const [selected, setSelected] = useState(null);

  function choose(index) {
    setSelected(index);

    if (index === lesson.correctIndex) {
      onComplete?.({ correct: true });
    } else {
      alert("Not quite! Try again.");
    }
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