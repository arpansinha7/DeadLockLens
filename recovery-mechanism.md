# DeadLockLens – Recovery Mechanism

## Introduction

Deadlock recovery is the process of resolving a detected deadlock by taking appropriate action against a selected victim process.

DeadLockLens uses victim selection based on protection scores to support recovery analysis.

## Recovery Objectives

- Resolve circular waiting conditions.
- Minimize the impact on running processes.
- Select a suitable victim process.
- Maintain records of recovery operations.

## Recovery Workflow

1. Detect a deadlock between processes and resources.
2. Identify the processes involved.
3. Calculate protection scores.
4. Select the process with the lowest protection score.
5. Initiate the configured recovery action.
6. Update relevant process and resource information.
7. Record the recovery action in the deadlock history.

## Victim Process Selection

The victim process is selected using the protection score formula:

S = 0.4P + 0.4R + 0.2T

The process with the lowest protection score is selected as the victim.

## Recovery History

The `deadlock_events` table maintains information related to detected deadlocks and recovery operations.

Important fields include:

- detected_at: Time when the deadlock was detected.
- victim_process_id: Selected victim process.
- protection_score: Victim protection score.
- recovery_action: Recovery action performed.
- recovered_at: Time when recovery was completed.

## Benefits

- Structured deadlock recovery analysis.
- Cost-aware victim selection.
- Historical tracking of deadlock events.
- Better understanding of recovery operations.

## Conclusion

The recovery mechanism helps DeadLockLens analyze and manage deadlock situations while maintaining historical records for further evaluation.
