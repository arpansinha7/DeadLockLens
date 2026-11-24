# DeadLockLens – Project Overview

## Introduction

DeadLockLens is a database-backed deadlock detection, analysis, and recovery system designed to identify and visualize deadlocks between processes and resources.

The system provides an interactive way to understand resource allocation, waiting relationships, deadlock detection, and recovery operations.

## Key Objectives

- Identify deadlocks between processes and resources.
- Visualize resource allocation and waiting relationships.
- Analyze process protection scores.
- Select suitable victim processes.
- Support deadlock recovery.
- Maintain historical records of deadlock events.

## Technology Stack

| Component | Technology |
|---|---|
| Frontend | HTML, CSS, JavaScript |
| Backend | Node.js, Express.js |
| Database | PostgreSQL |
| Database Connectivity | node-postgres (pg) |
| Graph Visualization | Cytoscape.js |
| Version Control | Git and GitHub |

## System Architecture

DeadLockLens follows a three-layer architecture:

1. **Presentation Layer:** Provides the user interface and graph visualization.
2. **Application Layer:** Handles API requests, deadlock detection, and victim selection.
3. **Database Layer:** Stores process, resource, allocation, request, and deadlock event records.

## Core Workflow

1. Create processes and resources.
2. Allocate resources to processes.
3. Generate resource requests.
4. Analyze process-resource dependencies.
5. Detect and visualize deadlocks.
6. Select a victim using the protection score.
7. Perform recovery and maintain event history.

## Expected Benefits

- Better understanding of operating system deadlocks.
- Visual representation of resource dependencies.
- Structured victim selection.
- Historical deadlock analysis.
- Database-backed management of deadlock events.
