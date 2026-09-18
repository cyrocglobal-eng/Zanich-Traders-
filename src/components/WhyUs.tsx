import Image from "next/image";
import { Boxes, Cpu, Zap, TrendingUp } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { site } from "@/content/site";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const icons: LucideIcon[] = [Boxes, Cpu, Zap, TrendingUp];

export function WhyUs() {
  const { why } = site;
  return (
    <section id="why" className="press-section bg-paper">
      <div className="container-x grid gap-14 lg:grid-cols-2 lg:gap-20">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <SectionHeading eyebrow={why.eyebrow} title={why.title} />

          <Reveal delay={0.15}>
            <div className="mt-8 overflow-hidden border border-ink/10">
              <Image
                src="/images/printshop.jpg"
                alt="Cutting-edge large-format printing technology at Zanich General Traders"
                width={1200}
                height={800}
                sizes="(max-width: 1024px) 100vw, 48vw"
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
        </div>

        <RevealGroup className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-1">
          {why.reasons.map((reason, i) => {
            const Icon = icons[i % icons.length];
            return (
              <RevealItem
                key={reason.title}
                className="relative grid grid-cols-[40px_1fr] gap-x-5 border-t border-ink/20 py-6"
              >
                <span className="col-start-1 row-span-3 text-sm font-semibold text-brand-600">
                  0{i + 1}
                </span>
                <span className="hidden">
                  <Icon className="h-5.5 w-5.5" />
                </span>
                <h3 className="col-start-2 font-display text-xl font-600 text-ink">{reason.title}</h3>
                <p className="col-start-2 mt-2 text-sm leading-relaxed text-ink/75">{reason.desc}</p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
