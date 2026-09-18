import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  dark = false,
  className = "",
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  align?: "left" | "center";
  dark?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`${align === "center" ? "mx-auto max-w-2xl text-center" : "max-w-2xl"} ${className}`}
    >
      <Reveal>
        <span className="eyebrow">
          <span className="h-px w-6 bg-brand" />
          {eyebrow}
        </span>
      </Reveal>
      <Reveal delay={0.05}>
        <h2
          className={`mt-4 font-display text-3xl font-700 leading-[1.12] tracking-tightest text-balance sm:text-4xl lg:text-[2.7rem] ${
            dark ? "text-white" : "text-ink"
          }`}
        >
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.1}>
          <p
            className={`mt-5 text-lg leading-relaxed text-pretty ${
              dark ? "text-white/75" : "text-ink/75"
            }`}
          >
            {intro}
          </p>
        </Reveal>
      )}
    </div>
  );
}
