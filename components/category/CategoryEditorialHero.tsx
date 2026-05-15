"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import {
  CATEGORY_HERO_ACCENT,
  CATEGORY_HERO_CTA_FG,
  type CategoryHeroKind,
} from "@/lib/category-hero-theme";
import { GN_EASE_PREMIUM, GN_HERO_TOP_PAD } from "@/lib/ui/gonatural-design";

type CategoryEditorialHeroProps = {
  locale: Locale;
  slug: string;
  title: string;
  eyebrow: string;
  subtitle: string;
  ctaLabel: string;
  visualKind: CategoryHeroKind;
};

const easeOut = GN_EASE_PREMIUM;

function HeroGraphic({
  kind,
  accent,
  reduceMotion,
}: {
  kind: CategoryHeroKind;
  accent: string;
  reduceMotion: boolean;
}) {
  const stroke = accent;
  const floatProps = reduceMotion
    ? {}
    : {
        animate: { y: [0, -6, 0] },
        transition: {
          duration: 14,
          repeat: Infinity,
          ease: "easeInOut" as const,
        },
      };

  const common = "pointer-events-none absolute inset-0 overflow-visible";

  switch (kind) {
    case "fishing":
      return (
        <motion.div className={common} aria-hidden {...floatProps}>
          <svg
            className="absolute -right-[8%] top-[12%] h-[min(42vw,320px)] w-[min(42vw,320px)] opacity-[0.09] md:-right-[4%] md:top-[8%]"
            viewBox="0 0 200 200"
            fill="none"
          >
            <path
              d="M12 140 Q55 40 120 88 T188 52"
              stroke={stroke}
              strokeWidth="2.2"
              strokeLinecap="round"
            />
            <path
              d="M28 168 Q72 96 118 118 Q148 132 172 108"
              stroke={stroke}
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity="0.65"
            />
          </svg>
        </motion.div>
      );
    case "mountain-snow":
      return (
        <motion.div className={common} aria-hidden {...floatProps}>
          <svg
            className="absolute -left-[6%] bottom-[6%] h-[min(48vw,340px)] w-[min(52vw,360px)] opacity-[0.085] md:left-[2%]"
            viewBox="0 0 240 120"
            fill="none"
          >
            <path
              d="M0 118 L52 48 L88 82 L132 28 L176 72 L240 40 L240 120 L0 120 Z"
              fill={stroke}
              opacity="0.35"
            />
            <path
              d="M0 118 L52 48 L88 82 L132 28 L176 72 L240 40"
              stroke={stroke}
              strokeWidth="1.6"
              strokeLinejoin="round"
              opacity="0.55"
            />
          </svg>
        </motion.div>
      );
    case "outdoor-adventure":
      return (
        <motion.div className={common} aria-hidden {...floatProps}>
          <svg
            className="absolute left-[4%] top-[18%] h-[min(44vw,300px)] w-[min(44vw,300px)] opacity-[0.1] md:left-[10%]"
            viewBox="0 0 200 200"
            fill="none"
          >
            <path
              d="M24 160 C48 96 72 120 100 72 C128 44 152 88 176 52"
              stroke={stroke}
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeDasharray="5 9"
            />
            <path
              d="M40 172 C64 112 96 132 124 96 C150 68 168 104 188 84"
              stroke={stroke}
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeDasharray="4 10"
              opacity="0.55"
            />
          </svg>
        </motion.div>
      );
    case "water-sports":
      return (
        <motion.div className={common} aria-hidden {...floatProps}>
          <svg
            className="absolute -right-[4%] bottom-[10%] h-[min(38vw,280px)] w-[min(72vw,520px)] opacity-[0.09]"
            viewBox="0 0 320 100"
            fill="none"
          >
            <path
              d="M0 52 C40 28 80 76 120 52 S200 28 240 52 S320 76 360 52"
              stroke={stroke}
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M0 72 C48 48 96 88 144 64 S240 40 288 64 S336 88 384 72"
              stroke={stroke}
              strokeWidth="1.2"
              strokeLinecap="round"
              opacity="0.55"
            />
          </svg>
        </motion.div>
      );
    case "active-sports":
      return (
        <motion.div className={common} aria-hidden {...floatProps}>
          <svg
            className="absolute right-[6%] top-[14%] h-[min(40vw,300px)] w-[min(40vw,300px)] opacity-[0.09]"
            viewBox="0 0 200 200"
            fill="none"
          >
            <path
              d="M32 148 L148 40"
              stroke={stroke}
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.45"
            />
            <path
              d="M48 156 L156 52"
              stroke={stroke}
              strokeWidth="2.6"
              strokeLinecap="round"
            />
            <path
              d="M64 164 L164 64"
              stroke={stroke}
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity="0.5"
            />
          </svg>
        </motion.div>
      );
    default:
      return null;
  }
}

export default function CategoryEditorialHero({
  locale,
  slug,
  title,
  eyebrow,
  subtitle,
  ctaLabel,
  visualKind,
}: CategoryEditorialHeroProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const off = reduceMotion;
  const accent = CATEGORY_HERO_ACCENT[visualKind];
  const ctaFg = CATEGORY_HERO_CTA_FG[visualKind];

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
      transition: { duration: 0.62, ease: easeOut },
    },
  };

  const ctaHref = `/${locale}/category/${slug}#category-products`;

  return (
    <section
      className="relative isolate overflow-hidden border-b border-[rgba(46,74,54,0.08)] bg-[#F4EBDD]"
      aria-labelledby="category-hero-heading"
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_28%,rgba(217,164,65,0.06),transparent_50%)]"
        aria-hidden
      />
      <HeroGraphic kind={visualKind} accent={accent} reduceMotion={off} />

      <motion.div
        className={`relative z-[1] mx-auto w-full max-w-[1200px] px-[18px] pb-14 md:px-8 md:pb-16 lg:px-12 lg:pb-20 ${GN_HERO_TOP_PAD}`}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        <div className="mx-auto flex max-w-[920px] flex-col items-center text-center">
          <motion.p
            variants={itemVariants}
            className="font-inter text-[10px] font-semibold uppercase tracking-[0.28em] text-[rgba(46,74,54,0.52)] md:text-[11px]"
          >
            {eyebrow}
          </motion.p>

          <motion.h1
            id="category-hero-heading"
            variants={itemVariants}
            className="font-display mt-4 text-balance text-[clamp(2.1rem,4.8vw,3.65rem)] font-medium leading-[1.06] tracking-[-0.02em] md:mt-5"
            style={{ color: accent }}
          >
            {title}
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="font-inter mt-5 max-w-2xl text-pretty text-base leading-relaxed text-[rgba(46,74,54,0.72)] md:mt-6 md:text-lg"
          >
            {subtitle}
          </motion.p>

          <motion.div variants={itemVariants} className="mt-8 md:mt-10">
            <Link
              href={ctaHref}
              className="group inline-flex min-h-[52px] items-center justify-center rounded-full px-9 py-3 font-inter text-[12px] font-semibold uppercase tracking-[0.14em] shadow-[inset_0_1px_0_rgba(255,255,255,0.22)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4EBDD] motion-reduce:transition-none md:min-h-[56px] md:px-10 md:text-[13px]"
              style={{
                backgroundColor: accent,
                color: ctaFg,
                boxShadow: `inset 0 1px 0 rgba(255,255,255,0.2), 0 12px 40px -12px ${accent}55`,
              }}
            >
              <span className="motion-safe:transition motion-safe:duration-300 motion-safe:ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-0.5 group-hover:shadow-[0_18px_48px_-14px_rgba(46,74,54,0.18)]">
                {ctaLabel}
              </span>
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
