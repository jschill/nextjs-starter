import 'dotenv/config';
import { drizzle } from 'drizzle-orm/postgres-js'
import { authUsers } from 'drizzle-orm/supabase'
import * as schema from './schemas'  // Import all schemas

declare global {
  // eslint-disable-next-line no-var
  var _db: ReturnType<typeof drizzle<typeof schema>> | undefined;
}

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set');
}

const createDb = (() => {
  return () => {
      if (!global._db) {
          console.log('Creating new db')
          // const client = postgres(String(process.env.NEXT_DB_URL), { prepare: false });
          global._db = drizzle(process.env.DATABASE_URL!, { schema });
      }
      return global._db;
  };
})();

export const db = createDb();

export { authUsers }