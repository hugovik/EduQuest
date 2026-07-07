export default function PageHeader({
  eyebrow,
  title,
  description,
  onBack,
  backLabel = "← Back",
}) {
  return (
    <section className="card page-header">
      {onBack && (
        <button className="secondary-button page-header__back" onClick={onBack}>
          {backLabel}
        </button>
      )}

      {eyebrow && <p className="eyebrow">{eyebrow}</p>}

      <h1>{title}</h1>

      {description && <p>{description}</p>}
    </section>
  );
}