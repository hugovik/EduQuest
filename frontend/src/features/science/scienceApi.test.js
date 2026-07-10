import {
  completeScienceTopicReview,
  completeScienceExperiment,
  getScienceExperiments,
  getScienceProgress,
} from "../../api/scienceApi.js";

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

    if (String(url).endsWith("/science/experiments") && !String(url).includes("/complete")) {
      return {
        ok: true,
        json: async () => ([
          {
            id: "electricity-1",
            title: "Light the Bulb",
            topic_id: "electricity",
            activity_type: "observation",
            xp_reward: 10,
            xp: 10,
            order: 1,
            requires: null,
          },
        ]),
      };
    }

    if (String(url).endsWith("/science/progress")) {
      return {
        ok: true,
        json: async () => ({
          completed_experiments: ["electricity-1"],
          experiments_completed: 1,
          total_experiments: 10,
          xp_earned: 10,
          topics: [
            {
              id: "electricity",
              title: "Electricity",
              completed: false,
              completed_experiments: 1,
              total_experiments: 5,
              progress_percent: 20,
              reward_earned: false,
              review: {
                attempts: 1,
                best_percentage: 80,
                mastery_level: "strong",
              },
            },
          ],
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
          topic_completed: true,
          topic_id: "electricity",
          topic_reward: {
            item_key: "lightning_crystal",
            name: "Lightning Crystal",
            icon: "⚡",
            quantity: 1,
          },
        }),
      };
    }

    if (String(url).endsWith("/science/reviews/electricity/complete")) {
      return {
        ok: true,
        json: async () => ({
          topic_id: "electricity",
          score: 4,
          total_questions: 5,
          percentage: 80,
          best_percentage: 80,
          attempts: 1,
          mastery_level: "strong",
          xp_awarded: 0,
          results: [{ experiment_id: "electricity-1", correct: true }],
        }),
      };
    }

    return { ok: false, json: async () => ({}) };
  };

  try {
    const experiments = await getScienceExperiments();
    const progress = await getScienceProgress();
    const completion = await completeScienceExperiment("electricity-1");
    const review = await completeScienceTopicReview("electricity", [
      { experiment_id: "electricity-1", answer: "Battery", correct: false, score: 0 },
    ]);

    assert(experiments[0].topic_id === "electricity", "Science registry metadata should load.");
    assert(experiments[0].xp_reward === 10, "Science registry XP should load.");
    assert(progress.xp_earned === 10, "Science progress should load XP.");
    assert(progress.topics[0].progress_percent === 20, "Science topic progress should load.");
    assert(progress.topics[0].review.best_percentage === 80, "Science topic review summary should load.");
    assert(completion.xp_awarded === 10, "Science completion should return XP.");
    assert(completion.topic_reward.item_key === "lightning_crystal", "Topic reward should return.");
    assert(review.score === 4, "Science review score should come from backend response.");
    assert(review.xp_awarded === 0, "Science review should remain zero-XP practice.");
    assert(calls[0].url.endsWith("/science/experiments"), "Science experiments URL should be used.");
    assert(calls[1].url.endsWith("/science/progress"), "Science progress URL should be used.");
    assert(
      calls[2].url.endsWith("/science/experiments/electricity-1/complete"),
      "Science completion URL should be used."
    );
    assert(calls[2].options.method === "POST", "Science completion should post.");
    assert(calls[3].url.endsWith("/science/reviews/electricity/complete"), "Science review URL should be used.");
    assert(calls[3].options.method === "POST", "Science review should post.");
    assert(
      JSON.parse(calls[3].options.body).answers[0].score === undefined,
      "Science review API should not submit an authoritative frontend score."
    );
    assert(
      JSON.parse(calls[3].options.body).answers[0].correct === undefined,
      "Science review API should not submit an authoritative frontend correctness flag."
    );
  } finally {
    globalThis.fetch = originalFetch;
  }
}
