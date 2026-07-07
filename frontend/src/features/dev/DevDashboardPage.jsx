import { useMemo, useState } from "react";
import { resetBackendProgress } from "../../api/devApi.js";
import {
  exportStorageSnapshot,
  getStorageSnapshot,
  importStorageSnapshot,
  resetStorageKeys,
} from "../storage/storageService.js";
import PageHeader from "../../components/PageHeader.jsx";
import DashboardLayout from "../../components/DashboardLayout.jsx";
import { ACHIEVEMENTS } from "../achievements/achievements.js";
import { getUnlockedAchievements } from "../achievements/achievementService.js";

export default function DevDashboardPage({ onBack }) {
  const [status, setStatus] = useState("");
  const [snapshot, setSnapshot] = useState(() => getStorageSnapshot());
  const [importText, setImportText] = useState("");

  const prettySnapshot = useMemo(
    () => JSON.stringify(snapshot, null, 2),
    [snapshot]
  );

  function refreshSnapshot(message = "Snapshot refreshed.") {
    setSnapshot(getStorageSnapshot());
    setStatus(message);
  }

  function confirmAction(message) {
    return window.confirm(message);
  }

  async function handleResetLocalProgress() {
    if (!confirmAction("Reset all local EduQuest progress?")) return;

    resetStorageKeys();
    refreshSnapshot("Local progress reset.");
  }

  async function handleResetBackendProgress() {
    if (!confirmAction("Reset backend progress?")) return;

    await resetBackendProgress();
    refreshSnapshot("Backend progress reset.");
  }

  async function handleExport() {
    const data = exportStorageSnapshot();
    await navigator.clipboard?.writeText(data);
    setStatus("Progress JSON copied to clipboard.");
  }

  function handleImport() {
    if (!confirmAction("Import progress JSON and overwrite current local state?")) {
      return;
    }

    try {
      const parsed = JSON.parse(importText);
      importStorageSnapshot(parsed);
      refreshSnapshot("Progress JSON imported.");
      setImportText("");
    } catch {
      setStatus("Import failed. JSON is invalid.");
    }
  }

  return (
    <DashboardLayout>

        <PageHeader
            eyebrow="Development Only"
            title="Developer Dashboard"
            description="Reset, inspect, export, and import EduQuest progress while developing new adventures."
            onBack={onBack}
            backLabel="← Back to Tree House"
        />

    {status && <p className="helper-text">{status}</p>}

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
        <h2>Achievements</h2>

        <div className="button-row">
          <button className="secondary-button" onClick={handleResetLocalProgress}>
            Reset Achievements
          </button>
        </div>

        <div>
          {ACHIEVEMENTS.map((achievement) => {
            const unlocked = getUnlockedAchievements().includes(achievement.id);

            return (
              <p key={achievement.id}>
                {unlocked ? "✅" : "⬜"} {achievement.icon} {achievement.title}
              </p>
            );
          })}
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
    </DashboardLayout>
  );
}