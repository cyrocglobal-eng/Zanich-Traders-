import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { JsonLd } from "@/components/seo/JsonLd";
import { localBusinessSchema } from "@/lib/seo/schema";
import { homeTitle, homeDescription, pageMetadata } from "@/lib/seo/metadata";
import { ContactDock } from "@/components/communication/ContactDock";
import { AnalyticsProvider } from "@/components/analytics/AnalyticsProvider";
import { agentAvailable, quoteAvailable } from "@/server/config";

const inter = localFont({
  src: "../../node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2",
  variable: "--font-sans",
  weight: "100 900",
  display: "swap",
});
const sora = localFont({
  src: "../../node_modules/@fontsource-variable/sora/files/sora-latin-wght-normal.woff2",
  variable: "--font-display",
  weight: "100 800",
  display: "swap",
});
export const metadata: Metadata = {
  ...pageMetadata(homeTitle, homeDescription, "/"),
  verification: process.env.GOOGLE_SITE_VERIFICATION
    ? { google: process.env.GOOGLE_SITE_VERIFICATION }
    : undefined,
  icons: { icon: [{ url: "/favicon.svg", type: "image/svg+xml" }] },
};
export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  width: "device-width",
  initialScale: 1,
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-KE" className={`${inter.variable} ${sora.variable}`}>
      <body className="bg-paper font-sans text-ink antialiased">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-sm focus:font-semibold focus:text-white"
        >
          Skip to content
        </a>
        {children}
        <JsonLd data={localBusinessSchema()} />
        <ContactDock
          agentEnabled={agentAvailable()}
          canSubmit={quoteAvailable()}
        />
        <AnalyticsProvider />
      </body>
    </html>
  );
}
