import Image from "next/image";
import { ArrowRight, ArrowDownRight } from "lucide-react";
import { site } from "@/content/site";
import { business } from "@/content/business";

export function Hero() {
  const { hero } = site;
  return (
    <section id="top" className="press-hero">
      <div className="container-x">
        <div className="press-hero-label"><span>{hero.eyebrow}</span><span>Nairobi, Kenya</span></div>
        <div className="press-hero-grid">
          <div>
            <h1>{hero.headline.map((line, i) => <span key={line} className={i === hero.headline.length - 1 ? "text-brand-600" : ""}>{line} </span>)}</h1>
            <p className="press-hero-copy">{hero.sub}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={hero.primaryCta.href} className="btn-primary">{hero.primaryCta.label}<ArrowRight aria-hidden="true" className="h-4 w-4" /></a>
              <a href={hero.secondaryCta.href} className="btn-dark">{hero.secondaryCta.label}<ArrowDownRight aria-hidden="true" className="h-4 w-4" /></a>
            </div>
          </div>
          <figure className="press-hero-figure">
            <div className="press-hero-image"><Image src="/images/hero-merch.jpg" alt="Branded corporate promotional merchandise — mug, notebook, bottle, apparel and lanyard by Zanich General Traders" width={1408} height={768} loading="eager" fetchPriority="high" sizes="(max-width: 1023px) 100vw, 50vw" className="h-full w-full object-contain" /></div>
            <figcaption><span>Print. Brand. Make an impression.</span><span>01 / Merchandise</span></figcaption>
          </figure>
        </div>
        <div className="press-hero-bottom">
          <dl>{hero.stats.map(s => <div key={s.label}><dt>{s.value}</dt><dd>{s.label}</dd></div>)}</dl>
          <p>*{business.fastTrack}</p>
        </div>
      </div>
    </section>
  );
}
