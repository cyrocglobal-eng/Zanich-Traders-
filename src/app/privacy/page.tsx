import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { AnalyticsSettings } from "@/components/analytics/AnalyticsProvider";
import { pageMetadata } from "@/lib/seo/metadata";
import { site } from "@/content/site";
export const metadata = pageMetadata(
  "Privacy & Contact Preferences | Zanich General Traders",
  "How Zanich handles quote requests, private feedback, AI support conversations and optional analytics. Manage your contact and privacy preferences.",
  "/privacy",
);
export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="container-x service-page">
        <article className="mx-auto max-w-3xl space-y-8 text-base leading-relaxed">
          <div>
            <p className="eyebrow">Zanich General Traders</p>
            <h1 className="mt-4 font-display text-4xl font-800">
              Privacy &amp; your inquiries
            </h1>
          </div>
          <section>
            <h2 className="font-display text-2xl font-700">
              When you contact us
            </h2>
            <p className="mt-3">
              We use the name, contact details, project specifications and
              feedback you choose to provide to respond to your inquiry and
              manage your project. Only provide information relevant to your
              request. Please do not include passwords, payment card details or
              identity documents.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-700">
              Quote requests and feedback
            </h2>
            <p className="mt-3">
              When website submission is available, your request is stored and a
              notification is queued for our team. A saved reference confirms
              receipt by the website; it does not confirm a price, order,
              deadline or that a team member has read the message. Your feedback
              is private and is not automatically published as a testimonial.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-700">
              WhatsApp and email
            </h2>
            <p className="mt-3">
              Choosing WhatsApp opens a prefilled message containing the details
              you reviewed. You choose whether to send it. WhatsApp and your
              email provider handle those conversations under their own
              policies. Website notifications use an email delivery provider to
              reach the Zanich team.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-700">AI support</h2>
            <p className="mt-3">
              When enabled, the AI assistant sends the recent conversation to
              OpenAI to prepare a response. The integration requests that
              responses are not stored through the API; provider security and
              abuse-prevention processing may still apply. Chat messages are
              kept in the current page session and are not saved to our inquiry
              records unless you choose to submit a brief or feedback. Prices,
              artwork suitability and turnaround are confirmed by our team.
            </p>
          </section>
          <section>
            <h2 className="font-display text-2xl font-700">
              Optional analytics
            </h2>
            <p className="mt-3">
              Analytics is off until you allow it. When enabled, Google
              Analytics receives limited events such as the page viewed,
              selected service, and contact button used. We exclude quote text,
              names, phone numbers, email addresses and chat transcripts from
              these events. Your analytics choice is saved on this browser.
              Declining does not prevent you from contacting us.
            </p>
            <div className="mt-5">
              <AnalyticsSettings />
            </div>
          </section>
          <section>
            <h2 className="font-display text-2xl font-700">
              Access and questions
            </h2>
            <p className="mt-3">
              Access to inquiries is restricted to people and service providers
              involved in handling them. To ask about your information, request
              a correction or deletion, or discuss this notice, email{" "}
              <a
                className="break-all underline"
                href={`mailto:${site.contact.email}`}
              >
                {site.contact.email}
              </a>{" "}
              or contact us at Ground Floor, JKM Building, Keekorok Road,
              Nairobi.
            </p>
          </section>
        </article>
      </main>
      <Footer />
    </>
  );
}
