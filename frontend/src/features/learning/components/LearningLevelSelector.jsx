import { MAX_LEARNING_LEVEL, MIN_LEARNING_LEVEL } from "../learningLevelConfig";

const levelOptions = Array.from(
  { length: MAX_LEARNING_LEVEL - MIN_LEARNING_LEVEL + 1 },
  (_, index) => MIN_LEARNING_LEVEL + index
);

export default function LearningLevelSelector({
  childGrade,
  effectiveLevel,
  isSaving = false,
  overrideLevel,
  source,
  onOverrideLevelChange,
}) {
  function handleChange(event) {
    const value = event.target.value;
    onOverrideLevelChange(value === "grade" ? null : Number(value));
  }

  return (
    <section className="card learning-level-selector">
      <div>
        <p className="quest-realm">Learning Level</p>
        <h2>Level {effectiveLevel} adventure</h2>
        <p>My grade level: Grade {childGrade ?? 2}</p>
      </div>

      <label className="learning-level-control">
        <span>Challenge level</span>
        <select
          value={overrideLevel ?? "grade"}
          onChange={handleChange}
          disabled={isSaving}
        >
          <option value="grade">Use my grade level</option>
          {levelOptions.map((level) => (
            <option key={level} value={level}>
              Level {level}
            </option>
          ))}
        </select>
      </label>

      <p>
        {source === "override"
          ? `Challenge Level ${effectiveLevel} selected`
          : "Using your grade level"}
      </p>
    </section>
  );
}
