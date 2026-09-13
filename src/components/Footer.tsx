import { Mail, Phone, MapPin } from "lucide-react";
import { site } from "@/content/site";
import { Logo } from "./Logo";

export function Footer() {
  const { footer, contact, nav } = site;
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-white/10 bg-ink text-white">
      <div className="container-x py-16">
        <div className="grid gap-12 lg:grid-cols-[1.6fr_1fr_1fr] lg:gap-8">
          <div className="max-w-sm">
            <Logo variant="light" />
            <p className="mt-5 text-sm leading-relaxed text-white/55">
              {footer.blurb}
            </p>
            <p className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-brand">
              {site.tagline}
            </p>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Explore
            </h3>
            <ul className="mt-5 space-y-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <a
                    href={`/${item.href}`}
                    className="text-sm text-white/65 transition-colors hover:text-white"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-white/40">
              Get in touch
            </h3>
            <ul className="mt-5 space-y-4 text-sm">
              <li>
                <a
                  href={contact.phoneHref}
                  className="flex items-start gap-3 text-white/65 transition-colors hover:text-white"
                >
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  {contact.phone}
                </a>
              </li>
              <li>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-start gap-3 break-all text-white/65 transition-colors hover:text-white"
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                  {contact.email}
                </a>
              </li>
              <li className="flex items-start gap-3 text-white/65">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" />
                <span>
                  {contact.address.line1},<br />
                  {contact.address.line2}, {contact.address.city}
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/40">
            &copy; {year} {footer.legal}
          </p>
          <a href="/privacy" className="text-sm text-white/75 underline">
            Privacy &amp; contact preferences
          </a>
        </div>
      </div>
    </footer>
  );
}
