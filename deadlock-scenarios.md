# DeadLockLens – Deadlock Scenarios

## Introduction

Deadlock scenarios help explain how processes can enter a waiting state because of resource dependencies.

## Scenario 1: Two Processes and Two Resources

Consider two processes:

- P1
- P2

And two resources:

- R1
- R2

### Resource Allocation

- R1 is allocated to P1.
- R2 is allocated to P2.

### Resource Requests

- P1 requests R2.
- P2 requests R1.

### Result

Both processes wait for resources held by each other, creating a circular wait condition.

## Scenario 2: No Circular Waiting

Consider two processes where P1 requests a resource that is available.

The resource can be allocated to P1 without creating a circular dependency.

This scenario does not represent the circular-wait deadlock described above.

## Scenario 3: Multiple Resource Dependencies

Multiple processes may request resources allocated to other processes.

Analyzing these dependencies helps identify circular waiting relationships.

## Relevance to DeadLockLens

DeadLockLens provides process-resource visualization and deadlock analysis to help understand such situations.

## Conclusion

Deadlock scenarios provide useful examples for understanding resource allocation, waiting relationships, and circular dependencies.
