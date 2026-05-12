"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import CompassSnowflakeFollower from "@/components/home/CompassSnowflakeFollower";
import HeroCompassCursor, {
  type CompassCardinalLabels,
} from "@/components/home/HeroCompassCursor";
import type { HeroCategoryCard } from "@/components/home/slides/HomeHeroCategorySlide";

const FALLBACK_IMG = "/assets/images/hero/hero.webp";

const CARD_RADIUS = "rounded-[1.35rem] md:rounded-[1.75rem]";

const luxuryEase = [0.19, 1, 0.22, 1] as const;
const hoverTransition = { duration: 0.72, ease: luxuryEase };

function ExpeditionOrb() {
  return (
    <div
      className="pointer-events-none flex h-[5.5rem] w-[5.5rem] shrink-0 items-center justify-center rounded-full border border-white/26 bg-gradient-to-br from-white/[0.14] via-white/[0.06] to-black/35 shadow-[inset_0_1px_0_rgba(255,255,255,0.2),0_10px_32px_-6px_rgba(0,0,0,0.42)] backdrop-blur-[6px] transition-[transform,box-shadow,border-color,background-color] duration-[720ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover/card:-translate-y-0.5 group-hover/card:scale-[1.06] group-hover/card:border-accent-gold/45 group-hover/card:shadow-[inset_0_1px_0_rgba(255,255,255,0.28),0_0_0_1px_rgba(217,138,36,0.22),0_14px_40px_-4px_rgba(0,0,0,0.48),0_0_36px_-6px_rgba(217,138,36,0.18)]"
      aria-hidden
    >
      <svg
        viewBox="0 0 24 24"
        className="h-[30px] w-[30px] translate-x-[0.5px] text-white/90 transition-[transform,color] duration-[720ms] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover/card:-rotate-[15deg] group-hover/card:text-accent-gold"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.35"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M7 17 17 7" />
        <path d="M8 7h9v9" />
      </svg>
    </div>
  );
}

type Props = {
  locale: Locale;
  cards: HeroCategoryCard[];
  cardinalLabels: CompassCardinalLabels;
  compassAriaLabel: string;
};

