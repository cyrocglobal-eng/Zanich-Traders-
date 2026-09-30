"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ChevronDown, Menu, X } from "lucide-react";
import { site } from "@/content/site";
import { services } from "@/content/services";
import { Logo } from "./Logo";
import styles from "./Navbar.module.css";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const toggle = useRef<HTMLButtonElement>(null);
  const serviceToggle = useRef<HTMLButtonElement>(null);
  const mobileServiceToggle = useRef<HTMLButtonElement>(null);
  function closeAll() { setOpen(false); setServicesOpen(false); }

  useEffect(() => {
    function keydown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      if (servicesOpen) {
        setServicesOpen(false);
        (open ? mobileServiceToggle : serviceToggle).current?.focus();
      } else if (open) { setOpen(false); toggle.current?.focus(); }
    }
    function outside(event: PointerEvent) {
      if (!header.current?.contains(event.target as Node)) { setOpen(false); setServicesOpen(false); }
    }
    const breakpoint = window.matchMedia("(min-width: 1024px)");
    function resize() { setOpen(false); setServicesOpen(false); }
    document.addEventListener("keydown", keydown);
    document.addEventListener("pointerdown", outside);
    breakpoint.addEventListener("change", resize);
    return () => {
      document.removeEventListener("keydown", keydown);
      document.removeEventListener("pointerdown", outside);
      breakpoint.removeEventListener("change", resize);
    };
  }, [open, servicesOpen]);

  const serviceLinks = <>
    <p className={styles.panelLabel}>Find the right finish</p>
    <ul className={styles.serviceGrid}>{services.map(service => <li key={service.slug}>
      <Link href={`/services/${service.slug}`} onClick={closeAll}>{service.name}<ArrowUpRight size={15} aria-hidden="true" /></Link>
    </li>)}</ul>
    <Link href="/services" className={styles.allServices} onClick={closeAll}>Explore all services <ArrowUpRight size={15} aria-hidden="true" /></Link>
  </>;

  return (
    <header ref={header} className={styles.header} onBlur={event => {
      if (!event.currentTarget.contains(event.relatedTarget as Node | null)) closeAll();
    }}>
      <nav className={styles.bar} aria-label="Primary">
        <Link href="/" className={styles.logo} aria-label={`${site.name} home`} onClick={closeAll}><Logo /></Link>
        <ul className={styles.desktop}>
          <li><Link href="/#about">About</Link></li>
          <li className={styles.serviceItem}>
            <button type="button" ref={serviceToggle} aria-expanded={servicesOpen} aria-controls="desktop-services" onClick={() => setServicesOpen(value => !value)}>Services<ChevronDown size={14} aria-hidden="true" /></button>
            {servicesOpen && !open && <div id="desktop-services" className={styles.servicePanel}>{serviceLinks}</div>}
          </li>
          <li><Link href="/#portfolio">Work</Link></li>
          <li><Link href="/#contact">Contact</Link></li>
        </ul>
        <div className={styles.controls}>
          <Link href="/contact#contact" className={styles.quote} onClick={closeAll}><span className={styles.desktopQuote}>Get a Quote</span><span className={styles.mobileQuote}>Quote</span><ArrowUpRight size={16} aria-hidden="true" /></Link>
          <button ref={toggle} type="button" className={styles.menuToggle} aria-expanded={open} aria-controls="mobile-navigation" aria-label={open ? "Close menu" : "Open menu"} onClick={() => { setOpen(value => !value); setServicesOpen(false); }}>{open ? <X size={20} /> : <Menu size={20} />}</button>
        </div>
      </nav>
      {open && <nav id="mobile-navigation" aria-label="Mobile" className={styles.mobilePanel}>
        <Link href="/#about" onClick={closeAll}>About Zanich</Link>
        <button ref={mobileServiceToggle} type="button" aria-expanded={servicesOpen} aria-controls="mobile-services" onClick={() => setServicesOpen(value => !value)}>Services<ChevronDown size={18} aria-hidden="true" /></button>
        {servicesOpen && <div id="mobile-services" className={styles.mobileServices}>{serviceLinks}</div>}
        <Link href="/#portfolio" onClick={closeAll}>Our work</Link>
        <Link href="/#why" onClick={closeAll}>Why Zanich</Link>
        <Link href="/#clients" onClick={closeAll}>Our clients</Link>
        <Link href="/#contact" onClick={closeAll}>Contact</Link>
      </nav>}
    </header>
  );
}
