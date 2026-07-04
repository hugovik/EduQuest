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
      math: { unlocked: true, is_unlocked: true, is_available: true, coming_soon: false, reason: "Unlocked by default" },
      writing: {
        unlocked: false,
        is_unlocked: false,
        is_available: false,
        coming_soon: true,
        reason: adventureUnlockRules.writing.reason,
        lock_reason: adventureUnlockRules.writing.reason,
        unlock_requirement: adventureUnlockRules.writing.requirement,
      },
    }),
  });

  try {
    const unlocks = await getAdventureUnlocks();

    assert(unlocks.math.unlocked === true, "Unlocked card should allow navigation.");
    assert(unlocks.writing.unlocked === false, "Coming soon card should be locked.");
    assert(unlocks.writing.coming_soon === true, "Coming soon state should be exposed.");
    assert(
      adventureUnlockRules.writing.requirement.includes("Reading Forest"),
      "Unlock copy should be child-friendly and specific."
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
}
