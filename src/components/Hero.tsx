"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { site } from "@/content/site";
import { business } from "@/content/business";

export function Hero() {
  const { hero } = site;

  const ease = [0.16, 1, 0.3, 1] as const;

  return (
    <section id="top" className="relative overflow-hidden bg-ink text-white">
      {/* Ambient glows */}
      <div className="pointer-events-none absolute -left-40 top-0 h-[520px] w-[520px] rounded-full bg-brand/25 blur-[130px]" />
      <div className="pointer-events-none absolute right-0 top-1/3 h-[420px] w-[420px] rounded-full bg-brand/10 blur-[120px]" />
      <div className="pointer-events-none absolute inset-0 bg-grain opacity-[0.04] mix-blend-overlay" />
      {/* Grid lines */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "72px 72px",
        }}
      />

      <div className="container-x relative grid gap-14 pb-20 pt-32 md:pt-40 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:pb-28">
        {/* Copy */}
        <div>
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-white/80 backdrop-blur"
          >
            <Sparkles className="h-3.5 w-3.5 text-brand" />
            {hero.eyebrow}
          </motion.div>

          <h1 className="font-display text-[2.6rem] font-800 leading-[1.02] tracking-tightest text-balance sm:text-6xl lg:text-[4.4rem]">
            {hero.headline.map((line, i) => (
              <motion.span
                key={line}
                className="block"
                initial={false}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.1 + i * 0.12, ease }}
              >
                {i === hero.headline.length - 1 ? (
                  <span className="relative">
                    {line}
                    <motion.span
                      className="absolute -bottom-1.5 left-0 h-[6px] w-full origin-left rounded-full bg-brand"
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.8, delay: 0.65, ease }}
                    />
                  </span>
                ) : (
                  line
                )}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4, ease }}
            className="mt-7 max-w-xl text-lg leading-relaxed text-white/70 text-pretty"
          >
            {hero.sub}
          </motion.p>

          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.55, ease }}
            className="mt-9 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <a href={hero.primaryCta.href} className="btn-primary group">
              {hero.primaryCta.label}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
            <a href={hero.secondaryCta.href} className="btn-ghost">
              {hero.secondaryCta.label}
            </a>
          </motion.div>

          {/* Stats */}
          <motion.dl
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.7, ease }}
            className="mt-12 grid max-w-lg grid-cols-3 gap-6 border-t border-white/10 pt-8"
          >
            {hero.stats.map((s) => (
              <div key={s.label}>
                <dt className="font-display text-3xl font-800 tracking-tight text-white lg:text-4xl">
                  {s.value}
                </dt>
                <dd className="mt-1 text-xs leading-snug text-white/55">
                  {s.label}
                </dd>
              </div>
            ))}
          </motion.dl>
          <p className="mt-4 max-w-lg text-sm leading-relaxed text-white/70">
            *{business.fastTrack}
          </p>
        </div>

        {/* Visual */}
        <motion.div
          initial={false}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3, ease }}
          className="relative"
        >
          <div className="relative overflow-hidden rounded-[26px] border border-white/10 shadow-2xl shadow-black/60">
            <Image
              src="/images/hero-merch.jpg"
              alt="Branded corporate promotional merchandise — mug, notebook, bottle, apparel and lanyard by Zanich General Traders"
              width={1408}
              height={768}
              loading="eager"
              fetchPriority="high"
              sizes="(max-width: 1024px) 100vw, 48vw"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent" />
          </div>

          {/* Floating tagline card */}
          <motion.div
            initial={false}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease }}
            className="absolute -bottom-5 -left-3 flex items-center gap-3 rounded-2xl border border-white/10 bg-ink-soft/90 px-5 py-4 shadow-xl backdrop-blur-md sm:-left-6"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-lg font-800 text-white">
              Z
            </span>
            <div className="leading-tight">
              <p className="text-sm font-semibold text-white">{site.tagline}</p>
              <p className="text-xs text-white/55">Nairobi, Kenya</p>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* bottom fade into next section */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
    </section>
  );
}
