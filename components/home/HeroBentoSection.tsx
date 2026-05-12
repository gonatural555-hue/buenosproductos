"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { HomeHeroCarouselProps } from "@/components/home/HomeHeroCarousel";
import PremiumImageOverlay from "@/components/ui/PremiumImageOverlay";
import {
  premiumPrimaryCtaClass,
  premiumSecondaryCtaClass,
} from "@/lib/ui/premium-cta-classes";

/**
 * Hero de Home: vista cinematográfica tipo Journal (antes BlogHero).
 * Carrusel / bento vive en `BentoHeroSection` (p. ej. `/blog`).
 */
export default function HeroBentoSection({
  locale,
  tagline,
  title,
  subtitle,
  ctaProducts,
  ctaJournal,
  imageSrc = "/assets/images/hero/hero.webp",
  imageAlt = "",
}: HomeHeroCarouselProps) {
  const [scroll, setScroll] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);

    const onScroll = () => setScroll(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const fade = reduceMotion ? 1 : Math.max(0.35, 1 - scroll / 520);
  const lift = reduceMotion ? 0 : scroll * 0.15;

  return (
    <section
      className="relative min-h-[min(100dvh,40rem)] w-full overflow-hidden bg-dark-base"
      aria-label="Hero"
    >
      <div className="absolute inset-0">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
          style={
            reduceMotion
              ? undefined
              : {
                  transform: `scale(1.06) translateY(${scroll * 0.12}px)`,
                }
          }
        />
        <PremiumImageOverlay />
      </div>

      <div
        className="relative z-10 flex min-h-[min(100dvh,40rem)] flex-col items-center justify-center px-6 pb-16 pt-[calc(env(safe-area-inset-top,0px)+5.25rem)] text-center sm:px-10 sm:pb-20 sm:pt-[calc(env(safe-area-inset-top,0px)+5.5rem)] md:pt-[calc(env(safe-area-inset-top,0px)+5.75rem)]"
        style={{
          opacity: fade,
          transform: reduceMotion ? undefined : `translateY(${lift}px)`,
        }}
      >
        <p className="text-[0.7rem] font-medium uppercase tracking-[0.35em] text-accent-gold/90 sm:text-xs">
          {tagline}
        </p>
        <h1 className="hero-display mt-6 max-w-4xl font-semibold tracking-tight text-white text-[clamp(2.5rem,6vw,4.5rem)] leading-[1.05] [text-shadow:0_2px_28px_rgba(0,0,0,0.45)]">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/85 sm:text-lg">
          {subtitle}
        </p>
        <div className="mt-10 flex w-full max-w-md flex-col items-stretch justify-center gap-3 sm:max-w-none sm:flex-row sm:gap-4">
          <Link href={`/${locale}/products`} className={premiumPrimaryCtaClass}>
            {ctaProducts}
          </Link>
          <Link href={`/${locale}/blog`} className={premiumSecondaryCtaClass}>
            {ctaJournal}
          </Link>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-8 left-1/2 z-10 -translate-x-1/2 motion-reduce:hidden"
        style={{ opacity: fade }}
        aria-hidden
      >
        <div className="flex h-11 w-6 justify-center rounded-full border border-white/35 shadow-[0_4px_16px_rgba(0,0,0,0.35)] backdrop-blur-[2px]">
          <div className="mt-2 h-1.5 w-px animate-pulse rounded-full bg-white/65" />
        </div>
      </div>
    </section>
  );
}
