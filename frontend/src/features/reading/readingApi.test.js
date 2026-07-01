import {
  getReadingPassages,
  getReadingProgress,
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
    const result = await submitReadingAnswers({
      passageId: "reading-l2-01",
      answers: { q1: "Beside the old tree" },
    });

    assert(passages[0].level === 2, "Reading passages should load by level.");
    assert(progress[0].completed === true, "Reading progress should load.");
    assert(result.rewards.xp === 5, "Reading submit should return rewards.");
    assert(calls[2].options.method === "POST", "Reading submit should use POST.");
  } finally {
    globalThis.fetch = originalFetch;
  }
}
