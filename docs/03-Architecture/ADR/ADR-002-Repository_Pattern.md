# ADR-002 — Repository Pattern

---

# Status

Accepted

---

# Date

July 2026

---

# Context

EduQuest requires a clean separation between business logic and data persistence.

Without a dedicated data access layer, services would become tightly coupled to SQLAlchemy and the underlying database implementation.

This would make the application more difficult to test, maintain, and migrate to different database technologies.

A solution is required that isolates database operations from application logic.

---

# Decision

EduQuest adopts the **Repository Pattern**.

Repositories are responsible for all communication with the database.

Services interact exclusively with repositories.

Repositories expose simple methods for creating, retrieving, updating, and deleting data.

Business logic must never communicate directly with SQLAlchemy.

---

# Rationale

The Repository Pattern provides:

- Database abstraction
- Better maintainability
- Easier testing
- Cleaner service layer
- Future database portability

The application remains independent of the persistence mechanism.

---

# Architecture

```
API

↓

Service

↓

Repository

↓

SQLAlchemy

↓

Database
```

Repositories form the only bridge between business logic and persistent storage.

---

# Repository Responsibilities

Repositories are responsible for:

- Creating records
- Reading records
- Updating records
- Deleting records
- Query optimization
- Transaction management

Repositories should never contain business rules.

---

# Service Responsibilities

Services are responsible for:

- Business logic
- XP calculations
- Lesson progression
- Achievement evaluation
- Validation beyond data integrity

Services should never execute SQL queries.

---

# Repository Structure

```
repositories/

student_repository.py

lesson_repository.py

progress_repository.py

achievement_repository.py

certificate_repository.py

parent_repository.py
```

Each repository manages a single domain.

---

# Example Flow

```
Lesson Completed

↓

Lesson Service

↓

Progress Repository

↓

SQLAlchemy

↓

Database
```

Business logic remains completely unaware of database implementation details.

---

# Dependency Direction

Dependencies always point downward.

```
API

↓

Services

↓

Repositories

↓

Database
```

Repositories should never depend upon services.

---

# Benefits

The Repository Pattern provides:

- Loose coupling
- Better readability
- Easier testing
- Simplified maintenance
- Cleaner architecture

Changes to the database layer require minimal changes elsewhere.

---

# Testing

Repositories can be tested independently.

Services can be tested using mocked repositories without requiring a real database.

This significantly improves test speed and reliability.

---

# Database Migration

Future migration from SQLite to PostgreSQL should require minimal repository changes.

Neither the API nor service layer should require modification.

Database portability is achieved through SQLAlchemy and repository abstraction.

---

# Alternatives Considered

Direct SQLAlchemy Usage

```
Service

↓

SQLAlchemy

↓

Database
```

Rejected because business logic becomes tightly coupled to the persistence layer.

Active Record Pattern

Rejected because business logic becomes distributed across entity models, making larger applications more difficult to maintain.

---

# Future Considerations

Future repositories may support:

- Read Replicas
- Distributed Databases
- Caching Layers
- Search Indexes
- Analytics Storage

Application services should remain unaffected by these changes.

---

# Decision Summary

The Repository Pattern provides a clean separation between business logic and data persistence.

It improves maintainability, simplifies testing, and ensures that EduQuest can evolve its database technology without affecting the rest of the application.

---

# Revision History

| Version | Date | Notes |
|----------|------|-------|
| 1.0 | Initial | Repository Pattern decision accepted |