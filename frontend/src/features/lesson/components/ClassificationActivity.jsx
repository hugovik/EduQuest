import { useState } from "react";

export default function ClassificationActivity({
  activity,
  onComplete,
}) {
  const [answers, setAnswers] = useState({});

  function choose(itemId, category) {
    const next = {
      ...answers,
      [itemId]: category,
    };

    setAnswers(next);

    if (Object.keys(next).length === activity.items.length) {
      const correct = activity.items.every(
        (item) => next[item.id] === item.category
      );

      onComplete({
        correct,
      });
    }
  }

  return (
    <section className="activity-card">
      <h2>{activity.prompt}</h2>

      {activity.items.map((item) => (
        <div
          key={item.id}
          className="classification-row"
        >
          <span>{item.label}</span>

          <div className="classification-buttons">
            {activity.categories.map((category) => (
              <button
                key={category}
                className={
                  answers[item.id] === category
                    ? "primary-button"
                    : "secondary-button"
                }
                onClick={() => choose(item.id, category)}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}