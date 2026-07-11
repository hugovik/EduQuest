# Sprint 9 - Science Lab Magnetism

## Summary

Sprint 9 adds and stabilizes Magnetism as the second Science Lab topic after Electricity.

Status: Complete

## What Changed

- Added five data-driven Magnetism experiments:
  - Magnet Mystery
  - Magnetic or Not?
  - Strong vs Weak
  - Find the Hidden Magnet
  - Compass Adventure
- Reused the shared lesson activity components:
  - Observation
  - Classification
  - Matching
  - Sequencing
  - Prediction
- Extended the backend Science experiment registry so Magnetism completions use the existing XP, progress, tree growth, and achievement pipeline.
- Added backend unlock validation so Science experiments must be completed in order.
- Added frontend and backend tests for Magnetism lesson structure and unlock behavior.
- Added topic-local progression so `magnets-1` is available without completing Electricity.
- Added topic completion rewards:
  - Electricity -> Lightning Crystal
  - Magnetism -> Magnetic Compass
- Added Science topic achievements.
- Added Science Review Mode with persisted attempts, best score, mastery tracking, and backend-validated scoring.
- Added Science architecture documentation and Sprint 9.10 audit.

## Unlock Rules

- Electricity lessons unlock in order.
- Magnetism starts independently; `magnets-1` is available by default.
- Magnetism lessons unlock in order.

## Known Limits

- Review answer keys intentionally duplicate only minimal scoring data on the backend while full lesson presentation remains frontend-owned.
- `scienceStorage.js` is obsolete and should be removed in a cleanup sprint after confirming no dev tooling still references it.
