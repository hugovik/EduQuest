export default function TreehouseProgressBar({
  label,
  value,
  max,
  percent,
}) {
  const safePercent = Math.min(100, Math.max(0, percent ?? 0));

  return (
    <div className="treehouse-progress">
      <div className="treehouse-progress-header">
        <span>{label}</span>
        <strong>
          {value}
          {max ? ` / ${max}` : ""}
        </strong>
      </div>
      <div className="treehouse-progress-track" aria-hidden="true">
        <div
          className="treehouse-progress-fill"
          style={{ width: `${safePercent}%` }}
        />
      </div>
    </div>
  );
}
