# API

---

# Purpose

This document defines the REST API architecture of EduQuest.

It describes how the frontend communicates with the backend, the design principles used for API development, endpoint organization, request lifecycle, and future extensibility.

The goal is to provide a predictable, secure, and scalable interface between all application components.

---

# API Vision

EduQuest exposes all backend functionality through a RESTful API.

The API acts as the single communication layer between the frontend and backend.

Every request is validated.

Every response follows a consistent format.

The API should remain stable as the application evolves.

---

# API Design Principles

The API follows these principles:

- RESTful Design
- Stateless Communication
- Consistent Endpoints
- Predictable Responses
- Resource-Based URLs
- Secure Authentication
- Versioned API
- Validation First
- Documentation Driven

---

# API Architecture

```
React Frontend

↓

API Client

↓

REST API

↓

FastAPI

↓

Services

↓

Repositories

↓

Database
```

The frontend never communicates directly with the database.

---

# API Versioning

Current

```
/api/v1/
```

Future

```
/api/v2/
```

New API versions should not introduce breaking changes to existing clients.

---

# Endpoint Organization

Endpoints are grouped by domain.

```
Authentication

↓

Students

↓

Lessons

↓

Progress

↓

Achievements

↓

Certificates

↓

AI

↓

Parent Dashboard
```

Each domain owns its own collection of endpoints.

---

# Authentication Endpoints

Examples

```
POST   /auth/login

POST   /auth/logout

POST   /auth/register

POST   /auth/refresh
```

Authentication endpoints manage user identity and access.

---

# Student Endpoints

Examples

```
GET    /student

PUT    /student

GET    /student/profile

GET    /student/settings
```

These endpoints manage student information.

---

# Lesson Endpoints

Examples

```
GET    /lessons

GET    /lessons/{id}

POST   /lessons/{id}/start

POST   /lessons/{id}/complete
```

Lesson endpoints provide access to educational content.

---

# Progress Endpoints

Examples

```
GET    /progress

GET    /progress/reading

GET    /progress/writing

GET    /progress/math
```

Progress endpoints provide learning history and statistics.

---

# Achievement Endpoints

Examples

```
GET    /achievements

GET    /badges

GET    /rewards
```

Achievements are calculated by backend services.

The API returns the current results.

---

# Certificate Endpoints

Examples

```
GET    /certificates

GET    /certificates/{id}

POST   /certificates/generate
```

Certificates remain accessible through dedicated endpoints.

---

# AI Endpoints

Examples

```
POST   /ai/story

POST   /ai/reading

POST   /ai/writing

POST   /ai/hints
```

AI functionality remains isolated from core application services.

---

# Parent Dashboard Endpoints

Examples

```
GET    /parent/dashboard

GET    /parent/reports

POST   /parent/goals

GET    /parent/statistics
```

These endpoints provide parent-specific functionality.

---

# Request Lifecycle

Every request follows the same predictable flow.

```
Client

↓

API Route

↓

Validation

↓

Authentication

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

Response
```

Business logic belongs exclusively to the service layer.

---

# Request Validation

Every request validates:

- Authentication
- Authorization
- Required fields
- Data types
- Business rules

Invalid requests should never reach the service layer.

---

# Response Structure

Successful responses should remain consistent.

Example

```
{
    "success": true,
    "data": { ... }
}
```

Error responses follow the same structure.

```
{
    "success": false,
    "message": "...",
    "errors": [ ... ]
}
```

Consistent responses simplify frontend development.

---

# HTTP Status Codes

The API uses standard HTTP status codes.

```
200 OK

201 Created

204 No Content

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

409 Conflict

422 Validation Error

500 Internal Server Error
```

Status codes should accurately describe the result of every request.

---

# Authentication

Current

Development Mode

Future

- JWT
- Refresh Tokens
- OAuth
- Google Authentication
- School Authentication

Authentication should remain independent from business logic.

---

# Pagination

Large collections should support pagination.

Example

```
GET /lessons?page=1&pageSize=20
```

Pagination improves scalability and performance.

---

# Filtering

Endpoints may support filtering.

Examples

```
Subject

Difficulty

Completed

Grade

Achievement Status
```

Filtering should remain optional.

---

# Sorting

Endpoints may support sorting.

Examples

```
Name

Date

Difficulty

XP

Completion Time
```

Sorting should improve usability without increasing API complexity.

---

# Rate Limiting

Future production deployments should implement rate limiting.

Examples

- Login attempts
- AI requests
- Public endpoints

Rate limiting protects backend resources.

---

# API Documentation

FastAPI automatically generates documentation.

Available formats

- Swagger UI
- OpenAPI Specification

Documentation should always reflect the current implementation.

---

# Security

API security includes:

- HTTPS
- Authentication
- Authorization
- Input validation
- Parameterized queries
- CORS
- Rate limiting

Security should be enforced before business logic executes.

---

# Performance Goals

API

- Average response under 200ms

Validation

- Minimal overhead

Serialization

- Efficient JSON responses

The API should remain responsive under increasing load.

---

# Future Expansion

Future API capabilities may include:

- GraphQL
- WebSockets
- Event Streaming
- Public API
- Third-Party Integrations
- School Integrations

These additions should not require redesign of existing endpoints.

---

# Success Criteria

The API succeeds when:

- endpoints remain predictable
- requests are consistently validated
- responses follow a common format
- business logic remains outside the API layer
- documentation stays synchronized with implementation
- new endpoints can be added without affecting existing clients

---

# Vision Statement

The EduQuest API serves as the communication bridge between every user interface and every backend service.

Its design should remain simple, secure, and consistent, enabling developers to build new features confidently while ensuring reliable communication across the entire platform.

---

# Revision History

| Version | Date | Notes |
|----------|------|-------|
| 1.0 | Initial | API architecture specification created |