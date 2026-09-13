import { createHash, randomUUID } from "node:crypto";
import type { QuoteInput } from "@/contracts/quote";
import type { FeedbackInput } from "@/contracts/feedback";
import type { Database } from "@/server/persistence/database";

export class IdempotencyConflict extends Error {}
export async function saveInquiry(
  db: Database,
  kind: "quote" | "feedback",
  payload: QuoteInput | FeedbackInput,
  key: string,
) {
  const hash = createHash("sha256")
    .update(JSON.stringify({ kind, payload }))
    .digest("hex");
  return db.transaction(async (tx) => {
    const id = randomUUID();
    const reference = `ZN-${id.slice(0, 8).toUpperCase()}-${id.slice(9, 13).toUpperCase()}`;
    const inserted = await tx.query<{ id: string; reference: string }>(
      "INSERT INTO inquiries (id, idempotency_key, payload_hash, reference, kind, payload) VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT (idempotency_key) DO NOTHING RETURNING id, reference",
      [id, key, hash, reference, kind, JSON.stringify(payload)],
    );
    if (!inserted.rows.length) {
      const existing = await tx.query<{
        reference: string;
        payload_hash: string;
      }>(
        "SELECT reference, payload_hash FROM inquiries WHERE idempotency_key=$1",
        [key],
      );
      if (existing.rows[0]?.payload_hash !== hash)
        throw new IdempotencyConflict();
      return { reference: existing.rows[0].reference, duplicate: true };
    }
    await tx.query(
      "INSERT INTO notification_outbox (id, inquiry_id) VALUES ($1,$2)",
      [randomUUID(), id],
    );
    return { reference, duplicate: false };
  });
}
