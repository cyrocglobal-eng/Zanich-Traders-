import { Mail, Phone, MapPin, MessageCircle, Clock } from "lucide-react";
import { site } from "@/content/site";
import { QuoteForm } from "./quote/QuoteForm";
import { quoteAvailable } from "@/server/config";
import { whatsappLink } from "@/lib/whatsapp";

export function Contact({ initialService }: { initialService?: string }) {
  const { contact, cta } = site;
  const contacts = [
    {
      Icon: Phone,
      label: "Call us",
      value: contact.phone,
      href: contact.phoneHref,
    },
    {
      Icon: MessageCircle,
      label: "WhatsApp",
      value: "Message us instantly",
      href: whatsappLink(),
    },
    {
      Icon: Mail,
      label: "Email",
      value: contact.email,
      href: `mailto:${contact.email}`,
    },
    {
      Icon: MapPin,
      label: "Head office",
      value: `${contact.address.line1}, ${contact.address.line2}, ${contact.address.city}`,
      href: "https://www.google.com/maps/search/?api=1&query=JKM%20Building%20Keekorok%20Road%20Nairobi%20Kenya",
    },
    { Icon: Clock, label: "Hours", value: contact.hours, href: undefined },
  ];
  return (
    <section
      id="contact"
      className="press-section bg-ink text-white"
    >
      <div className="container-x relative grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div>
          <span className="eyebrow">Contact</span>
          <h2 className="mt-4 font-display text-3xl font-800 leading-tight sm:text-4xl">
            {cta.title}
          </h2>
          <p className="mt-5 max-w-md text-lg leading-relaxed text-white/75">
            {cta.sub}
          </p>
          <ul className="mt-10 space-y-3">
            {contacts.map(({ Icon, label, value, href }) => (
              <li key={label}>
                {href ? (
                  <a
                    href={href}
                    className="contact-row"
                    target={href.startsWith("https:") ? "_blank" : undefined}
                    rel={
                      href.startsWith("https:")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    data-placement="contact"
                  >
                    <Icon
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 text-brand"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm text-white/75">
                        {label}
                      </span>
                      <span className="break-words text-base">{value}</span>
                    </span>
                  </a>
                ) : (
                  <div className="contact-row">
                    <Icon
                      aria-hidden="true"
                      className="h-5 w-5 shrink-0 text-brand"
                    />
                    <span className="min-w-0">
                      <span className="block text-sm text-white/75">
                        {label}
                      </span>
                      {value}
                    </span>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="min-w-0 self-start border-t-4 border-brand bg-white p-5 text-ink sm:p-8">
          <QuoteForm
            initialService={initialService}
            canSubmit={quoteAvailable()}
          />
        </div>
      </div>
    </section>
  );
}
