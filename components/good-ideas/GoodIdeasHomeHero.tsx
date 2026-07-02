"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import HeroProductShowcase from "@/components/home/HeroProductShowcase";
import HexGridInteractiveBackground from "@/components/good-ideas/HexGridInteractiveBackground";
import { useTranslations } from "@/components/i18n/LocaleProvider";
import type { HeroProductShowcaseLayers } from "@/lib/hero-product-showcase";
import type { Locale } from "@/lib/i18n/config";
import { productsPath } from "@/lib/routing/paths";
import { GI_EASE, GI_HERO_TOP_PAD } from "@/lib/ui/goodideas-design";

const easeOut = GI_EASE;

const HERO_CTA_CLASS =
  "group inline-flex h-[56px] min-h-[56px] w-full max-w-md items-center justify-center gap-2.5 rounded-full bg-[#3B82F6] px-8 text-center font-body text-sm font-semibold text-white shadow-[0_14px_44px_rgba(59,130,246,0.32)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-[#2563EB] hover:shadow-[0_18px_52px_rgba(59,130,246,0.38)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F14] motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:h-[60px] md:min-h-[60px] md:px-10 md:text-base lg:h-[64px] lg:min-h-[64px]";

export type GoodIdeasHomeHeroProps = {
  locale: Locale;
  eyebrow: string;
  titleBefore: string;
  titleAccent: string;
  subtitle: string;
  ctaLabel: string;
  socialProof: string;
  showcaseBadge: string;
  showcaseProductLayers: HeroProductShowcaseLayers;
  sectionAriaLabel: string;
};

const SOCIAL_AVATARS = ["B", "P", "+"] as const;

function HeroEditorialTitle({
  locale,
  titleBefore,
  titleAccent,
}: {
  locale: Locale;
  titleBefore: string;
  titleAccent: string;
}) {
  if (locale === "es") {
    return (
      <>
        <span className="block">Soluciones que</span>
        <span className="block">
          mejoran{" "}
          <span className="text-[#3B82F6]">tu día a</span>
        </span>
        <span className="block text-[#3B82F6]">día.</span>
      </>
    );
  }

  return (
    <>
      <span className="block">Solutions that</span>
      <span className="block">improve </span>
      <span className="block text-[#3B82F6]">{titleAccent.trim()}</span>
    </>
  );
}

function SocialProofAvatars() {
  return (
    <div className="flex -space-x-2.5" aria-hidden>
      {SOCIAL_AVATARS.map((initial) => (
        <span
          key={initial}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border-2 border-[#0B0F14] bg-[#151B24] font-body text-xs font-bold text-[#E8ECF1] shadow-[0_4px_12px_rgba(0,0,0,0.25)] ring-1 ring-white/[0.12]"
        >
          {initial}
        </span>
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
  titleBefore,
  titleAccent,
  subtitle,
  ctaLabel,
  socialProof,
  showcaseBadge,
  showcaseProductLayers,
  sectionAriaLabel,
}: GoodIdeasHomeHeroProps) {
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
        <div className="grid min-h-0 items-center gap-12 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-10 xl:gap-14 lg:min-h-[600px] lg:max-h-[760px]">
          <div className="flex flex-col items-center text-center lg:max-w-[36rem] lg:items-start lg:text-left">
            <motion.p
              variants={itemVariants}
              className="font-inter text-[11px] font-semibold uppercase tracking-[0.28em] text-[rgba(232,236,241,0.55)]"
            >
              {eyebrow}
            </motion.p>

            <motion.h1
              variants={itemVariants}
              className="mt-4 w-full max-w-[18rem] font-display text-[clamp(2rem,6.2vw,3.15rem)] font-semibold leading-[1.08] tracking-[-0.03em] text-[#E8ECF1] sm:max-w-[20rem] lg:mt-5 lg:max-w-[15.5rem] lg:text-[clamp(2.4rem,3.6vw,3.55rem)] lg:leading-[1.06] xl:max-w-[16.5rem]"
            >
              <HeroEditorialTitle
                locale={locale}
                titleBefore={titleBefore}
                titleAccent={titleAccent}
              />
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-5 max-w-md font-inter text-[15px] leading-relaxed text-[rgba(232,236,241,0.72)] sm:text-base lg:mt-6 lg:max-w-[32rem]"
            >
              {subtitle}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-8 w-full max-w-md lg:mt-9"
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

            <motion.div
              variants={itemVariants}
              className="mt-7 flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:mt-8 lg:justify-start"
            >
              <SocialProofAvatars />
              <p className="font-body text-[14px] font-medium leading-snug text-[rgba(232,236,241,0.72)] sm:text-[15px]">
                {socialProof}
              </p>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="relative w-full min-w-0 lg:justify-self-end"
          >
            <HeroProductShowcase
              layers={showcaseProductLayers}
              badge={showcaseBadge}
              microBadgeShipping={t("goodIdeas.trustBar.shippingTitle")}
              microBadgeSecure={t("goodIdeas.trustBar.secureTitle")}
            />
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
