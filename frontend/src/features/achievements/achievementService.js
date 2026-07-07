import { ACHIEVEMENTS } from "./achievements.js";

const STORAGE_KEY = "eduquest-achievements";

function loadAchievements() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? [];
  } catch {
    return [];
  }
}

function saveAchievements(achievements) {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(achievements)
  );
}

export function getUnlockedAchievements() {
  return loadAchievements();
}

export function isAchievementUnlocked(id) {
  return loadAchievements().includes(id);
}

export function unlockAchievement(id) {
  const unlocked = loadAchievements();

  if (unlocked.includes(id)) {
    return false;
  }

  unlocked.push(id);
  saveAchievements(unlocked);

  return true;
}

export function resetAchievements() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getAchievement(id) {
  return ACHIEVEMENTS.find(
    (achievement) => achievement.id === id
  );
}