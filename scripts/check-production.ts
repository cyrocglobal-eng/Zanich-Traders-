import { loadEnvConfig } from "@next/env";
import { serverConfig } from "../src/server/config";
import { validateDeployment } from "./deployment-config";

loadEnvConfig(process.cwd());
const result = validateDeployment(process.env);
try {
  serverConfig();
} catch {
  result.errors.push("Invalid server configuration; review .env.example");
}
for (const warning of result.warnings) console.log(`Deferred: ${warning}`);
if (result.errors.length) {
  console.error("Deployment configuration needs attention:\n" + result.errors.map((error) => `- ${error}`).join("\n"));
  process.exitCode = 1;
} else {
  console.log(`${result.stage} configuration passed. Live delivery, HTTPS and database checks remain separate release gates.`);
}
