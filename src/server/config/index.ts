import { z } from "zod";

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
export const quoteAvailable = () =>
  Boolean(
    process.env.DATABASE_URL &&
    process.env.RESEND_API_KEY &&
    process.env.EMAIL_FROM &&
    process.env.OUTBOX_SECRET,
  );
export const agentAvailable = () =>
  Boolean(
    process.env.DATABASE_URL &&
    process.env.OPENAI_API_KEY &&
    process.env.OPENAI_MODEL,
  );
