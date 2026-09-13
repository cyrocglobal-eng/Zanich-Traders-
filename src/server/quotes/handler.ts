import { quoteSchema } from "@/contracts/quote";
import { feedbackSchema } from "@/contracts/feedback";
import { getDatabase } from "@/server/persistence/database";
import { saveInquiry, IdempotencyConflict } from "./intake";
import {
  readRequest,
  idempotencyKey,
  enforceRateLimit,
  requestBucket,
  RequestError,
  apiError,
} from "@/server/security/requests";

export async function handleInquiry(
  request: Request,
  kind: "quote" | "feedback",
) {
  try {
    const body = await readRequest(request);
    const key = idempotencyKey(request);
    const parsed = (kind === "quote" ? quoteSchema : feedbackSchema).safeParse(
      body,
    );
    if (!parsed.success)
      return Response.json(
        {
          error: "Please check the highlighted fields.",
          issues: parsed.error.issues.map((issue) => ({
            path: issue.path,
            message: issue.message,
          })),
        },
        { status: 422 },
      );
    const db = getDatabase();
    await enforceRateLimit(db, requestBucket(request, "intake"), 10);
    const saved = await saveInquiry(db, kind, parsed.data, key);
    return Response.json(
      { reference: saved.reference, status: "accepted" },
      {
        status: saved.duplicate ? 200 : 201,
        headers: { "Cache-Control": "no-store" },
      },
    );
  } catch (error) {
    return apiError(
      error instanceof IdempotencyConflict
        ? new RequestError(
            409,
            "This request changed. Please review and submit it again.",
          )
        : error,
    );
  }
}
