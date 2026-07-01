import { API_BASE_URL } from "../config/api.js";

export async function getDailyGoal() {
  const response = await fetch(`${API_BASE_URL}/daily-goal`);

  if (!response.ok) {
    throw new Error("Unable to load daily goal.");
  }

  return response.json();
}

export async function progressDailyGoal() {
  const response = await fetch(`${API_BASE_URL}/daily-goal/progress`, {
    method: "POST",
  });

  if (!response.ok) {
    throw new Error("Unable to update daily goal.");
  }

  return response.json();
}

export async function getDailyStreak() {
  const response = await fetch(`${API_BASE_URL}/daily-streak`);

  if (!response.ok) {
    throw new Error("Unable to load daily streak.");
  }

  return response.json();
}
