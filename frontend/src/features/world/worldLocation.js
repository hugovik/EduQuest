export const WORLD_LOCATIONS = [ 
  
  "treehouse",
  "world",
  "math",
  "reading",
  "writing",
  "science",
  "geography",
  "music",
];

export function normalizeWorldLocation(location) {
  return WORLD_LOCATIONS.includes(location) ? location : "treehouse";
}

export function getResumeLocationFromWorldState(worldState) {
  return normalizeWorldLocation(worldState?.active_location);
}
