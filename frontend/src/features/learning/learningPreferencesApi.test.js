import { updateLearningPreference } from "../../api/learningPreferencesApi.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export async function runLearningPreferencesApiTests() {
  const originalFetch = globalThis.fetch;
  const calls = [];

  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return {
      ok: true,
      json: async () => ({
        id: 1,
        child_id: 1,
        adventure_type: "math",
        override_level: JSON.parse(options.body).override_level,
      }),
    };
  };

  try {
    const selected = await updateLearningPreference("math", 3);
    const reset = await updateLearningPreference("math", null);

    assert(
      calls[0].url.endsWith("/learning/preferences/math"),
      "Updating a level should call the adventure preference endpoint."
    );
    assert(
      calls[0].options.method === "PUT",
      "Updating a level should use PUT."
    );
    assert(selected.override_level === 3, "Selecting a level should save that level.");
    assert(reset.override_level === null, "Reset should save null.");
  } finally {
    globalThis.fetch = originalFetch;
  }
}
