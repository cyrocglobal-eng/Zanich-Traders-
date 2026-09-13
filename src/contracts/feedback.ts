import { z } from "zod";
import { contactSchema } from "./quote";

export const feedbackSchema = contactSchema
  .extend({
    reference: z.string().trim().max(100),
    message: z
      .string()
      .trim()
      .min(10, "Please describe your feedback.")
      .max(3000),
    resolution: z.string().trim().max(1000),
    consent: z
      .boolean()
      .refine(Boolean, "Please agree to share this feedback with Zanich."),
    website: z.string().max(0),
  })
  .refine((data) => Boolean(data.email || data.phone), {
    message: "Enter an email address or phone number.",
    path: ["email"],
  });
export type FeedbackInput = z.infer<typeof feedbackSchema>;
