import { useState } from "react";
import { Mic } from "lucide-react";
import { useQuests } from "./useQuests";

export function ReadingQuestPage() {
  const { data: quests, isLoading, error } = useQuests();
  const [selected, setSelected] = useState("");
  const [feedback, setFeedback] = useState("");

  if (isLoading) {
    return <main className="screen">Loading Reading Forest...</main>;
  }

  if (error) {
    return <main className="screen">Unable to load Reading Forest.</main>;
  }

  const quest = quests.find((item) => item.subject === "reading");

  if (!quest) {
    return <main className="screen">No reading quests found.</main>;
  }

  const options = ["Captain Beaver", "Professor Owl", "Spark Dragon"];

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
          {options.map((option) => (
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