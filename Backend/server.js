import express from 'express';
import 'dotenv/config';
import pool, { createProcessSession } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;
const processSessions = new Map();

app.use(express.static("public"));
app.use(express.json());


pool.query('SELECT NOW()', (err, res) => {

    if(err)
    {
        console.error('Database connection failed: ', err);
    }
    else
    {
        console.log('Database connected: ', res.rows[0]);
    }
});

app.post('/processes', async (req, res) => {

    try
    {
        const { name, progress, rollback_cost, retry_count } = req.body;

        const result = await pool.query(
            'INSERT INTO processes (name, progress, rollback_cost, retry_count ) VALUES ($1, $2, $3, $4) RETURNING *', 
            [name, progress || 0, rollback_cost || 0, retry_count || 0]
        );

        res.json(
            result.rows[0]
        );

    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({
            error: 'Failed to create process'
        });
    }
});

app.post('/resources', async (req, res) => {

    try
    {
        const { name, instances } = req.body;

        const result = await pool.query(
            'INSERT INTO resources (name, instances) VALUES ($1,$2) RETURNING *',
            [name, instances]
        );

        res.json(result.rows[0]);
    }
    catch(error)
    {
        console.log(error);

        res.status(500).json({
            error: 'Failed to create resource'
        });
    }
});

app.post('/allocations', async (req, res) => {

    try
    {
        const { process_id, resource_id } = req.body;

        const result = await pool.query(
            'INSERT INTO allocations (process_id, resource_id) VALUES ($1, $2) RETURNING *',
            [process_id, resource_id]
        );

        res.json(result.rows[0]);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({
            error: 'Failed to allocate resource'
        });
    }
});

app.post('/requests', async (req, res) => {

    try
    {
        const { process_id, resource_id } = req.body;

        const result = await pool.query(
            'INSERT INTO requests (process_id, resource_id) VALUES ($1, $2) RETURNING *',
            [process_id, resource_id]
        );

        res.json(result.rows[0]);
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({
            error: 'Failed to create resource request'
        });
    }
});

function hasCycle(edges)
{
    const graph = {};

    for(const edge of edges)
    {
        if(!graph[edge.from])
        {
            graph[edge.from] = [];
        }

        graph[edge.from].push(edge.to);
    }

    const visited = new Set();
    const path = new Set();
    const currentPath = [];

    function dfs(node)
    {
        if(path.has(node))
        {
            const cycleStart = currentPath.indexOf(node);
            const cycle = currentPath.slice(cycleStart);

            console.log('Cycle detected: ', cycle);

            return cycle;
        }
        
        if(visited.has(node))
        {
            return false;
        }

        visited.add(node);
        path.add(node);
        currentPath.push(node);

        for(const neighbour of graph[node] || [])
        {
            const cycle = dfs(neighbour);

            if(cycle)
            {
                return cycle;
            }
        }

        path.delete(node);
        currentPath.pop();
        return false;
    }

    for(const node in graph)
    {
        const cycle = dfs(node);

        if(cycle)
        {
            return cycle;
        }
    }
    return false;
}

function calculateProtectionScore(process)
{
    const progress = process.progress / 100;
    const rollbackCost = process.rollback_cost / 100;
    const retryCount = Math.min(process.retry_count/3, 1);

    const score = 0.4 * progress + 0.4 * rollbackCost + 0.2 * retryCount;

    return score;
}

function canProcessFinish(processId, requestMatrix, available)
{
    const requests = requestMatrix[processId] || {};

    for(const resourceId in requests)
    {
        if(requests[resourceId] > (available[resourceId]|| 0))
        {
            return false;
        }
    }
    return true;

}
async function recoverProcess(client, processId)
{
    await client.query(`DELETE FROM requests WHERE process_id = $1`, [processId]);

    await client.query(`DELETE FROM allocations WHERE process_id = $1`, [processId]);

    await client.query(`UPDATE processes SET retry_count = retry_count + 1 WHERE id = $1`, [processId]);

}


