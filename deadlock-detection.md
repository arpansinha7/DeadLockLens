# DeadLockLens – Deadlock Detection

## Introduction

Deadlock detection is an important operating system concept used to identify situations where multiple processes wait indefinitely for resources held by one another.

DeadLockLens represents these dependencies using a Resource Allocation Graph (RAG).

## Resource Allocation Graph

A Resource Allocation Graph consists of:

- Process nodes: Represent executing processes.
- Resource nodes: Represent system resources.
- Allocation edges: Represent resources allocated to processes.
- Request edges: Represent resources requested by processes.

## Deadlock Detection Approach

The system analyzes relationships between processes and resources to identify circular waiting conditions.

### Detection Steps

1. Retrieve active processes and resources.
2. Read current resource allocations.
3. Read pending resource requests.
4. Construct the dependency graph.
5. Analyze the graph for circular dependencies.
6. Identify processes involved in detected deadlocks.

## Circular Wait

A circular wait occurs when processes form a cycle of dependencies.

Example:

P1 waits for R2, which is held by P2.

P2 waits for R1, which is held by P1.

This creates a circular dependency between P1 and P2.

## Detection Result

When a deadlock is detected, the system can:

- Identify involved processes.
- Highlight related graph relationships.
- Calculate protection scores.
- Select a victim process.
- Record the deadlock event.

## Conclusion

Deadlock detection helps identify resource conflicts and provides information required for selecting an appropriate recovery strategy.
