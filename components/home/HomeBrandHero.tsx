"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useMemo } from "react";
import type { Locale } from "@/lib/i18n/config";
import { GN_EASE_PREMIUM } from "@/lib/ui/gonatural-design";

export type HomeBrandHeroProps = {
  locale: Locale;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
};

const easeOut = GN_EASE_PREMIUM;

const primaryCtaClass =
  "group inline-flex h-[52px] min-h-[52px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#1F3527_0%,#2E4A36_50%,#3E654B_100%)] px-8 text-center font-sans text-[12px] font-bold uppercase tracking-[0.18em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_12px_44px_rgba(46,74,54,0.14)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.26),0_16px_52px_rgba(46,74,54,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gn-mustard/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5ece1] motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:px-9";

const secondaryCtaClass =
  "group inline-flex h-[52px] min-h-[52px] items-center justify-center rounded-full border border-gn-forest/22 bg-transparent px-8 text-center font-sans text-[12px] font-bold uppercase tracking-[0.18em] text-gn-forest/90 shadow-none transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-gn-forest/40 hover:bg-[#ebe3d6]/90 hover:shadow-[var(--gn-shadow-default)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gn-burnt/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5ece1] motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:px-9";

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

  /* Espacio bajo header fijo (pt-6 + fila ~84px) sin crear contenedor extra de scroll */
  const heroTopPad =
    "pt-[calc(env(safe-area-inset-top,0px)+1.5rem+5.25rem+8px)] sm:pt-[calc(env(safe-area-inset-top,0px)+1.5rem+5.25rem+10px)] md:pt-[calc(env(safe-area-inset-top,0px)+1.5rem+5.25rem+12px)]";

  return (
    <section
      className="relative isolate flex w-full flex-col overflow-x-clip bg-[#f5ece1]"
      aria-label="Hero"
    >
      <motion.div
        className={`relative z-[1] mx-auto flex w-full min-w-0 max-w-[1040px] flex-col px-[18px] pb-12 md:px-[28px] md:pb-16 lg:px-[48px] ${heroTopPad}`}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="flex flex-col items-center py-10 md:py-14 lg:py-16">
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
            className="gn-hero-subtitle mx-auto mt-6 text-center md:mt-7"
          >
            {subtitle}
          </motion.p>

          <motion.div
            variants={itemVariants}
            className="mt-8 flex w-full max-w-md flex-col items-stretch justify-center gap-4 sm:max-w-none sm:flex-row sm:justify-center md:mt-9"
          >
            <Link href={`/${locale}/products`} className={primaryCtaClass}>
              {ctaPrimary}
            </Link>
            <Link href={`/${locale}/blog`} className={secondaryCtaClass}>
              {ctaSecondary}
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
