"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Product } from "@/lib/products";
import type { Locale } from "@/lib/i18n/config";
import ProductCardSimple from "@/components/ProductCardSimple";
import ProductsHeroLuxuryCompass from "@/components/products/ProductsHeroLuxuryCompass";
import { LUMINOUS_EDGE_CARD } from "@/lib/ui/luminous-edge";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Hero /products: acerca el bloque al header respecto al patrón global del home. */
const PRODUCTS_HERO_TOP_PAD =
  "pt-[calc(env(safe-area-inset-top,0px)+0.5rem+9.375rem+6px)] sm:pt-[calc(env(safe-area-inset-top,0px)+0.5rem+9.625rem+6px)] md:pt-[calc(env(safe-area-inset-top,0px)+0.75rem+9.875rem+6px)]";

type CompassLabels = {
  north: string;
  south: string;
  east: string;
  west: string;
};

type ProductsHeroProps = {
  locale: Locale;
  /** Carrusel destacado (orden ya resuelto en servidor). */
  featuredProducts: Product[];
  labels: {
    viewProduct: string;
    addToCart: string;
    noImage: string;
  };
  eyebrow: string;
  title: string;
  subtitle: string;
  freeShippingBadge: string;
  compassAria: string;
  compassLabels: CompassLabels;
  searchHint?: string | null;
  featuredRailLabel: string;
  carouselPrevAria?: string;
  carouselNextAria?: string;
};

function usePerView() {
  const [n, setN] = useState(3);
  useEffect(() => {
    const read = () => {
      const w = typeof window !== "undefined" ? window.innerWidth : 1200;
      if (w < 640) setN(1);
      else if (w < 1024) setN(2);
      else setN(3);
    };
    read();
    window.addEventListener("resize", read, { passive: true });
    return () => window.removeEventListener("resize", read);
  }, []);
  return n;
}

