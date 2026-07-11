# Changelog

---

## Sprint 9 — Science Magnetism, Review, and Mastery

### Added

- Five Magnetism missions in Science Lab.
- Topic-local mission progression for Electricity and Magnetism.
- Backend Science registry and review answer registry.
- Science topic completion rewards: Lightning Crystal and Magnetic Compass.
- Science topic achievements.
- Review Mode with persisted attempts, best score, and mastery level.
- Backend-validated review scoring from submitted learner answers.
- Science architecture documentation and Sprint 9.10 release audit.

### Changed

- Science progress summaries now include topic and review summaries.
- Shared activity components now emit normalized submitted answers for review scoring.
- Science topic accordion buttons now expose expanded state for accessibility.

### Fixed

- Magnetism no longer depends on Electricity completion.
- Review scoring no longer trusts frontend-submitted correctness or score values.
- Science review attempts are cleared by developer reset.

### Verified

- Backend tests: `158 passed`
- Frontend tests: `21 frontend test suites passed`
- Frontend build: passed
- `git diff --check`: passed with line-ending warnings only

---

## Sprint 8.11 — Core Engine Unification

### Added

- Backend-backed Writing Kingdom lesson completion and progress.
- Shared backend `AdventureCompletionService` for Science and Writing XP/event/tree updates.
- Backend Science first-experiment achievement unlock response.
- Shared frontend `invalidateGlobalProgress()` helper.

### Changed

- Science and Writing completion flows now refresh global progress consistently.
- Lesson activity components now use the normalized `lesson` prop contract.
- Global adventure progress summaries include Math, Reading, Writing, and Science.

### Verified

- Backend tests: `117 passed`
- Frontend smoke tests: `17 frontend test suites passed`
- Frontend build: passed

---

# Purpose

This document records the evolution of EduQuest throughout its development.

It provides a chronological history of new features, improvements, bug fixes, architectural changes, and major project milestones.

The goal is to maintain a clear historical record of the project's progress and provide transparency for developers, contributors, testers, and future stakeholders.

---

# Changelog Philosophy

Every meaningful change should be recorded.

The changelog should answer three questions:

- What changed?
- Why did it change?
- When did it change?

The changelog should remain concise while providing enough context to understand the project's evolution.

---

# Versioning

EduQuest follows **Semantic Versioning**.

```
MAJOR.MINOR.PATCH
```

Examples

```
1.0.0

1.1.0

1.1.1

2.0.0
```

Version numbers communicate the impact of each release.

---

# Change Categories

Every release should categorize changes using the following sections.

### Added

New functionality.

Examples

- New learning worlds
- New achievements
- AI features
- Parent dashboard

---

### Changed

Improvements to existing functionality.

Examples

- UI improvements
- Performance optimizations
- Navigation updates
- Improved lesson flow

---

### Fixed

Resolved defects.

Examples

- XP calculation
- Progress synchronization
- Authentication
- Layout issues

---

### Removed

Deprecated functionality.

Examples

- Legacy components
- Obsolete APIs
- Unused assets
- Deprecated configuration

---

### Security

Security-related improvements.

Examples

- Authentication updates
- Dependency upgrades
- Vulnerability fixes
- Access control improvements

---

# Release Format

Each release should follow a consistent structure.

```
Version

↓

Release Date

↓

Added

↓

Changed

↓

Fixed

↓

Removed

↓

Security
```

Consistency improves readability over time.

---

# Upcoming Release

## Unreleased

### Added

- Initial project architecture
- Product documentation
- Design system
- Development documentation
- Roadmap planning

### Changed

- Ongoing documentation refinement

### Fixed

- N/A

### Removed

- N/A

### Security

- Initial security architecture

---

# Version 1.0.0

**Planned Initial Public Release**

### Added

- Student profiles
- Reading activities
- Writing activities
- Math activities
- XP system
- Tree House
- Achievement system
- Parent dashboard
- Core API
- Initial database

### Changed

- Initial production architecture

### Fixed

- Initial release

### Removed

- None

### Security

- JWT authentication
- HTTPS
- Input validation

---

# Future Releases

Future releases should continue using the same format.

Examples

```
1.1.0

↓

Added

↓

Changed

↓

Fixed

↓

Security
```

The structure should remain consistent across all versions.

---

# Documentation Updates

Documentation changes should also appear in the changelog.

Examples

- Architecture updates
- API documentation
- Design guidelines
- Development workflow

Documentation is considered part of the product.

---

# Breaking Changes

Breaking changes should be clearly identified.

Examples

- API changes
- Database migrations
- Authentication updates
- Configuration changes

Breaking changes should include migration guidance whenever possible.

---

# Release Notes

The changelog complements formal release notes.

Release notes explain the impact of a release.

The changelog records the technical history.

Both documents should remain synchronized.

---

# Maintenance

The changelog should be updated:

- Before every release
- After major architectural changes
- After significant feature additions
- Following important security updates

The changelog should never be reconstructed after the fact.

---

# Best Practices

Developers should:

- Write concise entries
- Group related changes
- Avoid duplicate entries
- Record user-visible improvements
- Record architectural decisions

Every entry should provide value to future readers.

---

# Success Criteria

The changelog succeeds when:

- every release is documented
- project history remains easy to follow
- breaking changes are clearly identified
- documentation stays synchronized
- future developers can understand project evolution

---

# Vision Statement

The EduQuest changelog is the historical record of the platform's evolution.

By documenting every meaningful improvement, it preserves the story of how EduQuest grows from a personal learning application into a comprehensive educational ecosystem, ensuring that every contributor understands both where the project has been and where it is going.

---

# Revision History

| Version | Date | Notes |
|----------|------|-------|
| 1.0 | Initial | Changelog specification created |
