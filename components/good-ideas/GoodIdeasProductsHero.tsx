"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import {
  GI_CATALOG_SECTION_ID,
  GI_EASE,
  GI_HERO_TOP_PAD,
  GI_PRODUCTS_CATEGORY_TONES,
  type GiProductsCategoryTone,
} from "@/lib/ui/goodideas-design";

const easeOut = GI_EASE;

const CATEGORY_CTA_BASE =
  "inline-flex min-h-[52px] w-full items-center justify-center rounded-full border px-5 text-center font-inter text-[11px] font-semibold uppercase tracking-[0.14em] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F14] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:min-h-[56px] sm:px-7 sm:text-[12px] md:text-[13px]";

const discoverCtaClass =
  "group inline-flex h-[56px] min-h-[56px] w-full max-w-md items-center justify-center rounded-full bg-[#E8ECF1] px-9 text-center font-inter text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0B0F14] shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F14] motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:h-[58px] md:min-h-[58px] md:px-10 md:text-[13px]";

function editorialHeadlineFromTitle(title: string): { line1: string; line2: string | null } {
  const raw = title.trim();
  if (!raw) return { line1: "", line2: null };
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  if (lines.length >= 3) {
    return { line1: lines[0] ?? "", line2: lines.slice(1).join(" ") };
  }
  if (lines.length === 2) {
    return { line1: lines[0] ?? "", line2: lines[1] ?? "" };
  }
  return { line1: lines[0] ?? "", line2: null };
}

function splitLineWithAccent(line: string, accent: string | undefined) {
  const a = accent?.trim();
  if (!line) return null;
  if (!a || !line.includes(a)) {
    return <span className="text-balance text-[#E8ECF1]">{line}</span>;
  }
  const i = line.indexOf(a);
  return (
    <span className="text-balance text-[#E8ECF1]">
      {line.slice(0, i)}
      <span className="text-[#3B82F6]">{a}</span>
      {line.slice(i + a.length)}
    </span>
  );
}

export type GoodIdeasProductsHeroCategory = {
  id: string;
  label: string;
  tone: GiProductsCategoryTone;
};

export type GoodIdeasProductsHeroProps = {
  title: string;
  subtitle: string;
  accentWord: string;
  categoryCtas: GoodIdeasProductsHeroCategory[];
  discoverCtaLabel: string;
  scrollHint: string;
  catalogSectionId?: string;
};

export default function GoodIdeasProductsHero({
  title,
  subtitle,
  accentWord,
  categoryCtas,
  discoverCtaLabel,
  scrollHint,
  catalogSectionId = GI_CATALOG_SECTION_ID,
}: GoodIdeasProductsHeroProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const off = reduceMotion;

  const { line1, line2 } = useMemo(() => editorialHeadlineFromTitle(title), [title]);

  const containerVariants = {
    hidden: off ? { opacity: 1 } : { opacity: 0 },
    show: {
      opacity: 1,
      transition: off
        ? { duration: 0 }
        : { staggerChildren: 0.08, delayChildren: 0.04, ease: easeOut },
    },
  };

  const itemVariants = {
    hidden: off ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: easeOut },
    },
  };

  const scrollToCatalog = () => {
    const el = document.getElementById(catalogSectionId);
    if (!el) return;
    el.scrollIntoView({ behavior: off ? "auto" : "smooth", block: "start" });
  };

  return (
    <section
      className="relative isolate flex min-h-[100svh] flex-col overflow-x-clip border-b border-white/[0.08] bg-[#0B0F14] text-[#E8ECF1]"
      aria-label={title}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,rgba(59,130,246,0.22),transparent_60%)]"
        aria-hidden
      />
      <motion.div
        className={`relative z-[1] mx-auto flex min-h-[100svh] w-full min-w-0 max-w-[1080px] flex-col px-[18px] pb-3 md:px-[28px] md:pb-4 lg:px-[48px] ${GI_HERO_TOP_PAD}`}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:56px_56px]"
          aria-hidden
        />
        <div className="flex min-h-0 flex-1 flex-col justify-between gap-3 md:gap-4">
          <div className="relative flex w-full max-w-[980px] flex-col items-center">
            <motion.h1
              variants={itemVariants}
              className="w-full text-center font-display text-[clamp(38px,9.5vw,56px)] font-semibold leading-[0.92] tracking-[-0.02em] md:text-[clamp(58px,6.5vw,102px)] md:leading-[0.88]"
            >
              {splitLineWithAccent(line1, accentWord)}
              {line2 ? (
                <span className="mt-0 block text-balance text-[rgba(232,236,241,0.55)]">
                  {line2}
                </span>
              ) : null}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-4 max-w-lg text-center font-inter text-[clamp(16px,3.8vw,18px)] leading-relaxed text-[rgba(232,236,241,0.72)] md:mt-5"
            >
              {subtitle}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-6 grid w-full max-w-2xl grid-cols-2 gap-3 sm:max-w-none sm:grid-cols-2 sm:gap-4 md:mt-7 lg:grid-cols-4"
            >
              {categoryCtas.map((cat) => {
                const tone = GI_PRODUCTS_CATEGORY_TONES[cat.tone];
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={scrollToCatalog}
                    className={`${CATEGORY_CTA_BASE} ${
                      "border" in tone && tone.border ? "border" : "border-transparent"
                    }`}
                    style={{
                      backgroundColor: tone.bg,
                      color: tone.fg,
                      ...("border" in tone && tone.border
                        ? { borderColor: tone.border }
                        : {}),
                    }}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </motion.div>

            <motion.div variants={itemVariants} className="mt-6 flex w-full justify-center md:mt-7">
              <button type="button" onClick={scrollToCatalog} className={discoverCtaClass}>
                {discoverCtaLabel}
              </button>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="flex shrink-0 flex-col items-center gap-1.5 pb-1 pt-2 text-center"
          >
            <div
              className="flex h-6 w-4 items-start justify-center rounded-full border border-white/25 pt-1"
              aria-hidden
            >
              <span className="block h-1.5 w-[3px] rounded-full bg-white/45" />
            </div>
            <p className="max-w-xs font-inter text-[11px] font-medium uppercase tracking-[0.2em] text-[rgba(232,236,241,0.5)] md:text-xs">
              {scrollHint}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
