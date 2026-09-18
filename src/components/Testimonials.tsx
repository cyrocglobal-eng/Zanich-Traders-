import { Quote, Star } from "lucide-react";
import { site } from "@/content/site";
import { RevealGroup, RevealItem } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Testimonials() {
  const { testimonials } = site;
  return (
    <section className="press-section bg-white">
      <div className="container-x">
        <SectionHeading
          eyebrow={testimonials.eyebrow}
          title={testimonials.title}
          align="left"
          className="mb-14"
        />

        <RevealGroup className="grid gap-6 md:grid-cols-2" stagger={0.12}>
          {testimonials.items.map((t) => (
            <RevealItem
              key={t.author}
              className="relative flex flex-col border-t-2 border-ink bg-paper p-6 lg:p-8"
            >
              <figure className="flex h-full flex-col"><Quote className="h-9 w-9 text-brand-600" fill="currentColor" />
              <div className="mt-4 flex gap-1 text-brand">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4" fill="currentColor" />
                ))}
              </div>
              <blockquote className="mt-5 flex-1 text-lg leading-relaxed text-ink/75 text-pretty">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-4 border-t border-ink/8 pt-6">
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-ink font-display text-lg font-700 text-white">
                  {t.author.charAt(0)}
                </span>
                <div>
                  <p className="font-display text-base font-700 text-ink">{t.author}</p>
                  <p className="text-sm text-ink/70">{t.role}</p>
                </div>
              </figcaption></figure>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
