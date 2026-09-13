import { z } from "zod";

export const agentRequestSchema = z
  .object({
    messages: z
      .array(
        z.object({
          role: z.enum(["user", "assistant"]),
          content: z.string().trim().min(1).max(2000),
        }),
      )
      .min(1)
      .max(16),
  })
  .refine(
    (value) => value.messages.at(-1)?.role === "user",
    "A customer message is required.",
  );
export const agentResponseSchema = z.object({
  reply: z.string(),
  summary: z.string(),
  handoff: z.enum(["none", "quote", "feedback", "team"]),
});
export type AgentReply = z.infer<typeof agentResponseSchema>;
export const agentDecisionSchema = z.object({
  intent: z.enum([
    "service",
    "pricing",
    "turnaround",
    "artwork",
    "location",
    "feedback",
    "other",
  ]),
  serviceSlug: z.string().nullable(),
  nextQuestion: z.enum([
    "service",
    "quantity",
    "specifications",
    "artwork",
    "deadline",
    "contact",
    "review",
  ]),
  summary: z.string(),
  needsHuman: z.boolean(),
});
