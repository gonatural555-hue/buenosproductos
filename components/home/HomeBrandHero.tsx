"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useMemo } from "react";
import HeroCompassCursor, { type CompassCardinalLabels } from "@/components/home/HeroCompassCursor";
import type { Locale } from "@/lib/i18n/config";
import { GN_EASE_PREMIUM, GN_HEADER_TITLE_WORD_COLORS } from "@/lib/ui/gonatural-design";

export type HomeBrandHeroProps = {
  locale: Locale;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  scrollHint: string;
  cardinalLabels: CompassCardinalLabels;
  compassAriaLabel: string;
};

const easeOut = GN_EASE_PREMIUM;

const primaryCtaClass =
  "group inline-flex h-[52px] min-h-[52px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#1F3527_0%,#2E4A36_50%,#3E654B_100%)] px-7 text-center font-sans text-[12px] font-bold uppercase tracking-[0.18em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18),var(--gn-shadow-default)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.22),var(--gn-shadow-hover)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gn-mustard/40 focus-visible:ring-offset-2 focus-visible:ring-offset-gn-cream motion-reduce:transition-none motion-reduce:hover:translate-y-0";

const secondaryCtaClass =
  "group inline-flex h-[52px] min-h-[52px] items-center justify-center rounded-full border-[1.5px] border-gn-forest/35 bg-transparent px-7 text-center font-sans text-[12px] font-bold uppercase tracking-[0.18em] text-gn-forest shadow-none transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-gn-forest/55 hover:bg-gn-cream/90 hover:shadow-[var(--gn-shadow-default)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gn-burnt/35 focus-visible:ring-offset-2 focus-visible:ring-offset-gn-cream motion-reduce:transition-none motion-reduce:hover:translate-y-0";

function buildTitleRows(title: string) {
  const titleLines = title.includes("\n")
    ? title.split("\n").map((l) => l.trim()).filter(Boolean)
    : [title.trim()].filter(Boolean);

  let colorCursor = 0;
  return titleLines.map((line, lineIdx) => ({
    key: lineIdx,
    words: line.split(/\s+/).filter(Boolean).map((word) => {
      const ci = colorCursor++;
      return {
        word,
        colorKey: ci,
        color:
          GN_HEADER_TITLE_WORD_COLORS[ci % GN_HEADER_TITLE_WORD_COLORS.length],
      };
    }),
  }));
}

export default function HomeBrandHero({
  locale,
  title,
  subtitle,
  ctaPrimary,
  ctaSecondary,
  scrollHint,
  cardinalLabels,
  compassAriaLabel,
}: HomeBrandHeroProps) {
  const reduceMotion = useReducedMotion();
  const off = reduceMotion ?? false;

  const titleRows = useMemo(() => buildTitleRows(title), [title]);

  const containerVariants = {
    hidden: off ? { opacity: 1 } : { opacity: 0 },
    show: {
      opacity: 1,
      transition: off
        ? { duration: 0 }
        : { staggerChildren: 0.09, delayChildren: 0.05, ease: easeOut },
    },
  };

  const itemVariants = {
    hidden: off ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.65, ease: easeOut },
    },
  };

  const compassReveal = {
    hidden: off ? { opacity: 1, y: 0 } : { opacity: 0, y: 52 },
    show: {
      opacity: 1,
      y: 0,
      transition: off ? { duration: 0 } : { duration: 1.08, ease: easeOut },
    },
  };

  return (
    <section
      className="relative isolate flex w-full flex-col overflow-x-clip overflow-y-visible bg-gn-cream"
      aria-label="Hero"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,rgba(255,255,255,0.45),transparent_55%)]"
        aria-hidden
      />

      {/* Primera pantalla: sin brújula; más aire bajo el header fijo */}
      <motion.div
        className="relative z-[1] mx-auto flex min-h-[100svh] min-h-[100dvh] w-full min-w-0 max-w-gn-content flex-col px-4 pb-gn-l pt-[calc(env(safe-area-inset-top,0px)+6.75rem)] sm:px-6 sm:pt-[calc(env(safe-area-inset-top,0px)+7rem)] md:px-8 md:pt-[calc(env(safe-area-inset-top,0px)+7.25rem)] lg:px-12 lg:pb-gn-xl lg:pt-[calc(env(safe-area-inset-top,0px)+7.5rem)]"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
          <motion.h1
            variants={itemVariants}
            className="gn-hero-title mx-auto w-full min-w-0 text-center"
          >
            {titleRows.map((row) => (
              <span key={row.key} className="flex w-full min-w-0 justify-center py-px">
                <span className="inline-flex max-w-full flex-wrap justify-center gap-x-[0.14em] gap-y-1">
                  {row.words.map(({ word, color, colorKey }) => (
                    <motion.span
                      key={`${row.key}-${colorKey}`}
                      className="inline-block cursor-default rounded-md px-[0.05em] [-webkit-tap-highlight-color:transparent]"
                      style={{
                        color,
                        transformOrigin: "50% 90%",
                      }}
                      whileHover={
                        off
                          ? undefined
                          : {
                              y: -8,
                              scale: 1.055,
                              textShadow:
                                "0 12px 32px rgba(46, 74, 54, 0.12), 0 4px 14px rgba(46, 74, 54, 0.08)",
                              transition: {
                                duration: 0.52,
                                ease: easeOut,
                              },
                            }
                      }
                    >
                      {word}
                    </motion.span>
                  ))}
                </span>
              </span>
            ))}
          </motion.h1>

          <motion.p variants={itemVariants} className="gn-hero-subtitle mx-auto mt-gn-m text-center">
            {subtitle}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-gn-m flex w-full max-w-md flex-col items-stretch justify-center gap-gn-s sm:max-w-none sm:flex-row sm:gap-gn-m"
          >
            <Link href={`/${locale}/products`} className={primaryCtaClass}>
              {ctaPrimary}
            </Link>
            <Link href={`/${locale}/blog`} className={secondaryCtaClass}>
              {ctaSecondary}
            </Link>
          </motion.div>
        </div>

        <motion.div variants={itemVariants} className="mt-auto flex flex-col items-center gap-gn-xs pt-gn-m">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-gn-forest md:text-[12px] md:tracking-[0.22em]">
            {scrollHint}
          </p>
          {!off ? (
            <motion.div
              className="flex flex-col items-center gap-gn-xs"
              animate={{ y: [0, 6, 0] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: [0.45, 0, 0.55, 1],
              }}
              aria-hidden
            >
              <span className="block h-7 w-[1.125rem] rounded-full border border-gn-forest/35 bg-gn-cream/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.65)]" />
              <span className="block h-1 w-1 rounded-full bg-gn-forest/45" />
            </motion.div>
          ) : (
            <div className="flex flex-col items-center gap-gn-xs" aria-hidden>
              <span className="block h-7 w-[1.125rem] rounded-full border border-gn-forest/35 bg-gn-cream/60" />
              <span className="block h-1 w-1 rounded-full bg-gn-forest/45" />
            </div>
          )}
        </motion.div>
      </motion.div>

      {/* Brújula: solo tras scroll; entrada slide-up premium */}
      <motion.div
        className="relative z-[1] mx-auto flex w-full min-w-0 max-w-gn-content justify-center px-4 pb-gn-xxl pt-gn-l sm:px-6 md:px-8 lg:px-12"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.22, margin: "0px 0px -10% 0px" }}
        variants={compassReveal}
      >
        <HeroCompassCursor
          variant="brand"
          ariaLabel={compassAriaLabel}
          cardinalLabels={cardinalLabels}
        />
      </motion.div>
    </section>
  );
}
