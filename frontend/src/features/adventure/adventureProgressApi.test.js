import { getAdventureProgressSummary } from "../../api/adventureProgressApi.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export async function runAdventureProgressApiTests() {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async (url) => {
    return {
      ok: true,
      json: async () => ({
        math: {
          completed_quests: 1,
          total_quests: 2,
          xp_earned: 25,
          level: 2,
          status: "in_progress",
        },
      }),
      url,
    };
  };

  try {
    const summary = await getAdventureProgressSummary();

    assert(summary.math.completed_quests === 1, "Progress data should load.");
    assert(summary.math.status === "in_progress", "Status should load safely.");
  } finally {
    globalThis.fetch = originalFetch;
  }
}
