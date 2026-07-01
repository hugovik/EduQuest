import { getMathOperationUnlockGrade } from "../utils/mathGradeConfig";

const mathTools = [
  { value: "addition", icon: "➕", label: "Addition" },
  { value: "subtraction", icon: "➖", label: "Subtraction" },
  { value: "multiplication", icon: "✖️", label: "Multiplication" },
  { value: "division", icon: "➗", label: "Division" },
  { value: "mixed", icon: "🎲", label: "Surprise Me" },
];

function getUnavailableMessage(tool) {
  const unlockLevel = getMathOperationUnlockGrade(tool.value);

  if (!unlockLevel || tool.value === "mixed") {
    return null;
  }

  return `${tool.label} unlocks at Level ${unlockLevel}.`;
}

export default function MathOperationSelector({
  availableOperations,
  effectiveLevel,
  selectedOperation,
  onSelectOperation,
}) {
  const lockedTool = mathTools.find(
    (tool) =>
      tool.value !== "mixed" && !availableOperations.includes(tool.value)
  );

  return (
    <section className="card math-tool-selector">
      <div>
        <p className="quest-realm">Math Tool</p>
        <h2>Choose Lena&apos;s math tool</h2>
        <p>Level {effectiveLevel} Math Adventure</p>
      </div>

      <div className="math-tool-options" aria-label="Choose a math tool">
        {mathTools.map((tool) => {
          const isSelected = selectedOperation === tool.value;
          const isAvailable =
            tool.value === "mixed" || availableOperations.includes(tool.value);
          const unavailableMessage = getUnavailableMessage(tool);

          return (
            <button
              key={tool.value}
              className={`primary-button math-tool-button${isSelected ? " active" : ""}`}
              type="button"
              aria-pressed={isSelected}
              disabled={!isAvailable}
              title={unavailableMessage ?? undefined}
              onClick={() => onSelectOperation(tool.value)}
            >
              <span aria-hidden="true">{tool.icon}</span>
              {tool.label}
            </button>
          );
        })}
      </div>

      {lockedTool && (
        <p className="quest-result">{getUnavailableMessage(lockedTool)}</p>
      )}
    </section>
  );
}
