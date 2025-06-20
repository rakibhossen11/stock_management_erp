import { Pool } from 'pg';

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: Number(process.env.POSTGRES_PORT),
});

// For development, you might want to check if we're not in production
if (process.env.NODE_ENV !== 'production') {
  // Attach an error handler to the pool for debugging
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle PostgreSQL client', err);
  });
}

export const query = (text, params) => pool.query(text, params);

export default pool;