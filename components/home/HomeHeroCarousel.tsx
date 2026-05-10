"use client";

import { useEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import HomeHeroVideoSlide from "@/components/home/slides/HomeHeroVideoSlide";
import HomeHeroCategorySlide, {
  type HeroCategoryCard,
} from "@/components/home/slides/HomeHeroCategorySlide";
import HomeHeroProductsSlide, {
  type HeroProductPayload,
} from "@/components/home/slides/HomeHeroProductsSlide";
const SLIDE_COUNT = 3;

export type HomeHeroCarouselProps = {
  locale: Locale;
  tagline: string;
  title: string;
  subtitle: string;
  ctaProducts: string;
  ctaJournal: string;
  imageSrc?: string;
  imageAlt?: string;
  videoSrc?: string;
  videoSrcMobile?: string;
  categorySlide: {
    eyebrow: string;
    headline: string;
    cards: HeroCategoryCard[];
  };
  productsSlide: {
    eyebrow: string;
    headline: string;
    subline: string;
    ctaLabel: string;
    stripLabel: string;
    main: HeroProductPayload;
    strip: HeroProductPayload[];
  };
  /** Cuando true: sin sección full-viewport; rellena la tarjeta bento padre. */
  embedded?: boolean;
};

function CarouselDots({
  index,
  onSelect,
  className,
}: {
  index: number;
  onSelect: (i: number) => void;
  className?: string;
}) {
  return (
    <div
      className={`pointer-events-auto flex flex-col gap-2.5 ${className ?? ""}`}
      role="tablist"
      aria-label="Hero slides"
    >
      {Array.from({ length: SLIDE_COUNT }).map((_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          aria-selected={index === i}
          aria-label={`Slide ${i + 1}`}
          onClick={() => onSelect(i)}
          className={`h-2 w-2 rounded-full border transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/50 focus-visible:ring-offset-2 focus-visible:ring-offset-warm-sand ${
            index === i
              ? "scale-125 border-accent-gold bg-accent-gold shadow-[0_0_14px_rgba(217,138,36,0.4)]"
              : "border-earth-brown/40 bg-soft-stone/90 hover:border-earth-brown/55 hover:bg-white"
          }`}
        />
      ))}
    </div>
  );
}

function CarouselArrow({
  direction,
  onClick,
  label,
  className,
}: {
  direction: "prev" | "next";
  onClick: () => void;
  label: string;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={`pointer-events-auto absolute top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/18 bg-white/12 text-white shadow-[0_8px_28px_-8px_rgba(0,0,0,0.45)] backdrop-blur-md transition hover:border-white/35 hover:bg-white/22 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/55 md:h-11 md:w-11 ${className ?? ""}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.75}
        stroke="currentColor"
        className="h-5 w-5"
        aria-hidden
      >
        {direction === "prev" ? (
          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
        ) : (
          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
        )}
      </svg>
    </button>
  );
}

export default function HomeHeroCarousel({
  locale,
  tagline,
  title,
  subtitle,
  ctaProducts,
  ctaJournal,
  imageSrc = "/assets/images/hero/hero.webp",
  imageAlt = "",
  videoSrc = "/assets/images/hero/hero-home.mp4",
  videoSrcMobile = "/assets/images/hero/hero-home-mobile.mp4",
  categorySlide,
  productsSlide,
  embedded = false,
}: HomeHeroCarouselProps) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [scroll, setScroll] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReduceMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const onScroll = () => setScroll(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (reduceMotion || paused) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % SLIDE_COUNT);
    }, 3500);
    return () => window.clearInterval(id);
  }, [reduceMotion, paused]);

  const fade = embedded || reduceMotion ? 1 : Math.max(0.35, 1 - scroll / 520);
  const lift = embedded || reduceMotion ? 0 : scroll * 0.12;

  const go = (delta: number) => {
    setIndex((i) => (i + delta + SLIDE_COUNT) % SLIDE_COUNT);
  };

  const shell = (
    <div
      className={
        embedded
          ? "relative flex h-full min-h-0 w-full flex-col"
          : "relative w-full max-w-none"
      }
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className={embedded ? "relative flex h-full min-h-0 w-full flex-1 flex-col" : "relative mx-auto w-full"}>
        {!embedded ? (
          <>
            <CarouselDots
              index={index}
              onSelect={setIndex}
              className="absolute left-0 top-1/2 z-30 hidden -translate-x-[calc(100%+10px)] -translate-y-1/2 sm:flex md:-translate-x-[calc(100%+18px)]"
            />
            <CarouselDots
              index={index}
              onSelect={setIndex}
              className="absolute right-0 top-1/2 z-30 hidden translate-x-[calc(100%+10px)] -translate-y-1/2 sm:flex md:translate-x-[calc(100%+18px)]"
            />
          </>
        ) : null}

        <CarouselArrow
          direction="prev"
          label="Previous slide"
          onClick={() => go(-1)}
          className={embedded ? "left-3 sm:left-3" : "left-10 sm:left-3 md:left-4"}
        />
        <CarouselArrow
          direction="next"
          label="Next slide"
          onClick={() => go(1)}
          className={embedded ? "right-3 sm:right-3" : "right-10 sm:right-3 md:right-4"}
        />

        <div
          className={
            embedded
              ? "relative flex min-h-0 w-full flex-1 flex-col overflow-hidden rounded-[inherit] shadow-[0_20px_64px_-28px_rgba(0,0,0,0.45)] ring-0"
              : "relative w-full overflow-hidden rounded-[1.35rem] shadow-[0_24px_80px_-20px_rgba(0,0,0,0.55)] ring-1 ring-black/[0.08] md:rounded-[1.75rem]"
          }
        >
          <CarouselDots
            index={index}
            onSelect={setIndex}
            className={
              embedded
                ? "absolute left-3 top-1/2 z-[25] flex -translate-y-1/2"
                : "absolute left-3 top-1/2 z-[25] flex -translate-y-1/2 sm:hidden"
            }
          />
          <div
            className={
              embedded
                ? "relative min-h-[min(52vh,420px)] w-full flex-1 sm:min-h-[min(48vh,460px)] lg:min-h-0 lg:h-full lg:max-h-none"
                : "relative aspect-[4/5] w-full min-h-[min(68vh,560px)] max-h-[86vh] sm:aspect-[16/10] sm:min-h-[min(56vh,520px)] lg:aspect-auto lg:h-[min(60vh,660px)] lg:min-h-[420px] lg:max-h-[680px]"
            }
          >
            <div
              className={`absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                index === 0 ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
              }`}
              aria-hidden={index !== 0}
            >
              <HomeHeroVideoSlide
                locale={locale}
                tagline={tagline}
                title={title}
                subtitle={subtitle}
                ctaProducts={ctaProducts}
                ctaJournal={ctaJournal}
                imageSrc={imageSrc}
                imageAlt={imageAlt}
                videoSrc={videoSrc}
                videoSrcMobile={videoSrcMobile}
                isActive={index === 0}
                scroll={scroll}
                reduceMotion={reduceMotion}
              />
            </div>

            <div
              className={`absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                index === 1 ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
              }`}
              aria-hidden={index !== 1}
            >
              <HomeHeroCategorySlide
                locale={locale}
                eyebrow={categorySlide.eyebrow}
                headline={categorySlide.headline}
                cards={categorySlide.cards}
              />
            </div>

            <div
              className={`absolute inset-0 transition-opacity duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none ${
                index === 2 ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
              }`}
              aria-hidden={index !== 2}
            >
              <HomeHeroProductsSlide
                eyebrow={productsSlide.eyebrow}
                headline={productsSlide.headline}
                subline={productsSlide.subline}
                ctaLabel={productsSlide.ctaLabel}
                stripLabel={productsSlide.stripLabel}
                main={productsSlide.main}
                strip={productsSlide.strip}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (embedded) {
    return <div className="relative h-full min-h-0 w-full overflow-x-hidden">{shell}</div>;
  }

  return (
    <section className="relative flex min-h-[100dvh] w-full items-center justify-center overflow-x-hidden bg-warm-sand px-4 py-24 sm:px-5 sm:py-28 md:px-6 md:py-24 lg:px-8">
      <div
        className="relative w-full transition-[opacity,transform] duration-300 ease-out"
        style={{
          opacity: fade,
          transform: reduceMotion ? undefined : `translateY(${lift}px)`,
        }}
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        {shell}
      </div>

      <div
        className="pointer-events-none absolute bottom-6 left-1/2 z-20 -translate-x-1/2 motion-reduce:hidden"
        style={{ opacity: fade }}
        aria-hidden
      >
        <div className="flex h-11 w-6 justify-center rounded-full border border-earth-brown/35 bg-soft-stone/80 shadow-[0_4px_16px_rgba(17,23,19,0.08)] backdrop-blur-[2px]">
          <div className="mt-2 h-1.5 w-px animate-pulse rounded-full bg-earth-brown/55" />
        </div>
      </div>
    </section>
  );
}
