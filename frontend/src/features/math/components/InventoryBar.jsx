export default function InventoryBar({ inventory }) {
  return (
    <section className="card inventory-bar" aria-label="Inventory">
      <span>🧱 {inventory?.bricks ?? 0} bricks</span>
      <span>🪙 {inventory?.coins ?? 0} coins</span>
      <span>⭐ {inventory?.stars ?? 0} stars</span>
    </section>
  );
}
