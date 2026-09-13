"use client";
import { useEffect, useRef, useState } from "react";
import { X, Send, ArrowLeft } from "lucide-react";
import { site } from "@/content/site";
import { QuoteForm } from "@/components/quote/QuoteForm";
import { FeedbackForm } from "./FeedbackForm";
import { whatsappLink } from "@/lib/whatsapp";
import { track } from "@/lib/analytics";
import type { AgentReply } from "@/contracts/agent";

export default function AgentPanel({
  onClose,
  available,
  canSubmit,
}: {
  onClose: () => void;
  available: boolean;
  canSubmit: boolean;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [messages, setMessages] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [summary, setSummary] = useState("");
  const [handoff, setHandoff] = useState<AgentReply["handoff"]>("none");
  const [mode, setMode] = useState<"chat" | "quote" | "feedback">("chat");
  useEffect(() => {
    const modal = dialog.current;
    const opener = document.activeElement;
    modal?.showModal();
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      modal?.close();
      document.body.style.overflow = previous;
      if (opener instanceof HTMLElement && opener.isConnected) opener.focus();
    };
  }, []);
  async function send(event: React.FormEvent) {
    event.preventDefault();
    if (!draft.trim() || busy || !available) return;
    const next = [
      ...messages,
      { role: "user" as const, content: draft.trim() },
    ].slice(-15);
    setMessages(next);
    setDraft("");
    setBusy(true);
    setError("");
    setSummary("");
    setHandoff("none");
    try {
      const response = await fetch("/api/agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
        signal: AbortSignal.timeout(25000),
      });
      if (!response.ok) throw new Error("Unavailable");
      const result: AgentReply = await response.json();
      setMessages([...next, { role: "assistant", content: result.reply }]);
      setSummary(result.summary);
      setHandoff(result.handoff);
    } catch {
      setError(
        "The AI assistant could not reply. Your message is still shown above. Please use the quote form or contact the team directly.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <dialog
      ref={dialog}
      className="support-dialog"
      aria-labelledby="support-title"
      onCancel={onClose}
    >
      <header className="flex items-center justify-between gap-4 border-b border-ink/10 bg-ink px-5 py-4 text-white">
        <div>
          <h2 id="support-title" className="font-display font-700">
            Zanich support
          </h2>
          <p className="mt-1 text-sm text-white/70">
            {mode === "chat"
              ? "AI assistant & team contact"
              : mode === "quote"
                ? "Your project brief"
                : "Private feedback"}
          </p>
        </div>
        <button
          type="button"
          aria-label="Close support"
          onClick={onClose}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/25"
        >
          <X />
        </button>
      </header>
      <div className="support-scroll">
        {mode !== "chat" ? (
          <>
            <button
              className="mb-5 inline-flex min-h-11 items-center gap-2 text-sm underline"
              onClick={() => setMode("chat")}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to conversation
            </button>
            {mode === "quote" ? (
              <QuoteForm
                canSubmit={canSubmit}
                initialDetails={summary}
                id="agent-quote"
              />
            ) : (
              <FeedbackForm
                canSubmit={canSubmit}
                initialMessage={summary}
                id="agent-feedback"
              />
            )}
          </>
        ) : (
          <>
            <p className="text-base leading-relaxed">
              {available
                ? "Hi, I’m Zanich’s AI assistant. I can explain our services and help prepare your project brief. What would you like to print or brand?"
                : "The AI assistant is currently unavailable. You can still prepare a quote request or speak directly with the Zanich team."}
            </p>
            <p className="mt-3 text-sm leading-relaxed text-ink/65">
              Prices, artwork readiness and fast-track availability are
              confirmed by the team.{" "}
              <a
                href="/privacy"
                className="underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                How we handle your details
              </a>
              .
            </p>
            <div
              role="log"
              aria-live="polite"
              aria-label="Conversation"
              className="mt-5 space-y-3"
            >
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`rounded-2xl p-4 ${message.role === "user" ? "ml-5 bg-ink text-white" : "mr-5 bg-ink/5"}`}
                >
                  <p className="mb-1 text-xs font-semibold uppercase tracking-wider">
                    {message.role === "user" ? "You" : "AI assistant"}
                  </p>
                  <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">
                    {message.content}
                  </p>
                </div>
              ))}
              {busy && (
                <p role="status" className="text-sm">
                  Preparing a reply…
                </p>
              )}
            </div>
            {error && (
              <p role="alert" className="field-error mt-4">
                {error}
              </p>
            )}
            {available && (
              <form onSubmit={send} className="mt-5">
                <label
                  htmlFor="support-message"
                  className="text-sm font-semibold"
                >
                  Your message
                </label>
                <textarea
                  id="support-message"
                  className="agent-input"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  maxLength={2000}
                  rows={3}
                  placeholder="e.g. I need 100 branded mugs…"
                  disabled={busy}
                />
                <button
                  className="btn-primary mt-3 w-full"
                  disabled={busy || !draft.trim()}
                >
                  <Send className="h-4 w-4" />
                  {busy ? "Replying…" : "Ask AI assistant"}
                </button>
              </form>
            )}
            {summary && (
              <div className="mt-5 rounded-2xl border border-ink/15 p-4">
                <label
                  htmlFor="handoff-summary"
                  className="text-sm font-semibold"
                >
                  Review your project summary
                </label>
                <textarea
                  id="handoff-summary"
                  className="agent-input"
                  value={summary}
                  maxLength={2000}
                  onChange={(event) => setSummary(event.target.value)}
                  rows={4}
                />
                <p className="mt-2 text-sm text-ink/65">
                  Nothing is sent to the team until you choose a contact option.
                </p>
              </div>
            )}
            <div className="mt-5 grid gap-3">
              <button
                type="button"
                className="btn-dark"
                onClick={() =>
                  setMode(handoff === "feedback" ? "feedback" : "quote")
                }
              >
                {handoff === "feedback"
                  ? "Review private feedback"
                  : "Prepare a quote request"}
              </button>
              <a
                className="btn-whatsapp"
                href={whatsappLink(summary || undefined)}
                target="_blank"
                rel="noopener noreferrer"
                data-placement="agent"
                onClick={() => {
                  if (summary) track("agent_handoff", { channel: "whatsapp" });
                }}
              >
                Continue on WhatsApp
              </a>
              <div className="flex flex-wrap justify-between gap-2 text-sm">
                <a href={site.contact.phoneHref} className="py-3 underline">
                  Call {site.contact.phone}
                </a>
                <button
                  className="py-3 underline"
                  onClick={() => setMode("feedback")}
                >
                  Share feedback
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
