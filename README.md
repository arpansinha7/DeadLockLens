# DeadLockLens
A Deadlock Detection System Backed with database .

Schema
```sql
CREATE TABLE processes(
	id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL UNIQUE,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	progress INT NOT NULL DEFAULT 0,
	rollback_cost INT NOT NULL DEFAULT 0,
	retry_count INT NOT NULL DEFAULT 0
);

CREATE TABLE resources(
	id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL UNIQUE,
	instances INTEGER NOT NULL DEFAULT 1
);

CREATE TABLE allocations(
	process_id INT REFERENCES processes(id) ON DELETE CASCADE,
	resource_id INT REFERENCES resources(id) ON DELETE CASCADE,
	PRIMARY KEY(process_id, resource_id)
);

CREATE TABLE requests(
	process_id INT REFERENCES processes(id) ON DELETE CASCADE,
	resource_id INT REFERENCES resources(id) ON DELETE CASCADE,
	PRIMARY KEY(process_id, resource_id)
);

CREATE TABLE deadlock_events (
    id SERIAL PRIMARY KEY,
    detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    victim_process_id INT REFERENCES processes(id),
    victim_pid INT,
    protection_score DECIMAL,
    recovery_action VARCHAR(50),
    recovered_at TIMESTAMP
);
```## Documentation

Detailed project documentation is available in the
[Docs](./Docs/) directory.

### Documentation Topics

- [Project Overview](./Docs/project-overview.md)
- [Database Schema](./Docs/database-schema.md)
- [System Architecture](./Docs/system-architecture.md)
- [Deadlock Detection](./Docs/deadlock-detection.md)
- [Protection Score Algorithm](./Docs/protection-score.md)
- [Recovery Mechanism](./Docs/recovery-mechanism.md)
- [API Documentation](./Docs/api-documentation.md)
- [Testing and Validation](./Docs/testing-and-validation.md)
- [System Workflow](./Docs/system-workflow.md)
- [Future Enhancements](./Docs/future-enhancements.md)
- [Contributor Guide](./Docs/contributor-guide.md)
- [Database Relationships](./Docs/database-relationships.md)
