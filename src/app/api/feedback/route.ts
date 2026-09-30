import { handleInquiry } from "@/server/quotes/handler";
export const runtime = "nodejs";
export const POST = (request: Request) => handleInquiry(request, "feedback");
