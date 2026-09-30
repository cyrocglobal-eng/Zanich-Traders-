import { site } from "@/content/site";

export function whatsappLink(
  message = "Hello Zanich, I'd like to discuss a printing or branding project.",
) {
  const number = site.contact.phone.replace(/\D/g, "");
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}
