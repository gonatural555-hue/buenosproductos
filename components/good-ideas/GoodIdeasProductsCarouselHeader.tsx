"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { buildGoodIdeasProductsListHref } from "@/lib/good-ideas-plp-segments";
import {
  GI_CATALOG_SECTION_ID,
  GI_EASE,
  GI_HERO_EDITORIAL,
  GI_PLP_CAROUSEL_TOP_PAD,
  GI_PRODUCTS_CATEGORY_TONES,
  type GiProductsCategoryTone,
} from "@/lib/ui/goodideas-design";
import HexGridInteractiveBackground from "@/components/good-ideas/HexGridInteractiveBackground";

export type GoodIdeasCarouselSlide = {
  id: string;
  categoryLabel: string;
  title: string;
  subtitle: string;
  accentWord?: string;
  tone: GiProductsCategoryTone;
};

type Props = {
  slides: GoodIdeasCarouselSlide[];
  prevAria: string;
  nextAria: string;
};

const CAROUSEL_ARROW_CLASS =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#94A3B8]/40 text-[#E8ECF1] transition hover:border-[#3B82F6] hover:text-[#60A5FA] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F14]";

function splitLineWithAccent(line: string, accent: string | undefined) {
  const a = accent?.trim();
  if (!line) return null;
  if (!a || !line.includes(a)) {
    return <span className={GI_HERO_EDITORIAL.plpTitle}>{line}</span>;
  }
  const i = line.indexOf(a);
  return (
    <span className={GI_HERO_EDITORIAL.plpTitle}>
      {line.slice(0, i)}
      <span className={GI_HERO_EDITORIAL.titleAccent}>{a}</span>
      {line.slice(i + a.length)}
    </span>
  );
}

export default function GoodIdeasProductsCarouselHeader({
  slides,
  prevAria,
  nextAria,
}: Props) {
  const locale = useLocale();
  const reduceMotion = useReducedMotion() ?? false;
  const [index, setIndex] = useState(0);
  const [blockHovered, setBlockHovered] = useState(false);
  const count = slides.length;

  const go = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count]
  );

  useEffect(() => {
    setBlockHovered(false);
  }, [index]);

  useEffect(() => {
    if (reduceMotion || count <= 1) return;
    const id = window.setInterval(() => go(index + 1), 6000);
    return () => window.clearInterval(id);
  }, [go, index, reduceMotion, count]);

  const slide = slides[index] ?? slides[0];
  const tone = slide ? GI_PRODUCTS_CATEGORY_TONES[slide.tone] : null;

  const editorialTitle = useMemo(() => {
    if (!slide) return { line1: "", line2: null as string | null };
    const lines = slide.title.split("\n").map((l) => l.trim()).filter(Boolean);
    if (lines.length >= 2) {
      return { line1: lines[0] ?? "", line2: lines.slice(1).join(" ") };
    }
    return { line1: lines[0] ?? slide.title, line2: null };
  }, [slide]);

  if (!slide || !tone) return null;

  const categoryHref = `${buildGoodIdeasProductsListHref(locale, {
    category: slide.id,
  })}#${GI_CATALOG_SECTION_ID}`;

  return (
    <section
      className="relative isolate overflow-x-clip border-b border-white/[0.08] bg-[#0B0F14] text-[#E8ECF1]"
      aria-roledescription="carousel"
      aria-label={slide.title.replace(/\n/g, " ")}
    >
      <HexGridInteractiveBackground glowExpanded={blockHovered} />
      <div
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,rgba(59,130,246,0.18),transparent_60%)]"
        aria-hidden
      />

      <div
        className={`relative z-[2] mx-auto flex w-full max-w-[1080px] flex-col justify-center px-[18px] pb-10 md:px-[28px] md:pb-12 lg:px-[48px] ${GI_PLP_CAROUSEL_TOP_PAD}`}
      >
        <motion.div
          key={slide.id}
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: GI_EASE }}
          className="relative mx-auto flex min-h-[240px] w-full max-w-[980px] items-center gap-2 sm:gap-3 md:min-h-[260px] md:gap-4"
        >
          {count > 1 ? (
            <button
              type="button"
              onClick={() => go(index - 1)}
              className={CAROUSEL_ARROW_CLASS}
              aria-label={prevAria}
            >
              ‹
            </button>
          ) : null}

          <Link
            href={categoryHref}
            className="group flex min-w-0 flex-1 flex-col items-center rounded-2xl px-4 py-5 text-center outline-none transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F14] motion-reduce:transition-none motion-reduce:hover:scale-100 sm:px-6 sm:py-6"
            aria-label={`${slide.categoryLabel}: ${slide.title.replace(/\n/g, " ")}`}
            onMouseEnter={() => setBlockHovered(true)}
            onMouseLeave={() => setBlockHovered(false)}
            onFocus={() => setBlockHovered(true)}
            onBlur={() => setBlockHovered(false)}
          >
            <span
              className="mb-4 inline-flex min-h-[28px] items-center rounded-full px-4 font-inter text-[10px] font-semibold uppercase tracking-[0.16em] transition-opacity duration-300 group-hover:opacity-95"
              style={{
                backgroundColor: tone.bg,
                color: tone.fg,
                ...("border" in tone && tone.border
                  ? { border: `1px solid ${tone.border}` }
                  : {}),
              }}
            >
              {slide.categoryLabel}
            </span>

            <h1 className="w-full font-display text-[clamp(32px,7vw,56px)] font-semibold leading-[0.92] tracking-[-0.02em] text-[#FFFFFF] transition-colors duration-300 group-hover:text-white md:text-[clamp(44px,5vw,72px)] md:leading-[0.88]">
              {splitLineWithAccent(editorialTitle.line1, slide.accentWord)}
              {editorialTitle.line2 ? (
                <span
                  className={`mt-1 block transition-colors duration-300 group-hover:text-[#CBD5E1] ${GI_HERO_EDITORIAL.plpTitleLine2}`}
                >
                  {editorialTitle.line2}
                </span>
              ) : null}
            </h1>

            <p
              className={`mt-4 transition-colors duration-300 group-hover:text-[#CBD5E1] ${GI_HERO_EDITORIAL.plpSubtitle}`}
            >
              {slide.subtitle}
            </p>
          </Link>

          {count > 1 ? (
            <button
              type="button"
              onClick={() => go(index + 1)}
              className={CAROUSEL_ARROW_CLASS}
              aria-label={nextAria}
            >
              ›
            </button>
          ) : null}
        </motion.div>
      </div>
    </section>
  );
}
