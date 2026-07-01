# CODEX

---

# Purpose

This document defines how Codex should work within the EduQuest project.

It provides project context, architecture rules, coding standards, implementation expectations, and quality requirements for AI-assisted development.

The goal is to ensure that Codex-generated code follows the same engineering standards, folder structure, design system, and architectural decisions already established for EduQuest.

---

# Role of Codex

Codex acts as an implementation assistant.

Codex should help write, refactor, test, and organize code.

Codex should not independently redefine product direction, architecture, design language, or business rules.

Major decisions should follow the existing documentation.

---

# Codex Operating Principle

Before changing code, Codex should understand the existing project structure.

Before creating new patterns, Codex should check whether an existing pattern already exists.

Before adding complexity, Codex should choose the simplest correct solution.

Before completing work, Codex should verify that the implementation follows EduQuest standards.

---

# Primary References

Codex should follow these documents:

- MASTER_INDEX.md
- PROJECT_STATUS.md
- ENGINEERING.md
- TECH_DEBT.md
- DECISIONS.md
- docs/03-Architecture/System_Architecture.md
- docs/03-Architecture/Frontend.md
- docs/03-Architecture/Backend.md
- docs/03-Architecture/Project_Structure.md
- docs/04-Design-System/Design_System.md
- docs/04-Design-System/Components.md
- docs/05-Development/Coding_Standards.md

These documents define the source of truth for implementation.

---

# Project Overview

---

# What is EduQuest?

EduQuest is a modern educational adventure platform that combines structured learning with exploration, storytelling, and gamification.

Rather than presenting lessons as traditional coursework, EduQuest transforms learning into an interactive world where children complete quests, explore new environments, unlock achievements, and watch their progress shape the world around them.

The platform is designed to support long-term educational growth while maintaining a playful and engaging experience.

---

# Primary Goal

The primary objective of EduQuest is:

> Make children want to learn.

Every technical decision should support this goal.

---

# Target Audience

Primary

- Children (approximately Grades 1–6)

Secondary

- Parents
- Teachers
- Schools

Future versions may support additional educational environments.

---

# Product Philosophy

Learning should feel like an adventure.

Children should explore instead of navigating menus.

Progress should be visible.

Mistakes should encourage learning rather than discourage participation.

Every feature should reinforce curiosity.

---

# Core Gameplay Loop

```
Tree House

↓

Choose Quest

↓

Complete Activity

↓

Earn XP

↓

Unlock Rewards

↓

World Evolves

↓

Repeat
```

This gameplay loop is central to the entire application.

---

# Core Systems

The platform consists of several interconnected systems.

Examples

- Tree House
- Reading Forest
- Math Mountains
- Writing Kingdom
- XP System
- Achievement System
- Companion System
- Parent Dashboard
- Professor Owl AI

Every new feature should integrate into one or more existing systems rather than introducing isolated functionality.

---

# Technology Stack

Frontend

- React
- TypeScript
- Vite
- React Query

Backend

- FastAPI
- SQLAlchemy
- SQLite (Development)
- PostgreSQL (Future)

Development

- Git
- GitHub
- Visual Studio Code

The stack has already been selected.

Codex should work within these technologies unless instructed otherwise.

---

# Long-Term Vision

EduQuest is intended to become a complete educational ecosystem.

Future capabilities include:

- AI-assisted learning
- Classroom management
- School administration
- Multiplayer experiences
- Community events
- International curricula

Every implementation should consider future scalability.

---

# Codex Responsibilities

Codex should:

- Implement features
- Refactor code
- Improve maintainability
- Follow existing architecture
- Respect the design system
- Keep implementations simple

Codex should **not** redesign the product or introduce new architectural patterns without explicit instruction.

---

# Success Criteria

A successful implementation:

- follows the documented architecture
- integrates naturally with existing systems
- remains maintainable
- minimizes technical debt
- supports future expansion
- preserves the EduQuest vision


---

# Architecture Rules

Codex must follow the established EduQuest architecture.

Do not introduce new architectural patterns unless explicitly instructed.

Always prefer consistency over novelty.

---

## General Principles

Always:

- Follow the existing project architecture.
- Reuse existing patterns before creating new ones.
- Keep implementations simple.
- Keep responsibilities clearly separated.
- Respect the Design System.
- Respect the Engineering Handbook.

Never sacrifice maintainability for short-term convenience.

---

## Layered Architecture

The backend follows a layered architecture.

```
API

↓

Services

↓

Repositories

↓

Database
```

Responsibilities:

- API handles HTTP communication only.
- Services contain business logic.
- Repositories perform database operations.
- Database stores application data.

Never place business logic inside API routes.

Never execute SQL directly inside Services.

---

## Frontend Architecture

The frontend follows Feature-Based Architecture.

```
features/

shared/

api/

theme/

assets/
```

Each feature owns its:

- components
- pages
- hooks
- services
- styles

Do not create unrelated global components.

---

## Component Responsibility

Each component should have one responsibility.

Prefer:

Small reusable components

instead of

Large monolithic components.

If a component becomes difficult to understand, split it.

---

## Reuse Before Creation

Before creating:

- a new component
- a new hook
- a new utility
- a new service

first check whether an existing implementation can be reused or extended.

Avoid duplicate functionality.

---

## Business Logic

Business logic belongs in:

- Services
- Hooks (frontend UI logic only)

Business logic should never live inside:

- React pages
- Presentational components
- API routes

---

## State Management

Prefer the following order:

1. Component State
2. React Query
3. Context
4. Global State (only when absolutely necessary)

Keep state as local as possible.

---

## Future Scalability

Every implementation should assume that EduQuest will continue to grow.

Avoid hardcoded values.

Avoid feature-specific assumptions.

Design for extension rather than modification.

---

## Architectural Integrity

If a requested implementation appears to violate the established architecture:

- identify the conflict
- explain the concern
- suggest an alternative

Do not silently introduce architectural inconsistencies.

Architecture should remain stable as the project evolves.

---

# Frontend Standards

Codex must follow the established frontend architecture.

The frontend should remain modular, reusable, responsive, and easy to maintain.

Always implement features using existing project patterns.

---

## Technology Stack

Always use:

- React
- TypeScript
- Vite
- React Query

Do not introduce additional frontend frameworks unless explicitly instructed.

---

## Components

Always:

