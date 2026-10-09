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
```