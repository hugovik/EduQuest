# Sprint 6 World Engine

## What Was Added

Sprint 6 introduced the shared World Engine foundation for EduQuest.

- World Map as the primary adventure navigation screen.
- Persistent world state for active location, last region, and visited regions.
- Shared world inventory visibility.
- Overarching quest line: Restore the EduQuest World.
- Centralized region unlock and coming-soon rules.
- Region travel feedback and backend travel validation.
- Tree House world progress summary for parent/player visibility.

## Backend Routes

- `GET /world/state`
- `POST /world/travel`
- `GET /world/progress/summary`
- `GET /inventory`
- `POST /inventory/items`
- `POST /inventory/items/consume`
- `GET /adventures/progress/summary`
- `GET /adventures/unlocks`

Existing Math, Reading, Quest, Achievement, Daily Goal, and Learning Preference routes remain in use.

## Frontend Screens And Components

- `frontend/src/features/world/WorldMapPage.jsx`
- `frontend/src/features/world/components/WorldRegionNode.jsx`
- `frontend/src/features/treehouse/components/WorldAdventureSummary.jsx`
- `frontend/src/features/math/MathMountainsPage.jsx`
- `frontend/src/features/reading/ReadingForestPage.jsx`

The Tree House dashboard now shows compact world progress and still links to the World Map.

## Known Limitations

- Writing, Science, Geography, and Music regions are visible but coming soon.
- Region gates are centralized and prepared for future milestones, but future regions are intentionally disabled.
- Frontend tests are lightweight JavaScript smoke tests, not a full browser rendering suite.
- SQLite dev schema compatibility is handled in startup helpers; production migrations are still future work.

## Manual QA

1. Start the backend and frontend.
2. Open the app and confirm Tree House loads.
3. Open World Map from Tree House.
4. Travel from World Map to Math Mountains.
5. Return from Math Mountains to World Map.
6. Travel from World Map to Reading Forest.
7. Return from Reading Forest to World Map.
8. Refresh on Tree House, World Map, Math Mountains, and Reading Forest to confirm resume behavior.
9. Try Writing, Science, Geography, and Music and confirm they remain disabled/coming soon.
10. Confirm Tree House world summary shows current location, quest progress, unlocked regions, and inventory count.

## Automated Verification

Run from the repository root:

```powershell
.\.venv\Scripts\python.exe -m pytest backend/tests
```

Run from `frontend/`:

```powershell
npm test
npm run build
```
