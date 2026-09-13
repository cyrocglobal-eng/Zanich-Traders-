import type { AgentReply } from "@/contracts/agent";
import { business } from "@/content/business";
import { findService } from "@/content/services";
import { agentDecisionSchema } from "@/contracts/agent";
import type { z } from "zod";

export function decisionReply(
  decision: z.infer<typeof agentDecisionSchema>,
): AgentReply {
  const service = decision.serviceSlug
    ? findService(decision.serviceSlug)
    : undefined;
  const facts = {
    service: service
      ? `${service.name}: ${service.desc}`
      : "We offer digital printing, large format printing, sublimation, heat transfer printing, vinyl cutting, print & cut, doming and promotional merchandise.",
    pricing: business.pricing,
    turnaround: business.fastTrack,
    artwork:
      service?.artwork ||
      "Have ready-to-print artwork? Our team will review it before production. If you need design help, our in-house graphic designers can assist.",
    location: `Visit us at ${business.address.line1}, ${business.address.line2}, ${business.address.city}. Our hours are ${business.hours}. Call ${business.phone}.`,
    feedback:
      "You can share private feedback with our team using the feedback form. Include your job reference if available, what happened and your preferred resolution.",
    other:
      "The Zanich team can help confirm that detail. Please share your project requirements or contact us directly.",
  };
  const questions = {
    service: "What would you like to print or brand?",
    quantity: "How many items do you need? An estimate is fine.",
    specifications: service
      ? `Could you share these details: ${service.fields.join(", ").toLowerCase()}? Leave anything you are unsure of for our team to advise.`
      : "What size, material and finish do you have in mind?",
    artwork:
      "Do you have ready-to-print artwork, need in-house design, or want us to check what you have?",
    deadline:
      "When do you need the finished work? The team will confirm availability.",
    contact:
      "You can add your preferred contact details in the quote form when you are ready to submit.",
    review:
      "Please review your summary below, then choose a quote request or WhatsApp handoff.",
  };
  // All customer-facing business assertions come from approved content, not model prose.
  return {
    reply: `${facts[decision.intent]} ${questions[decision.nextQuestion]}`,
    summary: decision.summary.slice(0, 2000),
    handoff:
      decision.intent === "feedback"
        ? "feedback"
        : decision.needsHuman
          ? "team"
          : decision.nextQuestion === "review"
            ? "quote"
            : "none",
  };
}

export function policyReply(message: string): AgentReply | undefined {
  if (
    /\b(price|pricing|cost|how much|discount|rush|fast.track|24.hour|tomorrow|today)\b/i.test(
      message,
    )
  ) {
    return {
      reply: `${business.pricing} ${business.fastTrack} What product, quantity and deadline do you have in mind?`,
      summary: message,
      handoff: "quote",
    };
  }
  if (/\b(complaint|refund|damaged|unhappy|feedback)\b/i.test(message)) {
    return {
      reply:
        "I can help you share private feedback with the Zanich team. Please describe what happened, your job reference if you have it, and the resolution you would like. The team will review your request.",
      summary: message,
      handoff: "feedback",
    };
  }
}
