"use client";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { feedbackSchema, type FeedbackInput } from "@/contracts/feedback";
import { whatsappLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";

export function FeedbackForm({
  canSubmit = false,
  initialMessage = "",
  id = "feedback",
}: {
  canSubmit?: boolean;
  initialMessage?: string;
  id?: string;
}) {
  const [review, setReview] = useState<FeedbackInput | null>(null);
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const key = useRef<{ body: string; key: string } | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FeedbackInput>({
    resolver: zodResolver(feedbackSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      reference: "",
      message: initialMessage,
      resolution: "",
      consent: false,
      website: "",
    },
  });
  const summary = review
    ? [
        `Hello Zanich, I would like to share private feedback.`,
        `Name: ${review.name}`,
        review.email && `Email: ${review.email}`,
        review.phone && `Phone: ${review.phone}`,
        review.reference && `Job reference: ${review.reference}`,
        review.message,
        review.resolution && `Requested resolution: ${review.resolution}`,
      ]
        .filter(Boolean)
        .join("\n")
    : "";
  async function send() {
    if (!review || busy) return;
    setBusy(true);
    setError("");
    const body = JSON.stringify(review);
    if (key.current?.body !== body)
      key.current = { body, key: crypto.randomUUID() };
    try {
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": key.current.key,
        },
        body,
        signal: AbortSignal.timeout(20000),
      });
      const data = await response.json();
      if (!response.ok) {
        if (response.status === 409) key.current = null;
        throw new Error(data.error);
      }
      setReference(data.reference);
      track("feedback_submit", { channel: "website" });
    } catch {
      setError(
        "We could not confirm your submission. You can retry safely or continue on WhatsApp.",
      );
    } finally {
      setBusy(false);
    }
  }
  if (review)
    return (
      <div>
        <h3 className="font-display text-xl font-700">
          {reference ? "Your feedback is saved" : "Review your feedback"}
        </h3>
        {reference && (
          <p role="status" className="mt-3">
            Reference: {reference}. The team will review your message.
          </p>
        )}
        <pre className="mt-4 whitespace-pre-wrap break-words rounded-xl bg-ink/5 p-4 font-sans text-sm leading-relaxed">
          {summary}
        </pre>
        {error && (
          <p role="alert" className="field-error">
            {error}
          </p>
        )}
        <div className="mt-4 grid gap-3">
          {canSubmit && !reference && (
            <button className="btn-primary" disabled={busy} onClick={send}>
              {busy ? "Saving feedback…" : "Submit private feedback"}
            </button>
          )}
          <a
            href={whatsappLink(summary)}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-whatsapp"
            data-placement="feedback"
          >
            Continue on WhatsApp
          </a>
          {!reference && (
            <button
              className="btn-dark"
              onClick={() => setReview(null)}
              disabled={busy}
            >
              Edit feedback
            </button>
          )}
        </div>
      </div>
    );
  return (
    <form
      className="feedback-form"
      noValidate
      onSubmit={handleSubmit(setReview)}
    >
      <h3 className="font-display text-xl font-700">Share private feedback</h3>
      <p className="mt-2 text-sm text-ink/70">
        Tell us what happened and how you would like us to help. Your feedback
        goes to the team and is not published.
      </p>
      <div className="form-grid mt-5">
        {(["name", "email", "phone", "reference"] as const).map((field) => (
          <label key={field} htmlFor={`${id}-${field}`}>
            {field === "name"
              ? "Full name *"
              : field === "reference"
                ? "Job reference (optional)"
                : field === "email"
                  ? "Email"
                  : "Phone"}
            <input
              id={`${id}-${field}`}
              type={
                field === "email" ? "email" : field === "phone" ? "tel" : "text"
              }
              {...register(field)}
              aria-invalid={Boolean(errors[field])}
              aria-describedby={
                errors[field] ? `${id}-${field}-error` : undefined
              }
            />
            {errors[field] && (
              <span className="field-error" id={`${id}-${field}-error`}>
                {errors[field]?.message}
              </span>
            )}
          </label>
        ))}
      </div>
      <p className="mt-2 text-sm text-ink/65">
        Provide an email address or phone number for our reply.
      </p>
      <label className="mt-4" htmlFor={`${id}-message`}>
        Your feedback *
        <textarea
          id={`${id}-message`}
          rows={4}
          maxLength={3000}
          {...register("message")}
          aria-invalid={Boolean(errors.message)}
        />
        {errors.message && (
          <span className="field-error">{errors.message.message}</span>
        )}
      </label>
      <label className="mt-4" htmlFor={`${id}-resolution`}>
        How would you like us to help?{" "}
        <span className="optional">(optional)</span>
        <textarea
          id={`${id}-resolution`}
          rows={2}
          maxLength={1000}
          {...register("resolution")}
        />
      </label>
      <div className="honeypot" aria-hidden="true">
        <input
          {...register("website")}
          tabIndex={-1}
          autoComplete="off"
          aria-label="Website"
        />
      </div>
      <label className="consent-row mt-4">
        <input type="checkbox" {...register("consent")} />
        <span>
          I agree to share this feedback with Zanich.{" "}
          <a
            href="/privacy"
            className="underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            Privacy notice
          </a>
          .
        </span>
      </label>
      {errors.consent && (
        <span className="field-error">{errors.consent.message}</span>
      )}
      <button className="btn-primary mt-5 w-full" type="submit">
        Review feedback
      </button>
    </form>
  );
}
