import { adventures, getAdventureById } from "./adventureConfig.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export function runAdventureConfigTests() {
  assert(adventures.length === 7, "Adventure Hub should list seven worlds.");
  assert(getAdventureById("math")?.enabled === true, "Math Mountains should be enabled.");
  assert(getAdventureById("math")?.route === "math", "Math Mountains should navigate to math.");

  const comingSoonAdventures = adventures.filter((adventure) => adventure.id !== "math");
  assert(
    comingSoonAdventures.every((adventure) => adventure.enabled === false),
    "Future adventures should be disabled for now."
  );
  assert(
    comingSoonAdventures.every((adventure) => adventure.status === "Coming Soon"),
    "Future adventures should show Coming Soon status."
  );
}
