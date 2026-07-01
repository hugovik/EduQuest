Backend
Purpose

This document defines the backend architecture of EduQuest.

It describes the server-side components responsible for application logic, authentication, learning progression, AI integration, data persistence, and communication with the frontend.

The goal is to build a backend that is secure, maintainable, scalable, and capable of evolving from a personal educational platform into a cloud-native learning ecosystem.

Backend Vision

The EduQuest backend follows a layered architecture.

Business logic is separated from HTTP endpoints.

Database access is isolated through repositories.

Services remain modular and reusable.

AI components are implemented independently from gameplay systems.

This architecture allows the backend to evolve without affecting the frontend or application data.

Design Principles

The backend follows these principles:

Layered Architecture
Separation of Concerns
Repository Pattern
Service-Oriented Design
Dependency Injection
API-First Development
Secure by Design
Modular Services
Test-Driven Development
Technology Stack
Framework

FastAPI

Benefits

High performance
Automatic API documentation
Native asynchronous support
Excellent Python ecosystem
AI integration ready
Language

Python

ORM

SQLAlchemy

Benefits

Database abstraction
Flexible relationships
Migration support
Future database portability
Validation

Pydantic

Responsibilities

Request validation
Response serialization
Type safety
Database

Current

SQLite

Future

PostgreSQL

Cloud SQL

API Style

REST

Future

GraphQL
WebSockets
High-Level Backend Architecture
                  React Frontend

                         │

                    REST API

                         │

                    FastAPI Server

                         │

      ┌──────────┬──────────┬──────────┐
      │          │          │          │

 Authentication Services AI Services Repositories

                         │

                  SQLAlchemy ORM

                         │

                     SQLite DB

Each layer communicates only with the layer directly beneath it.

Backend Layers

EduQuest backend consists of four logical layers.

API

↓

Services

↓

Repositories

↓

Database

Each layer has a single responsibility.

API Layer

Technology

FastAPI

Responsibilities

HTTP routing
Authentication
Validation
Serialization
Error responses

The API layer should remain lightweight.

Business rules belong to services.

Service Layer

Responsibilities

XP calculation
Quest progression
Achievement evaluation
Story progression
Reading assessment
Parent reports
Certificate generation

Services orchestrate the application.

Services never execute SQL directly.

Repository Layer

Responsibilities

CRUD operations
Query optimization
Persistence
Transaction management

Repositories know how data is stored.

They do not know why.

Database Layer

Current

SQLite

Future

PostgreSQL

Responsibilities

User data
Learning history
Progress
Inventory
Achievements
Certificates

The database should never contain application logic.

Core Services

The backend consists of independent services.

Authentication Service

↓

Student Service

↓

Learning Service

↓

Progress Service

↓

Achievement Service

↓

Reward Service

↓

Certificate Service

↓

AI Service

↓

Reporting Service

Each service owns its own business rules.

Authentication Service

Responsibilities

Login
Logout
Registration
Password hashing
Session validation

Future

JWT
Refresh Tokens
OAuth

Authentication remains centralized.

Student Service

Responsibilities

Student profile
XP
Levels
Avatar
Companion
Inventory

This service becomes the primary source of student data.

Learning Service

Responsible for

Reading lessons
Writing exercises
Math activities
Story progression
Daily quests

Learning logic remains independent from presentation.

Progress Service

Tracks

Lesson completion
Scores
Accuracy
Time spent
Reading fluency
Writing performance
Math proficiency

Progress is calculated automatically after every activity.

Achievement Service

Responsible for

Badges
Milestones
Streaks
Unlockables
Certificates

Achievements are evaluated after every completed activity.

AI Service

The AI service operates independently.

Examples

Reading Coach

↓

Writing Assistant

↓

Story Generator

↓

Hint Generator

↓

Adaptive Learning

Future AI providers can be replaced without affecting the remainder of the backend.

Repository Structure
repositories/

student_repository.py

lesson_repository.py

progress_repository.py

achievement_repository.py

certificate_repository.py

parent_repository.py

Repositories expose data access only.

Request Lifecycle
Client Request

↓

API Route

↓

Validation

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

API Response

↓

Client

Every request follows the same predictable path.

Error Handling

Standard HTTP responses

200 OK

201 Created

400 Bad Request

401 Unauthorized

403 Forbidden

404 Not Found

422 Validation Error

500 Internal Server Error

Errors should remain consistent across all endpoints.

Logging

Important backend events include

Login
Logout
Lesson completion
Badge unlock
Certificate generation
AI requests
System errors

Sensitive information must never be logged.

Background Tasks

Examples

Daily

Streak calculation
Reminder scheduling

Weekly

Parent reports
Statistics aggregation

Monthly

Certificate archive
Analytics cleanup

Background jobs should never block API requests.

AI Integration

The backend communicates with external AI providers through a dedicated abstraction layer.

Application

↓

AI Service

↓

Prompt Builder

↓

Provider Adapter

↓

OpenAI / Future Providers

This allows providers to be replaced without modifying business logic.

Security

Backend security principles

Input validation
Parameterized queries
Password hashing
Authentication
Authorization
HTTPS
CORS
Rate limiting

Security should exist in every layer.

Performance Goals

API

Average response under 200 ms

Authentication

Under 250 ms

Progress updates

Under 100 ms

Lesson completion

Under 150 ms

AI requests

Cached whenever appropriate

Performance should remain measurable.

Future Expansion

Future backend modules may include

Multiplayer Service
Teacher Portal Service
Classroom Management
Notification Service
Analytics Service
Marketplace Service

These services should evolve independently as the platform grows.

Success Criteria

The backend succeeds when

business logic remains centralized
APIs remain stable
services are loosely coupled
database changes require minimal code changes
AI services remain isolated
new features can be added without architectural redesign
Vision Statement

The EduQuest backend is the engine that powers every learning experience.

It should remain invisible to the learner while providing a secure, reliable, and scalable foundation capable of supporting millions of educational interactions, intelligent tutoring, and future platform expansion.

Revision History
Version	Date	Notes
1.0	Initial	Backend architecture specification created