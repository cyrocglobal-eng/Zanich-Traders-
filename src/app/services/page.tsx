import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Services } from "@/components/Services";
import { pageMetadata } from "@/lib/seo/metadata";
export const metadata = pageMetadata(
  "Printing & Branding Services Nairobi | Zanich",
  "Explore digital printing, large format printing, sublimation, heat transfer, vinyl cutting, print & cut, doming and promotional merchandise at Zanich.",
  "/services",
);
export default function ServicesPage() {
  return (
    <>
      <Navbar />
      <main id="main" className="pt-[72px]">
        <div className="container-x py-14">
          <p className="eyebrow">Our services</p>
          <h1 className="mt-3 font-display text-4xl font-800">
            Printing &amp; branding in Nairobi
          </h1>
        </div>
        <Services />
      </main>
      <Footer />
    </>
  );
}
