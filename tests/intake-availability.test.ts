import test from "node:test";
import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { Pool } from "pg";
import { PGlite } from "@electric-sql/pglite";
import { POST as quotePost } from "../src/app/api/quotes/route";
import { POST as feedbackPost } from "../src/app/api/feedback/route";
import { publicSite } from "../src/lib/seo/config";

test("intake availability is enforced before persistence across both public routes", async (t) => {
  const pg = new PGlite();
  await pg.exec(await readFile(new URL("../migrations/001_intake.sql", import.meta.url), "utf8"));
  let calls = 0;
  const query = async (sql: string, values?: unknown[]) => {
    calls++;
    return pg.query(sql, values);
  };
  t.mock.method(Pool.prototype, "query", query);
  t.mock.method(Pool.prototype, "connect", async () => ({ query, release() {} }));
  const config = {
    DATABASE_URL: "postgres://test:test@127.0.0.1/test",
    RESEND_API_KEY: "test-provider-key",
    EMAIL_FROM: "test@example.test",
    OUTBOX_SECRET: "test-outbox-secret-with-at-least-32-characters",
    NEXT_PUBLIC_SITE_URL: "https://zanichtraders.co.ke",
  };
  const previous = Object.fromEntries(Object.keys(config).map(key => [key, process.env[key]]));
  Object.assign(process.env, config);
  const contact = { name: "Test Client", company: "", email: "client@example.test", phone: "", consent: true, website: "" };
  const cases = [
    { post: quotePost, body: { ...contact, service: "digital-printing", quantity: "100", deadline: "", artwork: "unsure", details: "Please quote for 100 cards.", specifications: {} } },
    { post: feedbackPost, body: { ...contact, reference: "", message: "Please call about my order.", resolution: "" } },
  ];
  const request = (body: unknown, key = randomUUID(), origin = publicSite.url) => new Request(`${publicSite.url}/api/quotes`, {
    method: "POST", headers: { origin, "content-type": "application/json", "idempotency-key": key }, body: JSON.stringify(body),
  });
  try {
    for (const { post, body } of cases) {
      for (const missing of ["DATABASE_URL", "RESEND_API_KEY", "EMAIL_FROM", "OUTBOX_SECRET"] as const) {
        delete process.env[missing];
        const before = calls;
        const response = await post(request(body));
        assert.equal(response.status, 503, `missing ${missing}`);
        assert.equal(response.headers.get("cache-control"), "no-store");
        assert.equal(calls, before, "disabled intake must not access the database");
        process.env[missing] = config[missing];
      }
      process.env.NEXT_PUBLIC_SITE_URL = "http://preview.example.test";
      const before = calls;
      assert.equal((await post(request(body))).status, 503);
      assert.equal(calls, before);
      process.env.NEXT_PUBLIC_SITE_URL = config.NEXT_PUBLIC_SITE_URL;
      assert.equal((await post(request(body, randomUUID(), "https://foreign.example"))).status, 403);
      const key = randomUUID();
      const accepted = await post(request(body, key));
      assert.equal(accepted.status, 201);
      const retry = await post(request(body, key));
      assert.equal(retry.status, 200);
      assert.deepEqual(await retry.json(), await accepted.json());
      assert.equal((await post(request({ ...body, name: "Changed Name" }, key))).status, 409);
    }
    assert.equal((await pg.query("SELECT * FROM inquiries")).rows.length, 2);
    assert.equal((await pg.query("SELECT * FROM notification_outbox")).rows.length, 2);
  } finally {
    for (const [key, value] of Object.entries(previous)) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    t.mock.restoreAll();
    await pg.close();
  }
});
