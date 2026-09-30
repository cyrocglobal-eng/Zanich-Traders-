import test from "node:test";
import assert from "node:assert/strict";
import { validateDeployment } from "../scripts/deployment-config";

const preview = { DEPLOYMENT_STAGE: "preview", NEXT_PUBLIC_SITE_URL: "http://ec2.example.com", SITE_INDEXABLE: "false" };
test("HTTP preview works with deferred integrations but cannot collect website inquiries", () => {
  assert.deepEqual(validateDeployment(preview).errors, []);
  assert.ok(validateDeployment({ ...preview, RESEND_API_KEY: "test-placeholder" }).errors.length > 0);
  assert.ok(validateDeployment({ ...preview, SITE_INDEXABLE: "true" }).errors.length > 0);
});
test("production WhatsApp launch does not require AI or analytics", () => {
  assert.deepEqual(validateDeployment({ NEXT_PUBLIC_SITE_URL: "https://zanichtraders.co.ke", SITE_INDEXABLE: "true" }).errors, []);
  assert.ok(validateDeployment({ ...preview, DEPLOYMENT_STAGE: "production" }).errors.length > 0);
});
test("deployment rejects origins containing paths or credentials", () => {
  for (const url of ["https://example.com/contact", "https://user:password@example.com", "file:///etc/passwd"])
    assert.ok(validateDeployment({ ...preview, NEXT_PUBLIC_SITE_URL: url }).errors.length > 0);
});
test("HTTPS intake requires complete delivery and distinct rate-limit configuration", () => {
  const enabled = { ...preview, NEXT_PUBLIC_SITE_URL: "https://preview.example.com", DATABASE_URL: "postgresql://example.test/zanich", RESEND_API_KEY: "test-placeholder", EMAIL_FROM: "hello@example.test", OUTBOX_SECRET: "o".repeat(32), RATE_LIMIT_SALT: "r".repeat(32), TRUSTED_IP_HEADER: "x-real-ip" };
  assert.deepEqual(validateDeployment(enabled).errors, []);
  assert.ok(validateDeployment({ ...enabled, OUTBOX_SECRET: enabled.RATE_LIMIT_SALT }).errors.length > 0);
  assert.ok(validateDeployment({ ...enabled, DATABASE_URL: "" }).errors.length > 0);
});