- Use functional components.
- Keep components focused on a single responsibility.
- Prefer composition over inheritance.
- Keep components small.
- Extract reusable UI into shared components.

Avoid large "god components."

---

## Feature Organization

Every feature owns its own implementation.

Typical structure:

```
feature/

components/

hooks/

pages/

services/

styles/

types/
```

Do not place feature-specific code inside shared folders.

---

## Shared Components

Only place components inside **shared/** when they are reusable by multiple features.

Examples:

- Button
- Card
- Modal
- Input
- ProgressBar

Avoid creating shared components for a single use case.

---

## Hooks

Always:

- Prefix hooks with **use**
- Keep hooks reusable
- Keep hooks focused
- Move reusable logic into hooks

Examples:

```
usePlayer()

useQuest()

useAchievements()

useTreeHouse()
```

Hooks should not render UI.

---

## State Management

Preferred order:

1. Local Component State
2. React Query
3. Context
4. Global State

Do not introduce unnecessary global state.

---

## React Query

Use React Query for:

- API requests
- Server state
- Caching
- Background synchronization

Do not duplicate server state inside component state.

---

## Routing

Use React Router.

Routes should represent application locations.

Examples:

```
/

↓

/treehouse

↓

/reading

↓

/math

↓

/writing

↓

/profile
```

Avoid deeply nested routes unless justified.

---

## Forms

Forms should:

- Validate user input
- Display friendly error messages
- Prevent invalid submissions
- Remain accessible

Validation should occur both on the client and the server.

---

## Error Handling

Components should fail gracefully.

Never leave the user with:

- blank pages
- uncaught exceptions
- infinite loading states

Always provide meaningful feedback.

---

## Loading States

Every asynchronous operation should provide visual feedback.

Examples:

- Skeleton screens
- Loading indicators
- Progress bars

Users should always know that work is in progress.

---

## Styling

All styling should follow the Design System.

Always use:

- CSS Variables
- Theme Tokens
- Existing spacing scale
- Existing typography scale

Avoid inline styles whenever possible.

---

## Responsiveness

Every component must work on:

- Mobile
- Tablet
- Desktop

Design mobile-first.

Never create separate desktop and mobile implementations unless absolutely necessary.

---

## Accessibility

Every component should support:

- Keyboard navigation
- Screen readers
- Focus indicators
- Sufficient contrast
- Semantic HTML

Accessibility is a requirement, not an enhancement.

---

## Performance

Optimize when necessary.

Prefer:

- Lazy loading
- Memoization
- Efficient rendering

Avoid premature optimization.

Measure before optimizing.

---

## Animations

Animations should follow the Motion Design guidelines.

Animations should:

- communicate state
- reinforce interaction
- reward progress

Avoid decorative animations that do not improve the experience.

---

## Testing

Frontend changes should not break existing functionality.

When practical:

- update tests
- verify responsive layouts
- verify accessibility
- verify loading states

---

## Before Completing Any Frontend Task

Verify:

- follows Design System
- responsive
- accessible
- reusable
- minimal complexity
- consistent naming
- no duplicated logic
- no unnecessary dependencies

Every frontend implementation should feel like it was written by the same developer.

===================================================================================

---

# Backend Standards

Codex must follow the established backend architecture.

The backend should remain modular, predictable, testable, and independent from the frontend.

Business logic should always be isolated from infrastructure concerns.

---

## Technology Stack

Always use:

- FastAPI
- SQLAlchemy
- Pydantic
- Alembic
- SQLite (Development)
- PostgreSQL (Production)

Do not introduce additional frameworks unless explicitly instructed.

---

## Backend Architecture

The backend follows Layered Architecture.

```
API

↓

Services

↓

Repositories

↓

Database
```

Every layer has a single responsibility.

---

## API Layer

The API layer should only:

- Receive requests
- Validate input
- Call Services
- Return responses

Do not place business logic inside API routes.

API endpoints should remain thin.

---

## Services

Services contain business logic.

Examples:

- XP calculation
- Quest progression
- Achievement evaluation
- Tree growth
- Reward distribution

Services should never perform direct database queries.

---

## Repositories

Repositories are responsible for:

- CRUD operations
- Database queries
- Persistence
- Query optimization

Repositories should not contain business rules.

---

## Database Models

Database models should represent data only.

Models should:

- Be normalized
- Use clear relationships
- Avoid duplicated data
- Follow SQLAlchemy best practices

Business calculations should never exist inside models.

---

## Schemas

Use Pydantic schemas for:

- Request validation
- Response serialization
- API documentation

Separate schemas from database models.

Never expose ORM models directly through the API.

---

## Dependency Injection

Use FastAPI dependency injection.

Dependencies should include:

- Database sessions
- Authentication
- Configuration
- Services (when appropriate)

Avoid creating global objects.

---

## Error Handling

Return meaningful HTTP responses.

Examples:

```
200 OK

201 Created

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

422 Validation Error

500 Internal Server Error
```

Never expose internal exceptions to API consumers.

---

## Authentication

Authentication should remain modular.

Future support includes:

- JWT
- Refresh Tokens
- OAuth
- Google Sign-In

Never hardcode authentication logic.

---

## Validation

Validate all external input.

Never trust:

- Request bodies
- Query parameters
- Path parameters
- Uploaded files

Validation should occur before business logic executes.

---

## Database Access

Always access the database through repositories.

Never:

- execute raw SQL inside services
- duplicate database queries
- bypass repositories

Maintain a single persistence layer.

---

## Configuration

Application configuration should come from:

- Environment Variables
- Configuration files

Never hardcode:

- passwords
- API keys
- secrets
- connection strings

---

## Logging

Log meaningful events.

Examples:

- Startup
- Shutdown
- Authentication failures
- Database errors
- Unexpected exceptions

Avoid excessive logging.

Sensitive information must never be logged.

---

## Performance

Backend implementations should:

- Minimize database queries
- Avoid N+1 query problems
- Reuse database sessions
- Keep endpoints fast

Optimize only after measuring.

---

## Testing

Backend changes should include verification of:

- API endpoints
- Validation
- Services
- Repositories
- Database interactions

Business logic should remain independently testable.

---

## Before Completing Any Backend Task

Verify:

- API routes remain thin
- Services contain business logic
- Repositories contain persistence only
- Validation is complete
- Error handling is implemented
- No duplicated queries
- No hardcoded values
- Architecture is respected

Every backend implementation should remain clean, scalable, and easy to maintain.

====================================================================================

---

# CSS & Theme Standards

EduQuest uses a centralized theme system.

All visual styling must follow the Design System.

Consistency is more important than individual preference.

---

## Theme Philosophy

The theme system is the single source of truth for styling.

Never hardcode values that already exist in the theme.

Every new component should automatically inherit the EduQuest visual identity.

---

## Theme Structure

Use the existing theme architecture.

```
theme/

variables.css

globals.css

layout.css

cards.css

buttons.css

animations.css
```

Do not create new global CSS files unless explicitly instructed.

---

## CSS Variables

Always use CSS variables.

Examples:

```css
var(--color-primary)
var(--color-background)
var(--spacing-md)
var(--radius-lg)
var(--shadow-md)
```

Never hardcode colors, spacing, or border radii that already exist as design tokens.

---

## Design Tokens

All visual properties should originate from design tokens.

Examples:

- Colors
- Typography
- Spacing
- Shadows
- Border Radius
- Animation Duration

This ensures consistency across the application.

---

## Component Styling

Every component owns its styles.

Example:

```
TreeHouse/

TreeHouse.tsx

TreeHouse.css
```

Avoid placing feature-specific styles inside global theme files.

---

## Global Styles

Global styles should contain only:

- Reset styles
- Typography defaults
- Layout utilities
- Theme variables

Do not place feature-specific styling in global files.

---

## Class Naming

Use descriptive class names.

Good examples:

```css
tree-house

quest-card

achievement-grid

player-avatar
```

Avoid:

```css
box1

blueCard

leftThing
```

Class names should describe purpose rather than appearance.

---

## Layout

Prefer modern CSS.

Use:

- Flexbox
- CSS Grid

Avoid outdated layout techniques unless required for compatibility.

---

## Responsive Design

Design mobile-first.

Support:

- Mobile
- Tablet
- Desktop

Avoid creating duplicate desktop/mobile layouts.

Components should adapt naturally.

---

## Spacing

Use the project's spacing scale.

Never use random spacing values.

Examples:

```css
var(--spacing-xs)

var(--spacing-sm)

var(--spacing-md)

var(--spacing-lg)

var(--spacing-xl)
```

Consistent spacing improves visual rhythm.

---

## Colors

Always use semantic colors.

Examples:

```css
--color-primary

--color-success

--color-warning

--color-danger

--color-surface
```

Never introduce new colors unless expanding the Design System.

---

## Typography

Typography must follow the Typography specification.

Do not define custom font sizes unless necessary.

Use existing typography tokens whenever possible.

---

## Shadows

Use predefined elevation levels.

Avoid arbitrary shadow values.

Shadow depth should communicate hierarchy.

---

## Border Radius

Rounded corners are part of the EduQuest identity.

Use existing radius tokens.

Avoid inconsistent corner styles.

---

## Animations

Animations must follow the Motion Design guidelines.

Animations should:

- communicate interaction
- reinforce feedback
- celebrate progress

Avoid decorative animations without purpose.

---

## Performance

CSS should remain efficient.

Avoid:

- Deep selector nesting
- Excessive specificity
- Duplicate rules
- Unused selectors

Prefer simple, maintainable selectors.

---

## !important

Avoid using `!important`.

If it appears necessary:

- review selector specificity
- review component structure
- review CSS architecture

Use `!important` only as a last resort.

---

## Inline Styles

Avoid inline styles.

Prefer:

- CSS classes
- CSS variables
- Theme tokens

Inline styles reduce maintainability.

---

## Accessibility

Ensure styles support:

- Keyboard navigation
- Focus visibility
- Sufficient contrast
- Readable typography
- Touch-friendly controls

Visual design should never reduce accessibility.

---

## Before Completing Any Styling Task

Verify:

- Uses theme variables
- Uses existing spacing scale
- Uses semantic colors
- Responsive
- Accessible
- No duplicated CSS
- No unnecessary specificity
- No hardcoded design values

Every new component should feel like a natural part of EduQuest without requiring additional visual adjustments.

======================================================================================

---

# Project Structure

Always follow the established EduQuest folder organization.

Do not create new top-level folders unless explicitly instructed.

Organize code by feature and responsibility.

Consistency is more important than personal preference.

---

## Root Structure

The project is organized into clearly separated areas.

```
/

src/

server/

docs/

public/

assets/
```

Each directory has a single responsibility.

---

## Frontend Structure

Frontend source code lives inside:

```
src/
```

Typical structure:

```
src/

api/

assets/

features/

shared/

theme/

types/

utils/
```

Avoid placing feature code outside **features/**.

---

## Feature Structure

Each feature owns everything it needs.

Example:

```
features/

treehouse/

components/

hooks/

pages/

services/

styles/

types/

utils/
```

A feature should be understandable without browsing unrelated folders.

---

## Shared Folder

The **shared/** directory contains reusable functionality.

Examples:

```
shared/

components/

hooks/

icons/

layouts/

providers/

utils/
```

Only place code here if it is reused by multiple features.

---

## Theme Folder

The theme is centralized.

Example:

```
theme/

variables.css

globals.css

layout.css

cards.css

buttons.css

animations.css
```

Do not duplicate design tokens elsewhere.

---

## Assets

Assets include:

- images
- illustrations
- icons
- audio
- fonts

Feature-specific assets should remain inside their respective feature folders whenever practical.

---

## Backend Structure

Backend code lives inside:

```
server/
```

Typical structure:

```
app/

api/

core/

database/

models/

repositories/

schemas/

services/
```

Keep the backend layered and modular.

---

## Documentation

Documentation lives inside:

```
docs/
```

Documentation categories include:

```
01-Foundation

02-Product

03-Architecture

04-Design-System

05-Development

06-Planning
```

Living project documents remain in the root of **docs/**.

---

## File Placement

Before creating a new file, ask:

- Does a similar file already exist?
- Does this belong to an existing feature?
- Can this functionality be extended instead?

Avoid unnecessary file proliferation.

---

## Imports

Prefer clean imports.

Group imports by:

1. React
2. External libraries
3. Internal modules
4. Relative imports

Keep import order consistent throughout the project.

---

## File Size

Prefer smaller files.

General guidance:

- Components: approximately 200 lines or less
- Hooks: focused on one responsibility
- Services: one domain responsibility

Large files should usually be split.

---

## Folder Creation

Create a new folder only when it improves organization.

Avoid unnecessary nesting.

Bad example:

```
components/

cards/

basic/

shared/

common/
```

Prefer:

```
components/

LessonCard

ProgressCard

QuestCard
```

---

## Naming

Use descriptive names.

Examples:

```
TreeHouse

ReadingForest

QuestCard

PlayerProfile
```

Avoid abbreviations unless universally understood.

---

## Feature Isolation

Features should communicate through well-defined interfaces.

Avoid importing deeply into another feature's internal implementation.

Public interfaces should remain stable.

---

## Scalability

Assume the project will continue to grow.

Every new folder should make future organization easier—not harder.

Optimize for maintainability rather than short-term convenience.

---

## Before Creating New Files

Verify:

- correct folder
- correct feature
- reusable implementation
- consistent naming
- follows existing architecture

The repository should always remain organized, predictable, and easy to navigate.

======================================================================================

---

# React Patterns

React code should follow consistent patterns throughout the EduQuest project.

Prefer predictable implementations over clever abstractions.

Every React component should be easy to understand without requiring knowledge of the rest of the application.

---

## Functional Components

Always use functional components.

Never introduce class components.

Example

```tsx
export function QuestCard() {
    return (
        <div>...</div>
    );
}
```

---

## Composition

Prefer composition over inheritance.

Good

```
Page

↓

Section

↓

Card

↓

Button
```

Avoid creating large components with many responsibilities.

---

## Single Responsibility

Each component should solve one problem.

Examples

Good

- QuestCard
- XPBar
- TreeNavigation
- PlayerAvatar

Poor

- DashboardEverything
- MainApplicationComponent

Split components when they begin handling multiple concerns.

---

## Props

Pass data through explicit props.

Keep props:

- Small
- Typed
- Predictable

Avoid passing entire application objects when only a few properties are required.

---

## Component State

Keep state as local as possible.

Preferred order

```
Local State

↓

React Query

↓

Context

↓

Global State
```

Do not move state upward unless necessary.

---

## Hooks

Extract reusable logic into custom hooks.

Examples

```
usePlayer()

useAchievements()

useTreeHouse()

useXP()
```

Hooks should contain logic—not UI.

---

## Side Effects

Keep side effects inside `useEffect()` only when necessary.

Avoid unnecessary effects.

If something can be calculated during rendering, do not use an effect.

---

## Derived State

Do not store values that can be derived.

Good

```tsx
const completed = quests.filter(q => q.completed);
```

Avoid

```tsx
const [completed, setCompleted] = useState([]);
```

when it can be derived from existing data.

---

## Event Handlers

Event handlers should be descriptive.

Examples

```
handleQuestStart()

handleTreeUpgrade()

handleRewardClaim()
```

Avoid generic names like:

```
click()

run()

doStuff()
```

---

## Conditional Rendering

Prefer clear conditional rendering.

Good

```tsx
if (loading) {
    return <LoadingScreen />;
}
```

Avoid deeply nested ternary expressions.

---

## Lists

Always provide stable keys.

Good

```tsx
quests.map(quest => (
    <QuestCard
        key={quest.id}
        quest={quest}
    />
))
```

Never use array indexes unless the list is static.

---

## Memoization

Only memoize when profiling indicates a performance benefit.

Avoid premature optimization.

---

## API Calls

Never perform API requests directly inside components.

Use:

- Services
- React Query
- Custom hooks

Components should focus on presentation.

---

## Styling

Keep JSX clean.

Avoid large inline style objects.

Prefer CSS classes and theme variables.

---

## Component Length

General guideline

- Under 200 lines whenever practical.

If a component becomes difficult to read, split it.

---

## Folder Placement

Feature-specific components belong inside their feature.

Shared components belong in `shared/components`.

Do not move components into `shared` until they are actually reused.

---

## Accessibility

Every component should support:

- keyboard navigation
- semantic HTML
- focus states
- screen readers

Accessibility is required.

---

## Before Completing Any React Task

Verify:

- Functional component
- Single responsibility
- Typed props
- Minimal state
- No duplicated logic
- Accessible
- Responsive
- Reusable
- Consistent naming
- Follows existing project patterns

Every React component should look as though it was written by the same engineer.

======================================================================================

---

# State Management

State should be managed using the simplest solution that satisfies the requirements.

Keep state as close as possible to where it is used.

Avoid introducing global state unless there is a clear architectural need.

---

## State Hierarchy

Always prefer the following order:

```
Local Component State

↓

React Query

↓

Context

↓

Global State
```

Move to the next level only when the current level becomes insufficient.

---

## Local State

Use local state for UI behavior.

Examples:

- Dialog visibility
- Selected tab
- Expanded sections
- Hover state
- Input values
- Temporary filters

Keep local state inside the owning component.

---

## Server State

Use React Query for server state.

Examples:

- Player profile
- Achievements
- Lessons
- Progress
- Inventory
- Statistics

Never duplicate server state using `useState`.

---

## React Query Responsibilities

React Query manages:

- Data fetching
- Caching
- Background refetching
- Loading states
- Error states
- Data synchronization

Do not recreate these features manually.

---

## Context

Use Context sparingly.

Suitable examples:

- Theme
- Authentication
- Language
- User Preferences

Do not use Context as a replacement for proper state management.

---

## Global State

Introduce global state only when:

- multiple unrelated features require the same data
- Context becomes insufficient
- performance requires centralized management

Global state should remain minimal.

---

## Derived State

Never store data that can be calculated.

Good

```tsx
const completedQuests = quests.filter(q => q.completed);
```

Bad

```tsx
const [completedQuests, setCompletedQuests] = useState([]);
```

Derived values should be computed, not stored.

---

## Single Source of Truth

Every piece of information should have exactly one source of truth.

Examples:

Player XP

↓

Player Service

↓

React Query

↓

Component

Avoid maintaining duplicate copies of the same data.

---

## Updating State

State updates should be predictable.

Prefer immutable updates.

Avoid mutating objects directly.

Good

```tsx
setPlayer({
    ...player,
    xp: player.xp + reward
});
```

Never mutate existing objects in place.

---

## Temporary State

Temporary UI state should remain local.

Examples:

- Search text
- Form input
- Open menus
- Drag state

Temporary state should not be persisted.

---

## Persistent State

Persist only meaningful data.

Examples:

- Player progress
- Inventory
- Settings
- Achievements
- Completed lessons

Do not persist transient UI state.

---

## Async State

Use React Query for asynchronous operations.

Avoid manually managing:

- loading
- error
- success
- cache

unless there is a specific reason.

---

## Optimistic Updates

Use optimistic updates only when they improve user experience.

Examples:

- Completing quests
- Claiming rewards
- Updating settings

Always support rollback if the server rejects the request.

---

## State Ownership

Every piece of state should have a clear owner.

Examples:

```
QuestCard

↓

Quest State

Player

↓

Player State

Tree House

↓

World State
```

Ownership should remain obvious.

---

## State Flow

Data should flow in one direction.

```
Backend

↓

React Query

↓

Hooks

↓

Components

↓

User Interaction

↓

API

↓

Backend
```

Avoid circular data flow.

---

## Performance

Avoid unnecessary re-renders.

Prefer:

- Local state
- Stable references
- Memoization when justified

Measure performance before optimizing.

---

## Before Completing Any State Management Task

Verify:

- Smallest appropriate scope
- Single source of truth
- No duplicated state
- No unnecessary Context
- React Query used for server state
- Immutable updates
- Predictable state flow
- Architecture respected

State management should remain simple, predictable, and easy to reason about as EduQuest continues to grow.

======================================================================================

---

# Naming Conventions

Consistent naming is essential for readability and maintainability.

Names should describe purpose rather than implementation.

Prefer explicit names over abbreviated names.

Code is read far more often than it is written.

---

## General Principles

Names should be:

- Descriptive
- Predictable
- Consistent
- Easy to search
- Easy to understand

Avoid clever or ambiguous names.

---

## Variables

Use **camelCase**.

Good

```ts
playerName

currentQuest

totalXP

achievementCount

readingProgress
```

Avoid

```ts
p

tmp

data

obj

value1
```

Variable names should communicate their purpose.

---

## Constants

Constants use **UPPER_SNAKE_CASE**.

Examples

```ts
MAX_LEVEL

DEFAULT_XP

MAX_INVENTORY_SIZE

SAVE_INTERVAL

API_TIMEOUT
```

Avoid magic numbers throughout the codebase.

---

## Functions

Functions use **camelCase**.

Function names should begin with a verb.

Examples

```ts
calculateXP()

loadPlayer()

unlockAchievement()

saveProgress()

startQuest()

completeLesson()
```

Function names should describe exactly what they do.

---

## Boolean Variables

Boolean names should read naturally.

Good

```ts
isCompleted

hasReward

canContinue

shouldSave

isUnlocked
```

Avoid

```ts
flag

status

done

value
```

---

## React Components

Components use **PascalCase**.

Examples

```tsx
TreeHouse

QuestCard

AchievementBadge

ReadingLesson

PlayerAvatar
```

Component names should represent UI concepts.

---

## Hooks

Hooks begin with **use**.

Examples

```ts
usePlayer()

useQuest()

useInventory()

useAchievements()

useProgress()
```

Never create hooks without the `use` prefix.

---

## Services

Services describe business domains.

Examples

```ts
PlayerService

QuestService

AchievementService

SaveService

InventoryService
```

Service names should never describe implementation details.

---

## Repositories

Repositories end with **Repository**.

Examples

```ts
PlayerRepository

QuestRepository

AchievementRepository
```

Repositories manage persistence only.

---

## API Routes

Routes should use nouns.

Examples

```
/player

/quests

/achievements

/inventory

/profile
```

Avoid verbs in URLs whenever practical.

---

## CSS Classes

Use descriptive kebab-case.

Good

```css
tree-house

quest-card

achievement-grid

player-avatar

reward-popup
```

Avoid

```css
box

blue

left

thing

container2
```

Class names describe purpose—not appearance.

---

## Files

Use names that match the primary export.

Examples

```
TreeHouse.tsx

QuestCard.tsx

PlayerService.ts

usePlayer.ts
```

Avoid generic filenames.

---

## Folders

Folder names should describe features.

Examples

```
treehouse

reading

math

writing

profile
```

Avoid folders like:

```
misc

temp

new

stuff
```

---

## Assets

Assets should have descriptive names.

Examples

```
tree-house-background.png

achievement-gold.svg

owl-wave.webp
```

Avoid

```
image1.png

final2.png

new-logo.png
```

---

## Database Tables

Use plural nouns.

Examples

```
players

quests

achievements

inventory_items

certificates
```

Maintain consistency throughout the schema.

---

## Database Columns

Use snake_case.

Examples

```
player_id

created_at

updated_at

current_level
```

Avoid mixed naming styles.

---

## Environment Variables

Environment variables use **UPPER_SNAKE_CASE**.

Examples

```
DATABASE_URL

JWT_SECRET

API_BASE_URL

NODE_ENV
```

---

## Git Branches

Branch names should be descriptive.

Examples

```
feature/tree-house

feature/reading-forest

fix/xp-calculation

refactor/theme-system

docs/project-status
```

Avoid vague branch names.

---

## Commit Messages

Commit messages should:

- Use the imperative mood
- Be concise
- Describe one logical change

Examples

```
Add Tree House navigation

Fix XP calculation

Refactor achievement service

Update project status
```

---

## Before Naming Anything

Ask:

- Does the name describe its purpose?
- Would a new developer understand it?
- Is it consistent with the rest of the project?
- Is it searchable?
- Is it future-proof?

Good naming reduces the need for comments and improves long-term maintainability.

---

## Golden Rule

Choose names that make the code read like natural language.

A developer unfamiliar with EduQuest should be able to understand the intent of the code simply by reading the names.

Clear naming is one of the simplest and most effective ways to improve software quality.

======================================================================================

---

# Implementation Rules

Codex is expected to implement features in a way that is consistent with the EduQuest architecture, engineering standards, and long-term vision.

Implementation quality is more important than implementation speed.

---

## Before Writing Code

Always understand the task before making changes.

Review:

- Existing implementation
- Similar features
- Relevant documentation
- Current architecture
- Design System

Do not begin coding until the overall approach is understood.

---

## Reuse Existing Code

Before creating:

- Components
- Hooks
- Services
- Utilities
- Styles

Search the project for an existing implementation.

Prefer extending existing code over introducing duplicates.

---

## Build Small

Implement features incrementally.

Prefer:

```
Small Feature

↓

Test

↓

Review

↓

Continue
```

Avoid implementing large features in a single change.

---

## Respect Existing Patterns

When adding code:

- Follow existing folder structure.
- Follow existing naming conventions.
- Follow existing coding style.
- Follow existing architectural patterns.

Consistency is more valuable than personal preference.

---

## Keep Components Small

If a component becomes responsible for multiple concerns:

Split it.

Prefer:

```
TreeHouse

↓

Navigation

↓

Scene

↓

Toolbar

↓

StatusPanel
```

rather than one large component.

---

## Separate Responsibilities

Never mix:

- UI
- Business Logic
- Data Access
- Configuration

Each layer should remain independent.

---

## Avoid Premature Abstraction

Do not create abstractions simply because they might become useful.

Wait until duplication appears.

Then refactor.

---

## Refactor Opportunistically

If existing code becomes noticeably cleaner with a small refactor:

Perform it.

Examples:

- Extract duplicate code
- Simplify logic
- Improve naming
- Remove dead code

Do not perform unrelated large refactors during feature implementation.

---

## Preserve Existing Behavior

Unless explicitly instructed:

Do not change existing functionality.

New features should not introduce regressions.

---

## Error Handling

Handle failures gracefully.

Always consider:

- Invalid input
- Missing data
- Network failures
- API errors
- Empty states

Applications should fail safely.

---

## Performance

When implementing new features:

Avoid:

- unnecessary rendering
- duplicated API calls
- expensive calculations
- unnecessary state

Optimize only when necessary.

---

## Accessibility

Every implementation should include:

- keyboard support
- semantic HTML
- proper labels
- focus management
- sufficient contrast

Accessibility is never optional.

---

## Responsiveness

Every UI implementation should function correctly on:

- Mobile
- Tablet
- Desktop

Responsive behavior should be considered from the beginning.

---

## Documentation

Update documentation when:

- Architecture changes
- New patterns are introduced
- Project structure changes
- Engineering standards change

Feature implementation alone does not normally require documentation updates.

---

## Ask Before Introducing

If implementation requires introducing:

- a new dependency
- a new framework
- a new architectural pattern
- a new state management solution
- a major refactor

Stop and ask first.

Do not make these decisions independently.

---

## Implementation Mindset

Think like a long-term maintainer.

Before submitting work, ask:

- Can this be simpler?
- Can this be reused?
- Is this consistent?
- Will another developer immediately understand it?
- Does it follow the EduQuest philosophy?

If the answer is "No", improve it before considering the task complete.

---

## Goal

Every implementation should feel as though it was written by the same experienced engineering team.

Consistency, clarity, and maintainability are the primary measures of success.

========================================================================================

---

# Do / Don't

The following rules define the expected engineering behavior for Codex.

These are not suggestions.

These are the default implementation rules for EduQuest.

When in doubt, follow these rules.

---

# DO

## Architecture

✔ Follow the existing architecture.

✔ Respect layer boundaries.

✔ Keep responsibilities separated.

✔ Reuse existing patterns.

✔ Extend instead of replacing.

---

## Components

✔ Create small components.

✔ Keep components reusable.

✔ Prefer composition.

✔ Split large components.

✔ Keep JSX readable.

---

## State

✔ Keep state local whenever possible.

✔ Use React Query for server state.

✔ Use Context sparingly.

✔ Maintain a single source of truth.

---

## Backend

✔ Keep API routes thin.

✔ Place business logic in Services.

✔ Keep database access inside Repositories.

✔ Validate all external input.

✔ Return meaningful HTTP responses.

---

## Styling

✔ Use theme variables.

✔ Follow the Design System.

✔ Build mobile-first.

✔ Use semantic colors.

✔ Keep CSS modular.

---

## Code Quality

✔ Write self-documenting code.

✔ Use descriptive names.

✔ Remove duplicate logic.

✔ Refactor when appropriate.

✔ Leave the code cleaner than you found it.

---

## Performance

✔ Measure before optimizing.

✔ Lazy load where appropriate.

✔ Avoid unnecessary renders.

✔ Minimize network requests.

---

## Accessibility

✔ Support keyboard navigation.

✔ Use semantic HTML.

✔ Maintain proper contrast.

✔ Provide meaningful labels.

Accessibility is required.

---

## Git

✔ Make focused commits.

✔ Keep Pull Requests small.

✔ Update documentation when required.

✔ Follow the established workflow.

---

# DON'T

## Architecture

✘ Don't introduce new architectural patterns.

✘ Don't bypass Services.

✘ Don't bypass Repositories.

✘ Don't mix responsibilities.

✘ Don't duplicate existing functionality.

---

## Components

✘ Don't create "god components."

✘ Don't place business logic inside presentation components.

✘ Don't create reusable components prematurely.

✘ Don't pass unnecessary props.

---

## State

✘ Don't duplicate server state.

✘ Don't overuse Context.

✘ Don't introduce global state without justification.

✘ Don't mutate state directly.

---

## Backend

✘ Don't execute SQL inside Services.

✘ Don't expose ORM models directly.

✘ Don't hardcode configuration.

✘ Don't ignore validation.

---

## Styling

✘ Don't hardcode colors.

✘ Don't hardcode spacing.

✘ Don't use `!important`.

✘ Don't create duplicate CSS.

✘ Don't use inline styles unless absolutely necessary.

---

## Performance

✘ Don't optimize without evidence.

✘ Don't render unnecessarily.

✘ Don't fetch the same data repeatedly.

✘ Don't create unnecessary abstractions.

---

## Code Quality

✘ Don't write clever code.

✘ Don't abbreviate names unnecessarily.

✘ Don't leave dead code.

✘ Don't leave commented-out implementations.

✘ Don't leave debug statements.

---

## Dependencies

✘ Don't introduce new libraries without approval.

✘ Don't replace existing libraries without discussion.

✘ Don't solve architectural problems with dependencies.

---

## Documentation

✘ Don't change architecture without updating documentation.

✘ Don't invent new project conventions.

✘ Don't ignore ENGINEERING.md.

✘ Don't ignore PROJECT_STATUS.md.

---

# Decision Rule

Whenever multiple implementations are possible, choose the one that is:

1. Simpler
2. More readable
3. More maintainable
4. More consistent with the existing project
5. Easier for future developers to understand

---

# Golden Rule

Implement every feature as if you will personally maintain it for the next five years.

Favor clarity over cleverness.

Favor consistency over novelty.

Favor maintainability over speed.

Every contribution should make EduQuest a better project than it was before.

=========================================================================================

---

# Definition of Done

A task is not considered complete simply because the code compiles.

A feature is complete only when it satisfies all functional, technical, visual, and quality requirements.

The Definition of Done establishes the minimum standard for every contribution to EduQuest.

No feature should be considered finished until every applicable item has been verified.

---

## Functionality

The feature:

- Fully satisfies the requested requirements.
- Produces the expected behavior.
- Handles normal user interactions.
- Handles edge cases where applicable.
- Does not introduce regressions.

---

## Architecture

The implementation:

- Follows the documented architecture.
- Respects layer boundaries.
- Uses existing project patterns.
- Does not introduce unnecessary complexity.
- Does not duplicate existing functionality.

---

## Code Quality

The code:

- Is clean and readable.
- Uses descriptive naming.
- Has a single responsibility.
- Contains no dead code.
- Contains no commented-out implementations.
- Contains no unnecessary abstractions.

---

## Frontend

The UI:

- Matches the Design System.
- Uses theme variables.
- Is fully responsive.
- Supports keyboard navigation.
- Displays appropriate loading states.
- Displays meaningful error states.
- Maintains visual consistency.

---

## Backend

The backend:

- Uses Services correctly.
- Uses Repositories correctly.
- Validates all inputs.
- Returns appropriate HTTP responses.
- Handles errors gracefully.
- Does not expose implementation details.

---

## State Management

State:

- Exists at the appropriate scope.
- Has a single source of truth.
- Uses React Query for server state.
- Avoids unnecessary Context.
- Avoids duplicated state.

---

## Performance

The implementation:

- Avoids unnecessary rendering.
- Avoids unnecessary API calls.
- Uses efficient algorithms.
- Does not introduce measurable performance regressions.

---

## Accessibility

The feature:

- Supports keyboard navigation.
- Uses semantic HTML.
- Includes accessible labels.
- Maintains sufficient color contrast.
- Preserves visible focus indicators.

Accessibility issues are treated as bugs.

---

## Styling

Styling:

- Uses Design System tokens.
- Uses CSS variables.
- Avoids inline styles.
- Avoids `!important`.
- Remains modular.
- Is responsive.

---

## Testing

The feature has been verified.

Verification includes, where applicable:

- Functional testing
- Responsive testing
- Accessibility verification
- Error handling
- Existing feature regression checks

Critical features should include automated tests when appropriate.

---

## Documentation

Documentation has been updated if:

- Architecture changed.
- Folder structure changed.
- Engineering standards changed.
- Public APIs changed.
- Developer workflows changed.

Documentation should remain synchronized with the implementation.

---

## Repository

Before completion:

- No merge conflicts.
- No debug code.
- No temporary files.
- No unused imports.
- No unused assets.
- No TODO comments without approval.

The repository should remain clean.

---

## Review Checklist

Before considering a task complete, verify:

- ✅ Requirements satisfied
- ✅ Architecture respected
- ✅ Design System followed
- ✅ Responsive
- ✅ Accessible
- ✅ Error handling implemented
- ✅ Performance acceptable
- ✅ No duplicated code
- ✅ Code reviewed
- ✅ Documentation updated (if required)

Every item should be satisfied before marking the task as complete.

---

## Final Question

Before completing any implementation, ask:

> "Would I be comfortable shipping this to production today?"

If the answer is **No**, the task is **not done**.

---

## Philosophy

Done does not mean:

- It works on my machine.
- It compiles.
- The UI appears correct.

Done means:

The feature is complete, maintainable, tested, consistent with the EduQuest architecture, and ready to become part of a long-term production codebase.

Quality is never an optional step.

It is part of the definition of completion.

=========================================================================================   

---

# Code Review Checklist

Every implementation should be reviewed before it is committed.

The purpose of code review is not only to find defects, but also to maintain the long-term quality, consistency, and maintainability of EduQuest.

Code review is a quality assurance process, not a fault-finding exercise.

---

## Requirements

Verify:

- The implementation satisfies all requested requirements.
- No requested functionality is missing.
- No unintended functionality has been introduced.
- Edge cases have been considered.

The implementation should solve the intended problem completely.

---

## Architecture

Verify:

- Existing architecture has been respected.
- Layer responsibilities remain clear.
- No architectural shortcuts have been introduced.
- Existing patterns have been followed.

Architecture should remain consistent across the project.

---

## Readability

Review the code as though it were being read for the first time.

Ask:

- Is the code easy to understand?
- Are responsibilities obvious?
- Are names descriptive?
- Can another developer understand the implementation quickly?

Readable code is maintainable code.

---

## Simplicity

Look for opportunities to simplify.

Ask:

- Can this be shorter?
- Can duplication be removed?
- Is there unnecessary abstraction?
- Is the implementation more complicated than required?

Prefer the simplest correct solution.

---

## Reuse

Verify:

- Existing components were reused where appropriate.
- Existing hooks were reused.
- Existing utilities were reused.
- Existing services were extended rather than duplicated.

Avoid creating parallel implementations.

---

## React

Verify:

- Functional components only.
- Proper hook usage.
- Minimal component state.
- No unnecessary re-renders.
- Components have a single responsibility.

React code should remain predictable.

---

## Backend

Verify:

- Thin API routes.
- Business logic in Services.
- Database access only through Repositories.
- Proper validation.
- Proper error handling.

Backend responsibilities should remain clearly separated.

---

## State Management

Verify:

- State exists at the correct level.
- No duplicated state.
- React Query used appropriately.
- Context used only where justified.

State flow should remain easy to reason about.

---

## Styling

Verify:

- Uses theme variables.
- Follows the Design System.
- Responsive.
- Accessible.
- No duplicated CSS.
- No inline styling unless justified.

Visual consistency is essential.

---

## Performance

Verify:

- No unnecessary rendering.
- No unnecessary API calls.
- No duplicated calculations.
- No obvious performance regressions.

Optimize only where beneficial.

---

## Accessibility

Verify:

- Keyboard navigation works.
- Semantic HTML is used.
- Focus management is correct.
- Labels are meaningful.
- Color contrast remains acceptable.

Accessibility issues should be treated as defects.

---

## Error Handling

Verify:

- Errors are handled gracefully.
- Empty states are supported.
- Loading states exist.
- Unexpected failures do not crash the application.

Users should always receive meaningful feedback.

---

## Security

Verify:

- Input validation exists.
- No sensitive data is exposed.
- Secrets are not hardcoded.
- API boundaries are respected.

Security should be considered during every review.

---

## Testing

Verify:

- Existing functionality still works.
- New functionality behaves correctly.
- No regressions are introduced.
- Appropriate tests have been updated or added when required.

Testing completes the review process.

---

## Repository Health

Before approving:

- No debug code
- No commented-out code
- No TODOs without approval
- No unused imports
- No unused variables
- No unused assets

Leave the repository cleaner than it was before.

---

## Documentation

Verify whether documentation requires updating.

Examples:

- Architecture changes
- Folder structure changes
- Public API changes
- Engineering process changes

Documentation should remain synchronized with implementation.

---

## Final Review Questions

Before approving a change, ask:

- Is this solution simple?
- Is it maintainable?
- Does it follow the architecture?
- Would another developer immediately understand it?
- Would I approve this Pull Request without hesitation?

If any answer is "No", continue improving the implementation.

---

## Approval Standard

Approve code only when you would be confident deploying it to production.

EduQuest should maintain the same engineering standards whether the project is maintained by one developer or an entire engineering team.

Every review should improve the quality of the project.

==========================================================================================

---

# Prompt Templates

The following prompt templates should be used as the starting point for common development tasks.

These prompts assume that Codex has access to the EduQuest repository and this CODEX.md file.

---

## Implement a New Feature

```
Implement the following feature for EduQuest.

Requirements:

- Follow CODEX.md.
- Follow ENGINEERING.md.
- Follow the Design System.
- Follow the existing architecture.
- Reuse existing components whenever possible.
- Keep components small.
- Do not introduce unnecessary dependencies.
- Explain any architectural decisions before implementing them.

Feature:

<feature description>
```

---

## Refactor Existing Code

```
Refactor the following code.

Goals:

- Improve readability.
- Reduce duplication.
- Preserve behavior.
- Follow existing project conventions.
- Do not change functionality.
- Keep the implementation simple.

Files:

<file list>
```

---

## Build React Component

```
Create a React component for EduQuest.

Requirements:

- Functional component.
- TypeScript.
- Responsive.
- Accessible.
- Uses theme variables.
- Uses existing shared components where appropriate.
- Keep the component under approximately 200 lines if practical.
- Do not include business logic.

Component:

<component name>
```

---

## Build Backend Feature

```
Implement the backend feature.

Requirements:

- Thin API route.
- Business logic inside Services.
- Database access only through Repositories.
- Pydantic schemas.
- SQLAlchemy models.
- Proper validation.
- Proper error handling.
- Follow Backend Standards.

Feature:

<feature description>
```

---

## Code Review

```
Review the implementation.

Check:

- Architecture
- Readability
- Naming
- State Management
- Performance
- Accessibility
- Responsiveness
- Technical Debt
- Definition of Done

Suggest improvements before approving.
```

---

## Bug Fix

```
Fix the reported issue.

Requirements:

- Find the root cause.
- Preserve existing functionality.
- Avoid introducing regressions.
- Keep the fix minimal.
- Explain why the bug occurred.
- Verify the solution.

Issue:

<bug description>
```

---

## Architecture Review

```
Review the implementation from an architectural perspective.

Identify:

- Layer violations
- Tight coupling
- Duplicate logic
- Missing abstractions
- Overengineering
- Future scalability concerns

Recommend improvements without changing functionality.
```

---

## Before Every Response

Before completing any task, ask yourself:

- Does this follow the architecture?
- Does this follow the Design System?
- Does this follow ENGINEERING.md?
- Is this the simplest correct implementation?
- Is the code maintainable?
- Would I approve this for production?

If the answer to any question is "No", improve the implementation before responding.

---

# Final Instruction

Your primary responsibility is not to generate code quickly.

Your primary responsibility is to generate code that another experienced engineer would be proud to maintain five years from now.

Favor simplicity.

Favor consistency.

Favor maintainability.

Favor the long-term success of EduQuest over short-term implementation speed.

Every contribution should strengthen the project.

===========================================================================================

---

# EduQuest Development Workflow

All development should follow the same workflow.

Do not skip steps unless explicitly instructed.

---

## 1. Understand

Before writing code:

- Read the task.
- Review related code.
- Review existing components.
- Review relevant documentation.
- Identify affected modules.

Do not begin implementation until the problem is fully understood.

---

## 2. Plan

Before changing code:

- Decide where the implementation belongs.
- Identify reusable components.
- Identify reusable hooks.
- Identify reusable services.
- Minimize architectural impact.

If multiple solutions exist, choose the simplest one.

---

## 3. Implement

During implementation:

- Follow the Engineering Handbook.
- Follow the Design System.
- Follow the Architecture.
- Follow existing naming conventions.
- Keep commits focused.

Do not introduce unrelated changes.

---

## 4. Verify

After implementation verify:

- Functionality
- Responsiveness
- Accessibility
- Performance
- Error handling
- Existing functionality

The feature should behave correctly under normal and edge-case conditions.

---

## 5. Refactor

Before considering the task complete:

- Remove duplication.
- Improve naming.
- Simplify logic.
- Improve readability.

Refactor only when it improves maintainability.

---

## 6. Review

Review the implementation as though another senior engineer wrote it.

Ask:

- Is this maintainable?
- Is this reusable?
- Is this consistent?
- Is this production-ready?

If not, improve it.

---

## 7. Complete

Before marking the task complete:

- Update documentation if required.
- Verify Definition of Done.
- Ensure no temporary code remains.
- Ensure the repository remains cleaner than before.

Every completed task should leave EduQuest in a better state than it was before.

---

# Development Philosophy

EduQuest is a long-term project.

Every decision should optimize for:

- Maintainability
- Simplicity
- Readability
- Scalability
- Consistency

Never optimize for speed at the expense of quality.

---

# Final Reminder

When uncertain:

- Prefer existing patterns.
- Prefer smaller changes.
- Prefer cleaner code.
- Prefer fewer abstractions.
- Prefer maintainability.

Build software that will still be enjoyable to maintain years from now.

===========================================================================================

# Revision History

| Version | Date | Notes |
|----------|------|-------|
| 1.0 | Initial | Codex project instruction file created |
