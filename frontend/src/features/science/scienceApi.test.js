import { completeScienceExperiment, getScienceProgress } from "../../api/scienceApi.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export async function runScienceApiTests() {
  const originalFetch = globalThis.fetch;
  const calls = [];

  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), options });

    if (String(url).endsWith("/science/progress")) {
      return {
        ok: true,
        json: async () => ({
          completed_experiments: ["electricity-1"],
          experiments_completed: 1,
          total_experiments: 10,
          xp_earned: 10,
        }),
      };
    }

    if (String(url).endsWith("/science/experiments/electricity-1/complete")) {
      return {
        ok: true,
        json: async () => ({
          experiment_id: "electricity-1",
          xp_awarded: 10,
          already_completed: false,
        }),
      };
    }

    return { ok: false, json: async () => ({}) };
  };

  try {
    const progress = await getScienceProgress();
    const completion = await completeScienceExperiment("electricity-1");

    assert(progress.xp_earned === 10, "Science progress should load XP.");
    assert(completion.xp_awarded === 10, "Science completion should return XP.");
    assert(calls[0].url.endsWith("/science/progress"), "Science progress URL should be used.");
    assert(
      calls[1].url.endsWith("/science/experiments/electricity-1/complete"),
      "Science completion URL should be used."
    );
    assert(calls[1].options.method === "POST", "Science completion should post.");
  } finally {
    globalThis.fetch = originalFetch;
  }
}
