import TreehousePage from "./TreehousePage";

export function TreeHouseDashboard({ onGoToDev, onGoToReading, onGoToWorld }) {
  return (
    <TreehousePage
      onGoToDev={onGoToDev}
      onGoToReading={onGoToReading}
      onGoToWorld={onGoToWorld}
    />
  );
}
