import { useMemo, useState } from "react";
import { resetBackendProgress } from "../../api/devApi.js";

const STORAGE_KEYS = [
  "eduquest:world-state",
  "eduquest:inventory",
  "eduquest:writing-progress",
  "eduquest:writing-books",
  "eduquest:writing-stories",
  "eduquest:math-progress",
  "eduquest:reading-progress",
];

function getLocalSnapshot() {
  return STORAGE_KEYS.reduce((snapshot, key) => {
    snapshot[key] = localStorage.getItem(key);
    return snapshot;
  }, {});
}

function removeKeys(keys) {
  keys.forEach((key) => localStorage.removeItem(key));
}

export default function DevDashboardPage() {
  const [status, setStatus] = useState("");
  const [snapshot, setSnapshot] = useState(() => getLocalSnapshot());
  const [importText, setImportText] = useState("");

  const prettySnapshot = useMemo(
    () => JSON.stringify(snapshot, null, 2),
    [snapshot]
  );

  function refreshSnapshot(message = "Snapshot refreshed.") {
    setSnapshot(getLocalSnapshot());
    setStatus(message);
  }

  function confirmAction(message) {
    return window.confirm(message);
  }

  async function handleResetLocalProgress() {
    if (!confirmAction("Reset all local EduQuest progress?")) return;

    removeKeys(STORAGE_KEYS);
    refreshSnapshot("Local progress reset.");
  }

  async function handleResetBackendProgress() {
    if (!confirmAction("Reset backend progress?")) return;

    await resetBackendProgress();
    refreshSnapshot("Backend progress reset.");
  }

  function handleExport() {
    const data = JSON.stringify(getLocalSnapshot(), null, 2);
    navigator.clipboard?.writeText(data);
    setStatus("Progress JSON copied to clipboard.");
  }

  function handleImport() {
    if (!confirmAction("Import progress JSON and overwrite current local state?")) {
      return;
    }

    try {
      const parsed = JSON.parse(importText);

      Object.entries(parsed).forEach(([key, value]) => {
        if (!STORAGE_KEYS.includes(key)) return;

        if (value === null || value === undefined) {
          localStorage.removeItem(key);
        } else {
          localStorage.setItem(key, value);
        }
      });

      refreshSnapshot("Progress JSON imported.");
      setImportText("");
    } catch {
      setStatus("Import failed. JSON is invalid.");
    }
  }

  return (
    <main className="page-shell">
      <section className="card dev-dashboard">
        <p className="eyebrow">Development Only</p>
        <h1>Developer Dashboard</h1>
        <p>
          Reset, inspect, export, and import EduQuest progress while developing
          new adventures.
        </p>

        {status && <p className="helper-text">{status}</p>}
      </section>

      <section className="card">
        <h2>Progress Tools</h2>
        <div className="button-row">
          <button className="primary-button" onClick={handleResetLocalProgress}>
            Reset Local Progress
          </button>
          <button className="secondary-button" onClick={handleResetBackendProgress}>
            Reset Backend Progress
          </button>
          <button className="secondary-button" onClick={() => refreshSnapshot()}>
            Refresh Snapshot
          </button>
        </div>
      </section>

      <section className="card">
        <h2>Save Tools</h2>
        <div className="button-row">
          <button className="primary-button" onClick={handleExport}>
            Export Progress JSON
          </button>
          <button className="secondary-button" onClick={handleImport}>
            Import Progress JSON
          </button>
        </div>

        <textarea
          value={importText}
          onChange={(event) => setImportText(event.target.value)}
          placeholder="Paste exported progress JSON here..."
          rows={8}
        />
      </section>

      <section className="card">
        <h2>Raw Local State</h2>
        <pre>{prettySnapshot}</pre>
      </section>
    </main>
  );
}