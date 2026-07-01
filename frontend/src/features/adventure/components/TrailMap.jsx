export default function TrailMap({
  title,
  emoji,
  obstacles,
  currentObstacleIndex,
}) {
  return (
    <section className="card trail-map-card">
      <div className="trail-map-header">
        <span className="trail-map-world-emoji">{emoji}</span>
        <div>
          <p className="quest-realm">Adventure Trail</p>
          <h2>{title}</h2>
        </div>
      </div>

      <div className="trail-path">
        {obstacles.map((obstacle, index) => {
          const isCompleted = index < currentObstacleIndex;
          const isCurrent = index === currentObstacleIndex;

          return (
            <div
              className={`trail-node ${
                isCompleted ? "completed" : isCurrent ? "current" : "locked"
              }`}
              key={obstacle.id}
            >
              <span className="trail-node-icon">
                {isCompleted ? "✅" : obstacle.emoji}
              </span>

              <div>
                <strong>{obstacle.title}</strong>
                <p>
                  {isCompleted
                    ? "Cleared"
                    : isCurrent
                      ? "Current mission"
                      : "Ahead on the trail"}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}