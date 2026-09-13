import { loadEnvConfig } from "@next/env";
import { readFile } from "node:fs/promises";
import { getDatabase } from "../src/server/persistence/database";

loadEnvConfig(process.cwd());
async function main() {
  const sql = await readFile(
    new URL("../migrations/001_intake.sql", import.meta.url),
    "utf8",
  );
  await getDatabase().transaction(async (tx) => {
    await tx.query("SELECT pg_advisory_xact_lock(731921)");
    await tx.query(sql);
  });
  console.log("Intake schema is ready.");
}
main().catch(() => {
  console.error(
    "Migration failed. Check database connectivity and permissions.",
  );
  process.exitCode = 1;
});
