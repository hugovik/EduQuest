import { getAdventure, getAdventureProgress, getAdventures } from "../../api/adventuresApi.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export async function runAdventuresApiTests() {
  const originalFetch = globalThis.fetch;
  const calls = [];

  globalThis.fetch = async (url) => {
    calls.push(String(url));

    if (String(url).endsWith("/adventures")) {
      return {
        ok: true,
        json: async () => ([{ id: "math-mountains", title: "Math Mountains" }]),
      };
    }

    if (String(url).endsWith("/adventures/math-mountains/progress")) {
      return {
        ok: true,
        json: async () => ({ adventure_id: "math-mountains", xp_earned: 25 }),
      };
    }

    if (String(url).endsWith("/adventures/math-mountains")) {
      return {
        ok: true,
        json: async () => ({ id: "math-mountains", is_playable: true }),
      };
    }

    return { ok: false, json: async () => ({}) };
  };

  try {
    const adventures = await getAdventures();
    const adventure = await getAdventure("math-mountains");
    const progress = await getAdventureProgress("math-mountains");

    assert(adventures[0].id === "math-mountains", "Adventures should load.");
    assert(adventure.is_playable === true, "Single adventure should load.");
    assert(progress.xp_earned === 25, "Adventure progress should load.");
    assert(calls[0].endsWith("/adventures"), "Adventures URL should be used.");
    assert(calls[1].endsWith("/adventures/math-mountains"), "Adventure URL should be used.");
    assert(calls[2].endsWith("/adventures/math-mountains/progress"), "Adventure progress URL should be used.");
  } finally {
    globalThis.fetch = originalFetch;
  }
}
