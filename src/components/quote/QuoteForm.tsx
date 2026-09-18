"use client";

import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, MessageCircle } from "lucide-react";
import { services } from "@/content/services";
import { business } from "@/content/business";
import { quoteSchema, quoteSummary, type QuoteInput } from "@/contracts/quote";
import { whatsappLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";

export function QuoteForm({
  initialService = "digital-printing",
  initialDetails = "",
  canSubmit = false,
  id = "quote",
}: {
  initialService?: string;
  initialDetails?: string;
  canSubmit?: boolean;
  id?: string;
}) {
  const [review, setReview] = useState<QuoteInput | null>(null);
  const [reference, setReference] = useState("");
  const [error, setError] = useState("");
  const [sending, setSending] = useState(false);
  const started = useRef(false);
  const request = useRef<{ body: string; key: string } | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<QuoteInput>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      name: "",
      company: "",
      email: "",
      phone: "",
      service: initialService,
      quantity: "",
      deadline: "",
      artwork: "unsure",
      details: initialDetails,
      specifications: {},
      consent: false,
      website: "",
    },
  });
  const selectedService = useWatch({ control, name: "service" });
  useEffect(() => {
    if (review) heading.current?.focus();
  }, [review]);
  const selected =
    services.find((item) => item.slug === selectedService) ?? services[0];
  const fieldError = (name: keyof QuoteInput) =>
    errors[name]?.message ? (
      <span className="field-error" id={`${id}-${name}-error`}>
        {String(errors[name]?.message)}
      </span>
    ) : null;
  const errorProps = (name: keyof QuoteInput) => ({
    "aria-invalid": Boolean(errors[name]),
    "aria-describedby": errors[name] ? `${id}-${name}-error` : undefined,
  });

  async function send() {
    if (!review || sending) return;
    setSending(true);
    setError("");
    const body = JSON.stringify(review);
    if (request.current?.body !== body)
      request.current = { body, key: crypto.randomUUID() };
    try {
      const result = await fetch("/api/quotes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": request.current.key,
        },
        body,
        signal: AbortSignal.timeout(20000),
      });
      const data = await result.json();
      if (!result.ok) {
        if (result.status === 409) request.current = null;
        throw new Error(
          data.error || "Your request was not accepted. Please try again.",
        );
      }
      setReference(data.reference);
      track("generate_lead", { service: review.service, channel: "website" });
      if (id.startsWith("agent"))
        track("agent_handoff", { service: review.service, channel: "website" });
    } catch (failure) {
      setError(
        failure instanceof Error && failure.name !== "TimeoutError"
          ? failure.message
          : "The connection timed out. You can retry safely or continue on WhatsApp.",
      );
    } finally {
      setSending(false);
    }
  }

  if (review)
    return (
      <div className="quote-review">
        <h3
          ref={heading}
          tabIndex={-1}
          className="font-display text-xl font-700"
        >
          {reference ? "Your request is saved" : "Review your quote request"}
        </h3>
        {reference && (
          <p
            role="status"
            className="mt-4 flex items-center gap-2 font-semibold"
          >
            <CheckCircle2 className="h-5 w-5 text-green-700" />
            Reference: {reference}
          </p>
        )}
        <p className="mt-3 text-sm text-ink/70">
          {reference
            ? "The team will review your brief. For an urgent request, continue on WhatsApp with this reference."
            : "Check your details, then choose how to contact us. WhatsApp opens a draft for you to send."}
        </p>
        <pre className="mt-5 max-h-80 overflow-auto whitespace-pre-wrap break-words rounded bg-ink/5 p-4 font-sans text-sm leading-relaxed">
          {quoteSummary(review, reference)}
        </pre>
        {error && (
          <p role="alert" className="field-error mt-4">
            {error}
          </p>
        )}
        <div className="mt-5 grid gap-3">
          {!reference && canSubmit && (
            <button className="btn-primary" onClick={send} disabled={sending}>
              {sending ? "Saving your request…" : "Submit request to Zanich"}
            </button>
          )}
          <a
            className="btn-whatsapp"
            href={whatsappLink(quoteSummary(review, reference))}
            target="_blank"
            rel="noopener noreferrer"
            data-placement="quote-review"
          >
            <MessageCircle className="h-5 w-5" />
            Continue on WhatsApp
          </a>
          {!reference && (
            <button
              type="button"
              className="btn-dark"
              disabled={sending}
              onClick={() => {
                setReview(null);
                setError("");
              }}
            >
              Edit details
            </button>
          )}
        </div>
        <p className="mt-4 text-sm text-ink/75">{business.fastTrack}</p>
      </div>
    );

  return (
    <form
      noValidate
      className="quote-form"
      onFocus={() => {
        if (!started.current) {
          track("quote_start", { service: selected.slug, placement: id });
          started.current = true;
        }
      }}
      onSubmit={handleSubmit((data) => {
        // Discard specs from previously selected services before review and handoff.
        setReview({
          ...data,
          specifications: Object.fromEntries(
            Object.entries(data.specifications).filter(([key]) =>
              selected.fields.some((field) => field === key),
            ),
          ),
        });
      })}
    >
      <h3 className="font-display text-xl font-700">Request a quote</h3>
      <p className="mt-2 text-sm text-ink/70">
        Tell us what you need branded. Unsure of a specification? Leave it blank
        and we can help.
      </p>
      <div className="form-grid mt-6">
        <label htmlFor={`${id}-name`}>
          Full name *
          <input
            id={`${id}-name`}
            autoComplete="name"
            {...register("name")}
            {...errorProps("name")}
          />
          {fieldError("name")}
        </label>
        <label htmlFor={`${id}-company`}>
          Company <span className="optional">(optional)</span>
          <input
            id={`${id}-company`}
            autoComplete="organization"
            {...register("company")}
          />
          {fieldError("company")}
        </label>
        <label htmlFor={`${id}-email`}>
          Email
          <input
            id={`${id}-email`}
            type="email"
            autoComplete="email"
            {...register("email")}
            {...errorProps("email")}
          />
          {fieldError("email")}
        </label>
        <label htmlFor={`${id}-phone`}>
          Phone
          <input
            id={`${id}-phone`}
            type="tel"
            autoComplete="tel"
            placeholder="+254…"
            {...register("phone")}
            {...errorProps("phone")}
          />
          {fieldError("phone")}
        </label>
      </div>
      <p className="mt-2 text-sm text-ink/75">
        Please provide an email address or phone number so we can reply.
      </p>
      <label className="mt-5" htmlFor={`${id}-service`}>
        What do you need? *
        <select
          id={`${id}-service`}
          {...register("service")}
          {...errorProps("service")}
        >
          {services.map((service) => (
            <option key={service.slug} value={service.slug}>
              {service.name}
            </option>
          ))}
        </select>
        {fieldError("service")}
      </label>
      <div className="form-grid mt-4">
        <label htmlFor={`${id}-quantity`}>
          Quantity <span className="optional">(optional)</span>
          <input
            id={`${id}-quantity`}
            placeholder="e.g. 100 items"
            {...register("quantity")}
          />
          {fieldError("quantity")}
        </label>
        <label htmlFor={`${id}-deadline`}>
          Requested deadline <span className="optional">(optional)</span>
          <input id={`${id}-deadline`} type="date" {...register("deadline")} />
          {fieldError("deadline")}
        </label>
      </div>
      <label className="mt-4" htmlFor={`${id}-artwork`}>
        Artwork readiness
        <select id={`${id}-artwork`} {...register("artwork")}>
          <option value="unsure">I’m not sure — please advise</option>
          <option value="ready-to-print">I have ready-to-print artwork</option>
          <option value="needs-design">I need in-house design</option>
        </select>
      </label>
      <details
        className="specification-fields mt-4 rounded border border-ink/15 p-4"
        key={selected.slug}
      >
        <summary className="cursor-pointer text-sm font-semibold">
          Add {selected.name.toLowerCase()} specifications{" "}
          <span className="optional">(optional)</span>
        </summary>
        <div className="mt-4 grid gap-4">
          {selected.fields.map((field, index) => (
            <label key={field} htmlFor={`${id}-spec-${index}`}>
              {field}
              <input
                id={`${id}-spec-${index}`}
                maxLength={250}
                {...register(`specifications.${field}`)}
              />
            </label>
          ))}
        </div>
      </details>
      <label className="mt-4" htmlFor={`${id}-details`}>
        Project details *
        <textarea
          id={`${id}-details`}
          rows={4}
          placeholder="Tell us what you have in mind…"
          maxLength={2000}
          {...register("details")}
          {...errorProps("details")}
        />
        {fieldError("details")}
      </label>
      <div className="honeypot" aria-hidden="true">
        <label>
          Website
          <input tabIndex={-1} autoComplete="off" {...register("website")} />
        </label>
      </div>
      <label className="consent-row mt-4">
        <input
          type="checkbox"
          {...register("consent")}
          {...errorProps("consent")}
        />
        <span>
          I agree to share these details with Zanich for this inquiry.{" "}
          <a
            href="/privacy"
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            Privacy notice
          </a>
          .
        </span>
      </label>
      {fieldError("consent")}
      <button type="submit" className="btn-primary mt-5 w-full">
        Review request
        <ArrowRight className="h-4 w-4" />
      </button>
      <p className="mt-4 text-sm leading-relaxed text-ink/75">
        {business.fastTrack}
      </p>
    </form>
  );
}
