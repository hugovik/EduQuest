export default function ProfessorNovaPanel({
  title = "Professor Nova",
  subtitle,
  message,
 mood = "curious",
}) {
  const avatar = {
    curious: "👩‍🔬",
    excited: "🤩👩‍🔬",
    success: "🎉👩‍🔬",
    thinking: "🤔👩‍🔬",
    warning: "⚠️👩‍🔬",
  }[mood] ?? "👩‍🔬";

  return (
    <section className="card professor-panel">
      <div className="professor-panel__avatar">
        {avatar}
      </div>

      <div className="professor-panel__content">
        <p className="quest-realm">{title}</p>

        {subtitle && (
        <h3 className="professor-panel__subtitle">
            {subtitle}
        </h3>
        )}

        <p className="professor-panel__message">
          {message}
        </p>
      </div>
    </section>
  );
}