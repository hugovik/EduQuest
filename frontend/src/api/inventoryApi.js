import { API_BASE_URL } from "../config/api.js";

export async function getInventory() {
  const response = await fetch(API_BASE_URL + "/inventory");

  if (!response.ok) {
    throw new Error("Unable to load inventory.");
  }

  return response.json();
}

export async function addInventoryItem({
  itemKey,
  quantity = 1,
  sourceRegion = null,
  itemName = null,
  itemType = null,
  description = null,
}) {
  const response = await fetch(API_BASE_URL + "/inventory/items", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      item_key: itemKey,
      quantity,
      source_region: sourceRegion,
      item_name: itemName,
      item_type: itemType,
      description,
    }),
  });

  if (!response.ok) {
    throw new Error("Inventory item add failed: " + response.status);
  }

  return response.json();
}

export async function consumeInventoryItem({ itemKey, quantity = 1 }) {
  const response = await fetch(API_BASE_URL + "/inventory/items/consume", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      item_key: itemKey,
      quantity,
    }),
  });

  if (!response.ok) {
    throw new Error("Inventory item consume failed: " + response.status);
  }

  return response.json();
}

export async function rewardCorrectAnswer({ obstacleId }) {
  const response = await fetch(API_BASE_URL + "/inventory/reward", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      obstacle_id: obstacleId,
    }),
  });

  if (!response.ok) {
    throw new Error("Reward failed: " + response.status);
  }

  return response.json();
}

export async function applyIncorrectAnswerPenalty({ obstacleId }) {
  const response = await fetch(API_BASE_URL + "/inventory/penalty", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      obstacle_id: obstacleId,
    }),
  });

  if (!response.ok) {
    throw new Error("Penalty failed: " + response.status);
  }

  return response.json();
}
