import {
  evaluateAchievementEvent,
  getAchievements,
  getEarnedAchievements,
} from "../../api/achievementApi.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export async function runAchievementApiTests() {
  const originalFetch = globalThis.fetch;
  const calls = [];

  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url, options });

    if (String(url).endsWith("/achievements/earned")) {
      return {
        ok: true,
        json: async () => ([
          { achievement_id: "first_math_answer" },
        ]),
      };
    }

    if (String(url).endsWith("/achievements/evaluate")) {
      return {
        ok: true,
        json: async () => ({
          newly_earned: [{ id: "first_adventure_entered" }],
        }),
      };
    }

    return {
      ok: true,
      json: async () => ([
        { id: "first_math_answer", name: "First Step Solver" },
      ]),
    };
  };

  try {
    const achievements = await getAchievements();
    const earned = await getEarnedAchievements();
    const evaluated = await evaluateAchievementEvent({
      eventType: "adventure_entered",
      sourceAdventure: "math",
    });

    assert(achievements[0].id === "first_math_answer", "Achievements should load.");
    assert(earned[0].achievement_id === "first_math_answer", "Earned achievements should load.");
    assert(
      evaluated.newly_earned[0].id === "first_adventure_entered",
      "Achievement evaluation should return newly earned badges."
    );
    assert(calls[2].options.method === "POST", "Evaluation should use POST.");
  } finally {
    globalThis.fetch = originalFetch;
  }
}
