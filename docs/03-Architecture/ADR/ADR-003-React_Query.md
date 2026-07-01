# ADR-003 — React Query

---

# Status

Accepted

---

# Date

July 2026

---

# Context

EduQuest is a data-driven application that frequently communicates with backend services.

Student progress, lessons, achievements, certificates, and AI-generated content are all retrieved through REST APIs.

Managing server state manually using React state, Context, or Redux would introduce unnecessary complexity, duplicate requests, inconsistent caching, and additional boilerplate.

A dedicated solution is required for managing asynchronous server state.

---

# Decision

EduQuest adopts **React Query** as the primary solution for server state management.

React Query is responsible for:

- Data fetching
- Request caching
- Background synchronization
- Automatic refetching
- Loading states
- Error handling
- Cache invalidation

React Query manages only server state.

Local UI state remains within React components.

---

# Rationale

React Query provides:

- Automatic caching
- Reduced network requests
- Better application performance
- Simplified asynchronous code
- Consistent loading behavior
- Built-in retry logic

The frontend remains significantly simpler than alternative state management solutions.

---

# State Architecture

```
React Component

↓

React Query

↓

API Client

↓

FastAPI

↓

Database
```

React Query becomes the single source of truth for all server-side data.

---

# Responsibilities

React Query manages:

- Student profile
- Lessons
- Progress
- Achievements
- Certificates
- Parent dashboard
- AI responses

Server data should never be duplicated in component state.

---

# Local State

React component state remains responsible for:

- Dialog visibility
- Form inputs
- Selected tabs
- Current filters
- UI animations
- Temporary values

Local state should never store persistent application data.

---

# Caching

React Query automatically caches responses.

Examples

- Student Profile
- Lesson List
- Progress Summary
- Achievement List
- Parent Dashboard

Cached data reduces unnecessary API requests.

---

# Cache Invalidation

Caches should refresh after operations that modify data.

Examples

```
Lesson Completed

↓

XP Updated

↓

Invalidate Progress

↓

Reload Progress
```

Only affected queries should be invalidated.

---

# Background Refetching

React Query automatically refreshes stale data.

Examples

- Returning to application
- Window refocus
- Network reconnection

Users always receive current information with minimal interruption.

---

# Loading States

Loading states are managed automatically.

Examples

- Lesson loading
- Dashboard loading
- AI generation
- Certificate retrieval

Components remain simple and predictable.

---

# Error Handling

React Query provides centralized error handling.

Examples

- Network unavailable
- Server unavailable
- Timeout
- Authentication expired

The application should display user-friendly messages.

---

# Retry Strategy

Transient failures may be retried automatically.

Examples

- Network interruption
- Temporary server error

Authentication failures should never retry automatically.

---

# Offline Support

Future offline functionality integrates naturally with React Query.

```
Cached Data

↓

Offline

↓

Reconnect

↓

Background Refresh
```

Cached information remains available during temporary network loss.

---

# Benefits

React Query provides:

- Cleaner components
- Reduced boilerplate
- Automatic caching
- Better performance
- Simpler asynchronous code
- Improved user experience

The application remains easier to maintain as it grows.

---

# Alternatives Considered

Manual Fetching

Rejected because every component would duplicate loading, error handling, and caching logic.

Redux

Rejected because EduQuest has relatively little global client state and does not require centralized state management for server data.

Context API

Rejected because Context is not designed for asynchronous server state and lacks caching capabilities.

---

# Future Considerations

Future React Query capabilities may include:

- Persistent cache
- Offline synchronization
- Background prefetching
- Optimistic updates
- Infinite scrolling
- Intelligent cache persistence

These enhancements integrate naturally with the existing architecture.

---

# Decision Summary

React Query provides a modern, efficient, and scalable solution for managing server state within EduQuest.

It minimizes complexity, improves application performance, and allows developers to focus on building educational features rather than maintaining asynchronous data logic.

---

# Revision History

| Version | Date | Notes |
|----------|------|-------|
| 1.0 | Initial | React Query decision accepted |