app.get('/graph', async (req, res) => {

    try
    {
        const allocations = await pool.query('SELECT * FROM allocations');
        const requests = await pool.query('SELECT * FROM requests');
        const resources = await pool.query('SELECT * FROM resources');

        const available = {};
        for(const resource of resources.rows)
        {
            const allocatedCount = allocations.rows.filter(
                allocation => allocation.resource_id === resource.id
            ).length;

            available[resource.id] = resource.instances - allocatedCount;
        }

        console.log('Available resources: ', available);

        const allocationMatrix = {};

        for(const allocation of allocations.rows)
        {
            if(!allocationMatrix[allocation.process_id])
            {
                allocationMatrix[allocation.process_id] = {};
            }

            if(!allocationMatrix[allocation.process_id][allocation.resource_id])
            {
                allocationMatrix[allocation.process_id][allocation.resource_id] = 0;
            }

            allocationMatrix[allocation.process_id][allocation.resource_id]++;

        }
        
        console.log('Allocation Matrix: ', allocationMatrix);

        const requestMatrix = {};

        for(const request of requests.rows)
        {
            if(!requestMatrix[request.process_id])
            {
                requestMatrix[request.process_id] = {};
            }

            if(!requestMatrix[request.process_id][request.resource_id])
            {
                requestMatrix[request.process_id][request.resource_id] = 0;
            }

            requestMatrix[request.process_id][request.resource_id]++;
        }

        console.log('Request Matrix: ', requestMatrix);

        const processResult = await pool.query('SELECT * FROM processes');
        const processIds = processResult.rows.map(process => process.id);

        const work = {...available};
        const finish = {};

        for(const processId of processIds)
        {
            finish[processId] = false;
        }

        let changed = true;

        while(changed)
        {
            changed = false;

            for(const processId of processIds)
            {
                if(finish[processId])
                {
                    continue;
                }

                if(canProcessFinish(processId, requestMatrix, work))
                {
                    finish[processId] = true;

                    for(const resourceId in allocationMatrix[processId] || {})
                    {
                        work[resourceId] += allocationMatrix[processId][resourceId];
                    }
                    changed = true;
                }
            }
        }

        console.log('Work after detection: ', work);
        console.log('Finish status: ', finish);

        const deadlockedProcesses = processIds.filter(processId => !finish[processId]).map(processId => `P${processId}`);

        const deadlock = deadlockedProcesses.length > 0;

        const nodes = [];
        const edges = [];

        for(const allocation of allocations.rows)
        {
            nodes.push({
                id: `P${allocation.process_id}`,
                type: 'process'
            });

            nodes.push({
                id: `R${allocation.resource_id}`,
                type: 'resource'
            });

            edges.push({
                from: `R${allocation.resource_id}`,
                to: `P${allocation.process_id}`,
                type: 'allocation'
            });
        }

        for(const request of requests.rows)
        {
            nodes.push({
                id: `P${request.process_id}`,
                type: 'process'
            });

            nodes.push({
                id: `R${request.resource_id}`,
                type: 'resource'
            });

            edges.push({
                from: `P${request.process_id}`,
                to: `R${request.resource_id}`,
                type: 'request'
            });
        }

            const uniqueNodes = Array.from(
                new Map(nodes.map(node => [node.id, node])).values()
            );

            const cycle = hasCycle(edges);

            const deadlockedProcessIds = processIds.filter(processId => !finish[processId]);

            const deadlockedProcessData = processResult.rows.filter(process => deadlockedProcessIds.includes(process.id));

            const scoredProcesses = deadlockedProcessData.map(process => ({
                ...process,
                protection_score: calculateProtectionScore(process)
            }));

            console.log('Scored processes: ', scoredProcesses);

            const victim = scoredProcesses.length > 0 ? 
            
            scoredProcesses.reduce((lowest, process) => {

                return process.protection_score < lowest.protection_score ? process : lowest;
            }) : null;

            if(victim)
            {
                const client = await pool.connect();

                try
                {
                    await client.query('BEGIN');

                    await recoverProcess(client, victim.id);

                    await client.query('COMMIT');

                    console.log(`Recovery completed for process: P${victim.id}`);
                }
                catch(error)
                {
                    await client.query('ROLLBACK');
                    console.log(`Recovery failed. Transaction rolled back`);

                    throw error;
                }
                finally
                {
                    client.release();
                }
            }

            console.log('Selected victim: ', victim);

            console.log('Deadlocked process data: ', deadlockedProcessData);


            res.json({
                nodes: uniqueNodes,
                edges,
                deadlock,
                cycle,
                deadlockedProcesses
            });
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({
            error: 'Failed to build resource allocation graph'
        });
    }
});

