import { useState } from "react";
import { Mic } from "lucide-react";

const quest = {
  title: "Professor Owl and the Lost Page",
  realm: "Reading Forest",
  passage:
    "Professor Owl found a lost page near the library tree. Lena helped him read the clues and return the page to the magic book.",
  question: "Who found the lost page?",
  options: ["Captain Beaver", "Professor Owl", "Spark Dragon"],
  answer: "Professor Owl",
};

export function ReadingQuestPage() {
  const [selected, setSelected] = useState("");
  const [feedback, setFeedback] = useState("");

  function checkAnswer() {
    if (selected === quest.answer) {
      setFeedback("Wonderful reading! You helped Professor Owl return the page.");
    } else {
      setFeedback(
        "Almost there. Read the story one more time and look for the character who found the page."
      );
    }
  }

  return (
    <main className="screen">
      <section className="lesson-card">
        <p className="eyebrow">{quest.realm}</p>
        <h2>{quest.title}</h2>

        <p className="passage">{quest.passage}</p>

        <button className="voice-button">
          <Mic size={18} /> Read Aloud Practice
        </button>

        <p className="hint">
          Voice recognition will be connected in an upcoming build.
        </p>

        <h3>{quest.question}</h3>

        <div className="options">
          {quest.options.map((option) => (
            <button
              key={option}
              onClick={() => setSelected(option)}
              className={selected === option ? "selected" : ""}
            >
              {option}
            </button>
          ))}
        </div>

        <button className="primary" onClick={checkAnswer}>
          Finish Quest
        </button>

        {feedback && <p className="feedback">{feedback}</p>}
      </section>
    </main>
  );
}