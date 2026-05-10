"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import HeroCompassCursor, {
  type CompassCardinalLabels,
} from "@/components/home/HeroCompassCursor";
import type { HeroCategoryCard } from "@/components/home/slides/HomeHeroCategorySlide";

const FALLBACK_IMG = "/assets/images/hero/hero.webp";

type Props = {
  locale: Locale;
  /** Cuatro categorías en orden: arriba-izq, arriba-der, abajo-izq, abajo-der */
  cards: HeroCategoryCard[];
  cardinalLabels: CompassCardinalLabels;
  compassAriaLabel: string;
};

function CornerCard({
  card,
  locale,
  gridClass,
}: {
  card: HeroCategoryCard;
  locale: Locale;
  gridClass: string;
}) {
  const [src, setSrc] = useState(card.image);

  return (
    <Link
      href={`/${locale}/category/${card.slug}`}
      className={`group relative flex min-h-[140px] flex-col overflow-hidden rounded-2xl border border-earth-brown/15 bg-dark-base shadow-[0_14px_44px_-20px_rgba(17,23,19,0.35)] ring-1 ring-black/[0.06] transition-[transform,box-shadow,border-color] duration-500 ease-out hover:z-[1] hover:scale-[1.02] hover:border-accent-gold/30 hover:shadow-[0_22px_56px_-22px_rgba(17,23,19,0.42)] motion-reduce:transition-none motion-reduce:hover:scale-100 sm:min-h-[160px] md:min-h-[168px] md:max-w-[280px] lg:min-h-[176px] lg:max-w-[300px] ${gridClass}`}
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width:768px) 45vw, 240px"
        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        onError={() => setSrc(FALLBACK_IMG)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-base via-dark-base/6 to-transparent" />
      <div className="relative z-[1] mt-auto p-3 sm:p-4">
        <p className="font-sans text-[0.62rem] font-semibold uppercase tracking-[0.26em] text-accent-gold/95">
          {card.title}
        </p>
        <p className="mt-1 line-clamp-2 font-sans text-xs leading-snug text-white/88 sm:text-[13px]">
          {card.subtitle}
        </p>
      </div>
    </Link>
  );
}

export default function HomeCompassCategories({
  locale,
  cards,
  cardinalLabels,
  compassAriaLabel,
}: Props) {
  const ordered: HeroCategoryCard[] = cards.slice(0, 4);
  while (ordered.length < 4) {
    ordered.push({
      slug: "mountain-snow",
      title: "—",
      subtitle: "",
      image: FALLBACK_IMG,
    });
  }

  const [tl, tr, bl, br] = ordered as [
    HeroCategoryCard,
    HeroCategoryCard,
    HeroCategoryCard,
    HeroCategoryCard,
  ];

  return (
    <section className="relative bg-soft-stone/80 py-14 sm:py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 md:grid md:min-h-[min(72vh,620px)] md:grid-cols-3 md:grid-rows-3 md:items-stretch md:gap-5 lg:min-h-[560px] lg:gap-6">
          <div className="grid grid-cols-2 gap-3 md:contents">
            <CornerCard
              card={tl}
              locale={locale}
              gridClass="md:col-start-1 md:row-start-1 md:justify-self-start"
            />
            <CornerCard
              card={tr}
              locale={locale}
              gridClass="md:col-start-3 md:row-start-1 md:justify-self-end"
            />
          </div>

          <div className="flex justify-center py-2 md:col-start-2 md:row-start-2 md:items-center md:justify-center md:py-0">
            <HeroCompassCursor ariaLabel={compassAriaLabel} cardinalLabels={cardinalLabels} />
          </div>

          <div className="grid grid-cols-2 gap-3 md:contents">
            <CornerCard
              card={bl}
              locale={locale}
              gridClass="md:col-start-1 md:row-start-3 md:self-end md:justify-self-start"
            />
            <CornerCard
              card={br}
              locale={locale}
              gridClass="md:col-start-3 md:row-start-3 md:self-end md:justify-self-end"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
