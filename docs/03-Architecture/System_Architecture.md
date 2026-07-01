# System Architecture

---

# Purpose

This document defines the high-level architecture of EduQuest.

It describes how the major components of the platform interact, the architectural principles that guide development, and the rationale behind key design decisions.

The goal is to ensure that EduQuest remains scalable, maintainable, and extensible as it grows from a personal learning application into a complete educational ecosystem.

---

# Architecture Vision

EduQuest is built using a modular, layered architecture.

Every component has a single responsibility.

Business logic is isolated from presentation.

Data access is isolated from business logic.

UI components remain reusable.

This separation allows individual systems to evolve independently.

---

# Architectural Principles

The architecture follows these principles:

- Separation of Concerns
- Single Responsibility Principle
- Feature-Based Frontend Organization
- Layered Backend Architecture
- API-First Communication
- Stateless Backend Services
- Reusable UI Components
- Scalable Domain Models
- Documentation-Driven Development

---

# High-Level Architecture

```
                   User

                     │

        ┌────────────┴────────────┐
        │                         │
        ▼                         ▼

   React Frontend          Parent / Teacher Portal

        │
        │ REST API
        ▼

      FastAPI Backend

        │

 ┌──────┼────────┬────────┐
 │       │        │        │
 ▼       ▼        ▼        ▼

Services Repositories Auth Future AI

        │

        ▼

   SQLAlchemy ORM

        │

        ▼

      SQLite
```

Future database engines (PostgreSQL, MySQL) should require minimal application changes.

---

# Application Layers

EduQuest is divided into five primary layers.

```
Presentation

↓

API

↓

Services

↓

Repositories

↓

Database
```

Each layer has a clearly defined responsibility.

---

# Layer 1 — Presentation

Technology

- React
- Vite
- React Query

Responsibilities

- User Interface
- Navigation
- Animations
- State Presentation
- User Interaction

The presentation layer never communicates directly with the database.

---

# Layer 2 — API

Technology

- FastAPI

Responsibilities

- HTTP endpoints
- Validation
- Authentication
- Request handling
- Response serialization

The API should remain thin.

Business logic belongs elsewhere.

---

# Layer 3 — Services

Responsibilities

- Business logic
- Gameplay rules
- XP calculations
- Tree Growth
- Achievement unlocking
- Quest progression

Services orchestrate the application.

They should never contain SQL.

---

# Layer 4 — Repositories

Responsibilities

- Database access
- CRUD operations
- Query optimization
- Persistence

Repositories know how data is stored.

They do not know why.

---

# Layer 5 — Database

Current

SQLite

Future

PostgreSQL

Cloud SQL

Responsibilities

- Persist player data
- Quest history
- Statistics
- Achievements
- Certificates

The database should never contain business logic.

---

# Frontend Architecture

The frontend follows Feature-Based Architecture.

```
src/

features/

shared/

api/

theme/

assets/
```

Each feature owns:

- pages
- components
- hooks
- services
- styles

This minimizes coupling.

---

# Backend Architecture

The backend follows Layered Architecture.

```
app/

api/

models/

schemas/

repositories/

services/

core/

database/
```

Every folder has a single responsibility.

---

# Communication

Frontend and backend communicate exclusively through REST APIs.

Example

```
React

↓

GET /player

↓

FastAPI

↓

PlayerService

↓

PlayerRepository

↓

Database
```

Future GraphQL support may be considered if justified by application complexity.

---

# Request Lifecycle

```
User Click

↓

React Component

↓

React Query

↓

API Client

↓

FastAPI Route

↓

Service

↓

Repository

↓

Database

↓

Repository

↓

Service

↓

API

↓

React Query

↓

Component

↓

User
```

Every request follows the same predictable path.

---

# State Management

Client state uses:

- React Query
- Component State
- Context (only where appropriate)

Avoid global state unless necessary.

The backend remains the source of truth.

---

# Data Flow

```
Database

↓

Repository

↓

Service

↓

API

↓

React Query Cache

↓

Component

↓

User
```

Data should always flow in one direction.

---

# Authentication

Current

Development Mode

Future

- JWT Authentication
- Refresh Tokens
- OAuth
- Google Sign-In
- School Authentication

Authentication should remain modular.

---

# File Storage

Future storage includes:

- avatars
- certificates
- illustrations
- generated reports

Possible providers:

- Local Storage
- AWS S3
- Azure Blob Storage
- Google Cloud Storage

Storage implementation should remain abstracted.

---

# AI Integration

Future AI services should exist independently.

Examples:

Professor Owl AI

↓

Story Generator

↓

Hint Generator

↓

Reading Coach

↓

Writing Assistant

↓

Adaptive Learning Engine

AI services should never become tightly coupled with gameplay systems.

---

# Event Flow

Major gameplay events trigger multiple systems.

Example

Quest Completed

↓

XP Awarded

↓

Tree Updated

↓

Achievement Check

↓

Certificate Check

↓

Companion Update

↓

Statistics Updated

↓

UI Refresh

Future versions may introduce an internal event bus.

---

# Scalability

The architecture should support:

- millions of quests
- thousands of schools
- multiple languages
- cloud deployment
- AI services
- multiplayer features
- seasonal events

without major redesign.

---

# Security Architecture

Key principles:

- Input validation
- Parameterized queries
- Authentication
- Authorization
- HTTPS
- Secure password hashing
- Principle of least privilege

Security should be designed into every layer.

---

# Performance Goals

Frontend

- First load under 2 seconds

API

- Average response under 200ms

Database

- Indexed queries

Images

- Lazy loading

Animations

- 60 FPS

Performance should remain measurable.

---

# Deployment Architecture

Development

```
React Dev Server

↓

FastAPI

↓

SQLite
```

Production

```
Browser

↓

Nginx

↓

FastAPI

↓

PostgreSQL

↓

Cloud Storage

↓

CDN
```

Deployment should remain environment-independent.

---

# Future Microservices

Future services may include:

- Notification Service
- AI Service
- Reporting Service
- Certificate Service
- Analytics Service
- Multiplayer Service

These should evolve only when justified by scale.

---

# Architecture Decision Principles

Before introducing new technology, ask:

- Does it simplify the architecture?
- Is it maintainable?
- Does it improve scalability?
- Can the existing architecture solve the problem?
- Will future developers understand it?

The simplest correct solution is preferred.

---

# Success Criteria

The architecture succeeds when:

- new features can be added without major refactoring
- frontend remains independent of backend implementation
- business logic is centralized
- code is easy to test
- documentation remains accurate
- the system scales naturally

---

# Vision Statement

EduQuest is designed to grow for many years.

Its architecture should evolve just as the Tree of Growth evolves—steadily, thoughtfully, and with strong foundations.

Every new feature should strengthen the platform rather than complicate it.

---

# Revision History

| Version | Date | Notes |
|----------|------|-------|
| 1.0 | Initial | System Architecture specification created |