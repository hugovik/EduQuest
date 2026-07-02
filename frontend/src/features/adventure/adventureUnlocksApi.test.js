import { getAdventureUnlocks } from "../../api/adventureUnlocksApi.js";
import { adventureUnlockRules } from "./adventureUnlockConfig.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export async function runAdventureUnlocksApiTests() {
  const originalFetch = globalThis.fetch;

  globalThis.fetch = async () => ({
    ok: true,
    json: async () => ({
      math: { unlocked: true, reason: "Unlocked by default" },
      story: {
        unlocked: false,
        reason: adventureUnlockRules.story.reason,
        current: 1,
        required: 3,
      },
    }),
  });

  try {
    const unlocks = await getAdventureUnlocks();

    assert(unlocks.math.unlocked === true, "Unlocked card should allow navigation.");
    assert(unlocks.story.unlocked === false, "Locked card should be locked.");
    assert(unlocks.story.required === 3, "Locked card should include requirement.");
    assert(
      adventureUnlockRules.story.reason.includes("Reading Forest"),
      "Unlock copy should be child-friendly and specific."
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
}
