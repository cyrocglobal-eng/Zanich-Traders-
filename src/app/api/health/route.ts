export const dynamic = "force-dynamic";

// Process liveness only. Database and notification readiness are checked separately.
export function GET() {
  return Response.json({ status: "ok" }, { headers: { "Cache-Control": "no-store" } });
}