function buildWaitForGraph(waits)
{
    const edges = [];

    for(const wait of waits)
    {
        edges.push({
            from: wait.blocked_pid,
            to: wait.blocking_pid
        });
    }

    return edges;
}
async function getDeadlockedProcesses(db, pid)
{
    const result = await db.query(
        `
        SELECT
            activity.pid,
            activity.application_name,
            p.id AS process_id,
            p.name AS process_name,
            p.progress,
            p.rollback_cost,
            p.retry_count
        FROM pg_stat_activity AS activity
        JOIN processes p    
            ON activity.application_name = 'DeadlockLens-' || p.name
        WHERE activity.pid = $1
        `,
        [pid]
    );

    return result.rows[0];
}
app.get('/db/waits', async (req, res) => {

    try
    {
        const result = await pool.query(`
            SELECT
                blocked.pid AS blocked_pid,
                blocking.pid AS blocking_pid,
                blocked.state AS blocked_state,
                blocking.state AS blocking_state,
                blocked.query AS blocked_query,
                blocking.query AS blocking_query
            FROM pg_stat_activity blocked
            JOIN pg_stat_activity blocking
                ON blocking.pid = ANY(pg_blocking_pids(blocked.pid))
            WHERE blocked.datname = current_database();
            `);

        const edges = buildWaitForGraph(result.rows);
        const cycle = hasCycle(edges);
        const deadlock = cycle !== false;
        const deadlockedProcesses = [];

        if(cycle)
        {
            for(const pid of cycle)
            {
                const process = await getDeadlockedProcesses(pool, pid);

                if(process)
                {
                    process.protection_score = calculateProtectionScore(process);
                    deadlockedProcesses.push(process);
                }
            }
        }

        let victim = null;

        if(deadlockedProcesses.length > 0)
        {
            victim = deadlockedProcesses.reduce((lowest, process) => {
                return process.protection_score < lowest.protection_score ? process : lowest
            });
        }

        res.json({
            waits: result.rows,
            edges,
            deadlock,
            cycle,
            deadlockedProcesses,
            victim
        });
    }
    catch(error)
    {
        console.error(error);
        res.status(500).json({
            error: 'Failed to fetch database waits'
        });
    }
});

app.post('/db/process-session', async (req, res) => {

    try
    {
        const { processName } = req.body;

        const client = await createProcessSession(processName);

        processSessions.set(processName, client);

        res.json({
            message: 'Process session created',
            processName
        });
    }
    catch(error)
    {
        console.log(error);

        res.status(500).json({
            error: 'Failed to create process session'
        });
    }
});

app.post('/db/process-query', async (req, res) => {

    try
    {
        const { processName, query } = req.body;

        const client = processSessions.get(processName);

        if(!client)
        {
            return res.status(404).json({
                error: 'Process session not found'
            });
        }

        const result = await client.query(query);

        res.json({
            processName,
            command: result.command,
            rows: result.rows
        });
    }
    catch(error)
    {
        console.log(error);
        res.status(500).json({
            error: 'failed to execute process query',
            message: error.message,
            code: error.code
        });
    }
});
app.post('/db/recover', async (req, res) => {

    try
    {
        const { pid } = req.body;

        if(!pid)
        {
            return res.status(400).json({
                error: 'PID is required'
            });
        }

        const process = await getDeadlockedProcesses(pool, pid);

        if(!process)
        {
            return res.status(404).json({
                error: 'Deadlocked process not found'
            });
        }

        process.protection_score = calculateProtectionScore(process);
        const result = await pool.query(`SELECT pg_terminate_backend($1) as terminated`, [pid]);

        if(!result.rows[0].terminated)
        {
            return res.status(500).json({
                error: 'Failed to terminate process'
            });
        }

        await pool.query(
            `
            UPDATE processes
            SET retry_count = retry_count + 1
            WHERE id = $1
            `,
            [process.process_id]
        );

        await pool.query(
            `
            INSERT INTO deadlock_events
            (victim_process_id, victim_pid, protection_score, recovery_action, recovered_at)
            VALUES($1, $2, $3, $4, CURRENT_TIMESTAMP)
            `,
            [process.process_id, pid, process.protection_score, 'terminate_backend']
        );

        res.json({
            pid,
            processName: process.process_name,
            terminated: true,
            protectionScore: process.protection_score,
            recoveryAction: 'terminate_backend'
        });
    }
    catch(error)
    {
        console.error(error);

        res.status(500).json({
            error: 'Failed to recover transaction'
        });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});