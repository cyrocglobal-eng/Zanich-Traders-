import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { PGlite } from "@electric-sql/pglite";
import { saveInquiry, IdempotencyConflict } from "../src/server/quotes/intake";
import { drainOutbox } from "../src/server/notifications/outbox";
import { quoteSchema, type QuoteInput } from "../src/contracts/quote";
import type { Database } from "../src/server/persistence/database";
import { enforceRateLimit } from "../src/server/security/requests";

const quote: QuoteInput = {
  name: "Test Client",
  company: "",
  email: "client@example.test",
  phone: "",
  service: "digital-printing",
  quantity: "100",
  deadline: "",
  artwork: "unsure",
  details: "Please quote for 100 business cards.",
  specifications: {},
  consent: true,
  website: "",
};
async function fixture() {
  const pg = new PGlite();
  await pg.exec(
    await readFile(
      new URL("../migrations/001_intake.sql", import.meta.url),
      "utf8",
    ),
  );
  return { pg, db: pg as unknown as Database };
}

test("quote requires contact, consent and a real service; accepts an unknown specification", () => {
  assert.equal(quoteSchema.safeParse(quote).success, true);
  assert.equal(quoteSchema.safeParse({ ...quote, email: "" }).success, false);
  assert.equal(
    quoteSchema.safeParse({ ...quote, consent: false }).success,
    false,
  );
  assert.equal(
    quoteSchema.safeParse({ ...quote, service: "invented" }).success,
    false,
  );
  assert.equal(
    quoteSchema.safeParse({ ...quote, website: "spam.example" }).success,
    false,
  );
});
test("a retried request saves exactly one inquiry and one notification; changed payload is rejected", async () => {
  const { db, pg } = await fixture();
  try {
    const key = randomUUID();
    const first = await saveInquiry(db, "quote", quote, key);
    const retry = await saveInquiry(db, "quote", quote, key);
    assert.equal(first.reference, retry.reference);
    assert.equal(retry.duplicate, true);
    await assert.rejects(
      saveInquiry(db, "quote", { ...quote, quantity: "200" }, key),
      IdempotencyConflict,
    );
    assert.equal((await db.query("SELECT * FROM inquiries")).rows.length, 1);
    assert.equal(
      (await db.query("SELECT * FROM notification_outbox")).rows.length,
      1,
    );
  } finally {
    await pg.close();
  }
});
test("an outbox insertion failure rolls the inquiry back", async () => {
  const { db, pg } = await fixture();
  try {
    await db.query("DROP TABLE notification_outbox");
    await assert.rejects(saveInquiry(db, "quote", quote, randomUUID()));
    assert.equal((await db.query("SELECT * FROM inquiries")).rows.length, 0);
  } finally {
    await pg.close();
  }
});
test("email failures retain the job for retry; successful retries preserve the provider key", async () => {
  const { db, pg } = await fixture();
  try {
    await saveInquiry(db, "quote", quote, randomUUID());
    let firstKey = "";
    const failed = await drainOutbox(db, async (mail) => {
      firstKey = mail.idempotencyKey;
      throw new Error("Simulated outage");
    });
    assert.equal(failed.retried, 1);
    assert.equal(
      (await db.query("SELECT status FROM notification_outbox")).rows[0].status,
      "pending",
    );
    await db.query(
      "UPDATE notification_outbox SET next_attempt_at=now()-interval '1 second'",
    );
    const retried = await drainOutbox(db, async (mail) => {
      assert.equal(mail.idempotencyKey, firstKey);
      assert.equal(mail.to, "zanichgeneraltraders@gmail.com");
      assert.ok(mail.text.includes("100 business cards"));
      return "provider-test-id";
    });
    assert.equal(retried.sent, 1);
    assert.equal(
      (await db.query("SELECT status FROM notification_outbox")).rows[0].status,
      "sent",
    );
    assert.equal(
      (
        await drainOutbox(db, async () => {
          throw new Error("Must not resend");
        })
      ).sent,
      0,
    );
  } finally {
    await pg.close();
  }
});
test("rate limits count across clients and reset after expiry", async () => {
  const { db, pg } = await fixture();
  try {
    await enforceRateLimit(db, "test", 2);
    await enforceRateLimit(db, "test", 2);
    await assert.rejects(enforceRateLimit(db, "test", 2), /Too many/);
    await db.query(
      "UPDATE rate_limits SET expires_at=now()-interval '1 second'",
    );
    await enforceRateLimit(db, "test", 2);
  } finally {
    await pg.close();
  }
});
