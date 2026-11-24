# DeadLockLens – Protection Score Algorithm

## Introduction

DeadLockLens uses a protection score algorithm to select a suitable victim process during deadlock recovery.

The objective is to minimize the impact of recovery by considering process progress, rollback cost, and retry count.

## Protection Score Formula

The system uses the following weighted formula:

S = 0.4P + 0.4R + 0.2T

Where:

- S = Protection Score
- P = Normalized Process Progress
- R = Normalized Rollback Cost
- T = Normalized Retry Count

## Weight Distribution

| Parameter | Weight |
|---|---:|
| Process Progress (P) | 40% |
| Rollback Cost (R) | 40% |
| Retry Count (T) | 20% |

## Victim Selection

The system calculates a protection score for each process involved in a deadlock.

The process with the lowest protection score is selected as the victim.

## Algorithm Workflow

1. Identify processes involved in the deadlock.
2. Retrieve process progress, rollback cost, and retry count.
3. Normalize the parameter values.
4. Calculate the protection score.
5. Compare the scores of all candidate processes.
6. Select the process with the lowest score as the victim.

## Benefits

- Considers the amount of completed process work.
- Takes rollback cost into account.
- Considers previous retry attempts.
- Provides a structured approach to victim selection.
- Helps minimize recovery impact.

## Conclusion

The protection score algorithm provides a cost-aware approach to deadlock victim selection by considering multiple process-related parameters.
