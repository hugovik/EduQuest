import { useState } from "react";

export default function ObservationActivity({
  lesson,
  onComplete,
}) {
  const [selected, setSelected] = useState(null);

  function choose(index) {
    setSelected(index);
    const correct = index === lesson.correctIndex;

    onComplete({
      correct,
      score: correct ? 1 : 0,
      attempts: 1,
      xpRequested: correct ? lesson.xp ?? 0 : 0,
    });
  }

  return (
    <section className="activity-card">
      <h2>{lesson.prompt}</h2>

      {lesson.image && (
        <img
          src={lesson.image}
          alt={lesson.prompt}
          className="activity-image"
        />
      )}

      <div className="activity-options">
        {lesson.options.map((option, index) => (
          <button
            key={index}
            className={
              selected === index
                ? "primary-button"
                : "secondary-button"
            }
            onClick={() => choose(index)}
            disabled={selected !== null}
          >
            {option}
          </button>
        ))}
      </div>
    </section>
  );
}
