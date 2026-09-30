import { ArrowUpRight } from "lucide-react";
import { site } from "@/content/site";

export function TaglineStrip() {
  return (
    <div className="bg-brand-600 text-white">
      <div className="container-x flex flex-wrap items-center justify-between gap-4 py-5">
        <p className="font-display text-lg font-600 tracking-tight sm:text-2xl">{site.tagline}</p>
        <a href="#services" className="inline-flex min-h-11 items-center gap-3 text-sm font-semibold underline underline-offset-4">Printing · Branding · Promotional Products<ArrowUpRight aria-hidden="true" className="h-5 w-5 shrink-0" /></a>
      </div>
    </div>
  );
}
