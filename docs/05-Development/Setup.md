# Setup

---

# Purpose

This document defines the local development environment for EduQuest.

It describes the tools, software, dependencies, and initial configuration required to begin development.

The goal is to ensure every developer can set up a consistent working environment with minimal effort.

---

# Setup Vision

EduQuest should be simple to develop.

A new developer should be able to clone the repository, install dependencies, and start the application within minutes.

The setup process should remain consistent across operating systems.

---

# Development Principles

The development environment follows these principles:

- Simple Setup
- Consistent Configuration
- Cross-Platform Support
- Minimal Manual Configuration
- Reproducible Environments
- Documentation First
- Version Controlled

---

# Development Requirements

Minimum requirements

- Git
- Node.js (LTS)
- npm
- Python 3.12+
- Visual Studio Code

Recommended

- GitHub Desktop
- Postman
- SQLite Browser
- Docker Desktop (Future)

---

# Project Structure

Clone the repository.

```
git clone <repository-url>

cd eduquest
```

The repository contains both frontend and backend projects.

---

# Frontend Setup

Install project dependencies.

```
npm install
```

Start the development server.

```
npm run dev
```

The application becomes available through the Vite development server.

---

# Backend Setup

Navigate to the backend.

```
cd server
```

Create a virtual environment.

```
python -m venv .venv
```

Activate the environment.

Windows

```
.venv\Scripts\activate
```

macOS / Linux

```
source .venv/bin/activate
```

Install dependencies.

```
pip install -r requirements.txt
```

Run the backend.

```
uvicorn app.main:app --reload
```

---

# Database Setup

Current database

SQLite

The database is created automatically during development.

No additional configuration is required.

---

# Environment Variables

Application configuration is stored inside environment files.

Example

```
.env

↓

Application Configuration

↓

Runtime
```

Sensitive information should never be committed to source control.

---

# Recommended Extensions

Visual Studio Code extensions

- ESLint
- Prettier
- Python
- Pylance
- GitLens
- Error Lens
- Markdown All in One

Extensions should improve productivity without becoming mandatory.

---

# Project Scripts

Common frontend commands

```
npm run dev

npm run build

npm run preview

npm run lint
```

Common backend commands

```
uvicorn app.main:app --reload

pytest

alembic upgrade head
```

Development commands should remain simple and predictable.

---

# Folder Organization

Developers should avoid creating new top-level directories.

New functionality should integrate into the existing project structure.

Project organization is defined in **Project_Structure.md**.

---

# Running the Application

Development startup sequence

```
Backend

↓

Database

↓

Frontend

↓

Browser
```

The frontend communicates with the backend using REST APIs.

---

# Verification

A successful setup should provide:

- Running frontend
- Running backend
- Database connection
- Successful API requests
- No startup errors

Developers should verify the application before beginning implementation.

---

# Troubleshooting

Common issues include:

- Missing dependencies
- Incorrect Node.js version
- Python virtual environment not activated
- Missing environment variables
- Port conflicts

Detailed troubleshooting procedures are documented in **Troubleshooting.md**.

---

# Future Improvements

Future setup enhancements may include:

- Docker development environment
- Dev Containers
- One-command setup
- Automated dependency verification
- Cloud development environments

These improvements should simplify onboarding while preserving the existing workflow.

---

# Success Criteria

The setup process succeeds when:

- developers can install the project quickly
- frontend and backend start successfully
- dependencies remain consistent
- configuration requires minimal manual changes
- onboarding time remains short

---

# Vision Statement

The EduQuest development environment should enable developers to focus on building educational experiences rather than configuring software.

A consistent and reliable setup process lays the foundation for efficient collaboration and long-term project maintainability.

---

# Revision History

| Version | Date | Notes |
|----------|------|-------|
| 1.0 | Initial | Development setup specification created |