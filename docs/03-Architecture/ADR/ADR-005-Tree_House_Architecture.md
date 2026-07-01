# ADR-005 — Tree House Architecture

---

# Status

Accepted

---

# Date

July 2026

---

# Context

EduQuest is not intended to be a traditional Learning Management System.

The application combines structured educational content with exploration, storytelling, and game mechanics.

Children should feel as though they are entering a living world rather than navigating menus and worksheets.

A central hub is required to connect all educational domains while providing a consistent point of progression.

---

# Decision

EduQuest adopts the **Tree House** as the central architectural concept of the application.

The Tree House serves as the player's home and primary navigation hub.

Every major educational activity begins and ends at the Tree House.

As learning progresses, the Tree House evolves together with the student.

---

# Rationale

The Tree House provides:

- Familiar navigation
- Emotional attachment
- Visible progression
- Consistent orientation
- Strong game identity

Rather than navigating between disconnected pages, students explore a single evolving world.

---

# World Architecture

```
                Tree House

        ┌────────┼────────┐

        ▼        ▼        ▼

 Reading Forest  Math Mountains  Writing Kingdom

        │        │        │

        └────────┼────────┘

                 ▼

        Achievement Castle
```

The Tree House connects every learning domain.

---

# Tree House Responsibilities

The Tree House provides access to:

- Daily Quests
- Learning Areas
- Companion
- Inventory
- Achievements
- Parent Messages
- Rewards

The Tree House should remain the player's central destination.

---

# Learning Areas

Educational content is divided into themed worlds.

Examples

- Reading Forest
- Math Mountains
- Writing Kingdom

Future learning worlds may be added without changing the overall navigation structure.

---

# Progression

The Tree House evolves together with the student.

Examples

- New decorations
- Additional rooms
- Unlockable furniture
- Seasonal decorations
- Companion upgrades

Visual progression reinforces learning progress.

---

# Navigation

Application navigation follows the world structure.

```
Tree House

↓

Learning Area

↓

Lesson

↓

Completion

↓

Tree House
```

Students always return to a familiar environment after completing activities.

---

# Rewards

Completing educational activities rewards the player.

Examples

- XP
- Coins
- Decorations
- Furniture
- Companion Items
- Story Progress

Rewards should always support educational motivation rather than distract from it.

---

# Companion System

The Tree House is home to the student's companion.

The companion may:

- Offer hints
- Celebrate achievements
- Deliver quests
- Explain new features

Future companions may be customized by the student.

---

# Story Progression

Educational progress advances the overall story.

Examples

- New areas unlock
- Characters appear
- Events occur
- Seasonal activities become available

Story progression should always reinforce learning.

---

# Parent Integration

Parents remain outside the adventure world.

Parent functionality is accessed separately through the Parent Dashboard.

This separation allows children to remain immersed in the learning experience.

---

# Scalability

The Tree House architecture supports future expansion.

Examples

- Science Lab
- Music Studio
- Geography Expedition
- Coding Workshop
- Multiplayer Plaza

New worlds connect naturally to the existing hub.

---

# Benefits

The Tree House Architecture provides:

- Consistent navigation
- Strong visual identity
- Emotional engagement
- Clear progression
- Natural scalability

The application feels like an adventure rather than educational software.

---

# Alternatives Considered

Traditional Dashboard

Rejected because it resembles a conventional LMS and lacks emotional engagement.

Menu-Based Navigation

Rejected because educational areas feel disconnected.

Linear Lesson Navigation

Rejected because it limits exploration and player agency.

---

# Future Considerations

Future versions may include:

- Seasonal Tree House themes
- Multiplayer visitors
- Community events
- Interactive furniture
- Dynamic weather
- AI-driven characters

The Tree House should continue evolving without changing its role as the central hub.

---

# Decision Summary

The Tree House serves as the heart of EduQuest.

It transforms navigation into exploration, connects every educational domain, and provides a persistent home that grows alongside the student throughout their learning journey.

---

# Revision History

| Version | Date | Notes |
|----------|------|-------|
| 1.0 | Initial | Tree House Architecture decision accepted |