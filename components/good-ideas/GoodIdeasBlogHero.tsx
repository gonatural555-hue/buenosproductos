"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import type { Locale } from "@/lib/i18n/config";
import {
  GI_BLOG_POSTS_ANCHOR,
  GI_EASE,
  GI_HERO_PRIMARY_CTA_CLASS,
  GI_HERO_TOP_PAD,
  parseGoodIdeasEditorialTitle,
} from "@/lib/ui/goodideas-design";

const easeOut = GI_EASE;

export type GoodIdeasBlogHeroProps = {
  locale: Locale;
  title: string;
  subtitle: string;
  eyebrow: string;
  exploreCtaLabel: string;
  scrollHint: string;
  postsAnchorId?: string;
  sectionAriaLabel: string;
};

export default function GoodIdeasBlogHero({
  locale,
  title,
  subtitle,
  eyebrow,
  exploreCtaLabel,
  scrollHint,
  postsAnchorId = GI_BLOG_POSTS_ANCHOR,
  sectionAriaLabel,
}: GoodIdeasBlogHeroProps) {
  const reduceMotion = useReducedMotion();
  const off = reduceMotion ?? false;

  const { line1, row1Accent, row2Muted } = useMemo(
    () => parseGoodIdeasEditorialTitle(title),
    [title]
  );

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

  const exploreHref = `/${locale}/blog#${postsAnchorId}`;

  return (
    <section
      className="relative isolate flex min-h-[100svh] flex-col overflow-x-clip border-b border-white/[0.08] bg-[#0B0F14] text-[#E8ECF1]"
      aria-label={sectionAriaLabel}
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
          <motion.div className="relative mt-[40px] flex w-full max-w-[980px] flex-col items-center">
            <motion.p
              variants={itemVariants}
              className="mb-3 text-center font-inter text-[11px] font-semibold uppercase tracking-[0.24em] text-[rgba(232,236,241,0.45)] md:mb-4"
            >
              {eyebrow}
            </motion.p>

            <motion.h1
              variants={itemVariants}
              className="w-full text-center font-display text-[clamp(38px,9.5vw,56px)] font-semibold leading-[0.92] tracking-[-0.02em] md:text-[clamp(58px,6.5vw,102px)] md:leading-[0.88]"
            >
              <span className="block text-balance text-[#E8ECF1]">{line1}</span>
              {row1Accent || row2Muted ? (
                <span className="mt-0 block text-balance">
                  {row1Accent ? (
                    <span className="text-[rgba(232,236,241,0.55)]">{row1Accent} </span>
                  ) : null}
                  {row2Muted ? (
                    <span className="text-[#3B82F6]">{row2Muted}</span>
                  ) : null}
                </span>
              ) : null}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-4 max-w-lg text-center font-inter text-[clamp(16px,3.8vw,18px)] leading-relaxed text-[rgba(232,236,241,0.72)] md:mt-5"
            >
              {subtitle}
            </motion.p>

            <motion.div variants={itemVariants} className="mt-6 w-full max-w-md md:mt-7">
              <Link href={exploreHref} className={GI_HERO_PRIMARY_CTA_CLASS} aria-label={exploreCtaLabel}>
                {exploreCtaLabel}
              </Link>
            </motion.div>
          </motion.div>

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
