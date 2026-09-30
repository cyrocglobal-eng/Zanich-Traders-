import assert from "node:assert/strict";
import pg from "pg";

const client = new pg.Client({ connectionString: process.env.DATABASE_URL, connectionTimeoutMillis: 15000, statement_timeout: 10000 });
let stage = "connect";
try {
  await client.connect();
  stage = "identity-and-TLS";
  const connection = await client.query("SELECT current_user AS username, ssl FROM pg_stat_ssl WHERE pid = pg_backend_pid()");
  assert.equal(connection.rows[0]?.username, "zanich_app");
  assert.equal(connection.rows[0]?.ssl, true);
  stage = "table-permissions";
  for (const table of ["inquiries", "notification_outbox", "rate_limits"]) {
    for (const privilege of ["SELECT", "INSERT", "UPDATE", "DELETE"]) {
      const access = await client.query("SELECT has_table_privilege(current_user, $1, $2) AS allowed", [table, privilege]);
      assert.equal(access.rows[0].allowed, true);
    }
  }
  console.log("PASS actual runtime DATABASE_URL: verified TLS, zanich_app identity, and required table permissions");
} catch (error) {
  const code = typeof error?.code === "string" && /^[A-Z0-9_]+$/.test(error.code) ? error.code : "CHECK_FAILED";
  console.error(`Runtime RDS check failed at ${stage} (${code}); no connection settings were logged.`);
  process.exitCode = 1;
} finally {
  await client.end();
}
