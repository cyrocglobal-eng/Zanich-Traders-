import { randomUUID } from "node:crypto";
import type { Database } from "@/server/persistence/database";
import { quoteSummary, type QuoteInput } from "@/contracts/quote";
import type { FeedbackInput } from "@/contracts/feedback";
import { site } from "@/content/site";

type Job = {
  id: string;
  inquiry_id: string;
  attempts: number;
  kind: "quote" | "feedback";
  payload: QuoteInput | FeedbackInput;
  reference: string;
};
export type Mail = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
  idempotencyKey: string;
};
export type MailSender = (mail: Mail) => Promise<string>;

export async function sendEmail(mail: Mail): Promise<string> {
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM)
    throw new Error("EMAIL_NOT_CONFIGURED");
  const result = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
      "Idempotency-Key": mail.idempotencyKey,
    },
    body: JSON.stringify({
      from: process.env.EMAIL_FROM,
      to: [mail.to],
      subject: mail.subject,
      text: mail.text,
      ...(mail.replyTo ? { reply_to: mail.replyTo } : {}),
    }),
    signal: AbortSignal.timeout(15000),
  });
  if (!result.ok) throw new Error(`EMAIL_HTTP_${result.status}`);
  const data: unknown = await result.json();
  if (
    !data ||
    typeof data !== "object" ||
    !("id" in data) ||
    typeof data.id !== "string"
  )
    throw new Error("EMAIL_INVALID_RESPONSE");
  return data.id;
}

export async function drainOutbox(
  db: Database,
  send: MailSender = sendEmail,
  limit = 10,
) {
  let sent = 0,
    retried = 0;
  // A lease permits another worker to recover a process crash; provider idempotency protects retries.
  await db.query(
    "UPDATE notification_outbox SET status='pending', locked_at=NULL WHERE status='processing' AND locked_at < now()-interval '5 minutes'",
  );
  for (let i = 0; i < limit; i++) {
    const job = await db.transaction(async (tx) => {
      const claimed = await tx.query<{
        id: string;
        inquiry_id: string;
        attempts: number;
      }>(
        `UPDATE notification_outbox SET status='processing', attempts=attempts+1, locked_at=now()
         WHERE id=(SELECT id FROM notification_outbox WHERE status='pending' AND next_attempt_at <= now() ORDER BY next_attempt_at FOR UPDATE SKIP LOCKED LIMIT 1)
         RETURNING id,inquiry_id,attempts`,
      );
      if (!claimed.rows[0]) return undefined;
      const inquiry = await tx.query<{
        kind: Job["kind"];
        payload: Job["payload"];
        reference: string;
      }>("SELECT kind,payload,reference FROM inquiries WHERE id=$1", [
        claimed.rows[0].inquiry_id,
      ]);
      return { ...claimed.rows[0], ...inquiry.rows[0] } as Job;
    });
    if (!job) break;
    try {
      const feedback = job.payload as FeedbackInput;
      const text =
        job.kind === "quote"
          ? quoteSummary(job.payload as QuoteInput, job.reference)
          : [
              `Feedback reference: ${job.reference}`,
              `Name: ${feedback.name}`,
              `Company: ${feedback.company}`,
              `Email: ${feedback.email}`,
              `Phone: ${feedback.phone}`,
              `Job reference: ${feedback.reference}`,
              `Feedback: ${feedback.message}`,
              `Requested resolution: ${feedback.resolution}`,
            ].join("\n");
      const providerId = await send({
        to: site.contact.email,
        subject: `[${job.reference}] ${job.kind === "quote" ? "Quote request" : "Private feedback"}`,
        text,
        replyTo: job.payload.email || undefined,
        idempotencyKey: `zanich-${job.id}`,
      });
      await db.query(
        "UPDATE notification_outbox SET status='sent', provider_id=$2, sent_at=now(), locked_at=NULL,error_code=NULL WHERE id=$1",
        [job.id, providerId],
      );
      sent++;
    } catch {
      const delay = Math.min(3600, 30 * 2 ** job.attempts);
      await db.query(
        "UPDATE notification_outbox SET status=$2,next_attempt_at=now()+$3*interval '1 second',locked_at=NULL,error_code='DELIVERY_UNAVAILABLE' WHERE id=$1",
        [job.id, job.attempts >= 8 ? "failed" : "pending", delay],
      );
      retried++;
    }
  }
  await db.query(
    "DELETE FROM rate_limits WHERE expires_at < now()-interval '1 hour'",
  );
  const failed = await db.query<{ count: string }>(
    "SELECT count(*) FROM notification_outbox WHERE status='failed'",
  );
  return {
    sent,
    retried,
    failed: Number(failed.rows[0].count),
    run: randomUUID(),
  };
}
