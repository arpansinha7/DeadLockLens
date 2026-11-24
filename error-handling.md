# DeadLockLens – Error Handling

## Introduction

Error handling is important for maintaining application reliability and providing meaningful feedback when unexpected situations occur.

DeadLockLens uses Node.js, Express.js, and PostgreSQL as its backend technologies.

## Common Error Categories

### 1. Validation Errors

These errors occur when user inputs are missing, invalid, or do not satisfy expected requirements.

### 2. Database Errors

These errors may occur during database connections, queries, or constraint validation.

### 3. Resource Errors

These errors may occur when a requested process or resource cannot be found.

### 4. Server Errors

These errors represent unexpected failures during backend request processing.

## HTTP Status Codes

| Status Code | Description |
|---|---|
| 200 | Request successful |
| 201 | Resource created |
| 400 | Bad request |
| 404 | Resource not found |
| 500 | Internal server error |

## Error Handling Guidelines

- Validate incoming request data.
- Handle database query failures.
- Return meaningful error messages.
- Use appropriate HTTP status codes.
- Avoid exposing sensitive server information.
- Maintain consistent API responses.

## Conclusion

Proper error handling helps improve application reliability, debugging, and user experience.
