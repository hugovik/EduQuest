import { ALL_STORAGE_KEYS } from "./storageKeys.js";

export function getStorageItem(key, fallbackValue = null) {
  const rawValue = localStorage.getItem(key);

  if (rawValue === null || rawValue === undefined) {
    return fallbackValue;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    return rawValue;
  }
}

export function setStorageItem(key, value) {
  if (value === null || value === undefined) {
    localStorage.removeItem(key);
    return;
  }

  if (typeof value === "string") {
    localStorage.setItem(key, value);
    return;
  }

  localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorageItem(key) {
  localStorage.removeItem(key);
}

export function resetStorageKeys(keys = ALL_STORAGE_KEYS) {
  keys.forEach((key) => removeStorageItem(key));
}

export function getStorageSnapshot(keys = ALL_STORAGE_KEYS) {
  return keys.reduce((snapshot, key) => {
    snapshot[key] = localStorage.getItem(key);
    return snapshot;
  }, {});
}

export function importStorageSnapshot(snapshot, allowedKeys = ALL_STORAGE_KEYS) {
  Object.entries(snapshot).forEach(([key, value]) => {
    if (!allowedKeys.includes(key)) return;

    if (value === null || value === undefined) {
      removeStorageItem(key);
    } else {
      localStorage.setItem(key, value);
    }
  });
}

export function exportStorageSnapshot(keys = ALL_STORAGE_KEYS) {
  return JSON.stringify(getStorageSnapshot(keys), null, 2);
}