export default function ProductsHero({
  locale,
  featuredProducts,
  labels,
  eyebrow,
  title,
  subtitle,
  freeShippingBadge,
  compassAria,
  compassLabels,
  searchHint,
  featuredRailLabel,
  carouselPrevAria = "Previous products",
  carouselNextAria = "Next products",
}: ProductsHeroProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const perView = usePerView();
  const slides = useMemo(() => featuredProducts.filter(Boolean), [featuredProducts]);
  const maxStart = Math.max(0, slides.length - perView);
  const [start, setStart] = useState(0);

  useEffect(() => {
    setStart((s) => Math.min(s, maxStart));
  }, [maxStart]);

  const visible = useMemo(
    () => slides.slice(start, start + perView),
    [slides, start, perView]
  );

  const goPrev = useCallback(() => {
    setStart((s) => Math.max(0, s - 1));
  }, []);
  const goNext = useCallback(() => {
    setStart((s) => Math.min(maxStart, s + 1));
  }, [maxStart]);

  const container = {
    hidden: reduceMotion ? { opacity: 1 } : { opacity: 0 },
    show: {
      opacity: 1,
      transition: reduceMotion
        ? { duration: 0 }
        : { staggerChildren: 0.08, delayChildren: 0.06, ease: EASE },
    },
  };
  const item = {
    hidden: reduceMotion ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.62, ease: EASE },
    },
  };

  return (
    <section
      className="relative overflow-x-hidden border-b border-[rgba(46,74,54,0.08)] bg-[#F4EBDD]"
      aria-label={title}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_55%_at_50%_0%,rgba(217,164,65,0.08),transparent_52%)]"
        aria-hidden
      />

      <motion.div
        className={`relative z-[1] mx-auto w-full max-w-[1400px] px-[18px] pb-10 sm:px-7 sm:pb-12 md:px-10 md:pb-14 lg:px-12 lg:pb-16 ${PRODUCTS_HERO_TOP_PAD}`}
        variants={container}
        initial="hidden"
        animate="show"
      >
        <div className="grid grid-cols-1 items-center justify-items-center gap-6 text-center sm:gap-7 lg:grid-cols-2 lg:items-start lg:justify-items-stretch lg:gap-8 lg:text-left xl:gap-10">
          <div className="flex min-w-0 max-w-xl flex-col items-center space-y-3 sm:space-y-3.5 lg:max-w-none lg:items-start lg:space-y-4">
            <motion.p
              variants={item}
              className="font-inter text-[11px] font-semibold uppercase tracking-[0.28em] text-[#C9622B] sm:text-xs"
            >
              {eyebrow}
            </motion.p>
            <motion.h1
              variants={item}
              className="max-w-xl font-[family-name:var(--font-tan-nimbus),Georgia,serif] text-[clamp(1.55rem,3.9vw,2.65rem)] font-semibold leading-[1.06] tracking-[-0.02em] text-[#2E4A36] sm:text-[clamp(1.65rem,3.5vw,2.7rem)] lg:mx-0 lg:text-[clamp(1.85rem,2.6vw,2.75rem)]"
            >
              {title}
            </motion.h1>
            <motion.p
              variants={item}
              className="max-w-md font-inter text-sm leading-relaxed text-[rgba(46,74,54,0.82)] md:text-[15px] md:leading-relaxed lg:mx-0"
            >
              {subtitle}
            </motion.p>
            <motion.div variants={item} className="flex justify-center pt-1 lg:justify-start">
              <span className="inline-flex rounded-full border border-[#2E4A36]/25 bg-[#2E4A36] px-4 py-2 font-inter text-[11px] font-semibold uppercase tracking-[0.14em] text-[#F4EBDD] shadow-[0_8px_28px_-14px_rgba(46,74,54,0.35)] transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 md:text-xs">
                {freeShippingBadge}
              </span>
            </motion.div>

            <motion.div variants={item} className="flex w-full justify-center pt-2 lg:justify-start lg:pt-3">
              <ProductsHeroLuxuryCompass
                ariaLabel={compassAria}
                labels={compassLabels}
                reduceMotion={reduceMotion}
              />
            </motion.div>
          </div>

          <motion.div
            variants={item}
            className="flex w-full min-w-0 max-w-[min(100%,360px)] flex-col items-center max-lg:mt-1 lg:max-w-none lg:items-stretch lg:pl-1 xl:pl-2"
          >
            {slides.length > 0 ? (
              <div className="relative w-full lg:-mt-1">
                <div
                  className={`overflow-hidden rounded-[1.2rem] border border-[rgba(46,74,54,0.1)] bg-[#F4EBDD]/90 p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.55),0_12px_40px_-18px_rgba(17,23,19,0.1)] ring-1 ring-[rgba(46,74,54,0.06)] sm:rounded-[1.35rem] sm:p-4 md:rounded-[1.65rem] md:p-5 ${LUMINOUS_EDGE_CARD}`}
                >
                  <div className="mb-3 flex w-full flex-col items-center gap-2.5 sm:mb-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
                    <p className="text-center font-inter text-[11px] font-medium uppercase tracking-[0.2em] text-[rgba(46,74,54,0.55)] sm:text-left">
                      {featuredRailLabel}
                    </p>
                    <div className="flex flex-col items-center gap-2 sm:flex-row sm:gap-2">
                      <button
                        type="button"
                        onClick={goPrev}
                        disabled={start <= 0}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(46,74,54,0.15)] text-[#2E4A36] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#2E4A36]/35 hover:bg-[rgba(46,74,54,0.04)] disabled:pointer-events-none disabled:opacity-35"
                        aria-label={carouselPrevAria}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        onClick={goNext}
                        disabled={start >= maxStart}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[rgba(46,74,54,0.15)] text-[#2E4A36] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#2E4A36]/35 hover:bg-[rgba(46,74,54,0.04)] disabled:pointer-events-none disabled:opacity-35"
                        aria-label={carouselNextAria}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  <motion.div
                    key={`${start}-${perView}`}
                    initial={reduceMotion ? false : { opacity: 0.85, x: 8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.55, ease: EASE }}
                    className="grid grid-cols-1 justify-items-center gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 lg:justify-items-stretch lg:gap-6"
                  >
                    {visible.map((product) => (
                      <div key={product.id} className="min-w-0">
                        <ProductCardSimple
                          product={product}
                          locale={locale}
                          labels={labels}
                          analyticsListId="products_hero"
                          analyticsListName="products_hero_carousel"
                          surface="light"
                        />
                      </div>
                    ))}
                  </motion.div>
                </div>
              </div>
            ) : null}
            {searchHint ? (
              <p className="mt-4 text-center font-inter text-xs text-[rgba(46,74,54,0.72)] md:text-sm">
                {searchHint}
              </p>
            ) : null}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
}
