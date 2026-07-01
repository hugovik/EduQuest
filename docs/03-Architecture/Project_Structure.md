# Project Structure

---

# Purpose

This document defines the project structure of EduQuest.

It describes how source code, assets, documentation, and configuration files are organized throughout the application.

The goal is to provide a logical, scalable, and maintainable structure that allows developers to locate, understand, and extend the project efficiently.

---

# Project Vision

EduQuest follows a feature-oriented project organization.

Related files remain together.

Reusable resources are centralized.

Documentation evolves alongside the source code.

The project structure should remain intuitive regardless of future application growth.

---

# Organizational Principles

The project structure follows these principles:

- Feature-Based Organization
- Separation of Concerns
- Modular Development
- Reusable Components
- Centralized Configuration
- Documentation-Driven Development
- Predictable Naming
- Scalable Folder Hierarchy

---

# High-Level Structure

```
EduQuest/

docs/

public/

src/

server/

scripts/

tests/

package.json

vite.config.ts

README.md
```

Each top-level directory has a clearly defined responsibility.

---

# Documentation

Project documentation is stored separately from application code.

```
docs/

01-Foundation/

02-Product/

03-Architecture/

04-Design/

05-Development/

06-Testing/

07-Deployment/

08-Operations/
```

Documentation should evolve together with the application.

---

# Source Code

Application source code resides inside the **src** directory.

```
src/

assets/

components/

features/

hooks/

layouts/

pages/

services/

theme/

types/

utils/
```

Application logic should never exist outside the source directory.

---

# Assets

Static resources are organized separately.

```
assets/

images/

icons/

audio/

animations/

illustrations/

fonts/
```

Assets should remain optimized and categorized.

---

# Components

Reusable UI components are stored centrally.

Examples

- Button
- Card
- Modal
- Progress Bar
- Navigation
- Dialog
- Input
- Badge

Components should remain independent of application features.

---

# Features

Application functionality is organized by feature.

```
features/

reading/

writing/

math/

treehouse/

inventory/

profile/

achievements/

settings/
```

Each feature owns its own implementation.

---

# Feature Structure

Each feature follows the same organization.

```
feature/

components/

hooks/

pages/

services/

styles/

types/
```

This consistency simplifies navigation throughout the project.

---

# Layouts

Layouts define common page structures.

Examples

- Main Layout
- Parent Dashboard
- Authentication
- Learning Session

Layouts should contain no business logic.

---

# Pages

Pages compose multiple features into complete application screens.

Examples

- Home
- Reading Forest
- Math Mountains
- Writing Kingdom
- Tree House
- Parent Dashboard

Pages remain responsible for composition rather than implementation.

---

# Services

Application services communicate with external systems.

Examples

- API Client
- Authentication
- Storage
- AI
- Certificates

Services should never contain presentation logic.

---

# Theme

Application styling is centralized.

```
theme/

variables.css

globals.css

layout.css

cards.css

buttons.css

animations.css
```

The theme provides a consistent visual identity across the application.

---

# Utilities

Utility functions provide shared functionality.

Examples

- Date formatting
- Validation
- Calculations
- String utilities
- Constants

Utilities should remain framework independent whenever possible.

---

# Types

Shared TypeScript definitions are stored centrally.

Examples

- Student
- Lesson
- Progress
- Achievement
- Certificate

Shared types improve consistency across the application.

---

# Backend

Server-side code remains isolated from the frontend.

```
server/

api/

models/

repositories/

services/

database/

core/
```

Frontend and backend should evolve independently.

---

# Testing

Testing resources are separated from application code.

```
tests/

unit/

integration/

e2e/

fixtures/
```

Tests should mirror the application structure whenever practical.

---

# Configuration

Configuration files remain in the project root.

Examples

- package.json
- tsconfig.json
- vite.config.ts
- eslint.config.js
- .env.example

Configuration should remain environment independent.

---

# Naming Conventions

Directories

- lowercase
- kebab-case where appropriate

Files

- descriptive
- predictable
- consistent

Components

- PascalCase

Hooks

- camelCase beginning with **use**

Consistency improves maintainability.

---

# Dependency Rules

Features may depend upon:

- Shared Components
- Utilities
- Services
- Theme

Shared components should never depend upon individual features.

Dependencies should always point downward.

---

# Growth Strategy

As the application expands:

- new features become new folders
- shared functionality moves into common modules
- documentation grows alongside implementation

Existing structures should require minimal reorganization.

---

# Success Criteria

The project structure succeeds when:

- files are easy to locate
- responsibilities remain clear
- new developers can understand the project quickly
- features remain independent
- code duplication is minimized
- documentation stays synchronized with implementation

---

# Vision Statement

The EduQuest project structure provides the foundation for sustainable development.

Its organization should remain clear, predictable, and scalable, allowing the platform to grow naturally while preserving readability, maintainability, and developer productivity.

---

# Revision History

| Version | Date | Notes |
|----------|------|-------|
| 1.0 | Initial | Project Structure specification created |