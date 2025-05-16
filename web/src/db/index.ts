import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js'
// import postgres from 'postgres'
import * as schema from './schemas'  // Import all schemas

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
}

// const client = postgres(process.env.DATABASE_URL)
// export const db = drizzle(client, { schema });  // Provide schema to drizzle

// export default db;


export const db = drizzle(process.env.DATABASE_URL!, { schema });