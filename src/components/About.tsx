import Image from "next/image";
import { Check } from "lucide-react";
import { site } from "@/content/site";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function About() {
  const { about } = site;
  return (
    <section id="about" className="press-section bg-paper">
      <div className="container-x grid gap-14 lg:grid-cols-2 lg:items-center lg:gap-20">
        {/* Image */}
        <Reveal className="relative order-last lg:order-first">
          <div className="relative overflow-hidden border border-ink/10">
            <Image
              src="/images/about-studio.jpg"
              alt="Inside the Zanich General Traders branding and print studio in Nairobi"
              width={1200}
              height={900}
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="h-full w-full object-cover"
            />
          </div>
          {/* Badge */}
          <div className="border-t border-ink/20 py-4 text-ink">
            <p className="font-display text-base font-600 leading-none">Nairobi</p>
            <p className="mt-1 text-xs uppercase tracking-widest text-ink/70">Keekorok Road</p>
          </div>
        </Reveal>

        {/* Copy */}
        <div>
          <SectionHeading eyebrow={about.eyebrow} title={about.title} />
          <div className="mt-6 space-y-4">
            {about.body.map((p) => (
              <Reveal key={p.slice(0, 24)} delay={0.05}>
                <p className="text-base leading-relaxed text-ink/75 text-pretty">{p}</p>
              </Reveal>
            ))}
          </div>

          <RevealGroup className="mt-9">
            {about.pillars.map((pillar) => (
              <RevealItem
                key={pillar.title}
                className="flex gap-4 border-t border-ink/20 py-5"
              >
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center text-brand-600">
                  <Check className="h-4.5 w-4.5" strokeWidth={3} />
                </span>
                <div>
                  <h3 className="font-display text-base font-700 text-ink">{pillar.title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink/75">{pillar.desc}</p>
                </div>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
