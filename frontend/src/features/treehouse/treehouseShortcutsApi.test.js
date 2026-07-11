import {
  contributeToTreehouseShortcut,
  getTreehouseShortcut,
  getTreehouseShortcuts,
} from "../../api/treehouseShortcutsApi.js";

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

export async function runTreehouseShortcutsApiTests() {
  const originalFetch = globalThis.fetch;
  const calls = [];

  globalThis.fetch = async (url, options = {}) => {
    calls.push({ url: String(url), options });

    if (String(url).endsWith("/treehouse/shortcuts")) {
      return {
        ok: true,
        json: async () => ({ shortcuts: [] }),
      };
    }

    if (String(url).endsWith("/treehouse/shortcuts/reading-forest-shortcut")) {
      return {
        ok: true,
        json: async () => ({ shortcut_id: "reading-forest-shortcut" }),
      };
    }

    if (String(url).endsWith("/treehouse/shortcuts/reading-forest-shortcut/contribute")) {
      return {
        ok: true,
        json: async () => ({ shortcut_id: "reading-forest-shortcut", stage: 2 }),
      };
    }

    return {
      ok: false,
      json: async () => ({ detail: "No test route matched." }),
    };
  };

  try {
    const list = await getTreehouseShortcuts();
    const shortcut = await getTreehouseShortcut("reading-forest-shortcut");
    const contribution = await contributeToTreehouseShortcut("reading-forest-shortcut");

    assert(Array.isArray(list.shortcuts), "Shortcut list should include shortcuts array.");
    assert(shortcut.shortcut_id === "reading-forest-shortcut", "Shortcut detail should load by ID.");
    assert(contribution.stage === 2, "Shortcut contribution should return updated stage.");
    assert(calls[0].url.endsWith("/treehouse/shortcuts"), "Shortcut list URL should be used.");
    assert(calls[2].options.method === "POST", "Shortcut contribution should use POST.");
  } finally {
    globalThis.fetch = originalFetch;
  }
}
