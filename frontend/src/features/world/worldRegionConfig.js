import { adventureRegistry, getAdventureByRoute } from "../adventure/adventureRegistry.js";

const worldRegionIds = [
  "tree-house",
  "math-mountains",
  "reading-forest",
  "writing-kingdom",
  "science-lab",
  "geography-island",
  "music-valley",
];

export const worldRegions = worldRegionIds.map((adventureId) => {
  const adventure = adventureRegistry.find((item) => item.id === adventureId);

  return {
    id: adventure.id,
    title: adventure.title,
    adventureType: adventure.subject,
    screen: adventure.route,
    description: adventure.description,
    icon: adventure.icon,
    enabled: adventure.isPlayable,
    unlockedByDefault: adventure.isPlayable,
    comingSoonLabel: adventure.isComingSoon ? "Coming soon" : undefined,
    registryId: adventure.id,
  };
});

export function getWorldRegionByRoute(route) {
  const adventure = getAdventureByRoute(route);
  return adventure ? worldRegions.find((region) => region.registryId === adventure.id) : undefined;
}
