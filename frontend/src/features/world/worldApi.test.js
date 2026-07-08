import { getWorldProgressSummary, getWorldState, travelToWorldLocation } from "../../api/worldApi.js";
import { getResumeLocationFromWorldState, normalizeWorldLocation } from "./worldLocation.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export async function runWorldApiTests() {
  const originalFetch = globalThis.fetch;
  const calls = [];

  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), options });

    if (String(url).endsWith("/world/state")) {
      return {
        ok: true,
        json: async () => ({
          active_location: "reading",
          visited_regions: ["reading"],
          available_regions: ["treehouse", "world", "math", "reading"],
          unlocked_regions: ["math", "reading"],
          locked_regions: [],
          inventory: { bricks: 0, coins: 0, stars: 0, items: [{ item_key: "reading_leaf", item_name: "Reading Leaf", quantity: 1, source_region: "reading" }] },
          progress_summary: { reading: { completed_quests: 1 } },
          unlocks: { reading: { unlocked: true } },
          regions: [
            {
              region_key: "math",
              title: "Math Mountains",
              adventure_type: "math",
              status: "unlocked",
              is_unlocked: true,
              is_available: true,
              lock_reason: null,
              unlock_requirement: null,
              coming_soon: false,
              progress: { completed_quests: 0, total_quests: 1 },
            },
            {
              region_key: "writing",
              title: "Writing Kingdom",
              adventure_type: "writing",
              status: "coming_soon",
              is_unlocked: false,
              is_available: false,
              lock_reason: "Writing Kingdom is coming soon.",
              unlock_requirement: "Complete Math Mountains and Reading Forest milestones to unlock Writing Kingdom.",
              coming_soon: true,
              progress: { completed_quests: 0, total_quests: 0 },
            },
          ],
          overarching_quest: {
            quest_key: "restore_eduquest_magic",
            title: "Restore the EduQuest World",
            status: "in_progress",
            progress_percent: 50,
            steps: [{ key: "visit_reading", status: "completed", region: "reading" }],
            reward_items: [{ item_key: "world_heart", item_name: "World Heart" }],
            reward_xp: 25,
          },
          quest_steps: [{ key: "visit_reading", status: "completed", region: "reading" }],
          quest_progress_percent: 50,
          quest_status: "in_progress",
        }),
      };
    }

    if (String(url).endsWith("/world/progress/summary")) {
      return {
        ok: true,
        json: async () => ({
          active_location: "reading",
          last_region: "reading",
          visited_regions: ["math", "reading"],
          total_regions: 6,
          unlocked_regions: 2,
          completed_regions: 0,
          world_quest: {
            title: "Restore the EduQuest World",
            progress_percent: 50,
            status: "in_progress",
          },
          inventory_count: 3,
          math: { completed_quests: 1 },
          reading: { completed_quests: 1 },
        }),
      };
    }

    if (String(url).endsWith("/world/travel")) {
      return {
        ok: true,
        json: async () => ({ active_location: JSON.parse(options.body).location }),
      };
    }

    return { ok: false, json: async () => ({}) };
  };

  try {
    const state = await getWorldState();
    const worldSummary = await getWorldProgressSummary();
    const travelState = await travelToWorldLocation("math");

    assert(state.active_location === "reading", "World state should load active location.");
    assert(state.progress_summary.reading.completed_quests === 1, "World state should include progress summary.");
    assert(state.unlocks.reading.unlocked === true, "World state should include unlocks.");
    assert(state.inventory.items[0].item_key === "reading_leaf", "World state should include inventory items.");
    assert(state.regions[0].region_key === "math", "World state should include normalized regions.");
    assert(state.regions[1].coming_soon === true, "World state should identify coming soon regions.");
    assert(state.regions[1].lock_reason.includes("Writing Kingdom"), "World state should include lock reason.");
    assert(state.overarching_quest.quest_key === "restore_eduquest_magic", "World state should include overarching quest.");
    assert(state.quest_progress_percent === 50, "World state should include quest progress percent.");
    assert(state.quest_steps[0].status === "completed", "World state should include quest steps.");
    assert(worldSummary.active_location === "reading", "World progress summary should include active location.");
    assert(worldSummary.world_quest.progress_percent === 50, "World progress summary should include quest progress.");
    assert(worldSummary.inventory_count === 3, "World progress summary should include inventory count.");
    assert(travelState.active_location === "math", "World travel should return saved location.");
    assert(calls[0].url.endsWith("/world/state"), "World state URL should be used.");
    assert(calls[1].url.endsWith("/world/progress/summary"), "World progress summary URL should be used.");
    assert(calls[2].url.endsWith("/world/travel"), "World travel URL should be used.");
    assert(calls[2].options.method === "POST", "World travel should post.");
    assert(normalizeWorldLocation("reading") === "reading", "Reading should be resumable.");
    assert(normalizeWorldLocation("science") === "science", "Science should be resumable.");
    assert(getResumeLocationFromWorldState({ active_location: "world" }) === "world", "App should resume World Map.");
    assert(getResumeLocationFromWorldState({ active_location: "math" }) === "math", "App should resume Math Mountains.");
    assert(getResumeLocationFromWorldState({ active_location: "reading" }) === "reading", "App should resume Reading Forest.");
    assert(getResumeLocationFromWorldState(null) === "treehouse", "Failed world state should fall back safely.");
  } finally {
    globalThis.fetch = originalFetch;
  }
}
