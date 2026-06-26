"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  GI_EASE,
  GI_HERO_TOP_PAD,
  GI_PRODUCTS_CATEGORY_TONES,
  type GiProductsCategoryTone,
} from "@/lib/ui/goodideas-design";

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
  dotAriaTemplate: string;
};

function splitLineWithAccent(line: string, accent: string | undefined) {
  const a = accent?.trim();
  if (!line) return null;
  if (!a || !line.includes(a)) {
    return <span className="text-balance text-[#E8ECF1]">{line}</span>;
  }
  const i = line.indexOf(a);
  return (
    <span className="text-balance text-[#E8ECF1]">
      {line.slice(0, i)}
      <span className="text-[#3B82F6]">{a}</span>
      {line.slice(i + a.length)}
    </span>
  );
}

export default function GoodIdeasProductsCarouselHeader({
  slides,
  prevAria,
  nextAria,
  dotAriaTemplate,
}: Props) {
  const reduceMotion = useReducedMotion() ?? false;
  const [index, setIndex] = useState(0);
  const count = slides.length;

  const go = useCallback(
    (next: number) => {
      if (count === 0) return;
      setIndex(((next % count) + count) % count);
    },
    [count]
  );

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

  return (
    <section
      className="relative isolate overflow-x-clip border-b border-white/[0.08] bg-[#0B0F14] text-[#E8ECF1]"
      aria-roledescription="carousel"
      aria-label={slide.title.replace(/\n/g, " ")}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,rgba(59,130,246,0.22),transparent_60%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:56px_56px]"
        aria-hidden
      />

      <div
        className={`relative z-[1] mx-auto flex min-h-[min(42svh,380px)] w-full max-w-[1080px] flex-col justify-center px-[18px] py-10 md:min-h-[min(38svh,360px)] md:px-[28px] md:py-12 lg:px-[48px] ${GI_HERO_TOP_PAD}`}
      >
        <motion.div
          key={slide.id}
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: GI_EASE }}
          className="mx-auto flex w-full max-w-[980px] flex-col items-center text-center"
        >
          <span
            className="mb-4 inline-flex min-h-[28px] items-center rounded-full px-4 font-inter text-[10px] font-semibold uppercase tracking-[0.16em]"
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

          <h1 className="w-full font-display text-[clamp(32px,7vw,56px)] font-semibold leading-[0.92] tracking-[-0.02em] md:text-[clamp(44px,5vw,72px)] md:leading-[0.88]">
            {splitLineWithAccent(editorialTitle.line1, slide.accentWord)}
            {editorialTitle.line2 ? (
              <span className="mt-1 block text-balance text-[rgba(232,236,241,0.55)]">
                {editorialTitle.line2}
              </span>
            ) : null}
          </h1>

          <p className="mt-4 max-w-lg font-inter text-[clamp(15px,3.2vw,17px)] leading-relaxed text-[rgba(232,236,241,0.72)] md:mt-5">
            {slide.subtitle}
          </p>
        </motion.div>

        {count > 1 ? (
          <div className="relative z-[2] mt-8 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => go(index - 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.12] text-[#E8ECF1] transition hover:border-[#3B82F6]/40 hover:text-[#3B82F6]"
              aria-label={prevAria}
            >
              ‹
            </button>
            <div className="flex gap-2">
              {slides.map((s, i) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setIndex(i)}
                  className={`h-2 w-2 rounded-full transition ${
                    i === index ? "bg-[#3B82F6]" : "bg-white/25 hover:bg-white/40"
                  }`}
                  aria-label={dotAriaTemplate.replace("{n}", String(i + 1))}
                  aria-current={i === index ? "true" : undefined}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => go(index + 1)}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.12] text-[#E8ECF1] transition hover:border-[#3B82F6]/40 hover:text-[#3B82F6]"
              aria-label={nextAria}
            >
              ›
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
