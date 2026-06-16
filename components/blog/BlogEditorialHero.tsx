"use client";

import { motion, useReducedMotion } from "framer-motion";
import SmartImage from "@/components/SmartImage";
import Link from "next/link";
import { useMemo } from "react";
import type { Locale } from "@/lib/i18n/config";
import {
  blogHeroElementStyle,
  DEFAULT_BLOG_HERO_LAYOUT,
} from "@/lib/blog-hero-layout";
import { GN_EASE_PREMIUM, GN_HERO_TOP_PAD } from "@/lib/ui/gonatural-design";
import {
  GN_HERO_CTA_CLASS_WIDE,
  GN_HERO_CTA_FOREST,
  gnHeroCtaStyle,
} from "@/lib/ui/gn-hero-cta";
import { useTranslations } from "@/components/i18n/LocaleProvider";

const easeOut = GN_EASE_PREMIUM;

export const BLOG_COVER_WIDTH = 1260;
export const BLOG_COVER_HEIGHT = 720;

const exploreCtaStyle = gnHeroCtaStyle(GN_HERO_CTA_FOREST);
const copyBlockStyle = blogHeroElementStyle(DEFAULT_BLOG_HERO_LAYOUT.copyBlock);
const coverImageStyle = blogHeroElementStyle(DEFAULT_BLOG_HERO_LAYOUT.coverImage);

/** Primera línea: forest + opcional burgundy (1.ª palabra del bloque tras \\n); segunda: mustard. */
function parseBlogEditorialTitle(title: string): {
  line1Forest: string;
  row1Burgundy: string;
  row2Mustard: string | null;
} {
  const raw = title.trim();
  if (!raw) {
    return { line1Forest: "", row1Burgundy: "", row2Mustard: null };
  }
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  const line1 = lines[0] ?? "";
  const secondLineText = lines.slice(1).join(" ").trim();
  const words = secondLineText.split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return { line1Forest: line1, row1Burgundy: "", row2Mustard: null };
  }
  if (words.length === 1) {
    return { line1Forest: line1, row1Burgundy: "", row2Mustard: words[0] ?? null };
  }
  return {
    line1Forest: line1,
    row1Burgundy: words[0] ?? "",
    row2Mustard: words.slice(1).join(" "),
  };
}

export type BlogEditorialHeroProps = {
  locale: Locale;
  title: string;
  subtitle: string;
  eyebrow: string;
  exploreCtaLabel: string;
  postsAnchorId: string;
  sectionAriaLabel: string;
  coverImageSrc?: string;
  coverImageAlt?: string;
};

export default function BlogEditorialHero({
  locale,
  title,
  subtitle,
  eyebrow,
  exploreCtaLabel,
  postsAnchorId,
  sectionAriaLabel,
  coverImageSrc,
  coverImageAlt,
}: BlogEditorialHeroProps) {
  const t = useTranslations();
  const reduceMotion = useReducedMotion();
  const off = reduceMotion ?? false;
  const hasCover = Boolean(coverImageSrc);

  const { line1Forest, row1Burgundy, row2Mustard } = useMemo(
    () => parseBlogEditorialTitle(title),
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
  const textAlign = hasCover
    ? "items-start text-left"
    : "items-center text-center";

  const copyBlockContent = (
    <>
      <motion.p
        variants={itemVariants}
        className={`mb-3 text-[0.65rem] font-semibold uppercase tracking-[0.38em] text-[rgba(46,74,54,0.62)] md:mb-4 ${
          hasCover ? "" : "text-center"
        }`}
      >
        {eyebrow}
      </motion.p>

      <motion.h1 variants={itemVariants} className="gn-hero-editorial-two-line w-full">
        <span className="block text-balance">
          <span className="gn-hero-editorial-line-forest">{line1Forest}</span>
          {row1Burgundy ? (
            <>
              {" "}
              <span className="gn-hero-c-burgundy">{row1Burgundy}</span>
            </>
          ) : null}
        </span>
        {row2Mustard ? (
          <span className="gn-hero-editorial-line-mustard text-balance">
            {row2Mustard}
          </span>
        ) : null}
      </motion.h1>

      <motion.p
        variants={itemVariants}
        className={`gn-hero-subtitle mt-4 md:mt-5 ${hasCover ? "" : "text-center"}`}
      >
        {subtitle}
      </motion.p>

      <motion.div variants={itemVariants} className="mt-6 w-full max-w-md md:mt-7">
        <Link
          href={exploreHref}
          className={GN_HERO_CTA_CLASS_WIDE}
          style={exploreCtaStyle}
          aria-label={exploreCtaLabel}
        >
          {exploreCtaLabel}
        </Link>
      </motion.div>
    </>
  );

  return (
    <section
      className={`relative isolate overflow-x-clip border-b border-[rgba(46,74,54,0.08)] bg-[#F4EBDD] ${
        hasCover ? "overflow-visible pt-10 pb-0 md:pt-14 lg:pt-16" : "flex min-h-[100svh] flex-col"
      }`}
      aria-label={sectionAriaLabel}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_36%,rgba(217,164,65,0.10),transparent_46%)]"
        aria-hidden
      />
      <motion.div
        className={`relative z-[1] mx-auto w-full min-w-0 px-4 md:px-6 lg:px-10 ${
          hasCover
            ? `max-w-[1920px] ${GN_HERO_TOP_PAD}`
            : `flex min-h-[100svh] max-w-[1080px] flex-col px-[18px] pb-3 md:px-[28px] md:pb-4 lg:px-[48px] ${GN_HERO_TOP_PAD}`
        }`}
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {hasCover ? (
          <div className="relative flex min-h-0 flex-col gap-10 overflow-visible lg:min-h-[720px] lg:justify-center">
            <div
              className={`relative z-10 flex w-full max-w-xl flex-col ${textAlign} lg:absolute lg:inset-y-0 lg:left-0 lg:max-w-md lg:justify-center xl:max-w-lg`}
              style={copyBlockStyle}
            >
              {copyBlockContent}
            </div>

            <div
              className="relative z-[1] mx-auto w-full max-w-[1260px] shrink-0"
              style={coverImageStyle}
            >
              <motion.div
                variants={itemVariants}
                className="relative mx-auto aspect-[7/4] w-full overflow-hidden lg:h-[720px] lg:w-[1260px]"
              >
                <SmartImage
                  src={coverImageSrc!}
                  alt={coverImageAlt ?? sectionAriaLabel}
                  width={BLOG_COVER_WIDTH}
                  height={BLOG_COVER_HEIGHT}
                  priority
                  className="h-full w-full object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 1260px"
                />
              </motion.div>
            </div>
          </div>
        ) : (
          <div className="flex min-h-0 flex-1 flex-col justify-between gap-3 md:gap-4">
            <div
              className={`flex w-full max-w-[980px] flex-col ${textAlign}`}
              style={copyBlockStyle}
            >
              {copyBlockContent}
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
        )}
      </motion.div>
    </section>
  );
}
