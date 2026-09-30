import { createHmac } from "node:crypto";
import { z } from "zod";
import type { Sql } from "@/server/persistence/database";
import { publicSite } from "@/lib/seo/config";

export class RequestError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}
export async function readRequest(
  request: Request,
  limit = 16384,
): Promise<unknown> {
  const origin = request.headers.get("origin");
  const allowed = new Set([publicSite.url]);
  if (process.env.NODE_ENV !== "production")
    allowed.add(new URL(request.url).origin);
  if (!origin || !allowed.has(origin))
    throw new RequestError(
      403,
      "Please submit this request from the Zanich website.",
    );
  if (!request.headers.get("content-type")?.startsWith("application/json"))
    throw new RequestError(415, "Use JSON for this request.");
  const reader = request.body?.getReader();
  if (!reader) throw new RequestError(400, "A request body is required.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      size += chunk.value.byteLength;
      if (size > limit) {
        await reader.cancel();
        throw new RequestError(413, "Please shorten your request.");
      }
      chunks.push(chunk.value);
    }
    try {
      return JSON.parse(Buffer.concat(chunks).toString("utf8"));
    } catch {
      throw new RequestError(400, "The request could not be read.");
    }
  } finally {
    reader.releaseLock();
  }
}
export function idempotencyKey(request: Request) {
  const result = z.uuid().safeParse(request.headers.get("idempotency-key"));
  if (!result.success)
    throw new RequestError(400, "A valid request key is required.");
  return result.data;
}
export async function enforceRateLimit(
  db: Sql,
  bucket: string,
  maximum: number,
  windowSeconds = 600,
) {
  const result = await db.query<{ hits: number }>(
    `INSERT INTO rate_limits (bucket,hits,expires_at) VALUES ($1,1,now()+$2*interval '1 second')
     ON CONFLICT (bucket) DO UPDATE SET
       hits=CASE WHEN rate_limits.expires_at <= now() THEN 1 ELSE rate_limits.hits+1 END,
       expires_at=CASE WHEN rate_limits.expires_at <= now() THEN now()+$2*interval '1 second' ELSE rate_limits.expires_at END
     RETURNING hits`,
    [bucket, windowSeconds],
  );
  if (result.rows[0].hits > maximum)
    throw new RequestError(
      429,
      "Too many requests. Please try later or contact us on WhatsApp.",
    );
}
export function requestBucket(request: Request, scope: string) {
  // Enable only a header which the deployment proxy overwrites; never trust arbitrary forwarded headers.
  const header = process.env.TRUSTED_IP_HEADER;
  const identity = header
    ? request.headers.get(header)?.split(",")[0].trim() || "unknown"
    : "shared";
  return `${scope}:${createHmac(
    "sha256",
    process.env.RATE_LIMIT_SALT || "local-development",
  )
    .update(identity)
    .digest("hex")}`;
}
export function apiError(error: unknown) {
  if (error instanceof RequestError)
    return Response.json(
      { error: error.message },
      {
        status: error.status,
        headers:
          error.status === 429
            ? { "Retry-After": "600", "Cache-Control": "no-store" }
            : { "Cache-Control": "no-store" },
      },
    );
  // Never log customer data, database URLs or provider response bodies.
  console.error(
    "Request unavailable",
    error instanceof Error ? error.constructor.name : "UnknownError",
  );
  return Response.json(
    {
      error:
        "This service is temporarily unavailable. Please continue on WhatsApp or call us.",
    },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}
