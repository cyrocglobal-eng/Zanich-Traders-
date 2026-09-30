import { z } from "zod";
import { services } from "@/content/services";

const shortText = z.string().trim().max(160);
export const contactSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(100),
  company: shortText,
  email: z.union([
    z.literal(""),
    z.email("Enter a valid email address.").max(254),
  ]),
  phone: z
    .string()
    .trim()
    .max(30)
    .refine(
      (value) =>
        !value ||
        (/^\+?[\d ()-]{7,30}$/.test(value) &&
          value.replace(/\D/g, "").length >= 7),
      "Enter a valid phone number.",
    ),
});
export const quoteSchema = contactSchema
  .extend({
    service: z
      .string()
      .refine(
        (value) => services.some((service) => service.slug === value),
        "Choose a service.",
      ),
    quantity: z.string().trim().max(40),
    deadline: z.union([z.literal(""), z.iso.date("Choose a valid date.")]),
    artwork: z.enum(["ready-to-print", "needs-design", "unsure"]),
    details: z
      .string()
      .trim()
      .min(
        10,
        "Tell us a little more about your project (at least 10 characters).",
      )
      .max(2000),
    specifications: z
      .record(z.string().max(80), z.string().trim().max(250))
      .refine((value) => Object.keys(value).length <= 8),
    consent: z
      .boolean()
      .refine(Boolean, "Please agree to sharing this brief with Zanich."),
    website: z.string().max(0),
  })
  .refine((data) => Boolean(data.email || data.phone), {
    message: "Enter an email address or phone number so we can reply.",
    path: ["email"],
  });
export type QuoteInput = z.infer<typeof quoteSchema>;

export function quoteSummary(data: QuoteInput, reference?: string) {
  const service = services.find((item) => item.slug === data.service);
  return [
    "Hello Zanich, I'd like a quote.",
    reference && `Reference: ${reference}`,
    `Name: ${data.name}`,
    data.company && `Company: ${data.company}`,
    data.email && `Email: ${data.email}`,
    data.phone && `Phone: ${data.phone}`,
    `Service: ${service?.name ?? data.service}`,
    `Quantity: ${data.quantity || "Please advise"}`,
    `Artwork: ${data.artwork}`,
    `Requested deadline: ${data.deadline || "Flexible"}`,
    ...Object.entries(data.specifications)
      .filter(([, value]) => value)
      .map(([key, value]) => `${key}: ${value}`),
    `Project: ${data.details}`,
  ]
    .filter(Boolean)
    .join("\n");
}
