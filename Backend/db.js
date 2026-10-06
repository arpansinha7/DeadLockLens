import pg from 'pg';
import 'dotenv/config';

const { Pool, Client } = pg;

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
});

export function createProcessClient(processName)
{
    return new Client({
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT,
        application_name: `DeadlockLens-${processName}`        
    });
}

export async function createProcessSession(processName)
{
    const client = createProcessClient(processName);

    client.on('error', (error) => {
        console.error(`Process session ${processName} ended: `, error.code);
    });
    await client.connect();

    return client;
}
export default pool;