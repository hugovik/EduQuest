import { treehouseControls } from "../treehouseConfig";

export default function TreehouseNavigation({
  inventoryCount = 0,
  onGoToDev,
  onGoToWorld,
  onOpenObject,
}) {
  function handleControl(controlId) {
    if (controlId === "bag" && onOpenObject) {
      onOpenObject("inventory");
      return;
    }

    if (controlId === "settings" && onGoToDev) {
      onGoToDev();
      return;
    }

    if (controlId === "settings" && onOpenObject) {
      onOpenObject("settings");
    }
  }

  return (
    <section className="treehouse-navigation-card" aria-label="Treehouse controls">
      <div className="treehouse-control-grid">
        <button className="secondary-button" type="button" onClick={onGoToWorld}>
          🗺️ World Map
        </button>
        {treehouseControls.map((control) => {
          const isBag = control.id === "bag";
          const isSettings = control.id === "settings";
          const disabled = isSettings && !onGoToDev && !onOpenObject;

          return (
            <button
              aria-label={control.ariaLabel}
              className="secondary-button"
              disabled={disabled}
              key={control.id}
              type="button"
              onClick={() => handleControl(control.id)}
            >
              {control.icon} {control.label}
              {isBag ? ` (${inventoryCount})` : ""}
            </button>
          );
        })}
      </div>
    </section>
  );
}
