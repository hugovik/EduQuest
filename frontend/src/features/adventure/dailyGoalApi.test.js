import { getDailyGoal, getDailyStreak, progressDailyGoal } from "../../api/dailyGoalApi.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export async function runDailyGoalApiTests() {
  const originalFetch = globalThis.fetch;
  const calls = [];

  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url, options });

    if (String(url).endsWith("/daily-goal")) {
      return {
        ok: true,
        json: async () => ({
          current_correct_answers: 4,
          target_correct_answers: 10,
          completed: false,
        }),
      };
    }

    if (String(url).endsWith("/daily-goal/progress")) {
      return {
        ok: true,
        json: async () => ({
          daily_goal: { current_correct_answers: 5 },
          completed_today: false,
          events: ["Daily Goal Progress"],
        }),
      };
    }

    return {
      ok: true,
      json: async () => ({ current_streak_days: 3, longest_streak_days: 5 }),
    };
  };

  try {
    const goal = await getDailyGoal();
    const progress = await progressDailyGoal();
    const streak = await getDailyStreak();

    assert(goal.current_correct_answers === 4, "Daily goal should load.");
    assert(progress.daily_goal.current_correct_answers === 5, "Daily goal progress should update.");
    assert(streak.current_streak_days === 3, "Daily streak should load.");
    assert(calls[1].options.method === "POST", "Progress should use POST.");
  } finally {
    globalThis.fetch = originalFetch;
  }
}
