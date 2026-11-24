# DeadLockLens
A database-backed deadlock detection, analysis and recovery system.

## Project Overview
DeadLockLens is designed to detect and visualize deadlocks between processes and resources. It provides a monitoring interface, deadlock simulation, victim selection and recovery analysis.
## Project Objectives

- Detect deadlocks between processes and resources.
- Visualize resource allocation and waiting relationships.
- Select a suitable victim using a protection score.
- Support deadlock recovery.
- Maintain deadlock history for further analysis.

  ## Technology Stack

- Frontend: HTML, CSS and JavaScript
- Backend: Node.js and Express.js
- Database: PostgreSQL
- Database Connectivity: node-postgres (pg)
- Graph Visualization: Cytoscape.js
- Version Control: Git and GitHub
- ## System Architecture

The system follows a three-layer architecture:

- Presentation Layer: Handles user interaction and graph visualization.
- Application Layer: Handles API requests, deadlock detection and victim selection.
- Database Layer: Stores processes, resources, allocations, requests and deadlock events.

## System Workflow

1. Create processes and resources.
2. Allocate resources and generate requests.
3. Analyze resource dependencies.
4. Detect deadlocks and visualize the graph.
5. Select a victim using the protection score.
6. Support recovery and maintain deadlock history.
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
