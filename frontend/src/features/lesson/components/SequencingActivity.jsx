import { useState } from "react";

export default function SequencingActivity({ lesson, onComplete }) {
  const [items, setItems] = useState(() => lesson.items ?? []);

  function moveItem(index, direction) {
    const nextIndex = index + direction;

    if (nextIndex < 0 || nextIndex >= items.length) return;

    const nextItems = [...items];
    const [movedItem] = nextItems.splice(index, 1);
    nextItems.splice(nextIndex, 0, movedItem);

    setItems(nextItems);
  }

  function checkAnswer() {
    const currentOrder = items.map((item) => item.id);
    const correct = lesson.correctOrder.every(
      (id, index) => currentOrder[index] === id
    );

    onComplete?.({
      answer: currentOrder,
      locallyCorrect: correct,
      correct,
      score: correct ? 1 : 0,
      attempts: 1,
      xpRequested: correct ? lesson.xp ?? 0 : 0,
    });
  }

  return (
    <section className="card">
      <h2>{lesson.prompt}</h2>

      <div className="sequencing-list">
        {items.map((item, index) => (
          <div className="sequencing-item" key={item.id}>
            <span>{item.label}</span>

            <div className="button-row">
              <button
                className="secondary-button"
                onClick={() => moveItem(index, -1)}
                disabled={index === 0}
              >
                ↑
              </button>

              <button
                className="secondary-button"
                onClick={() => moveItem(index, 1)}
                disabled={index === items.length - 1}
              >
                ↓
              </button>
            </div>
          </div>
        ))}
      </div>

      <button className="primary-button" onClick={checkAnswer}>
        Check Order
      </button>
    </section>
  );
}
