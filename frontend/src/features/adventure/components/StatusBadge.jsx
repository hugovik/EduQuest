export default function StatusBadge({ status }) {
  const config = {
    completed: {
      label: "Completed",
      icon: "✅",
      className: "status-completed",
    },
    new: {
      label: "New",
      icon: "🟢",
      className: "status-new",
    },
    locked: {
      label: "Locked",
      icon: "🔒",
      className: "status-locked",
    },
  };

  const badge = config[status] ?? config.locked;

  return (
    <span className={`status-badge ${badge.className}`}>
      {badge.icon} {badge.label}
    </span>
  );
}