"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/lib/products";
import type { Locale } from "@/lib/i18n/config";
import ProductCardSimple from "@/components/ProductCardSimple";
import HorizontalSwipeHint from "@/components/HorizontalSwipeHint";

type Props = {
  title: string;
  products: Product[];
  locale: Locale;
  categoryHref: string;
  viewCategoryLabel: string;
  labels: {
    viewProduct: string;
    addToCart: string;
    noImage: string;
  };
  /** Lista GA4 para `select_item` en el carrusel home. */
  analyticsListName?: string;
};

const CARD_MIN = "min-w-[min(88vw,340px)] max-w-[340px] sm:min-w-[360px] sm:max-w-[380px]";

export default function HomeCategoryCarousel({
  title,
  products,
  locale,
  categoryHref,
  viewCategoryLabel,
  labels,
  analyticsListName = "home_category_carousel",
}: Props) {
  const rootRef = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { root: null, rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    obs.observe(node);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      ref={rootRef}
      className={`relative w-full overflow-hidden border-t border-white/5 bg-dark-base transition-all duration-700 ease-out motion-reduce:transition-none ${
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-10 motion-reduce:translate-y-0 motion-reduce:opacity-100"
      }`}
    >
      <div className="py-16 md:py-24 lg:py-28">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-16">
          <header className="flex flex-col items-center text-center gap-4">
            <h2 className="section-display text-3xl md:text-4xl font-semibold tracking-tight text-text-primary max-w-[20ch] md:max-w-none">
              {title}
            </h2>
            <Link
              href={categoryHref}
              className="shrink-0 text-sm font-semibold uppercase tracking-[0.2em] text-accent-gold border-b border-accent-gold/40 pb-1 transition hover:text-accent-gold/90 hover:border-accent-gold/70"
            >
              {viewCategoryLabel}
            </Link>
          </header>

          {products.length > 0 ? <HorizontalSwipeHint className="mt-8" /> : null}

          <div
            className={`${
              products.length > 0 ? "mt-3 md:mt-12" : "mt-10 md:mt-12"
            } overflow-x-auto overflow-y-visible pb-4 scrollbar-rail-premium scroll-smooth snap-x snap-mandatory`}
            style={{ WebkitOverflowScrolling: "touch" }}
          >
            <div className="flex gap-5 md:gap-7 w-max pr-8">
              {products.length === 0 ? (
                <p className="text-sm text-text-muted max-w-md py-8">
                  {viewCategoryLabel}
                </p>
              ) : (
                products.map((product) => (
                  <div
                    key={product.id}
                    className={`snap-start shrink-0 ${CARD_MIN} rounded-2xl transition-[transform,box-shadow] duration-500 ease-out will-change-transform hover:scale-[1.04] hover:z-10 hover:shadow-[0_28px_56px_-12px_rgba(0,0,0,0.55)] motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none`}
                  >
                    <ProductCardSimple
                      product={product}
                      locale={locale}
                      analyticsListName={analyticsListName}
                      labels={labels}
                    />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
