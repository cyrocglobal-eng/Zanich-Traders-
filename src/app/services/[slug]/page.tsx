import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { services, findService } from "@/content/services";
import { business } from "@/content/business";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Contact } from "@/components/Contact";
import { JsonLd } from "@/components/seo/JsonLd";
import { serviceMetadata } from "@/lib/seo/metadata";
import { serviceSchema, breadcrumbSchema } from "@/lib/seo/schema";
import { whatsappLink } from "@/lib/whatsapp";

export const dynamicParams = false;
export function generateStaticParams() {
  return services.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const service = findService((await params).slug);
  return service ? serviceMetadata(service) : {};
}
export default async function ServicePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const service = findService((await params).slug);
  if (!service) notFound();
  return (
    <>
      <Navbar />
      <main id="main">
        <article className="container-x service-page">
          <nav
            aria-label="Breadcrumb"
            className="mb-8 flex flex-wrap gap-2 text-sm text-ink/70"
          >
            <Link href="/" className="underline">
              Home
            </Link>
            <span>/</span>
            <Link href="/services" className="underline">
              Services
            </Link>
            <span>/</span>
            <span aria-current="page">{service.name}</span>
          </nav>
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <p className="eyebrow">Zanich General Traders · Nairobi</p>
              <h1 className="mt-4 font-display text-4xl font-700 leading-tight tracking-tightest sm:text-5xl">
                {service.name}
              </h1>
              <p className="mt-6 text-xl leading-relaxed text-ink/75">
                {service.desc}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#contact" className="btn-primary">
                  Get a Free Quote
                </a>
                <a
                  href={whatsappLink(
                    `Hello Zanich, I'd like to discuss ${service.name.toLowerCase()}.`,
                  )}
                  className="btn-dark"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-placement="service-hero"
                >
                  Ask on WhatsApp
                </a>
              </div>
            </div>
            <Image
              src={`/images/${service.image}`}
              width={900}
              height={650}
              alt={`${service.name} examples from the Zanich portfolio`}
              className="aspect-[4/3] w-full  object-cover"
              sizes="(max-width:1024px) 100vw, 45vw"
              loading="eager"
              fetchPriority="high"
            />
          </div>
          <div className="mt-16 grid gap-10 border-t border-ink/15 pt-10 md:grid-cols-2">
            <section>
              <h2 className="font-display text-2xl font-700">
                What to include in your brief
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink/75">
                {service.preparation}
              </p>
            </section>
            <section>
              <h2 className="font-display text-2xl font-700">
                Artwork &amp; design support
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink/75">
                {service.artwork}
              </p>
            </section>
          </div>
          <section className="mt-10 rounded bg-ink p-7 text-white">
            <h2 className="font-display text-xl font-700">
              Working to a deadline?
            </h2>
            <p className="mt-3 text-base leading-relaxed text-white/80">
              {business.fastTrack} Share your brief and requested date so we can
              assess your options.
            </p>
          </section>
          <nav aria-label="Other services" className="mt-10">
            <h2 className="font-display text-xl font-700">
              Explore our other services
            </h2>
            <ul className="mt-4 flex flex-wrap gap-3">
              {services
                .filter((item) => item.slug !== service.slug)
                .map((item) => (
                  <li key={item.slug}>
                    <a
                      href={`/services/${item.slug}`}
                      className="inline-block rounded border border-ink/20 px-4 py-3 text-sm hover:border-brand"
                    >
                      {item.name}
                    </a>
                  </li>
                ))}
            </ul>
          </nav>
        </article>
        <Contact initialService={service.slug} />
        <JsonLd data={serviceSchema(service)} />
        <JsonLd data={breadcrumbSchema(service)} />
      </main>
      <Footer />
    </>
  );
}
