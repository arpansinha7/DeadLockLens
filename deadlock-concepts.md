# DeadLockLens – Deadlock Concepts

## Introduction

Deadlock is a situation in which two or more processes remain blocked because each process is waiting for a resource held by another process.

## Necessary Conditions of Deadlock

Four necessary conditions are associated with deadlocks.

### 1. Mutual Exclusion

At least one resource must be held in a non-shareable mode.

### 2. Hold and Wait

A process holds one resource while waiting for additional resources.

### 3. No Preemption

Resources cannot be forcibly taken away from a process.

### 4. Circular Wait

A circular chain of processes exists where each process waits for a resource held by the next process.

## Deadlock Prevention

Deadlock prevention aims to ensure that at least one necessary deadlock condition cannot occur.

## Deadlock Detection

Deadlock detection identifies deadlocks after they occur by analyzing resource allocation and waiting relationships.

## Deadlock Recovery

Deadlock recovery aims to resolve an existing deadlock using suitable recovery actions, such as process termination or resource preemption.

## Relevance to DeadLockLens

DeadLockLens focuses on deadlock detection, visualization, victim selection, and recovery analysis.

## Conclusion

Understanding deadlock conditions, prevention, detection, and recovery provides the foundation for analyzing resource conflicts in operating systems.
