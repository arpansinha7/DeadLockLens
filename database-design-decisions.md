# DeadLockLens – Database Design Decisions

## Introduction

DeadLockLens uses PostgreSQL as its relational database to maintain structured information about processes, resources, allocations, requests, and deadlock events.

## 1. Relational Database

PostgreSQL is used to organize project data into related tables.

## 2. Primary Keys

The processes, resources, and deadlock_events tables use SERIAL primary keys to uniquely identify records.

## 3. Foreign Keys

Foreign key constraints establish relationships between processes, resources, and deadlock events.

## 4. Composite Primary Keys

The allocations and requests tables use composite primary keys consisting of process_id and resource_id.

This prevents duplicate process-resource pairs within these tables.

## 5. Cascading Deletion

The allocations and requests tables use ON DELETE CASCADE for their process and resource references.

This helps maintain referential integrity when referenced records are deleted.

## 6. Default Values

Default values are provided for fields such as progress, rollback_cost, retry_count, and resource instances.

## 7. Timestamps

Timestamp fields help maintain information about process creation, deadlock detection, and recovery.

## Conclusion

These database design decisions provide a structured foundation for storing and managing DeadLockLens data.
