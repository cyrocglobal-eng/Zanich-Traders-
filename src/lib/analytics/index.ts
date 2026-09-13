type EventName =
  | "page_view"
  | "quote_start"
  | "generate_lead"
  | "whatsapp_click"
  | "phone_click"
  | "agent_handoff"
  | "feedback_submit";
type Properties = {
  service?: string;
  placement?: string;
  channel?: string;
  page_path?: string;
};
declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
    zanichAnalyticsConsent?: boolean;
  }
}

export function track(event: EventName, properties: Properties = {}) {
  if (
    typeof window === "undefined" ||
    !window.zanichAnalyticsConsent ||
    !process.env.NEXT_PUBLIC_GTM_ID ||
    process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "true"
  )
    return;
  // Only this allowlist reaches analytics. Never pass hrefs, form values or transcripts.
  const permitted = Object.fromEntries(
    Object.entries(properties).filter(([key]) =>
      ["service", "placement", "channel", "page_path"].includes(key),
    ),
  );
  (window.dataLayer ??= []).push({ event, ...permitted });
}