function CornerCard({
  card,
  locale,
  gridClass,
  onCardEnter,
  onCardLeave,
}: {
  card: HeroCategoryCard;
  locale: Locale;
  gridClass: string;
  onCardEnter: () => void;
  onCardLeave: () => void;
}) {
  const [src, setSrc] = useState(card.image);
  const reduceMotion = useReducedMotion();

  return (
    <Link
      href={`/${locale}/category/${card.slug}`}
      onMouseEnter={onCardEnter}
      onMouseLeave={onCardLeave}
      className={`group/card relative block w-full max-w-[810px] outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/45 focus-visible:ring-offset-4 focus-visible:ring-offset-white md:max-w-[756px] lg:max-w-[810px] ${gridClass}`}
    >
      <motion.div
        className={`relative flex min-h-[378px] w-full flex-col overflow-hidden sm:min-h-[432px] md:min-h-[454px] lg:min-h-[476px] ${CARD_RADIUS} border border-white/16 bg-white/[0.04] shadow-[0_20px_56px_-28px_rgba(17,23,19,0.42),0_0_0_1px_rgba(0,0,0,0.06),inset_0_1px_0_rgba(255,255,255,0.12),inset_0_0_48px_rgba(255,255,255,0.03)] ring-1 ring-black/[0.05]`}
        initial={false}
        whileHover={
          reduceMotion
            ? undefined
            : {
                y: -12,
                boxShadow:
                  "0 28px 64px -22px rgba(17,23,19,0.48), 0 0 0 1px rgba(217,138,36,0.18), inset 0 1px 0 rgba(255,255,255,0.16), inset 0 -24px 48px rgba(217,138,36,0.07), 0 0 52px -12px rgba(217,138,36,0.14)",
              }
        }
        transition={hoverTransition}
      >
        <div className="absolute inset-0 overflow-hidden rounded-[inherit]">
          <Image
            src={src}
            alt=""
            fill
            sizes="(max-width:768px) 45vw, 648px"
            className="object-cover object-center brightness-[1.07] contrast-[1.03] saturate-[1.06] transition-[transform,filter] duration-[900ms] ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform group-hover/card:scale-[1.045] group-hover/card:brightness-[1.16] group-hover/card:contrast-[1.04] motion-reduce:transition-none motion-reduce:group-hover/card:scale-100 motion-reduce:group-hover/card:brightness-[1.07]"
            onError={() => setSrc(FALLBACK_IMG)}
          />
          {/* Calidez editorial superior */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-b from-amber-100/15 via-transparent to-transparent opacity-80 mix-blend-soft-light"
            aria-hidden
          />
          {/* Profundidad cinematográfica */}
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-dark-base via-dark-base/50 to-dark-base/10 transition-opacity duration-[900ms] ease-out group-hover/card:from-dark-base/92 group-hover/card:via-dark-base/42"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.12),inset_0_-32px_64px_rgba(217,138,36,0.07)] transition-shadow duration-[900ms] group-hover/card:shadow-[inset_0_0_50px_rgba(0,0,0,0.08),inset_0_-28px_56px_rgba(217,138,36,0.12)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10"
            aria-hidden
          />
        </div>

        <div className="relative z-[2] mt-auto flex items-end justify-between gap-6 border-t border-white/10 bg-gradient-to-t from-black/50 via-black/28 to-transparent px-8 pb-8 pt-20 backdrop-blur-[10px] sm:px-10 sm:pb-8 sm:pt-24 supports-[backdrop-filter]:from-black/40 supports-[backdrop-filter]:via-black/18">
          <div className="min-w-0 flex-1 pr-4 text-left">
            <p className="font-display line-clamp-2 text-[0.875rem] font-semibold uppercase leading-snug tracking-[0.32em] text-accent-gold sm:text-[0.95rem] sm:tracking-[0.34em]">
              {card.title}
            </p>
            <p className="mt-3 line-clamp-3 font-sans text-[0.9375rem] font-normal leading-relaxed tracking-[0.01em] text-white/78 transition-colors duration-[720ms] group-hover/card:text-white/90 sm:text-base">
              {card.subtitle}
            </p>
          </div>
          <ExpeditionOrb />
        </div>
      </motion.div>
    </Link>
  );
}

export default function HomeCompassCategories({
  locale,
  cards,
  cardinalLabels,
  compassAriaLabel,
}: Props) {
  const [cardHoverDepth, setCardHoverDepth] = useState(0);
  const onCardEnter = useCallback(() => setCardHoverDepth((d) => d + 1), []);
  const onCardLeave = useCallback(() => setCardHoverDepth((d) => Math.max(0, d - 1)), []);
  const overCategoryCard = cardHoverDepth > 0;

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
    <section className="relative overflow-hidden bg-[#FFFFFF] py-16 sm:py-20 md:py-28">
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white via-transparent to-neutral-100/40"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_70%_at_50%_-5%,rgba(255,255,255,0.9),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_55%_45%_at_85%_95%,rgba(0,0,0,0.03),transparent_52%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.038] mix-blend-multiply"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden
      />

      <CompassSnowflakeFollower overCategoryCard={overCategoryCard} />

      <div className="relative z-[1] mx-auto max-w-[min(100%,1680px)] px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-16 md:grid md:min-h-[min(72vh,1674px)] md:grid-cols-[minmax(0,1.42fr)_minmax(0,0.58fr)_minmax(0,1.42fr)] md:grid-rows-3 md:items-stretch md:gap-14 lg:min-h-[1512px] lg:gap-16">
          <div className="grid grid-cols-2 gap-8 md:contents">
            <CornerCard
              card={tl}
              locale={locale}
              gridClass="md:col-start-1 md:row-start-1 md:justify-self-start"
              onCardEnter={onCardEnter}
              onCardLeave={onCardLeave}
            />
            <CornerCard
              card={tr}
              locale={locale}
              gridClass="md:col-start-3 md:row-start-1 md:justify-self-end"
              onCardEnter={onCardEnter}
              onCardLeave={onCardLeave}
            />
          </div>

          <div className="flex justify-center py-2 md:col-start-2 md:row-start-2 md:items-center md:justify-center md:py-0">
            <HeroCompassCursor ariaLabel={compassAriaLabel} cardinalLabels={cardinalLabels} />
          </div>

          <div className="grid grid-cols-2 gap-8 md:contents">
            <CornerCard
              card={bl}
              locale={locale}
              gridClass="md:col-start-1 md:row-start-3 md:self-end md:justify-self-start"
              onCardEnter={onCardEnter}
              onCardLeave={onCardLeave}
            />
            <CornerCard
              card={br}
              locale={locale}
              gridClass="md:col-start-3 md:row-start-3 md:self-end md:justify-self-end"
              onCardEnter={onCardEnter}
              onCardLeave={onCardLeave}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
