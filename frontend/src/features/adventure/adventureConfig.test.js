import { adventures, getAdventureById } from "./adventureConfig.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export function runAdventureConfigTests() {
  assert(adventures.length === 6, "Adventure Hub should list six learning worlds.");
  assert(getAdventureById("math")?.enabled === true, "Math Mountains should be enabled.");
  assert(getAdventureById("math-mountains")?.enabled === true, "Math Mountains should resolve by registry id.");
  assert(getAdventureById("math")?.route === "math", "Math Mountains should navigate to math.");
  assert(getAdventureById("reading")?.enabled === true, "Reading Forest should be enabled.");
  assert(getAdventureById("reading")?.route === "reading", "Reading Forest should navigate to reading.");
  assert(getAdventureById("writing")?.enabled === true, "Writing Kingdom should be enabled.");
  assert(getAdventureById("science")?.enabled === true, "Science Lab should be enabled.");

  const comingSoonAdventures = adventures.filter(
    (adventure) => !["math", "reading", "writing", "science"].includes(adventure.id)
  );
  assert(
    comingSoonAdventures.every((adventure) => adventure.enabled === false),
    "Future adventures should be disabled for now."
  );
  assert(
    comingSoonAdventures.every((adventure) => adventure.status === "Coming Soon"),
    "Future adventures should show Coming Soon status."
  );
}
