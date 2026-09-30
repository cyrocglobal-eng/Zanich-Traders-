// Run as root on the app host. Receive resolved credentials through SSH stdin,
// never command arguments. Only fixed status messages and error codes are logged.
import { readFile, writeFile, rename, chown, stat } from "node:fs/promises";
import { randomBytes, randomUUID } from "node:crypto";
import pg from "pg";

const { Client } = pg;
let owner;
let app;
try {
  let input = "";
  for await (const chunk of process.stdin) {
    input += chunk;
    if (input.length > 16384) throw new Error("Input too large");
  }
  const config = JSON.parse(input);
  input = "";
  if (!/^[a-zA-Z0-9.-]+\.rds\.amazonaws\.com$/.test(config.host)) throw new Error("Invalid database host");
  if (config.owner.username !== "zanich_owner" || config.app.username !== "zanich_app") throw new Error("Unexpected database users");
  if (typeof config.owner.password !== "string" || typeof config.app.password !== "string" || config.app.password.length < 32) throw new Error("Invalid credentials");
  const shared = {
    host: config.host,
    port: 5432,
    database: "zanich",
    ssl: { ca: await readFile("/etc/zanich/rds-ca.pem", "utf8"), rejectUnauthorized: true },
    connectionTimeoutMillis: 15000,
    statement_timeout: 15000,
  };
  owner = new Client({ ...shared, user: config.owner.username, password: config.owner.password });
  await owner.connect();
  await owner.query("BEGIN");
  await owner.query("SELECT pg_advisory_xact_lock(731921)");
  const existing = await owner.query("SELECT 1 FROM pg_roles WHERE rolname = $1", [config.app.username]);
  if (!existing.rowCount) {
    const statement = await owner.query("SELECT format('CREATE ROLE %I LOGIN PASSWORD %L NOSUPERUSER NOCREATEDB NOCREATEROLE NOREPLICATION', $1::text, $2::text) AS sql", [config.app.username, config.app.password]);
    await owner.query(statement.rows[0].sql);
  }
  await owner.query(await readFile("/srv/zanich/current/migrations/001_intake.sql", "utf8"));
  await owner.query("REVOKE CREATE ON SCHEMA public FROM PUBLIC");
  await owner.query("REVOKE ALL ON DATABASE zanich FROM PUBLIC");
  await owner.query("GRANT CONNECT ON DATABASE zanich TO zanich_app");
  await owner.query("GRANT USAGE ON SCHEMA public TO zanich_app");
  await owner.query("GRANT SELECT, INSERT, UPDATE, DELETE ON inquiries, notification_outbox, rate_limits TO zanich_app");
  await owner.query("COMMIT");
  await owner.end();
  owner = undefined;

  app = new Client({ ...shared, user: config.app.username, password: config.app.password });
  await app.connect();
  const tls = await app.query("SELECT ssl FROM pg_stat_ssl WHERE pid = pg_backend_pid()");
  if (tls.rows[0]?.ssl !== true) throw new Error("TLS verification failed");
  const privileges = await app.query("SELECT rolcreatedb, rolcreaterole, rolsuper FROM pg_roles WHERE rolname = current_user");
  if (Object.values(privileges.rows[0]).some(Boolean)) throw new Error("Excess runtime privileges");
  await app.query("BEGIN");
  const id = randomUUID();
  await app.query("INSERT INTO inquiries(id,idempotency_key,payload_hash,reference,kind,payload) VALUES($1,$2,'deployment-test',$3,'quote','{}')", [id, randomUUID(), `DEPLOY-${id}`]);
  await app.query("INSERT INTO notification_outbox(id,inquiry_id) VALUES($1,$2)", [randomUUID(), id]);
  await app.query("INSERT INTO rate_limits(bucket,hits,expires_at) VALUES($1,1,now())", [`deployment-${id}`]);
  await app.query("ROLLBACK");
  await app.end();
  app = undefined;

  const url = new URL(`postgresql://${config.host}:5432/zanich`);
  url.username = config.app.username;
  url.password = config.app.password;
  url.searchParams.set("sslmode", "verify-full");
  url.searchParams.set("sslrootcert", "/etc/zanich/rds-ca.pem");
  const destination = "/etc/zanich/database.env";
  let oldEnvironment = "";
  try { oldEnvironment = await readFile(destination, "utf8"); } catch (error) { if (error.code !== "ENOENT") throw error; }
  const oldValue = (key) => oldEnvironment.split("\n").find((line) => line.startsWith(`${key}=`))?.slice(key.length + 1);
  const salt = oldValue("RATE_LIMIT_SALT") || randomBytes(32).toString("hex");
  const outbox = oldValue("OUTBOX_SECRET") || randomBytes(32).toString("hex");
  const temporary = `${destination}.${randomUUID()}.tmp`;
  // Single quotes work in both systemd EnvironmentFile and shell sourcing;
  // otherwise the URL's ampersand would background a shell assignment.
  const quotedUrl = `'${url.href.replaceAll("'", "%27")}'`;
  await writeFile(temporary, `DATABASE_URL=${quotedUrl}\nRATE_LIMIT_SALT=${salt}\nOUTBOX_SECRET=${outbox}\n`, { mode: 0o640, flag: "wx" });
  await chown(temporary, 0, (await stat("/etc/zanich/app.env")).gid);
  await rename(temporary, destination);
  console.log("RDS setup passed: TLS verified, three tables migrated, runtime permissions verified, test writes rolled back, protected environment installed.");
} catch (error) {
  if (owner) { try { await owner.query("ROLLBACK"); } catch { /* Connection may already be closed. */ } }
  const code = typeof error?.code === "string" && /^[A-Z0-9_]+$/.test(error.code) ? error.code : "SETUP_FAILED";
  console.error(`RDS setup failed (${code}); no credential values were logged.`);
  process.exitCode = 1;
} finally {
  if (owner) { try { await owner.end(); } catch { /* Best-effort cleanup. */ } }
  if (app) { try { await app.end(); } catch { /* Best-effort cleanup. */ } }
}
