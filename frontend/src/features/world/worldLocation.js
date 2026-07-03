export const WORLD_LOCATIONS = ["treehouse", "world", "math", "reading"];

export function normalizeWorldLocation(location) {
  return WORLD_LOCATIONS.includes(location) ? location : "treehouse";
}

export function getResumeLocationFromWorldState(worldState) {
  return normalizeWorldLocation(worldState?.active_location);
}
