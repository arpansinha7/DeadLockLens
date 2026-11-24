# DeadLockLens – Database Schema

## Introduction

DeadLockLens uses PostgreSQL to store and manage process information, resource allocation, resource requests, and deadlock history.

## Database Tables

### 1. Processes

Stores information about processes.

- id: Unique process identifier.
- name: Process name.
- created_at: Process creation timestamp.
- progress: Current process progress.
- rollback_cost: Estimated rollback cost.
- retry_count: Number of previous retries.

### 2. Resources

Stores available system resources.

- id: Unique resource identifier.
- name: Resource name.
- instances: Total resource instances.

### 3. Allocations

Maintains resource allocation records.

- process_id: References the process.
- resource_id: References the resource.

### 4. Requests

Stores resource requests made by processes.

- process_id: References the requesting process.
- resource_id: References the requested resource.

### 5. Deadlock Events

Maintains records of detected deadlocks and recovery operations.

- id: Unique event identifier.
- detected_at: Detection timestamp.
- victim_process_id: Selected victim process.
- victim_pid: Process identifier.
- protection_score: Calculated protection score.
- recovery_action: Recovery operation performed.
- recovered_at: Recovery timestamp.

## Database Relationships

- One process can have multiple allocation records.
- One process can have multiple resource requests.
- Resources can be associated with multiple processes.
- Foreign keys maintain referential integrity.
- Primary keys ensure unique records.

## Data Integrity

The database uses primary keys, foreign keys, unique constraints, NOT NULL constraints, and cascading deletion where configured to maintain data consistency.
