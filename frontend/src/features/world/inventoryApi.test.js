import { addInventoryItem, consumeInventoryItem, getInventory } from "../../api/inventoryApi.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export async function runInventoryApiTests() {
  const originalFetch = globalThis.fetch;
  const calls = [];

  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), options });

    if (String(url).endsWith("/inventory")) {
      return {
        ok: true,
        json: async () => ({ items: [] }),
      };
    }

    if (String(url).endsWith("/inventory/items")) {
      return {
        ok: true,
        json: async () => ({ item_key: JSON.parse(options.body).item_key, quantity: 1 }),
      };
    }

    if (String(url).endsWith("/inventory/items/consume")) {
      return {
        ok: true,
        json: async () => ({ item_key: JSON.parse(options.body).item_key, quantity: 0 }),
      };
    }

    return { ok: false, json: async () => ({}) };
  };

  try {
    const inventory = await getInventory();
    const added = await addInventoryItem({ itemKey: "reading_leaf", sourceRegion: "reading" });
    const consumed = await consumeInventoryItem({ itemKey: "reading_leaf" });

    assert(Array.isArray(inventory.items), "Inventory should include items array.");
    assert(added.item_key === "reading_leaf", "Add item endpoint should be used.");
    assert(consumed.item_key === "reading_leaf", "Consume item endpoint should be used.");
    assert(calls[1].url.endsWith("/inventory/items"), "Inventory add URL should be used.");
    assert(calls[2].url.endsWith("/inventory/items/consume"), "Inventory consume URL should be used.");
  } finally {
    globalThis.fetch = originalFetch;
  }
}
