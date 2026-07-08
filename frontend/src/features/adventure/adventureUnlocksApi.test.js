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
      writing: { unlocked: true, is_unlocked: true, is_available: true, coming_soon: false, reason: adventureUnlockRules.writing.reason },
      science: { unlocked: true, is_unlocked: true, is_available: true, coming_soon: false, reason: adventureUnlockRules.science.reason },
      geography: {
        unlocked: false,
        is_unlocked: false,
        is_available: false,
        coming_soon: true,
        reason: adventureUnlockRules.geography.reason,
        lock_reason: adventureUnlockRules.geography.reason,
        unlock_requirement: adventureUnlockRules.geography.requirement,
      },
    }),
  });

  try {
    const unlocks = await getAdventureUnlocks();

    assert(unlocks.math.unlocked === true, "Unlocked card should allow navigation.");
    assert(unlocks.writing.unlocked === true, "Writing Kingdom should allow navigation.");
    assert(unlocks.science.unlocked === true, "Science Lab should allow navigation.");
    assert(unlocks.geography.unlocked === false, "Coming soon card should be locked.");
    assert(unlocks.geography.coming_soon === true, "Coming soon state should be exposed.");
    assert(
      adventureUnlockRules.geography.requirement.includes("Science Lab"),
      "Unlock copy should be child-friendly and specific."
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
}
