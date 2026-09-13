import { timingSafeEqual } from "node:crypto";
import { drainOutbox } from "@/server/notifications/outbox";
import { getDatabase } from "@/server/persistence/database";
export const runtime = "nodejs";
export async function POST(request: Request) {
  const expected = process.env.OUTBOX_SECRET;
  const supplied = request.headers
    .get("authorization")
    ?.replace(/^Bearer /, "");
  if (
    !expected ||
    expected.length < 32 ||
    !supplied ||
    Buffer.byteLength(supplied) !== Buffer.byteLength(expected) ||
    !timingSafeEqual(Buffer.from(supplied), Buffer.from(expected))
  ) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!process.env.RESEND_API_KEY || !process.env.EMAIL_FROM)
    return Response.json(
      { error: "Notifications unavailable" },
      { status: 503 },
    );
  try {
    return Response.json(await drainOutbox(getDatabase(), undefined, 3), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch {
    return Response.json({ error: "Worker unavailable" }, { status: 503 });
  }
}
