import { worldRegions } from "./worldRegionConfig.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export function runWorldRegionConfigTests() {
  const regionIds = worldRegions.map((region) => region.id);
  const mathRegion = worldRegions.find((region) => region.id === "math-mountains");
  const readingRegion = worldRegions.find((region) => region.id === "reading-forest");

  assert(regionIds.includes("treehouse"), "World Map should include Treehouse.");
  assert(regionIds.includes("math-mountains"), "World Map should include Math Mountains.");
  assert(regionIds.includes("reading-forest"), "World Map should include Reading Forest.");
  assert(mathRegion.enabled === true, "Math Mountains should be enabled.");
  assert(mathRegion.screen === "math", "Math Mountains should navigate to math.");
  assert(readingRegion.enabled === true, "Reading Forest should be enabled.");
  assert(readingRegion.screen === "reading", "Reading Forest should navigate to reading.");
}
