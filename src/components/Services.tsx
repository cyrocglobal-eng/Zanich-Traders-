import { ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";
import { SectionHeading } from "./SectionHeading";
import { services as catalogue } from "@/content/services";

export function Services() {
  const { services } = site;
  return (
    <section id="services" className="press-section bg-ink text-white">
      <div className="container-x">
        <div className="grid gap-6 lg:grid-cols-2 lg:items-end lg:gap-16">
          <SectionHeading eyebrow={services.eyebrow} title={services.title} dark />
          <p className="max-w-xl leading-relaxed text-white/75">{services.intro}</p>
        </div>
        <div className="press-services">
          {services.items.map((item, i) => (
            <a key={item.name} href={`/services/${catalogue[i].slug}`} className="press-service">
              <span className="press-service-number">{String(i + 1).padStart(2, "0")}</span>
              <div><h3>{item.name}</h3><p>{item.desc}</p></div>
              <ArrowUpRight aria-hidden="true" className="h-5 w-5" />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
