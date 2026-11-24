# DeadLockLens – System Workflow

## Introduction

DeadLockLens follows a structured workflow to manage processes, resources, deadlock detection, victim selection, and recovery analysis.

## Workflow Stages

### 1. Process Creation

The system allows users to create processes and maintain their progress, rollback cost, and retry count.

### 2. Resource Creation

Resources are registered with their names and available instance counts.

### 3. Resource Allocation

Resources are allocated to processes, and allocation relationships are maintained in the database.

### 4. Resource Requests

Processes can request additional resources, creating waiting relationships.

### 5. Deadlock Analysis

The system analyzes resource allocation and request relationships to identify deadlock conditions.

### 6. Graph Visualization

Cytoscape.js provides a graphical representation of process-resource relationships.

### 7. Victim Selection

The protection score algorithm evaluates candidate processes and selects the process with the lowest score.

### 8. Recovery Analysis

The selected victim and recovery information are maintained for deadlock recovery analysis.

### 9. Event History

Detected deadlocks, victim details, protection scores, and recovery information are stored for future reference.

## Workflow Summary

Process Creation → Resource Creation → Allocation and Requests → Deadlock Analysis → Graph Visualization → Victim Selection → Recovery → Event History

## Conclusion

The workflow provides a structured view of how DeadLockLens manages deadlock detection and recovery analysis.
