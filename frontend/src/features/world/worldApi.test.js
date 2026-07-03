import { getWorldState, travelToWorldLocation } from "../../api/worldApi.js";
import { getResumeLocationFromWorldState, normalizeWorldLocation } from "./worldLocation.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export async function runWorldApiTests() {
  const originalFetch = globalThis.fetch;
  const calls = [];

  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), options });

    if (String(url).endsWith("/world/state")) {
      return {
        ok: true,
        json: async () => ({ active_location: "reading", visited_regions: ["reading"], available_regions: ["treehouse", "world", "math", "reading"], unlocked_regions: ["math", "reading"], locked_regions: [], inventory: { bricks: 0, coins: 0, stars: 0, items: [{ item_key: "reading_leaf", item_name: "Reading Leaf", quantity: 1, source_region: "reading" }] }, progress_summary: { reading: { completed_quests: 1 } }, unlocks: { reading: { unlocked: true } } }),
      };
    }

    if (String(url).endsWith("/world/travel")) {
      return {
        ok: true,
        json: async () => ({ active_location: JSON.parse(options.body).location }),
      };
    }

    return { ok: false, json: async () => ({}) };
  };

  try {
    const state = await getWorldState();
    const travelState = await travelToWorldLocation("math");

    assert(state.active_location === "reading", "World state should load active location.");
    assert(state.progress_summary.reading.completed_quests === 1, "World state should include progress summary.");
    assert(state.unlocks.reading.unlocked === true, "World state should include unlocks.");
    assert(state.inventory.items[0].item_key === "reading_leaf", "World state should include inventory items.");
    assert(travelState.active_location === "math", "World travel should return saved location.");
    assert(calls[0].url.endsWith("/world/state"), "World state URL should be used.");
    assert(calls[1].url.endsWith("/world/travel"), "World travel URL should be used.");
    assert(calls[1].options.method === "POST", "World travel should post.");
    assert(normalizeWorldLocation("reading") === "reading", "Reading should be resumable.");
    assert(normalizeWorldLocation("science") === "treehouse", "Invalid resume location should fall back.");
    assert(getResumeLocationFromWorldState({ active_location: "world" }) === "world", "App should resume World Map.");
    assert(getResumeLocationFromWorldState({ active_location: "math" }) === "math", "App should resume Math Mountains.");
    assert(getResumeLocationFromWorldState({ active_location: "reading" }) === "reading", "App should resume Reading Forest.");
    assert(getResumeLocationFromWorldState(null) === "treehouse", "Failed world state should fall back safely.");
  } finally {
    globalThis.fetch = originalFetch;
  }
}
