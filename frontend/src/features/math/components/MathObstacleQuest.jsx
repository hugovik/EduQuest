import { useState } from "react";
import { generateMathProblem } from "../utils/generateMathProblem";

export default function MathObstacleQuest({
  levelConfig,
  obstacle,
  obstacleProgress,
  selectedOperation,
  isAnswerPending,
  onCorrectAnswer,
  onIncorrectAnswer,
  onObstacleComplete,
}) {
  const [problem, setProblem] = useState(() =>
    generateMathProblem({
      operation: selectedOperation,
      levelConfig,
      context: obstacle.id,
    })
  );
  const [answer, setAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [displayProgress, setDisplayProgress] = useState(obstacleProgress);
  const [isComplete, setIsComplete] = useState(Boolean(obstacleProgress?.completed));

  const currentProgress = displayProgress?.current_progress ?? 0;
  const requiredProgress =
    displayProgress?.required_progress ?? obstacle.totalMaterialsNeeded;
  const progressPercent = Math.min(
    100,
    Math.round((currentProgress / requiredProgress) * 100)
  );

  function normalize(value) {
    return String(value || "").trim();
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (isComplete || isAnswerPending) {
      return;
    }

    if (normalize(answer) !== normalize(problem.answer)) {
      try {
        await onIncorrectAnswer(obstacle.id);
        setFeedback("incorrect");
      } catch {
        setFeedback("penalty-save-error");
      }
      return;
    }

    try {
      const rewardResult = await onCorrectAnswer(obstacle.id);
      const nextProgress = rewardResult.obstacle_progress;

      setDisplayProgress(nextProgress);
      setFeedback("correct");
      setAnswer("");

      if (nextProgress.completed) {
        setIsComplete(true);
        onObstacleComplete();
        return;
      }

      setProblem(
        generateMathProblem({
          operation: selectedOperation,
          levelConfig,
          context: obstacle.id,
        })
      );
    } catch {
      setFeedback("save-error");
    }
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
          {obstacle.materialEmoji} {currentProgress} / {requiredProgress}{" "}
          {obstacle.materialName}
        </strong>

        <div className="obstacle-progress-bar" aria-hidden="true">
          <div
            className="obstacle-progress-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {!isComplete ? (
        <form onSubmit={handleSubmit}>
          <p className="quest-realm">Helping Task</p>
          <p>{problem.story}</p>

          <h3>{problem.question} = ?</h3>

          <input
            className="answer-input"
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Type your answer"
            disabled={isAnswerPending}
          />

          <button className="primary-button" type="submit" disabled={isAnswerPending}>
            {isAnswerPending ? "Saving..." : "Check Answer"}
          </button>
        </form>
      ) : (
        <div className="quest-result success">🎉 {obstacle.success}</div>
      )}

      {feedback === "correct" && !isComplete && (
        <div className="quest-result success">
          ✅ Correct! One brick was added to the repair.
        </div>
      )}

      {feedback === "incorrect" && (
        <div className="quest-result error">
          Not quite — try again! −2 XP
        </div>
      )}

      {feedback === "save-error" && (
        <div className="quest-result error">
          The answer was correct, but progress could not be saved yet.
        </div>
      )}

      {feedback === "penalty-save-error" && (
        <div className="quest-result error">
          Not quite — try again! XP could not be updated yet.
        </div>
      )}
    </section>
  );
}
