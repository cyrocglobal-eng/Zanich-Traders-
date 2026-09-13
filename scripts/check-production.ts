import { loadEnvConfig } from "@next/env";
import { serverConfig } from "../src/server/config";
loadEnvConfig(process.cwd());
const missing: string[] = [];
for (const key of [
  "DATABASE_URL",
  "RESEND_API_KEY",
  "EMAIL_FROM",
  "OPENAI_API_KEY",
  "OPENAI_MODEL",
  "GOOGLE_SITE_VERIFICATION",
  "NEXT_PUBLIC_GTM_ID",
  "TRUSTED_IP_HEADER",
]) {
  if (!process.env[key]) missing.push(key);
}
for (const key of ["OUTBOX_SECRET", "RATE_LIMIT_SALT"])
  if ((process.env[key]?.length ?? 0) < 32)
    missing.push(`${key} (minimum 32 characters)`);
if (process.env.NEXT_PUBLIC_SITE_URL !== "https://zanichtraders.co.ke")
  missing.push("NEXT_PUBLIC_SITE_URL must equal https://zanichtraders.co.ke");
if (process.env.SITE_INDEXABLE !== "true")
  missing.push("SITE_INDEXABLE=true on production only");
if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "true")
  missing.push("NEXT_PUBLIC_ANALYTICS_ENABLED=true on production only");
if (process.env.BRANDS_SERVED_CONFIRMED !== "true")
  missing.push("BRANDS_SERVED_CONFIRMED (existing 50+ claim)");
if (
  process.env.NEXT_PUBLIC_GTM_ID &&
  !/^GTM-[A-Z0-9]+$/.test(process.env.NEXT_PUBLIC_GTM_ID)
)
  missing.push("NEXT_PUBLIC_GTM_ID format");
try {
  serverConfig();
} catch {
  missing.push("Invalid server configuration; review .env.example");
}
if (missing.length) {
  console.error(
    "Production activation still needs:\n" +
      missing.map((key) => `- ${key}`).join("\n"),
  );
  process.exitCode = 1;
} else
  console.log(
    "Configuration checks passed. Complete live delivery, domain and analytics verification in docs/PRODUCTION.md.",
  );
