"use client";

import type { Product } from "@/lib/products";
import ProductCardSimple from "@/components/ProductCardSimple";
import type { Locale } from "@/lib/i18n/config";
import ScrollReveal from "@/components/blog/ScrollReveal";

type Props = {
  products: Product[];
  locale: Locale;
  title: string;
  subtitle: string;
  labels?: {
    viewProduct?: string;
    noImage?: string;
    addToCart?: string;
  };
};

const FEATURED_IDS = [
  "gn-ski-snow-001",
  "gn-cycling-011",
  "gn-cycling-eq-001",
  "gn-cycling-jacket-003",
  "gn-water-007",
  "gn-outdoor-009",
];

/**
 * Conversion block without loud ecommerce: curated grid, same cards as storefront, editorial spacing.
 */
export default function FeaturedProducts({
  products,
  locale,
  title,
  subtitle,
  labels,
}: Props) {
  const featured = FEATURED_IDS.map((id) => products.find((p) => p.id === id)).filter(
    (p): p is Product => Boolean(p)
  );

  return (
    <section
      id="essential-gear"
      className="scroll-mt-4 border-t border-white/[0.05] bg-[#0a0e0d] py-20 md:py-28 lg:py-32"
    >
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-12">
        <ScrollReveal>
          <header className="mx-auto max-w-2xl text-center">
            <h2 className="font-semibold tracking-tight text-text-primary text-[clamp(1.75rem,3.5vw,2.5rem)]">
              {title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-text-muted md:text-base">
              {subtitle}
            </p>
          </header>
        </ScrollReveal>

        <div className="mt-14 grid gap-8 md:grid-cols-2 md:gap-10 lg:grid-cols-3 lg:gap-12">
          {featured.map((product) => (
            <ScrollReveal key={product.id} delayMs={60}>
              <ProductCardSimple
                product={product}
                locale={locale}
                analyticsListId="home_essential"
                analyticsListName="home_essential_gear"
                labels={labels}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
