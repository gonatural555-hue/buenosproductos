"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import HeroFloatingProductCards from "@/components/home/HeroFloatingProductCards";
import HexGridInteractiveBackground from "@/components/good-ideas/HexGridInteractiveBackground";
import { useTranslations } from "@/components/i18n/LocaleProvider";
import type { GoodIdeasHomeHeroCardEntry } from "@/lib/good-ideas-home-hero-cards";
import type { ProductReviewStatsSnapshot } from "@/lib/good-ideas-product-review-stats";
import type { Locale } from "@/lib/i18n/config";
import { productsPath } from "@/lib/routing/paths";
import { GI_EASE, GI_HERO_TOP_PAD } from "@/lib/ui/goodideas-design";

const easeOut = GI_EASE;

const HERO_CTA_CLASS =
  "group inline-flex h-[56px] min-h-[56px] w-full max-w-md items-center justify-center gap-2.5 rounded-full bg-[#3B82F6] px-8 text-center font-body text-sm font-semibold text-white shadow-[0_14px_44px_rgba(59,130,246,0.32)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-[#2563EB] hover:shadow-[0_18px_52px_rgba(59,130,246,0.38)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F14] motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:h-[60px] md:min-h-[60px] md:px-10 md:text-base lg:h-[64px] lg:min-h-[64px]";

const HERO_TRUST_AVATAR_STYLES = [
  "bg-[linear-gradient(145deg,#D4A574_0%,#8B5E3C_55%,#6B4423_100%)]",
  "bg-[linear-gradient(145deg,#8EB4C8_0%,#4A6FA5_55%,#2C5282_100%)]",
  "bg-[linear-gradient(145deg,#B8D4A0_0%,#6B8F5E_55%,#4A6741_100%)]",
  "bg-[linear-gradient(145deg,#D4A0B8_0%,#9B6B8A_55%,#6B4A5E_100%)]",
] as const;

export type GoodIdeasHomeHeroProps = {
  locale: Locale;
  eyebrow: string;
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  titleAccent: string;
  ctaLabel: string;
  socialProofHighlight: string;
  socialProofLabel: string;
  heroCardEntries: GoodIdeasHomeHeroCardEntry[];
  heroReviewStatsMap: Record<string, ProductReviewStatsSnapshot>;
  viewProductLabel: string;
  sectionAriaLabel: string;
};

function HeroEditorialTitle({
  titleLine1,
  titleLine2,
  titleLine3,
  titleAccent,
}: {
  titleLine1: string;
  titleLine2: string;
  titleLine3: string;
  titleAccent: string;
}) {
  return (
    <>
      <span className="block">{titleLine1}</span>
      <span className="block">{titleLine2}</span>
      <span className="block">
        {titleLine3}
        <span className="text-[#3B82F6]">{titleAccent}</span>
      </span>
    </>
  );
}

function HeroTrustAvatars() {
  return (
    <div className="flex shrink-0 -space-x-3" aria-hidden>
      {HERO_TRUST_AVATAR_STYLES.map((style, index) => (
        <span
          key={index}
          className={`inline-flex h-11 w-11 rounded-full border-2 border-white shadow-[0_4px_16px_rgba(0,0,0,0.28)] ring-1 ring-white/[0.08] ${style}`}
        />
      ))}
    </div>
  );
}

function CtaArrow() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className="h-4 w-4 transition duration-300 group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function GoodIdeasHomeHero({
  locale,
  eyebrow,
  titleLine1,
  titleLine2,
  titleLine3,
  titleAccent,
  ctaLabel,
  socialProofHighlight,
  socialProofLabel,
  heroCardEntries,
  heroReviewStatsMap,
  viewProductLabel,
  sectionAriaLabel,
}: GoodIdeasHomeHeroProps) {
  void locale;
  const t = useTranslations();
  const reduceMotion = useReducedMotion();
  const off = reduceMotion ?? false;

  const containerVariants = {
    hidden: off ? { opacity: 1 } : { opacity: 0 },
    show: {
      opacity: 1,
      transition: off
        ? { duration: 0 }
        : { staggerChildren: 0.07, delayChildren: 0.05, ease: easeOut },
    },
  };

  const itemVariants = {
    hidden: off ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: easeOut },
    },
  };

  return (
    <section
      className="relative isolate overflow-x-clip border-b border-white/[0.08] bg-[#0B0F14] text-[#E8ECF1]"
      aria-label={sectionAriaLabel}
    >
      <HexGridInteractiveBackground />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_80%_55%_at_28%_-8%,rgba(59,130,246,0.22),transparent_58%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_55%_50%_at_88%_55%,rgba(59,130,246,0.14),transparent_58%)]"
        aria-hidden
      />

      <motion.div
        className={`relative z-[2] mx-auto w-full min-w-0 max-w-[1320px] px-4 pb-12 pt-8 sm:px-6 sm:pb-14 sm:pt-10 lg:px-10 lg:pb-16 ${GI_HERO_TOP_PAD}`}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="grid min-h-0 items-center gap-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:gap-16 xl:gap-24 lg:min-h-[600px] lg:max-h-[760px]">
          <div className="mx-auto flex w-full max-w-[34rem] flex-col items-center text-center lg:max-w-none lg:px-2 xl:px-6">
            <motion.p
              variants={itemVariants}
              className="font-inter text-[11px] font-semibold uppercase tracking-[0.28em] text-[rgba(232,236,241,0.55)]"
            >
              {eyebrow}
            </motion.p>

            <motion.h1
              variants={itemVariants}
              className="mt-6 w-full max-w-[22rem] font-display text-[clamp(1.85rem,5.4vw,2.75rem)] font-semibold leading-[1.02] tracking-[-0.03em] text-[#E8ECF1] sm:max-w-[26rem] md:text-[clamp(2rem,4.8vw,3rem)] lg:mt-8 lg:max-w-[28rem] lg:text-[clamp(2.15rem,3.2vw,3.35rem)] xl:max-w-[32rem]"
            >
              <HeroEditorialTitle
                titleLine1={titleLine1}
                titleLine2={titleLine2}
                titleLine3={titleLine3}
                titleAccent={titleAccent}
              />
            </motion.h1>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:items-center lg:mt-10"
              aria-label={`${socialProofHighlight} ${socialProofLabel}`}
            >
              <HeroTrustAvatars />
              <div className="text-center">
                <p className="font-body text-base font-semibold leading-tight text-[#E8ECF1] sm:text-[17px] lg:text-lg">
                  {socialProofHighlight}
                </p>
                <p className="mt-0.5 font-body text-sm leading-snug text-[rgba(232,236,241,0.62)] sm:text-[15px]">
                  {socialProofLabel}
                </p>
              </div>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="mt-10 w-full max-w-md lg:mt-12"
            >
              <Link
                href={productsPath(locale)}
                className={`${HERO_CTA_CLASS} lg:w-auto lg:min-w-[260px]`}
                aria-label={ctaLabel}
              >
                <span>{ctaLabel}</span>
                <CtaArrow />
              </Link>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="relative w-full min-w-0 lg:justify-self-end"
          >
            <HeroFloatingProductCards
              entries={heroCardEntries}
              reviewStatsMap={heroReviewStatsMap}
              microBadgeShipping={t("goodIdeas.trustBar.shippingTitle")}
              microBadgeSecure={t("goodIdeas.trustBar.secureTitle")}
              viewProductLabel={viewProductLabel}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
