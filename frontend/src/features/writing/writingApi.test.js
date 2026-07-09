import { completeWritingLesson, getWritingProgress } from "../../api/writingApi.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export async function runWritingApiTests() {
  const originalFetch = globalThis.fetch;
  const calls = [];

  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), options });

    if (String(url).endsWith("/writing/progress")) {
      return {
        ok: true,
        json: async () => ({
          completed_lessons: ["missing-period-1"],
          lessons_completed: 1,
          total_lessons: 7,
          xp_earned: 5,
        }),
      };
    }

    if (String(url).endsWith("/writing/lessons/missing-period-1/complete")) {
      return {
        ok: true,
        json: async () => ({
          lesson_id: "missing-period-1",
          xp_awarded: 5,
          already_completed: false,
        }),
      };
    }

    return { ok: false, json: async () => ({}) };
  };

  try {
    const progress = await getWritingProgress();
    const completion = await completeWritingLesson("missing-period-1");

    assert(progress.xp_earned === 5, "Writing progress should load XP.");
    assert(completion.xp_awarded === 5, "Writing completion should return XP.");
    assert(calls[0].url.endsWith("/writing/progress"), "Writing progress URL should be used.");
    assert(
      calls[1].url.endsWith("/writing/lessons/missing-period-1/complete"),
      "Writing completion URL should be used."
    );
    assert(calls[1].options.method === "POST", "Writing completion should post.");
  } finally {
    globalThis.fetch = originalFetch;
  }
}
