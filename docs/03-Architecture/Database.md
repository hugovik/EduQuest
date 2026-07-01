Database
Purpose

This document defines the database architecture of EduQuest.

It describes how application data is organized, stored, accessed, and maintained throughout the platform.

The goal is to provide a flexible data model that supports future growth while remaining simple enough for rapid MVP development.

Database Vision

EduQuest stores educational data using a relational database.

Application logic remains outside the database.

Relationships between entities are explicit.

Data integrity is enforced through constraints rather than application code whenever appropriate.

The database should remain independent of the application framework.

Design Principles

The database follows these principles:

Normalized Data Model
Single Source of Truth
Referential Integrity
Application-Level Business Logic
Database Portability
Efficient Indexing
Minimal Data Duplication
Future Scalability
Database Technology

Current

SQLite

Future

PostgreSQL

Cloud SQL

The application should require minimal changes when migrating to another relational database engine.

Database Architecture
React

↓

FastAPI

↓

SQLAlchemy ORM

↓

SQLite Database

SQLAlchemy provides complete abstraction between the application and the database engine.

Database Organization

The database is organized into logical domains.

Users

↓

Learning

↓

Progress

↓

Achievements

↓

World

↓

Administration

Each domain owns a clearly defined set of entities.

User Domain

Stores information related to users.

Primary entities

Parent
Student
Profile
Settings

This domain manages identity and personalization.

Learning Domain

Stores educational content.

Primary entities

Lesson
Activity
Question
Answer
Story
Challenge

Learning content remains independent from student progress.

Progress Domain

Stores learning history.

Primary entities

Lesson Progress
Reading Progress
Writing Progress
Math Progress
Daily Activity

Progress records should never overwrite historical results.

Achievement Domain

Stores rewards and milestones.

Primary entities

Achievement
Badge
Certificate
Reward
Inventory

Achievements are calculated by backend services.

World Domain

Stores game progression.

Primary entities

Avatar
Companion
Tree of Growth
Map Progress
Unlockables

Gameplay elements remain separate from educational content.

Entity Relationships
Parent

↓

Student

↓

Progress

↓

Achievements

↓

Certificates

Relationships remain simple and predictable.

Data Access

All database communication passes through repositories.

Service

↓

Repository

↓

SQLAlchemy

↓

Database

Application services never execute SQL directly.

Primary Keys

Each entity uses a unique identifier.

Example

Parent

↓

Student

↓

Lesson

↓

Achievement

Identifiers remain stable throughout the lifetime of the record.

Foreign Keys

Relationships use foreign keys to enforce integrity.

Examples

Student → Parent
Progress → Student
Lesson → Activity
Certificate → Student

The database should prevent orphaned records.

Indexing

Indexes should be created for:

User lookups
Student progress
Lesson history
Achievements
Certificates

Indexes should improve read performance without excessive storage overhead.

Transactions

Database transactions ensure data consistency.

Examples

Lesson completion
XP updates
Achievement unlocking
Certificate generation

Related operations should succeed or fail together.

Data Integrity

Integrity is maintained through:

Primary keys
Foreign keys
Constraints
Unique indexes
Validation

Application code should never bypass these protections.

Database Migration

Development

SQLite

↓

Migration Scripts

↓

Production

↓

PostgreSQL

The migration process should preserve all application data.

Backup Strategy

Future production deployments should include:

Automated backups
Point-in-time recovery
Versioned snapshots
Off-site storage

Backups should be verified regularly.

Performance Goals

Database

Indexed queries
Fast lookups
Efficient joins
Minimal duplication

Database performance should remain measurable.

Future Expansion

Future database enhancements may include:

Read replicas
Database sharding
Full-text search
Analytics warehouse
Multi-tenant architecture

These enhancements should require minimal changes to the application.

Success Criteria

The database succeeds when:

data integrity is maintained
migrations are reliable
queries remain performant
relationships remain clear
application logic remains outside the database
future database engines can be adopted with minimal effort
Vision Statement

The EduQuest database provides the foundation upon which every lesson, achievement, and adventure is built.

Its structure should remain reliable, scalable, and adaptable, supporting years of educational growth while remaining simple for developers to understand and maintain.

Revision History
Version	Date	Notes
1.0	Initial	Database architecture specification created