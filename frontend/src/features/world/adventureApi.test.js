import { getAdventureProgressSummary } from "../../api/adventureProgressApi.js";
import { getAdventureUnlocks } from "../../api/adventureUnlocksApi.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export async function runAdventureApiTests() {
  const originalFetch = globalThis.fetch;
  const calls = [];

  globalThis.fetch = async (url) => {
    calls.push(String(url));

    if (String(url).endsWith("/adventures/progress/summary")) {
      return {
        ok: true,
        json: async () => ({ math: { completed_quests: 1, total_quests: 2 } }),
      };
    }

    if (String(url).endsWith("/adventures/unlocks")) {
      return {
        ok: true,
        json: async () => ({ math: { unlocked: true } }),
      };
    }

    return { ok: false, json: async () => ({}) };
  };

  try {
    const progress = await getAdventureProgressSummary();
    const unlocks = await getAdventureUnlocks();

    assert(progress.math.completed_quests === 1, "Adventure progress should load.");
    assert(unlocks.math.unlocked === true, "Adventure unlocks should load.");
    assert(calls[0].endsWith("/adventures/progress/summary"), "Progress URL should be used.");
    assert(calls[1].endsWith("/adventures/unlocks"), "Unlock URL should be used.");
  } finally {
    globalThis.fetch = originalFetch;
  }
}
