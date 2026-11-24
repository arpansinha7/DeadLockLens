# DeadLockLens – API Documentation

## Introduction

DeadLockLens uses Node.js and Express.js to handle communication between the frontend and backend.

The backend exposes APIs to manage process and resource information and support deadlock analysis.

## API Architecture

The API layer acts as an interface between the frontend and the application logic.

### Main API Responsibilities

- Process management
- Resource management
- Resource allocation
- Resource request handling
- Deadlock analysis
- Victim selection
- Recovery history management

## HTTP Methods

| Method | Purpose |
|---|---|
| GET | Retrieve existing information |
| POST | Create or submit information |
| PUT | Update existing information |
| DELETE | Remove information |

## Request and Response

API requests are sent from the frontend to the Express.js backend.

The backend processes requests, interacts with PostgreSQL when required, and returns responses to the frontend.

## Error Handling

API errors should be communicated through appropriate HTTP status codes and descriptive response messages.

Common HTTP status codes:

- 200 – Successful request
- 201 – Resource created
- 400 – Invalid request
- 404 – Resource not found
- 500 – Internal server error

## Database Connectivity

The backend uses node-postgres (pg) to communicate with PostgreSQL.

## Conclusion

The API layer provides communication between the frontend, application logic, and database, supporting the different operations of DeadLockLens.
