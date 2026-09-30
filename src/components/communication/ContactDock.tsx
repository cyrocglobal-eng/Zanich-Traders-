"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { MessageCircle, MessagesSquare } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";
const AgentPanel = dynamic(() => import("./AgentPanel"), {
  ssr: false,
  loading: () => (
    <p
      role="status"
      className="fixed bottom-24 right-6 z-50 rounded bg-white p-4 shadow-xl"
    >
      Opening support…
    </p>
  ),
});

export function ContactDock({
  agentEnabled,
  canSubmit,
}: {
  agentEnabled: boolean;
  canSubmit: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="fixed bottom-6 right-6 z-40 hidden flex-col items-end gap-3 sm:flex">
        <button
          className="btn-dark !bg-white shadow-lg"
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
        >
          <MessagesSquare className="h-5 w-5" />
          Ask Zanich
        </button>
        <a
          className="btn-whatsapp shadow-lg"
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          data-placement="floating"
        >
          <MessageCircle className="h-5 w-5" />
          WhatsApp
        </a>
      </div>
      <nav
        aria-label="Quick contact"
        className="fixed inset-x-0 bottom-0 z-40 flex items-center gap-2 border-t border-ink/15 bg-white px-3 pt-3 shadow-xl sm:hidden"
        style={{ paddingBottom: "calc(12px + env(safe-area-inset-bottom))" }}
      >
        <a className="btn-primary flex-1 !px-3" href="/contact#contact">
          Get a quote
        </a>
        <a
          className="btn-whatsapp flex-1 !px-3"
          href={whatsappLink()}
          target="_blank"
          rel="noopener noreferrer"
          data-placement="mobile-bar"
        >
          WhatsApp
        </a>
        <button
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded border border-ink/20"
          aria-label="Ask Zanich support"
          aria-haspopup="dialog"
          onClick={() => setOpen(true)}
        >
          <MessagesSquare className="h-5 w-5" />
        </button>
      </nav>
      {open && (
        <AgentPanel
          available={agentEnabled}
          canSubmit={canSubmit}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
}
