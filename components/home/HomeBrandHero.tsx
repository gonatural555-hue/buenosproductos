"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useMemo } from "react";
import type { Locale } from "@/lib/i18n/config";
import { GN_EASE_PREMIUM } from "@/lib/ui/gonatural-design";
import HeroCompassCursor from "@/components/home/HeroCompassCursor";
import { useTranslations } from "@/components/i18n/LocaleProvider";

export type HomeBrandHeroProps = {
  locale: Locale;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

const easeOut = GN_EASE_PREMIUM;

const primaryCtaClass =
  "group inline-flex h-[56px] min-h-[56px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#1F3527_0%,#2E4A36_50%,#3E654B_100%)] px-9 text-center font-inter text-[12px] font-semibold uppercase tracking-[0.14em] text-[#F4EBDD] shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_12px_44px_rgba(46,74,54,0.14)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.26),0_16px_52px_rgba(46,74,54,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4EBDD] motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:h-[58px] md:min-h-[58px] md:px-10 md:text-[13px]";

const secondaryCtaClass =
  "group inline-flex h-[56px] min-h-[56px] items-center justify-center rounded-full border-[1.5px] border-[#2E4A36] bg-transparent px-9 text-center font-inter text-[12px] font-semibold uppercase tracking-[0.14em] text-[#2E4A36] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#2E4A36] hover:text-[#F4EBDD] hover:shadow-[0_12px_40px_-18px_rgba(46,74,54,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4EBDD] motion-reduce:transition-none md:h-[58px] md:min-h-[58px] md:px-10 md:text-[13px]";

/** Convierte títulos en 3 líneas (p. ej. EN) en 2 bloques editoriales sin tocar JSON. */
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

export default function HomeBrandHero({
  locale,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
}: HomeBrandHeroProps) {
  const t = useTranslations();
  const reduceMotion = useReducedMotion();
  const off = reduceMotion ?? false;

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

  const heroTopPad =
    "pt-[calc(env(safe-area-inset-top,0px)+1rem+14rem+8px)] sm:pt-[calc(env(safe-area-inset-top,0px)+1rem+14rem+10px)] md:pt-[calc(env(safe-area-inset-top,0px)+1.25rem+14.25rem+12px)]";

  return (
    <section
      className="relative isolate flex w-full flex-col overflow-x-clip bg-[#F4EBDD]"
      aria-label="Hero"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(217,164,65,0.10),transparent_46%)]"
        aria-hidden
      />
      <motion.div
        className={`relative z-[1] mx-auto flex w-full min-w-0 max-w-[1080px] flex-col items-center px-[18px] pb-10 md:px-[28px] md:pb-14 lg:px-[48px] lg:pb-16 ${heroTopPad}`}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="flex w-full max-w-[980px] flex-col items-center">
          <motion.h1 variants={itemVariants} className="gn-hero-editorial-two-line w-full">
            <span className="gn-hero-editorial-line-forest text-balance">{line1}</span>
            {line2 ? (
              <span className="gn-hero-editorial-line-mustard text-balance">{line2}</span>
            ) : null}
          </motion.h1>

          <motion.p variants={itemVariants} className="gn-hero-subtitle mt-6 text-center">
            {subtitle}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-9 flex w-full max-w-md flex-col items-stretch justify-center gap-5 sm:max-w-none sm:flex-row sm:justify-center md:mt-10"
          >
            <Link href={`/${locale}/products`} className={primaryCtaClass}>
              {ctaPrimary}
            </Link>
            <Link href={`/${locale}/blog`} className={secondaryCtaClass}>
              {ctaSecondary}
            </Link>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-12 flex flex-col items-center md:mt-14 lg:mt-16"
          >
            <HeroCompassCursor
              ariaLabel={t("homeCompass.compassAria")}
              cardinalLabels={{
                north: t("homeCompass.north"),
                south: t("homeCompass.south"),
                east: t("homeCompass.east"),
                west: t("homeCompass.west"),
              }}
              variant="brand"
            />
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-5 flex flex-col items-center gap-2 text-center md:mt-6"
          >
            <div
              className="flex h-7 w-[18px] items-start justify-center rounded-full border border-[rgba(46,74,54,0.32)] pt-1.5"
              aria-hidden
            >
              <span className="gn-hero-scroll-dot block h-1.5 w-[3px] rounded-full bg-[rgba(46,74,54,0.42)]" />
            </div>
            <p className="max-w-xs font-inter text-[11px] font-medium uppercase tracking-[0.2em] text-[rgba(46,74,54,0.72)] md:text-xs">
              {t("homeBrandHero.scrollHint")}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
