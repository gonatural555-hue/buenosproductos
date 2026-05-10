"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";

const FALLBACK_IMG = "/assets/images/hero/hero.webp";

export type HeroCategoryCard = {
  title: string;
  subtitle: string;
  slug: string;
  image: string;
};

type Props = {
  locale: Locale;
  eyebrow: string;
  headline: string;
  cards: HeroCategoryCard[];
};

function CategoryCard({
  card,
  locale,
}: {
  card: HeroCategoryCard;
  locale: Locale;
}) {
  const [src, setSrc] = useState(card.image);

  return (
    <Link
      href={`/${locale}/category/${card.slug}`}
      className="group relative min-h-[140px] flex-1 overflow-hidden rounded-xl border border-white/10 bg-dark-base shadow-[0_12px_40px_-16px_rgba(0,0,0,0.45)] ring-1 ring-white/[0.06] transition-[transform,box-shadow,border-color] duration-500 ease-out hover:z-[1] hover:scale-[1.02] hover:border-accent-gold/35 hover:shadow-[0_20px_50px_-18px_rgba(0,0,0,0.55)] motion-reduce:transition-none motion-reduce:hover:scale-100 sm:min-h-0 sm:min-h-[180px] md:rounded-2xl"
    >
      <Image
        src={src}
        alt=""
        fill
        sizes="(max-width:640px) 45vw, 25vw"
        className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        onError={() => setSrc(FALLBACK_IMG)}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-dark-base via-dark-base/55 to-dark-base/15" />
      <div className="absolute inset-x-0 bottom-0 z-[1] p-3 sm:p-4 md:p-5">
        <p className="font-sans text-[0.6rem] font-semibold uppercase tracking-[0.28em] text-accent-gold/90">
          {card.title}
        </p>
        <p className="mt-1 font-sans text-xs leading-snug text-white/85 line-clamp-2 sm:text-sm md:line-clamp-3">
          {card.subtitle}
        </p>
      </div>
    </Link>
  );
}

export default function HomeHeroCategorySlide({
  locale,
  eyebrow,
  headline,
  cards,
}: Props) {
  return (
    <div className="absolute inset-0 flex flex-col bg-gradient-to-br from-dark-base via-[#151c18] to-dark-base">
      <div className="flex shrink-0 flex-col px-4 pb-3 pt-10 text-center sm:px-8 sm:pb-4 sm:pt-12 md:pt-14">
        <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.32em] text-accent-gold/90">
          {eyebrow}
        </p>
        <h2 className="font-display mx-auto mt-3 max-w-xl text-xl font-semibold leading-tight tracking-tight text-white sm:text-2xl md:text-[clamp(1.35rem,2.8vw,1.85rem)]">
          {headline}
        </h2>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-2 gap-2 px-3 pb-6 sm:gap-3 sm:px-6 sm:pb-8 md:grid-cols-4 md:gap-4 md:px-8">
        {cards.map((card) => (
          <CategoryCard key={card.slug} card={card} locale={locale} />
        ))}
      </div>
    </div>
  );
}
