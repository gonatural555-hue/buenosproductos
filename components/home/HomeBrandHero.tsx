"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useMemo } from "react";
import type { Locale } from "@/lib/i18n/config";
import { GN_EASE_PREMIUM, GN_HERO_TOP_PAD } from "@/lib/ui/gonatural-design";
import { splitHeroLineWithAccent } from "@/lib/ui/hero-title-accent";
import { useGoNaturalHomeLayout } from "@/context/GoNaturalHomeLayoutContext";
import { useTranslations } from "@/components/i18n/LocaleProvider";

export type HomeBrandHeroProps = {
  locale: Locale;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

const easeOut = GN_EASE_PREMIUM;

const heroCtaBase =
  "inline-flex h-[56px] min-h-[56px] items-center justify-center rounded-full border border-black px-9 text-center font-inter text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-black/25 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4EBDD] motion-reduce:transition-none md:h-[58px] md:min-h-[58px] md:px-10 md:text-[13px]";

/** CTAs Hero — negro / blanco, invierte en hover */
const heroCtaClass = `${heroCtaBase} bg-black text-white hover:bg-white hover:text-black`;

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
  const { offsetStyle: homeLayoutOffset } = useGoNaturalHomeLayout();
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

  return (
    <section
      className="relative isolate flex min-h-[100svh] flex-col overflow-x-clip bg-[#F4EBDD]"
      aria-label="Hero"
      style={homeLayoutOffset("hero")}
      data-home-layout-element="hero"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(217,164,65,0.10),transparent_46%)]"
        aria-hidden
      />
      <motion.div
        className={`relative z-[1] mx-auto flex min-h-[100svh] w-full min-w-0 max-w-[1080px] flex-col px-[18px] pb-3 md:px-[28px] md:pb-4 lg:px-[48px] ${GN_HERO_TOP_PAD}`}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-between gap-3 md:gap-4">
          <div className="flex w-full max-w-[980px] flex-col items-center">
            <motion.h1 variants={itemVariants} className="gn-hero-editorial-two-line w-full">
              {splitHeroLineWithAccent(
                line1,
                t("homeBrandHero.titleAccentWord"),
                "gn-hero-editorial-line-forest"
              )}
              {line2 ? (
                <span className="gn-hero-editorial-line-mustard text-balance">{line2}</span>
              ) : null}
            </motion.h1>

            <motion.p variants={itemVariants} className="gn-hero-subtitle mt-4 text-center md:mt-5">
              {subtitle}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-6 flex w-full max-w-md flex-col items-stretch justify-center gap-4 sm:max-w-none sm:flex-row sm:justify-center md:mt-7"
            >
              <Link href={`/${locale}/products`} className={heroCtaClass}>
                {ctaPrimary}
              </Link>
              <Link href={`/${locale}/blog`} className={heroCtaClass}>
                {ctaSecondary}
              </Link>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="flex shrink-0 flex-col items-center gap-1.5 pb-1 text-center pt-2"
          >
            <div
              className="flex h-6 w-4 items-start justify-center rounded-full border border-[rgba(46,74,54,0.32)] pt-1"
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
