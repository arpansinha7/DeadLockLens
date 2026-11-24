# DeadLockLens – System Architecture

## Overview

DeadLockLens follows a three-layer architecture to provide deadlock detection, visualization, analysis, and recovery.

## 1. Presentation Layer

The presentation layer handles user interaction.

Responsibilities:
- Display process and resource information.
- Show resource allocation graphs.
- Display deadlock detection results.
- Present victim selection details.
- Show recovery information.

Technologies: HTML, CSS, JavaScript, Cytoscape.js.

## 2. Application Layer

The application layer contains the core backend logic.

Responsibilities:
- Handle HTTP requests.
- Manage processes and resources.
- Analyze resource dependencies.
- Detect deadlocks.
- Calculate protection scores.
- Manage victim selection and recovery.

Technologies: Node.js and Express.js.

## 3. Database Layer

The database layer stores and retrieves application data.

Responsibilities:
- Store process information.
- Maintain resource details.
- Track allocations and requests.
- Record deadlock events.
- Maintain recovery history.

Technology: PostgreSQL with node-postgres.

## Data Flow

1. The user performs an operation through the interface.
2. The frontend sends an HTTP request to the backend.
3. Express.js processes the request.
4. The application communicates with PostgreSQL.
5. Results are returned to the frontend.
6. Cytoscape.js visualizes relevant process-resource relationships.

## Conclusion

The layered architecture separates user interaction, application logic, and data management, making DeadLockLens easier to understand, maintain, and extend.
