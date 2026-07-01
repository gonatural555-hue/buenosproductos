"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import type { Locale } from "@/lib/i18n/config";
import { productsPath } from "@/lib/routing/paths";
import GoodProductsBrandName from "@/components/good-ideas/GoodProductsBrandName";
import HexGridInteractiveBackground from "@/components/good-ideas/HexGridInteractiveBackground";
import {
  GI_EASE,
  GI_HERO_DARK_CTA_CLASS,
  GI_HERO_EDITORIAL,
  GI_HERO_TOP_PAD,
  parseGoodIdeasEditorialTitle,
} from "@/lib/ui/goodideas-design";

const easeOut = GI_EASE;

export type GoodIdeasHomeHeroProps = {
  locale: Locale;
  title: string;
  subtitle: string;
  eyebrow: string;
  ctaLabel: string;
  sectionAriaLabel: string;
};

export default function GoodIdeasHomeHero({
  locale,
  title,
  subtitle,
  eyebrow,
  ctaLabel,
  sectionAriaLabel,
}: GoodIdeasHomeHeroProps) {
  const reduceMotion = useReducedMotion();
  const off = reduceMotion ?? false;

  const { row1Accent, row2Muted } = useMemo(
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

  return (
    <section
      className="relative isolate flex min-h-[100svh] flex-col overflow-x-clip border-b border-white/[0.08] bg-[#0B0F14] text-[#E8ECF1]"
      aria-label={sectionAriaLabel}
    >
      <HexGridInteractiveBackground />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,rgba(59,130,246,0.18),transparent_60%)]"
        aria-hidden
      />
      <motion.div
        className={`relative z-[2] mx-auto flex min-h-[100svh] w-full min-w-0 max-w-[1080px] flex-col px-[18px] pb-3 md:px-[28px] md:pb-4 lg:px-[48px] ${GI_HERO_TOP_PAD}`}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center gap-3 md:gap-4">
          <motion.div className="relative flex w-full max-w-[980px] flex-col items-center">
            <motion.p
              variants={itemVariants}
              className={`mb-3 md:mb-4 ${GI_HERO_EDITORIAL.eyebrow}`}
            >
              {eyebrow}
            </motion.p>

            <motion.h1
              variants={itemVariants}
              className="w-full text-center font-display text-[clamp(38px,9.5vw,56px)] font-semibold leading-[0.92] tracking-[-0.02em] text-[#FFFFFF] md:text-[clamp(58px,6.5vw,102px)] md:leading-[0.88]"
            >
              <span className="block text-balance">
                <GoodProductsBrandName locale={locale} />
              </span>
              {row1Accent || row2Muted ? (
                <span className="mt-0 block text-balance">
                  {row1Accent ? (
                    <span className={GI_HERO_EDITORIAL.titleMuted}>{row1Accent} </span>
                  ) : null}
                  {row2Muted ? (
                    <span className={GI_HERO_EDITORIAL.titleAccent}>{row2Muted}</span>
                  ) : null}
                </span>
              ) : null}
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className={`mt-4 ${GI_HERO_EDITORIAL.subtitle}`}
            >
              {subtitle}
            </motion.p>

            <motion.div variants={itemVariants} className="mt-6 w-full max-w-md md:mt-7">
              <Link
                href={productsPath(locale)}
                className={GI_HERO_DARK_CTA_CLASS}
                aria-label={ctaLabel}
              >
                {ctaLabel}
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
