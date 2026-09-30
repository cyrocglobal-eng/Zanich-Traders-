import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Contact } from "@/components/Contact";
import { FeedbackForm } from "@/components/communication/FeedbackForm";
import { quoteAvailable } from "@/server/config";
import { pageMetadata } from "@/lib/seo/metadata";
export const metadata = pageMetadata(
  "Contact Zanich General Traders | Nairobi Print Quotes",
  "Request a printing or branding quote. Visit JKM Building, Keekorok Road, Nairobi, or contact Zanich on +254 707 293 570.",
  "/contact",
);
export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="pt-[72px]">
        <div className="container-x py-12">
          <p className="eyebrow">Let’s talk about your project</p>
          <h1 className="mt-4 font-display text-4xl font-800">
            Contact Zanich General Traders
          </h1>
        </div>
        <Contact />
        <section className="container-x py-16">
          <details className="mx-auto max-w-2xl rounded-2xl border border-ink/20 p-6">
            <summary className="cursor-pointer font-display text-xl font-700">
              Already a client? Share feedback
            </summary>
            <div className="mt-6">
              <FeedbackForm canSubmit={quoteAvailable()} />
            </div>
          </details>
        </section>
      </main>
      <Footer />
    </>
  );
}
