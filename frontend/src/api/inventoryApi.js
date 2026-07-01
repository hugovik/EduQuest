import { API_BASE_URL } from "../config/api";

export async function getInventory() {
  const response = await fetch(`${API_BASE_URL}/inventory`);

  if (!response.ok) {
    throw new Error("Unable to load inventory.");
  }

  return response.json();
}

export async function rewardCorrectAnswer({ obstacleId }) {
  const response = await fetch(`${API_BASE_URL}/inventory/reward`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      obstacle_id: obstacleId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Reward failed: ${response.status}`);
  }

  return response.json();
}

export async function applyIncorrectAnswerPenalty({ obstacleId }) {
  const response = await fetch(`${API_BASE_URL}/inventory/penalty`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      obstacle_id: obstacleId,
    }),
  });

  if (!response.ok) {
    throw new Error(`Penalty failed: ${response.status}`);
  }

  return response.json();
}
