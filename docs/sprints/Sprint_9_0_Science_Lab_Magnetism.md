# Sprint 9.0 - Science Lab Magnetism

## Summary

Sprint 9.0 adds Magnetism as the second Science Lab topic after Electricity.

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

## Unlock Rules

- Electricity lessons unlock in order.
- Magnetism remains locked until Electricity is complete.
- Magnetism lessons unlock in order.

## Known Limits

- Magnetism uses existing Science Lab visuals and does not introduce a new scene system.
- The current Science achievement set remains shared; no Magnetism-specific badge was added in this sprint.
