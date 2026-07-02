import { useState } from "react";

function getValue(value) {
  return Array.isArray(value) ? value : value ?? "";
}

export default function ReadingQuestion({ question, value, onChange }) {
  const [showHint, setShowHint] = useState(false);

  function renderHint() {
    if (!question.hint) {
      return null;
    }

    return (
      <div className="reading-hint-box">
        <button
          className="secondary-button"
          type="button"
          onClick={() => setShowHint((current) => !current)}
        >
          Need a hint?
        </button>
        {showHint && <p>{question.hint}</p>}
      </div>
    );
  }

  if (question.type === "sequence") {
    const currentValue = Array.isArray(value) ? value : question.items.map(() => "");

    return (
      <fieldset className="reading-question">
        <legend>{question.prompt}</legend>
        {renderHint()}
        {question.items.map((_, index) => (
          <label key={index}>
            Step {index + 1}
            <select
              value={currentValue[index] ?? ""}
              onChange={(event) => {
                const nextValue = [...currentValue];
                nextValue[index] = event.target.value;
                onChange(nextValue);
              }}
            >
              <option value="">Choose an event</option>
              {question.items.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        ))}
      </fieldset>
    );
  }

  return (
    <fieldset className="reading-question">
      <legend>{question.prompt}</legend>
      {renderHint()}
      {question.options.map((option) => (
        <label key={option}>
          <input
            type="radio"
            name={question.id}
            value={option}
            checked={getValue(value) === option}
            onChange={() => onChange(option)}
          />
          {option}
        </label>
      ))}
    </fieldset>
  );
}
