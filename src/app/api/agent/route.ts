import { agentRequestSchema } from "@/contracts/agent";
import { respond } from "@/server/agent/respond";
import { getDatabase } from "@/server/persistence/database";
import {
  readRequest,
  enforceRateLimit,
  requestBucket,
  RequestError,
  apiError,
} from "@/server/security/requests";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    const input = agentRequestSchema.safeParse(
      await readRequest(request, 24000),
    );
    if (!input.success)
      throw new RequestError(
        422,
        "Please shorten your message or start a new conversation.",
      );
    const db = getDatabase();
    await enforceRateLimit(db, requestBucket(request, "agent"), 15);
    await enforceRateLimit(db, "agent:global-hourly", 200, 3600);
    return Response.json(await respond(input.data.messages), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return apiError(error);
  }
}
