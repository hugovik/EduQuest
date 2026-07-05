import { adventureRegistry, getAdventureBySubject } from "./adventureRegistry.js";

export const adventures = adventureRegistry
  .filter((adventure) => adventure.subject !== "home")
  .map((adventure) => ({
    id: adventure.subject,
    name: adventure.title,
    route: adventure.route,
    icon: adventure.icon,
    description: adventure.description,
    enabled: adventure.isPlayable,
    status: adventure.isComingSoon ? "Coming Soon" : "Ready",
    registryId: adventure.id,
  }));

export function getAdventureById(adventureId) {
  const registryAdventure = getAdventureBySubject(adventureId);

  return adventures.find((adventure) => adventure.id === adventureId)
    ?? adventures.find((adventure) => adventure.registryId === adventureId)
    ?? (registryAdventure && adventures.find(
      (adventure) => adventure.registryId === registryAdventure.id
    ));
}
