"use client";
import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useState, useSyncExternalStore } from "react";
import { track } from "@/lib/analytics";

let memoryChoice = "unknown";
const preferenceKey = "zanich.analytics.v1";
function snapshot() {
  try {
    return localStorage.getItem(preferenceKey) || memoryChoice;
  } catch {
    return memoryChoice;
  }
}
function subscribe(callback: () => void) {
  window.addEventListener("zanich-consent", callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener("zanich-consent", callback);
    window.removeEventListener("storage", callback);
  };
}

export function AnalyticsProvider() {
  const pathname = usePathname();
  const choice = useSyncExternalStore(subscribe, snapshot, () => "unknown");
  const [preferences, setPreferences] = useState(false);
  const gtm = process.env.NEXT_PUBLIC_GTM_ID || "";
  const enabled =
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true" &&
    /^GTM-[A-Z0-9]+$/.test(gtm);
  const accepted = enabled && choice === "accepted";
  useEffect(() => {
    const open = () => setPreferences(true);
    window.addEventListener("zanich-preferences", open);
    return () => window.removeEventListener("zanich-preferences", open);
  }, []);
  useEffect(() => {
    window.zanichAnalyticsConsent = accepted;
    if (accepted) {
      window.dataLayer ??= [];
      track("page_view", { page_path: pathname });
    }
    return () => {
      window.zanichAnalyticsConsent = false;
    };
  }, [accepted, pathname]);
  useEffect(() => {
    if (!accepted) return;
    const capture = (event: MouseEvent) => {
      const link =
        event.target instanceof Element ? event.target.closest("a") : null;
      if (!link) return;
      const placement = link.dataset.placement || "page";
      if (link.protocol === "tel:") track("phone_click", { placement });
      else if (link.hostname === "wa.me")
        track("whatsapp_click", { placement });
    };
    document.addEventListener("click", capture);
    return () => document.removeEventListener("click", capture);
  }, [accepted]);
  function choose(value: "accepted" | "declined") {
    const revoke = accepted && value === "declined";
    memoryChoice = value;
    try {
      localStorage.setItem(preferenceKey, value);
    } catch {
      /* Preference still applies for this visit. */
    }
    window.zanichAnalyticsConsent = value === "accepted" && enabled;
    window.dispatchEvent(new Event("zanich-consent"));
    setPreferences(false);
    if (revoke) {
      for (const cookie of document.cookie.split(";")) {
        const name = cookie.trim().split("=")[0];
        if (!/^_ga(?:_|$)/.test(name)) continue;
        document.cookie = `${name}=;Max-Age=0;path=/`;
        document.cookie = `${name}=;Max-Age=0;path=/;domain=${location.hostname}`;
        document.cookie = `${name}=;Max-Age=0;path=/;domain=.zanichtraders.co.ke`;
      }
      window.location.reload();
    }
  }
  return (
    <>
      {accepted && (
        <Script
          id="zanich-gtm"
          strategy="afterInteractive"
        >{`window.dataLayer=window.dataLayer||[];window.dataLayer.push({'gtm.start':Date.now(),event:'gtm.js'});(function(){var s=document.createElement('script');s.async=true;s.src='https://www.googletagmanager.com/gtm.js?id=${gtm}';document.head.appendChild(s);})();`}</Script>
      )}
      {((enabled && choice === "unknown") || preferences) && (
        <section
          aria-label="Analytics preferences"
          className="fixed bottom-24 left-3 right-3 z-[45] max-w-md rounded-lg border border-ink/20 bg-white p-5 text-ink shadow-xl sm:bottom-6 sm:left-6 sm:right-auto"
        >
          <h2 className="font-display font-700">Your privacy choices</h2>
          <p className="mt-2 text-sm leading-relaxed">
            {enabled
              ? "Optional analytics help us understand which services people find useful. Your quote details and chat messages are excluded. You can use the site without analytics."
              : "Optional analytics are currently disabled. Quote forms and contact options work without tracking."}{" "}
            <a href="/privacy" className="underline">
              Privacy notice
            </a>
            .
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button
              className="btn-dark !px-4"
              onClick={() => choose("declined")}
            >
              {enabled ? "Decline analytics" : "Keep disabled"}
            </button>
            {enabled && (
              <button
                className="btn-primary !px-4"
                onClick={() => choose("accepted")}
              >
                Allow analytics
              </button>
            )}
          </div>
        </section>
      )}
    </>
  );
}
export function AnalyticsSettings() {
  return (
    <button
      type="button"
      className="btn-dark"
      onClick={() => window.dispatchEvent(new Event("zanich-preferences"))}
    >
      Manage analytics preferences
    </button>
  );
}
