# DeadLockLens – Testing and Validation

## Introduction

Testing and validation help ensure that DeadLockLens handles process management, resource allocation, deadlock detection, and recovery scenarios correctly.

## Testing Objectives

- Verify process creation and management.
- Validate resource allocation and requests.
- Check deadlock detection scenarios.
- Verify protection score calculations.
- Evaluate victim selection.
- Check recovery history records.

## Test Scenarios

### 1. Process Management

Verify that processes can be created and their details are stored correctly.

### 2. Resource Management

Check that resource information and instance counts are maintained correctly.

### 3. Resource Allocation

Verify that allocation records correctly represent process-resource relationships.

### 4. Resource Requests

Check that process resource requests are stored and retrieved correctly.

### 5. Deadlock Detection

Use a circular waiting scenario to evaluate deadlock detection.

### 6. Victim Selection

Verify that protection scores are calculated using the configured formula and that the lowest-scoring candidate is selected.

### 7. Recovery History

Check whether deadlock events and recovery details are recorded correctly.

## Validation Criteria

- Database relationships should remain consistent.
- Invalid inputs should be handled appropriately.
- Deadlock analysis should identify supported deadlock scenarios.
- Victim selection should follow the protection score calculation.
- Recovery records should contain the relevant event details.

## Conclusion

Testing and validation provide a structured way to evaluate the reliability and correctness of DeadLockLens.
