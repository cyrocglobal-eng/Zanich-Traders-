import { loadEnvConfig } from "@next/env";
import { getDatabase } from "../src/server/persistence/database";
import { drainOutbox } from "../src/server/notifications/outbox";
loadEnvConfig(process.cwd());
async function main() {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM)
    throw new Error("Email configuration required");
  const result = await drainOutbox(getDatabase());
  console.log(result);
  if (result.failed) process.exitCode = 1;
}
main().catch(() => {
  console.error(
    "Notification worker unavailable; check private configuration.",
  );
  process.exitCode = 1;
});
