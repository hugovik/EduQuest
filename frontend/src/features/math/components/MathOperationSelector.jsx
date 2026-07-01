const mathTools = [
  { value: "addition", icon: "➕", label: "Addition" },
  { value: "subtraction", icon: "➖", label: "Subtraction" },
  { value: "multiplication", icon: "✖️", label: "Multiplication" },
  { value: "division", icon: "➗", label: "Division" },
  { value: "mixed", icon: "🎲", label: "Surprise Me" },
];

export default function MathOperationSelector({
  selectedOperation,
  onSelectOperation,
}) {
  return (
    <section className="card math-tool-selector">
      <div>
        <p className="quest-realm">Math Tool</p>
        <h2>Choose Lena&apos;s math tool</h2>
      </div>

      <div className="math-tool-options" aria-label="Choose a math tool">
        {mathTools.map((tool) => {
          const isSelected = selectedOperation === tool.value;

          return (
            <button
              key={tool.value}
              className={`primary-button math-tool-button${isSelected ? " active" : ""}`}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelectOperation(tool.value)}
            >
              <span aria-hidden="true">{tool.icon}</span>
              {tool.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}
