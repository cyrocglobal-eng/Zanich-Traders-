import { site } from "@/content/site";
import { quoteAvailable } from "@/server/config";
import { SectionHeading } from "./SectionHeading";
import { ProductGallery } from "./gallery/ProductGallery";

export function Portfolio() {
  const { portfolio } = site;
  return (
    <section id="portfolio" className="relative bg-white py-24 lg:py-32">
      <div className="container-x">
        <SectionHeading eyebrow={portfolio.eyebrow} title={portfolio.title} intro={portfolio.intro} />
        <ProductGallery canSubmit={quoteAvailable()} />
        <p className="mt-8 text-center text-sm text-ink/60">
          A selection from our portfolio. Full case studies available on request.
        </p>
      </div>
    </section>
  );
}
