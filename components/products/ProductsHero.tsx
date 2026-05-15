"use client";

import { motion, useReducedMotion } from "framer-motion";
import Link from "next/link";
import { useMemo } from "react";
import type { Locale } from "@/lib/i18n/config";
import { useTranslations } from "@/components/i18n/LocaleProvider";
import {
  PRODUCTS_CATALOG_CTA_STYLE,
  type ProductsCatalogCtaTone,
} from "@/lib/category-hero-theme";
import { GN_EASE_PREMIUM, GN_HERO_TOP_PAD } from "@/lib/ui/gonatural-design";
import { splitHeroLineWithAccent } from "@/lib/ui/hero-title-accent";

const easeOut = GN_EASE_PREMIUM;

const PRODUCTS_CATEGORY_CTA_BASE =
  "inline-flex min-h-[52px] w-full items-center justify-center rounded-full px-5 text-center font-inter text-[11px] font-semibold uppercase tracking-[0.14em] shadow-[0_10px_32px_-10px_rgba(46,74,54,0.22)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[0_14px_40px_-12px_rgba(46,74,54,0.2)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4EBDD] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:min-h-[56px] sm:px-7 sm:text-[12px] md:text-[13px]";

/** Igual que `HomeBrandHero`: título en 2 bloques editoriales. */
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

export type ProductsHeroCategoryTone = ProductsCatalogCtaTone;

export type ProductsHeroCategoryCta = {
  slug: string;
  label: string;
  tone: ProductsHeroCategoryTone;
};

const discoverCtaClass =
  "group inline-flex h-[56px] min-h-[56px] w-full max-w-md items-center justify-center rounded-full bg-[linear-gradient(135deg,#1F3527_0%,#2E4A36_50%,#3E654B_100%)] px-9 text-center font-inter text-[12px] font-semibold uppercase tracking-[0.14em] text-[#F4EBDD] shadow-[inset_0_1px_0_rgba(255,255,255,0.22),0_12px_44px_rgba(46,74,54,0.14)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.26),0_16px_52px_rgba(46,74,54,0.18)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4EBDD] motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:h-[58px] md:min-h-[58px] md:px-10 md:text-[13px]";

type ProductsHeroProps = {
  locale: Locale;
  title: string;
  subtitle: string;
  categoryCtas: ProductsHeroCategoryCta[];
  discoverCtaLabel: string;
  /** Ancla del bloque filtros + rejilla (scroll suave). */
  catalogSectionId?: string;
  searchHint?: string | null;
};

export default function ProductsHero({
  locale,
  title,
  subtitle,
  categoryCtas,
  discoverCtaLabel,
  catalogSectionId = "products-catalog",
  searchHint,
}: ProductsHeroProps) {
  const t = useTranslations();
  const reduceMotion = useReducedMotion() ?? false;
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

  const scrollToCatalog = () => {
    const el = document.getElementById(catalogSectionId);
    if (!el) return;
    el.scrollIntoView({
      behavior: off ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <section
      className="relative isolate flex min-h-[100svh] flex-col overflow-x-clip border-b border-[rgba(46,74,54,0.08)] bg-[#F4EBDD]"
      aria-label={title}
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
                t("productsPage.heroAccentWord"),
                "gn-hero-editorial-line-forest"
              )}
              {line2 ? (
                <span className="gn-hero-editorial-line-mustard text-balance">{line2}</span>
              ) : null}
            </motion.h1>

            <motion.p variants={itemVariants} className="gn-hero-subtitle mt-4 text-center md:mt-5">
              {subtitle}
            </motion.p>

            {searchHint ? (
              <motion.p
                variants={itemVariants}
                className="mt-3 max-w-lg text-center font-inter text-xs leading-relaxed text-[rgba(46,74,54,0.72)] md:text-sm"
              >
                {searchHint}
              </motion.p>
            ) : null}

            <motion.div
              variants={itemVariants}
              className="mt-6 grid w-full max-w-2xl grid-cols-2 gap-3 sm:max-w-none sm:grid-cols-2 sm:gap-4 md:mt-7 lg:grid-cols-4"
            >
              {categoryCtas.map((cat) => {
                const cta = PRODUCTS_CATALOG_CTA_STYLE[cat.tone];
                return (
                  <Link
                    key={cat.slug}
                    href={`/${locale}/category/${cat.slug}`}
                    className={`${PRODUCTS_CATEGORY_CTA_BASE} ${
                      cat.tone === "mustard" ? "border-[1.5px] border-white/90" : ""
                    }`}
                    style={{
                      backgroundColor: cta.bg,
                      color: cta.fg,
                      boxShadow: `inset 0 1px 0 rgba(255,255,255,0.18), 0 10px 32px -10px ${cta.bg}66`,
                    }}
                  >
                    {cat.label}
                  </Link>
                );
              })}
            </motion.div>

            <motion.div variants={itemVariants} className="mt-6 flex w-full justify-center md:mt-7">
              <button type="button" onClick={scrollToCatalog} className={discoverCtaClass}>
                {discoverCtaLabel}
              </button>
            </motion.div>
          </div>

          <motion.div
            variants={itemVariants}
            className="flex shrink-0 flex-col items-center gap-1.5 pb-1 pt-2 text-center"
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
