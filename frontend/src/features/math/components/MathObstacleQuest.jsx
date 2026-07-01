import { useState } from "react";
import { generateMathProblem } from "../utils/generateMathProblem";

export default function MathObstacleQuest({ obstacle, onObstacleComplete }) {
  const [problem, setProblem] = useState(() =>
    generateMathProblem({
        operation: obstacle.operation,
        context: obstacle.id,
    })
    );
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [materialsEarned, setMaterialsEarned] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const totalCorrectNeeded =
    obstacle.totalMaterialsNeeded * obstacle.correctAnswersPerMaterial;

  function normalize(value) {
    return String(value || "").trim();
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (isComplete) {
      return;
    }

    if (normalize(answer) !== normalize(problem.answer)) {
      setFeedback("incorrect");
      return;
    }

    const nextCorrectAnswers = correctAnswers + 1;
    const nextMaterialsEarned = Math.floor(
      nextCorrectAnswers / obstacle.correctAnswersPerMaterial
    );

    setCorrectAnswers(nextCorrectAnswers);
    setMaterialsEarned(nextMaterialsEarned);
    setFeedback("correct");
    setAnswer("");

    if (nextCorrectAnswers >= totalCorrectNeeded) {
      setIsComplete(true);
      onObstacleComplete();
      return;
    }

    setProblem(generateMathProblem({
      operation: obstacle.operation,
      context: obstacle.id,
    }));
  }

  return (
    <section className="card math-obstacle-card">
      <div className="math-obstacle-header">
        <span className="math-obstacle-emoji">{obstacle.emoji}</span>
        <div>
          <p className="quest-realm">Math Mountains Trail</p>
          <h2>{obstacle.title}</h2>
        </div>
      </div>

      <p>{obstacle.intro}</p>

      <div className="math-progress-box">
        <strong>
          {obstacle.materialEmoji} {materialsEarned} /{" "}
          {obstacle.totalMaterialsNeeded} {obstacle.materialName}
        </strong>

        <p>
          Correct answers: {correctAnswers} / {totalCorrectNeeded}
        </p>
      </div>

      {!isComplete ? (
        <form onSubmit={handleSubmit}>
          <p>{problem.story}</p>

          <h3>{problem.question} = ?</h3>

          <input
            className="answer-input"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Type your answer"
          />

          <button className="primary-button" type="submit">
            Check Answer
          </button>
        </form>
      ) : (
        <div className="quest-result success">
          🎉 {obstacle.success}
        </div>
      )}

      {feedback === "correct" && !isComplete && (
        <div className="quest-result success">
          ✅ Correct! The workers are getting closer to repairing the bridge.
        </div>
      )}

      {feedback === "incorrect" && (
        <div className="quest-result error">
          ❌ Not quite. Try again.
        </div>
      )}
    </section>
  );
}