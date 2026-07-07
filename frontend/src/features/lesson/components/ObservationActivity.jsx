import { useState } from "react";

export default function ObservationActivity({
  activity,
  onComplete,
}) {
  const [selected, setSelected] = useState(null);

  function choose(index) {
    setSelected(index);

    onComplete({
      correct: index === activity.correctIndex,
    });
  }

  return (
    <section className="activity-card">
      <h2>{activity.prompt}</h2>

      {activity.image && (
        <img
          src={activity.image}
          alt={activity.prompt}
          className="activity-image"
        />
      )}

      <div className="activity-options">
        {activity.options.map((option, index) => (
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