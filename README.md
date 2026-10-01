# DeadLockLens
A Deadlock Detection System Backed with database .

Schema
```sql
CREATE TABLE processes(
	id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE resources(
	id SERIAL PRIMARY KEY,
	name VARCHAR(50) NOT NULL,
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
```