"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import HeroCompassCursor, { type CompassCardinalLabels } from "@/components/home/HeroCompassCursor";
import type { Locale } from "@/lib/i18n/config";

export type HomeBrandHeroProps = {
  locale: Locale;
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaPrimary: string;
  ctaSecondary: string;
  scrollHint: string;
  cardinalLabels: CompassCardinalLabels;
  compassAriaLabel: string;
};

const easeOut = [0.22, 1, 0.36, 1] as const;

const primaryCtaClass =
  "group inline-flex h-[58px] min-h-[58px] items-center justify-center rounded-full bg-[linear-gradient(135deg,#1F3527_0%,#2E4A36_50%,#3E654B_100%)] px-[38px] text-center font-sans text-[13px] font-bold uppercase tracking-[0.16em] text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_10px_32px_-10px_rgba(31,53,39,0.55)] transition duration-300 ease-out hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.26),0_16px_44px_-12px_rgba(31,53,39,0.62)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441]/45 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4EBDD] motion-reduce:transition-none motion-reduce:hover:translate-y-0";

const secondaryCtaClass =
  "group inline-flex h-[58px] min-h-[58px] items-center justify-center rounded-full border-[1.5px] border-[rgba(46,74,54,0.35)] bg-transparent px-[38px] text-center font-sans text-[13px] font-bold uppercase tracking-[0.16em] text-[#2E4A36] shadow-none transition duration-300 ease-out hover:-translate-y-0.5 hover:border-[rgba(46,74,54,0.55)] hover:bg-[#F4EBDD]/90 hover:shadow-[0_10px_28px_-14px_rgba(46,74,54,0.12)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#C9622B]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4EBDD] motion-reduce:transition-none motion-reduce:hover:translate-y-0";

export default function HomeBrandHero({
  locale,
  eyebrow,
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

  const titleLines = title.includes("\n")
    ? title.split("\n").map((l) => l.trim()).filter(Boolean)
    : [title.trim()].filter(Boolean);

  const containerVariants = {
    hidden: off ? { opacity: 1 } : { opacity: 0 },
    show: {
      opacity: 1,
      transition: off
        ? { duration: 0 }
        : { staggerChildren: 0.11, delayChildren: 0.06, ease: easeOut },
    },
  };

  const itemVariants = {
    hidden: off ? { opacity: 1, y: 0 } : { opacity: 0, y: 22 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.72, ease: easeOut },
    },
  };

  return (
    <section
      className="relative isolate flex min-h-[100dvh] min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-[#F4EBDD] px-5 py-[calc(env(safe-area-inset-top,0px)+5rem)] sm:px-8 sm:py-24 md:px-10 md:py-28"
      aria-label="Hero"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_90%_60%_at_50%_0%,rgba(255,255,255,0.45),transparent_55%)]"
        aria-hidden
      />

      <motion.div
        className="relative z-[1] mx-auto flex w-full max-w-[min(100%,56rem)] flex-col items-center text-center"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <motion.p
          variants={itemVariants}
          className="font-sans text-[clamp(11px,1.15vw,13.5px)] font-semibold uppercase tracking-[0.35em] text-[#C9622B] mb-6 sm:mb-7"
        >
          {eyebrow}
        </motion.p>

        <motion.h1
          variants={itemVariants}
          className="hero-display max-w-[min(100%,900px)] text-balance text-[clamp(3rem,12vw,4.5rem)] font-semibold leading-[0.95] tracking-[-0.03em] text-[#2E4A36] md:text-[clamp(4.25rem,8vw,8.75rem)] md:leading-[0.92] md:tracking-[-0.035em]"
        >
          {titleLines.map((line, i) => (
            <span key={i} className="block">
              {line}
            </span>
          ))}
        </motion.h1>

        <motion.p
          variants={itemVariants}
          className="font-sans mt-9 max-w-[620px] text-pretty text-base leading-[1.7] text-[rgba(46,74,54,0.82)] sm:text-lg md:mt-10 md:text-[20px]"
        >
          {subtitle}
        </motion.p>

        <motion.div
          variants={itemVariants}
          className="mt-9 flex w-full max-w-md flex-col items-stretch justify-center gap-6 sm:mt-10 sm:max-w-none sm:flex-row sm:gap-6 md:mt-11"
        >
          <Link href={`/${locale}/products`} className={primaryCtaClass}>
            {ctaPrimary}
          </Link>
          <Link href={`/${locale}/blog`} className={secondaryCtaClass}>
            {ctaSecondary}
          </Link>
        </motion.div>

        <motion.div variants={itemVariants} className="mt-14 sm:mt-16 md:mt-[4.5rem]">
          <HeroCompassCursor
            variant="brand"
            ariaLabel={compassAriaLabel}
            cardinalLabels={cardinalLabels}
          />
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col items-center gap-3 sm:mt-12 md:mt-14"
        >
          <p className="font-sans text-[12px] font-semibold uppercase tracking-[0.22em] text-[#2E4A36]">
            {scrollHint}
          </p>
          {!off ? (
            <motion.div
              className="flex flex-col items-center gap-1.5"
              animate={{ y: [0, 7, 0] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                ease: [0.45, 0, 0.55, 1],
              }}
              aria-hidden
            >
              <span className="block h-8 w-5 rounded-full border border-[#2E4A36]/35 bg-[#F4EBDD]/60 shadow-[inset_0_2px_4px_rgba(255,255,255,0.65)]" />
              <span className="block h-1.5 w-1 rounded-full bg-[#2E4A36]/45" />
            </motion.div>
          ) : (
            <div className="flex flex-col items-center gap-1.5" aria-hidden>
              <span className="block h-8 w-5 rounded-full border border-[#2E4A36]/35 bg-[#F4EBDD]/60" />
              <span className="block h-1.5 w-1 rounded-full bg-[#2E4A36]/45" />
            </div>
          )}
        </motion.div>
      </motion.div>
    </section>
  );
}
