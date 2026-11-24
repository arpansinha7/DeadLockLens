# DeadLockLens – Database Relationships

## Introduction

DeadLockLens uses PostgreSQL relational tables to maintain process information, resources, allocations, requests, and deadlock events.

## 1. Processes and Allocations

The `allocations` table connects processes with resources through foreign keys.

- `process_id` references the processes table.
- `resource_id` references the resources table.
- Both columns form a composite primary key.

## 2. Processes and Requests

The `requests` table maintains resource requests made by processes.

- `process_id` references the processes table.
- `resource_id` references the resources table.
- Both columns form a composite primary key.

## 3. Deadlock Events

The `deadlock_events` table stores information about detected deadlocks.

- `victim_process_id` references the processes table.
- Victim process information is maintained for recovery analysis.

## 4. Referential Integrity

The database uses foreign key constraints to maintain valid relationships between tables.

The allocations and requests tables use `ON DELETE CASCADE` for their process and resource references.

## 5. Composite Primary Keys

The allocations and requests tables use composite primary keys consisting of `process_id` and `resource_id`.

This prevents duplicate process-resource relationships within each table.

## Conclusion

These database relationships help maintain structured and consistent information across DeadLockLens.
