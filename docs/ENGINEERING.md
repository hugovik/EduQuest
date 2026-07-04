# Engineering Handbook

---

# Purpose

This document defines the engineering standards used throughout EduQuest.

Unlike the architecture documentation, this handbook describes **how the EduQuest team builds software**.

It captures the development principles, coding conventions, quality standards, workflows, and best practices that guide everyday implementation.

The objective is to ensure that every contributor produces code that is consistent, maintainable, scalable, and aligned with the project's long-term vision.

---

# Engineering Philosophy

We build software for the long term.

Every decision should make the project easier to understand, easier to maintain, and easier to extend.

Short-term convenience should never compromise long-term quality.

---

# Core Engineering Principles

Every implementation should strive for:

- Simplicity
- Readability
- Maintainability
- Scalability
- Reusability
- Performance
- Accessibility
- Consistency

Whenever multiple solutions exist, prefer the simplest correct solution.

---

# Architecture First

Before writing code, consider:

- Does this fit the architecture?
- Is there an existing solution?
- Can this be reused?
- Does it increase technical debt?
- Will it still make sense in two years?

Architecture should guide implementation—not the other way around.

---

# React Standards

EduQuest follows modern React development.

Guidelines

- Functional Components only
- Hooks instead of class components
- Composition over inheritance
- Feature-first organization
- Small reusable components
- Clear prop interfaces

Avoid unnecessary abstraction.

---

# Component Philosophy

Components should:

- Have one responsibility
- Be reusable
- Be easy to test
- Be easy to understand
- Avoid business logic

Large components should be split into smaller pieces.

---

# State Management

Preferred order

```
Component State

↓

React Query

↓

Context

↓

Global State (only if necessary)
```

Keep state as local as possible.

---

# Backend Standards

Backend architecture follows:

```
API

↓

Services

↓

Repositories

↓

Database
```

Business logic belongs in Services.

Repositories access data.

Controllers remain thin.

---

# CSS Standards

EduQuest uses a modular theme-based CSS architecture.

Guidelines

- CSS Variables
- Mobile First
- Component styles
- Minimal specificity
- No inline styles
- Avoid !important

Styling should remain predictable and reusable.

---

# File Organization

New files should integrate into the existing project structure.

Avoid creating unnecessary directories.

Every file should have a clear purpose.

Project organization is defined in **Project_Structure.md**.

---

# Naming Conventions

Use descriptive names.

Examples

```
LessonCard

TreeHouseScene

AchievementBadge

PlayerService

calculateXP()
```

Names should explain intent.

---

# Code Style

Code should be:

- Clean
- Predictable
- Self-documenting

Avoid clever solutions that reduce readability.

Future maintainers should immediately understand the implementation.

---

# Comments

Write comments to explain:

- Why
- Trade-offs
- Business rules

Do not comment obvious code.

Good code should require very few comments.

---

# Error Handling

Errors should:

- Be handled gracefully
- Be logged appropriately
- Help developers diagnose problems
- Help users recover

Applications should fail safely.

---

# Performance

Performance should always be considered.

Examples

- Lazy loading
- Memoization
- Efficient rendering
- Image optimization
- API caching

Optimize only after measuring.

---

# Accessibility

Every feature should support:

- Keyboard navigation
- Screen readers
- Proper focus handling
- Sufficient contrast
- Responsive layouts

Accessibility is part of development—not an optional enhancement.

---

# Git Workflow

Developers should:

- Create feature branches
- Commit frequently
- Write meaningful commit messages
- Keep pull requests focused

Large unrelated commits should be avoided.

---

# Pull Requests

Every Pull Request should verify:

- Functionality
- Code quality
- Responsiveness
- Accessibility
- Documentation
- Testing

Code review is a collaborative process.

---

# Definition of Done

A feature is complete only when:

- ✅ Requirements implemented
- ✅ Responsive
- ✅ Accessible
- ✅ Linted
- ✅ Tested
- ✅ Documented
- ✅ No debug code
- ✅ No unused assets
- ✅ No TODO comments
- ✅ Architecture respected

Done means production-ready.

---

# Development Reset Maintenance

The development reset endpoint is part of the local testing workflow.

When adding a new player-owned gameplay table, location state, adventure progress table, inventory table, achievement unlock table, streak/goal table, or saved preference table:

- update `POST /dev/reset-progress`
- update the reset-progress regression test
- preserve static content definitions such as quests, passages, and achievement definitions
- verify XP audits do not include stale progress after reset

Reset behavior should clear user progress completely while keeping reusable seed/content data intact.

---

# Technical Debt

Technical debt should be:

- Identified
- Documented
- Prioritized
- Reduced continuously

Temporary solutions should never become permanent.

---

# Continuous Improvement

Every contributor should leave the codebase better than they found it.

Examples

- Improve readability
- Remove duplication
- Simplify logic
- Improve documentation
- Refactor safely

Small improvements accumulate over time.

---

# AI Collaboration

AI is considered an engineering assistant.

Use AI to:

- Explore solutions
- Generate boilerplate
- Review architecture
- Identify improvements
- Accelerate development

Developers remain responsible for reviewing and validating generated code.

---

# Engineering Culture

The EduQuest engineering team values:

- Curiosity
- Learning
- Respect
- Collaboration
- Craftsmanship
- Continuous improvement

Quality is everyone's responsibility.

---

# Success Criteria

The engineering handbook succeeds when:

- code remains consistent
- onboarding is fast
- technical debt stays low
- architecture remains clean
- development becomes predictable
- contributors share the same engineering standards

---

# Vision Statement

The EduQuest Engineering Handbook represents the collective engineering philosophy of the project.

By following shared standards and continuously improving both the codebase and the development process, the team can build a platform that remains reliable, maintainable, and enjoyable to develop for many years.

---

# Revision History

| Version | Date | Notes |
|----------|------|-------|
| 1.0 | Initial | Engineering Handbook created |
