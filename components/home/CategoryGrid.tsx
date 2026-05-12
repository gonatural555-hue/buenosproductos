"use client";

import Image from "next/image";
import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { HOME_CATEGORY_IMAGE } from "@/lib/home-category-visuals";
import ScrollReveal from "@/components/blog/ScrollReveal";

export type CategoryCard = {
  label: string;
  /** Navega a /{locale}/category/[slug] */
  slug?: string;
  /** Ruta sin locale, p. ej. /products */
  path?: string;
  /** Clave en HOME_CATEGORY_IMAGE para la imagen (si no hay slug útil) */
  imageKey?: string;
};

type CategoryGridProps = {
  locale: Locale;
  title: string;
  subtitle: string;
  cards: CategoryCard[];
};

export default function CategoryGrid({
  locale,
  title,
  subtitle,
  cards,
}: CategoryGridProps) {
  return (
    <section className="border-t border-earth-brown/10 bg-[#FFFFFF] py-20 md:py-28">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-12">
        <ScrollReveal>
          <header className="mx-auto max-w-2xl text-center">
            <h2 className="font-display font-semibold tracking-tight text-dark-base text-[clamp(1.65rem,3.2vw,2.25rem)]">
              {title}
            </h2>
            <p className="mt-3 text-sm text-muted-gray md:text-base">{subtitle}</p>
          </header>
        </ScrollReveal>

        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {cards.map((card, i) => {
            const href =
              card.path != null && card.path !== ""
                ? `/${locale}${card.path.startsWith("/") ? card.path : `/${card.path}`}`
                : card.slug
                  ? `/${locale}/category/${card.slug}`
                  : `/${locale}/products`;
            const imageLookupKey =
              card.imageKey ?? card.slug ?? "outdoor-adventure";
            const src =
              HOME_CATEGORY_IMAGE[imageLookupKey] ??
              "/assets/images/hero/trekking.webp";
            return (
              <ScrollReveal key={`${card.label}-${i}`} delayMs={i * 70}>
                <Link
                  href={href}
                  className="group relative block aspect-[4/5] min-h-[200px] overflow-hidden rounded-sm sm:min-h-[240px]"
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="(max-width:640px)100vw,25vw"
                    className="object-cover object-center transition duration-[900ms] ease-out group-hover:scale-[1.06]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-base via-dark-base/40 to-transparent opacity-90 transition duration-500 group-hover:from-dark-base/90" />
                  <div className="absolute inset-x-0 bottom-0 p-5 md:p-6">
                    <span className="text-[0.65rem] font-medium uppercase tracking-[0.28em] text-accent-gold/90">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="font-display mt-2 text-lg font-medium leading-snug tracking-tight text-white md:text-xl">
                      {card.label}
                    </p>
                  </div>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
