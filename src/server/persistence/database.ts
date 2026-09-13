import { Pool, type PoolClient, type QueryResultRow } from "pg";

export interface Sql {
  query<T extends QueryResultRow = QueryResultRow>(
    text: string,
    values?: unknown[],
  ): Promise<{ rows: T[] }>;
}
export interface Database extends Sql {
  transaction<T>(work: (connection: Sql) => Promise<T>): Promise<T>;
}
let database: Database | undefined;
export function getDatabase(): Database {
  if (database) return database;
  if (!process.env.DATABASE_URL) throw new Error("DATABASE_NOT_CONFIGURED");
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 5,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 10000,
    statement_timeout: 10000,
  });
  database = {
    query: (text, values) => pool.query(text, values),
    async transaction(work) {
      const client: PoolClient = await pool.connect();
      try {
        await client.query("BEGIN");
        const result = await work(client);
        await client.query("COMMIT");
        return result;
      } catch (error) {
        await client.query("ROLLBACK");
        throw error;
      } finally {
        client.release();
      }
    },
  };
  return database;
}
