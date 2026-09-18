"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { site } from "@/content/site";
import { Logo } from "./Logo";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const toggle = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    const close = (event: KeyboardEvent) => {
      if (open && event.key === "Escape") {
        setOpen(false);
        toggle.current?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-ink/10 bg-white/95 text-ink backdrop-blur-xl">
      <nav
        className="container-x flex h-[72px] items-center justify-between gap-4"
        aria-label="Primary"
      >
        <Link href="/" className="shrink-0" aria-label={`${site.name} home`}>
          <Logo />
        </Link>
        <ul className="hidden items-center gap-1 lg:flex">
          {site.nav.map((item) => (
            <li key={item.href}>
              <a
                href={`/${item.href}`}
                className="rounded px-3 py-3 text-sm font-medium text-ink/80 hover:text-brand"
              >
                {item.label}
              </a>
            </li>
          ))}
        </ul>
        <a
          href="/contact#contact"
          className="btn-primary hidden sm:inline-flex"
        >
          Get a Free Quote
        </a>
        <button
          ref={toggle}
          type="button"
          onClick={() => setOpen(!open)}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded border border-ink/20 lg:hidden"
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X /> : <Menu />}
        </button>
      </nav>
      {open && (
        <nav
          id="mobile-navigation"
          aria-label="Mobile"
          className="max-h-[70dvh] overflow-y-auto border-t border-ink/10 bg-white p-4 lg:hidden"
        >
          <ul>
            {site.nav.map((item) => (
              <li key={item.href}>
                <a
                  className="block rounded px-4 py-3 text-base hover:bg-ink/5"
                  href={`/${item.href}`}
                  onClick={() => setOpen(false)}
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="/contact#contact"
            onClick={() => setOpen(false)}
            className="btn-primary mt-3 w-full"
          >
            Get a Free Quote
          </a>
        </nav>
      )}
    </header>
  );
}
