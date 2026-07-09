import { useState } from "react";

export default function ClassificationActivity({
  lesson,
  onComplete,
}) {
  const [answers, setAnswers] = useState({});

  function choose(itemId, category) {
    const next = {
      ...answers,
      [itemId]: category,
    };

    setAnswers(next);

    if (Object.keys(next).length === lesson.items.length) {
      const correct = lesson.items.every(
        (item) => next[item.id] === item.category
      );

      onComplete({
        correct,
        score: correct ? 1 : 0,
        attempts: 1,
        xpRequested: correct ? lesson.xp ?? 0 : 0,
      });
    }
  }

  return (
    <section className="activity-card">
      <h2>{lesson.prompt}</h2>

      {lesson.items.map((item) => (
        <div
          key={item.id}
          className="classification-row"
        >
          <span>{item.label}</span>

          <div className="classification-buttons">
            {lesson.categories.map((category) => (
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
