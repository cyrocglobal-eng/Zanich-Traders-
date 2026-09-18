import Image from "next/image";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";
import { galleryItems } from "@/content/gallery";
import styles from "./Hero.module.css";

const collection = [
  { id: "work-67-helicopter-services-polo", label: "01 / Branded apparel" },
  { id: "logo-mug", label: "02 / Everyday merchandise" },
  { id: "branded-notebooks", label: "03 / Personal touches" },
];

export function Hero() {
  const { hero } = site;
  return (
    <section id="top" className={styles.hero} aria-labelledby="hero-title">
      <div className="container-x">
        <div className={styles.layout}>
          <div className={styles.copy}>
            <p className={styles.eyebrow}><span aria-hidden="true" />Printing & branding · Nairobi</p>
            <h1 id="hero-title">{hero.headline.map(line => <span key={line}>{line}{" "}</span>)}</h1>
            <p className={styles.intro}>{hero.sub}</p>
            <div className={styles.actions}>
              <a href={hero.primaryCta.href} className="btn-primary">{hero.primaryCta.label}<ArrowRight size={18} aria-hidden="true" /></a>
              <a href={hero.secondaryCta.href} className={styles.secondary}>{hero.secondaryCta.label}<ArrowUpRight size={18} aria-hidden="true" /></a>
            </div>
            <p className={styles.note}>For your business. Your event. Your next idea.</p>
          </div>
          <div className={styles.collection} aria-label="Selected portfolio examples">
            <div className={styles.collectionHeading}><span>THE ZANICH COLLECTION</span><span>Selected work / 01—03</span></div>
            <div className={styles.images}>
              {collection.map((entry, index) => {
                const item = galleryItems.find(item => item.id === entry.id)!;
                const rendition = item.thumbnails[item.thumbnails.length - 1];
                return (
                  <figure key={item.id} className={index === 0 ? styles.featured : styles.supporting}>
                    <div className={styles.imageFrame}>
                      <Image src={rendition.src} alt={item.alt} width={rendition.width}
                        height={Math.round(rendition.width * item.height / item.width)}
                        unoptimized loading={index === 0 ? "eager" : "lazy"}
                        fetchPriority={index === 0 ? "high" : "auto"} />
                    </div>
                    <figcaption><span>{entry.label}</span><small>{item.kind}</small></figcaption>
                  </figure>
                );
              })}
            </div>
          </div>
        </div>
        <div className={styles.footer}><span>Good ideas deserve a great finish.</span><p>Print <i aria-hidden="true" /> Apparel <i aria-hidden="true" /> Merchandise <i aria-hidden="true" /> Signage</p></div>
      </div>
    </section>
  );
}
