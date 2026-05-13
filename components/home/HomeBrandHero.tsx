"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useMemo } from "react";
import HeroCompassCursor, { type CompassCardinalLabels } from "@/components/home/HeroCompassCursor";
import type { Locale } from "@/lib/i18n/config";
import { GN_EASE_PREMIUM } from "@/lib/ui/gonatural-design";

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
  "group inline-flex h-[58px] min-h-[58px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#1F3527_0%,#2E4A36_50%,#3E654B_100%)] px-9 text-center font-sans text-[12px] font-bold uppercase tracking-[0.18em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_12px_44px_rgba(46,74,54,0.14)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.26),0_16px_52px_rgba(46,74,54,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gn-mustard/40 focus-visible:ring-offset-2 focus-visible:ring-offset-gn-cream motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:px-[42px]";

const secondaryCtaClass =
  "group inline-flex h-[58px] min-h-[58px] items-center justify-center rounded-full border border-gn-forest/22 bg-transparent px-9 text-center font-sans text-[12px] font-bold uppercase tracking-[0.18em] text-gn-forest/90 shadow-none transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-gn-forest/40 hover:bg-gn-cream/85 hover:shadow-[var(--gn-shadow-default)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gn-burnt/35 focus-visible:ring-offset-2 focus-visible:ring-offset-gn-cream motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:px-[42px]";

function splitTitleLines(title: string): string[] {
  if (title.includes("\n")) {
    return title.split("\n").map((l) => l.trim()).filter(Boolean);
  }
  return [title.trim()].filter(Boolean);
}

const LINE1_WORD_CLASS: [string, string] = ["gn-hero-c-navy", "gn-hero-c-burgundy"];

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

  const lines = useMemo(() => splitTitleLines(title), [title]);

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

  const heroTopPad =
    "pt-[calc(env(safe-area-inset-top,0px)+6.75rem)] sm:pt-[calc(env(safe-area-inset-top,0px)+7rem)] md:pt-[calc(env(safe-area-inset-top,0px)+7.125rem)]";

  return (
    <section
      className="relative isolate flex w-full flex-col overflow-x-clip overflow-y-visible bg-gn-cream"
      aria-label="Hero"
    >
      <motion.div
        className={`relative z-[1] mx-auto flex min-h-[100svh] min-h-[100dvh] w-full min-w-0 max-w-[1200px] flex-col px-[18px] pb-10 md:px-[28px] lg:px-[48px] ${heroTopPad}`}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
          <motion.h1 variants={itemVariants} className="gn-hero-editorial w-full">
            {lines.map((line, lineIdx) => {
              const isFirst = lineIdx === 0;
              const isMid = lineIdx === 1 && lines.length >= 2;
              const isLast = lineIdx === lines.length - 1 && lines.length >= 2;

              if (lines.length === 1) {
                return (
                  <span key={lineIdx} className="gn-hero-line-3 block text-balance">
                    <span className="gn-hero-c-mustard">{line}</span>
                  </span>
                );
              }

              if (isFirst) {
                const words = line.split(/\s+/).filter(Boolean);
                return (
                  <span key={lineIdx} className="gn-hero-line-1 flex flex-wrap justify-center gap-x-[0.2em] text-balance">
                    {words.map((word, wi) => (
                      <motion.span
                        key={`${lineIdx}-${wi}`}
                        className={`inline-block cursor-default rounded-md px-[0.04em] [-webkit-tap-highlight-color:transparent] ${LINE1_WORD_CLASS[wi % LINE1_WORD_CLASS.length]}`}
                        style={{ transformOrigin: "50% 90%" }}
                        whileHover={
                          off
                            ? undefined
                            : {
                                y: -8,
                                scale: 1.055,
                                textShadow:
                                  "0 12px 32px rgba(46, 74, 54, 0.12), 0 4px 14px rgba(46, 74, 54, 0.08)",
                                transition: { duration: 0.52, ease: easeOut },
                              }
                        }
                      >
                        {word}
                      </motion.span>
                    ))}
                  </span>
                );
              }

              if (isMid) {
                return (
                  <span key={lineIdx} className="gn-hero-line-2 block text-balance">
                    <motion.span
                      className="gn-hero-c-burnt inline-block cursor-default rounded-md px-[0.04em] [-webkit-tap-highlight-color:transparent]"
                      style={{ transformOrigin: "50% 90%" }}
                      whileHover={
                        off
                          ? undefined
                          : {
                              y: -8,
                              scale: 1.055,
                              textShadow:
                                "0 12px 32px rgba(46, 74, 54, 0.12), 0 4px 14px rgba(46, 74, 54, 0.08)",
                              transition: { duration: 0.52, ease: easeOut },
                            }
                      }
                    >
                      {line}
                    </motion.span>
                  </span>
                );
              }

              if (isLast) {
                return (
                  <span key={lineIdx} className="gn-hero-line-3 block text-balance">
                    <motion.span
                      className="gn-hero-c-mustard inline-block cursor-default rounded-md px-[0.04em] [-webkit-tap-highlight-color:transparent]"
                      style={{ transformOrigin: "50% 90%" }}
                      whileHover={
                        off
                          ? undefined
                          : {
                              y: -8,
                              scale: 1.055,
                              textShadow:
                                "0 12px 32px rgba(46, 74, 54, 0.12), 0 4px 14px rgba(46, 74, 54, 0.08)",
                              transition: { duration: 0.52, ease: easeOut },
                            }
                      }
                    >
                      {line}
                    </motion.span>
                  </span>
                );
              }

              return (
                <span key={lineIdx} className="gn-hero-line-2 block text-balance">
                  <span className="gn-hero-c-burnt">{line}</span>
                </span>
              );
            })}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="gn-hero-subtitle mx-auto mt-7 text-center md:mt-9"
          >
            {subtitle}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-10 flex w-full max-w-md flex-col items-stretch justify-center gap-5 sm:max-w-none sm:flex-row sm:justify-center"
          >
            <Link href={`/${locale}/products`} className={primaryCtaClass}>
              {ctaPrimary}
            </Link>
            <Link href={`/${locale}/blog`} className={secondaryCtaClass}>
              {ctaSecondary}
            </Link>
          </motion.div>

          <motion.div
            initial={off ? { opacity: 1, y: 0 } : { opacity: 0, y: 52 }}
            whileInView={off ? { opacity: 1, y: 0 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.22, margin: "0px 0px -10% 0px" }}
            transition={off ? { duration: 0 } : { duration: 1.08, ease: easeOut }}
            className="mt-14 flex w-full flex-col items-center"
          >
            <HeroCompassCursor
              variant="brand"
              ariaLabel={compassAriaLabel}
              cardinalLabels={cardinalLabels}
            />
          </motion.div>

          <motion.div variants={itemVariants} className="mt-[18px] flex flex-col items-center gap-gn-xs md:mt-5">
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
        </div>
      </motion.div>
    </section>
  );
}
