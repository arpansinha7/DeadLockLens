# DeadLockLens – Resource Allocation Graph

## Introduction

A Resource Allocation Graph (RAG) is a directed graph used to represent relationships between processes and resources in an operating system.

DeadLockLens uses graph visualization to represent process-resource relationships.

## Graph Components

### 1. Process Nodes

Process nodes represent processes involved in resource allocation or resource requests.

### 2. Resource Nodes

Resource nodes represent system resources available to processes.

### 3. Allocation Edges

An allocation edge represents a resource assigned to a process.

### 4. Request Edges

A request edge represents a resource requested by a process.

## Graph Representation

The graph contains two important relationships:

- Process to Resource: Represents a resource request.
- Resource to Process: Represents an existing resource allocation.

## Deadlock Analysis

Circular dependencies in a resource allocation graph can indicate deadlock conditions.

The graph helps users understand which processes are waiting for resources and which resources are currently allocated.

## Visualization

Cytoscape.js is used for graph visualization in DeadLockLens.

It provides a visual representation of process and resource relationships.

## Benefits

- Makes resource dependencies easier to understand.
- Helps visualize allocation and waiting relationships.
- Supports deadlock analysis.
- Improves understanding of process-resource interactions.

## Conclusion

Resource Allocation Graphs provide a visual approach to understanding resource dependencies and analyzing deadlock situations.
