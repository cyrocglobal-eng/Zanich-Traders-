import { z } from "zod";
import { publicSite } from "@/lib/seo/config";

const optional = z.string().optional();
const schema = z.object({
  DATABASE_URL: z.string().url().optional(),
  RESEND_API_KEY: optional,
  EMAIL_FROM: optional,
  OPENAI_API_KEY: optional,
  OPENAI_MODEL: optional,
  TRUSTED_IP_HEADER: z
    .enum(["x-forwarded-for", "cf-connecting-ip", "x-real-ip"])
    .optional(),
  RATE_LIMIT_SALT: optional,
  OUTBOX_SECRET: optional,
});
export function serverConfig() {
  return schema.parse(
    Object.fromEntries(
      Object.entries(process.env).map(([key, value]) => [
        key,
        value || undefined,
      ]),
    ),
  );
}
function intakeOriginReady() {
  try {
    const url = new URL(process.env.NEXT_PUBLIC_SITE_URL || publicSite.url);
    return url.protocol === "https:" || (
      process.env.NODE_ENV !== "production" &&
      url.protocol === "http:" &&
      ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname)
    );
  } catch {
    return false;
  }
}
export const quoteAvailable = () =>
  Boolean(
    intakeOriginReady() &&
    process.env.DATABASE_URL?.trim() &&
    process.env.RESEND_API_KEY?.trim() &&
    process.env.EMAIL_FROM?.trim() &&
    process.env.OUTBOX_SECRET?.trim(),
  );
export const agentAvailable = () =>
  Boolean(
    process.env.DATABASE_URL &&
    process.env.OPENAI_API_KEY &&
    process.env.OPENAI_MODEL,
  );
