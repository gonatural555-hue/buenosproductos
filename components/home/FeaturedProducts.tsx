"use client";

import type { Product } from "@/lib/products";
import ProductCardSimple from "@/components/ProductCardSimple";
import type { Locale } from "@/lib/i18n/config";
import ScrollReveal from "@/components/blog/ScrollReveal";
import { pickHomeEssentialProducts } from "@/lib/home-featured-products";

type Props = {
  products: Product[];
  locale: Locale;
  title: string;
  subtitle: string;
  colorImageMaps?: Record<string, Record<string, string>>;
  labels?: {
    viewProduct?: string;
    noImage?: string;
    addToCart?: string;
    addNow?: string;
    newColor?: string;
    salePercentTemplate?: string;
  };
};

export default function FeaturedProducts({
  products,
  locale,
  title,
  subtitle,
  colorImageMaps = {},
  labels,
}: Props) {
  const featured = pickHomeEssentialProducts(products);

  return (
    <section
      id="essential-gear"
      className="scroll-mt-4 border-t border-[#E5E5E5] bg-white py-16 md:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-[1400px] px-4 md:px-6 lg:px-10">
        <ScrollReveal>
          <header className="mx-auto max-w-2xl text-center">
            <h2 className="font-display text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold tracking-tight text-black">
              {title}
            </h2>
            <p className="mt-4 font-inter text-sm leading-relaxed text-[#666666] md:text-base">
              {subtitle}
            </p>
          </header>
        </ScrollReveal>

        <div className="mt-10 grid grid-cols-2 gap-x-4 gap-y-8 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-10">
          {featured.map((product) => (
            <ScrollReveal key={product.id} delayMs={60}>
              <ProductCardSimple
                product={product}
                locale={locale}
                variant="patagonia"
                analyticsListId="home_essential"
                analyticsListName="home_essential_gear"
                labels={labels}
                colorImages={colorImageMaps[product.id]}
              />
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
