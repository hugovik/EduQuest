import {
  getReadingPassages,
  getReadingProgress,
  getReadingProgressSummary,
  submitReadingAnswers,
} from "../../api/readingApi.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export async function runReadingApiTests() {
  const originalFetch = globalThis.fetch;
  const calls = [];

  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url, options });

    if (String(url).includes("/reading/passages?") ) {
      return {
        ok: true,
        json: async () => ([{ id: "reading-l2-01", level: 2 }]),
      };
    }

    if (String(url).includes("/reading/progress/summary?")) {
      return {
        ok: true,
        json: async () => ({
          completed_passage_ids: ["reading-l2-01"],
          passages_completed: 1,
          questions_answered: 4,
          accuracy: 1,
          vocabulary_learned: 2,
          total_xp_earned: 20,
        }),
      };
    }

    if (String(url).endsWith("/reading/progress")) {
      return {
        ok: true,
        json: async () => ([{ passage_id: "reading-l2-01", completed: true }]),
      };
    }

    return {
      ok: true,
      json: async () => ({ score: 1, rewards: { xp: 5 } }),
    };
  };

  try {
    const passages = await getReadingPassages(2);
    const progress = await getReadingProgress();
    const summary = await getReadingProgressSummary(2);
    const result = await submitReadingAnswers({
      passageId: "reading-l2-01",
      answers: { q1: "Beside the old tree" },
    });

    assert(passages[0].level === 2, "Reading passages should load by level.");
    assert(progress[0].completed === true, "Reading progress should load.");
    assert(summary.passages_completed === 1, "Reading summary should load.");
    assert(String(calls[2].url).includes("level=2"), "Reading summary should load by level.");
    assert(result.rewards.xp === 5, "Reading submit should return rewards.");
    assert(calls[3].options.method === "POST", "Reading submit should use POST.");
  } finally {
    globalThis.fetch = originalFetch;
  }
}
