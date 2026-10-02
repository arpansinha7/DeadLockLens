import express from 'express';
import 'dotenv/config';
import pool from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

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
        const { name } = req.body;

        const result = await pool.query('INSERT INTO processes (name) VALUES ($1) RETURNING *', [name]);

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

app.get('/graph', async (req, res) => {

    try
    {
        const allocations = await pool.query('SELECT * FROM allocations');
        const requests = await pool.query('SELECT * FROM requests');

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

            res.json({
                nodes: uniqueNodes,
                edges
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

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});