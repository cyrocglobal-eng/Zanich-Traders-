import {
  Printer,
  Maximize,
  Palette,
  Flame,
  Scissors,
  Sticker,
  BadgeCheck,
  Gift,
  ArrowUpRight,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { site } from "@/content/site";
import { Reveal, RevealGroup, RevealItem } from "./Reveal";
import { SectionHeading } from "./SectionHeading";
import { services as catalogue } from "@/content/services";

const icons: LucideIcon[] = [
  Printer,
  Maximize,
  Palette,
  Flame,
  Scissors,
  Sticker,
  BadgeCheck,
  Gift,
];

export function Services() {
  const { services } = site;
  return (
    <section
      id="services"
      className="relative overflow-hidden bg-ink py-24 text-white lg:py-32"
    >
      <div className="pointer-events-none absolute -right-32 top-10 h-[440px] w-[440px] rounded-full bg-brand/15 blur-[130px]" />
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.04] mix-blend-overlay" />

      <div className="container-x relative">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-end">
          <SectionHeading
            eyebrow={services.eyebrow}
            title={services.title}
            dark
          />
          <Reveal delay={0.1}>
            <p className="max-w-xl text-base leading-relaxed text-white/60 text-pretty lg:pb-2">
              {services.intro}
            </p>
          </Reveal>
        </div>

        <RevealGroup className="mt-14 grid gap-px overflow-hidden rounded-3xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
          {services.items.map((item, i) => {
            const Icon = icons[i % icons.length];
            return (
              <RevealItem
                key={item.name}
                className="group relative flex flex-col bg-ink-soft p-7 transition-colors duration-300 hover:bg-ink-muted"
              >
                <div className="mb-6 flex items-center justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand/15 text-brand transition-colors duration-300 group-hover:bg-brand group-hover:text-white">
                    <Icon className="h-5.5 w-5.5" />
                  </span>
                  <ArrowUpRight className="h-5 w-5 text-white/25 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
                </div>
                <h3 className="font-display text-lg font-700 leading-snug text-white">
                  <a
                    className="after:absolute after:inset-0 focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
                    href={`/services/${catalogue[i].slug}`}
                  >
                    {item.name}
                  </a>
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-white/55">
                  {item.desc}
                </p>
              </RevealItem>
            );
          })}
        </RevealGroup>
      </div>
    </section>
  );
}
