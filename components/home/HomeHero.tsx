"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import PremiumImageOverlay from "@/components/ui/PremiumImageOverlay";
import {
  premiumPrimaryCtaClass,
  premiumSecondaryCtaClass,
} from "@/lib/ui/premium-cta-classes";

type HomeHeroProps = {
  locale: Locale;
  tagline: string;
  title: string;
  subtitle: string;
  ctaProducts: string;
  ctaJournal: string;
  /** Poster / fallback estático (LCP y prefers-reduced-motion) */
  imageSrc?: string;
  imageAlt?: string;
  /** Vídeo en loop en desktop (desde 768px, breakpoint `md`) */
  videoSrc?: string;
  /** Vídeo en loop en móvil (por debajo de 768px) */
  videoSrcMobile?: string;
};

/**
 * Fullscreen cinematic hero — same language as Blog (overlay, gold accent, soft scroll fade).
 */
export default function HomeHero({
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
}: HomeHeroProps) {
  const [scroll, setScroll] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  /** Alineado con Tailwind `md` (768px): móvil si el ancho es menor */
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobileViewport(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onScroll = () => setScroll(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const activeVideoSrc = isMobileViewport ? videoSrcMobile : videoSrc;

  const fade = reduceMotion ? 1 : Math.max(0.35, 1 - scroll / 520);
  const lift = reduceMotion ? 0 : scroll * 0.12;

  return (
    <section className="relative h-[100dvh] min-h-[28rem] w-full overflow-hidden bg-dark-base">
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 overflow-hidden"
          style={
            reduceMotion
              ? undefined
              : {
                  transform: `scale(1.06) translateY(${scroll * 0.1}px)`,
                }
          }
        >
          {reduceMotion ? (
            <Image
              src={imageSrc}
              alt={imageAlt || ""}
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
            />
          ) : (
            <video
              key={activeVideoSrc}
              className="absolute inset-0 h-full w-full object-cover object-center opacity-90 grayscale"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              poster={imageSrc}
              aria-hidden
            >
              <source src={activeVideoSrc} type="video/mp4" />
            </video>
          )}
        </div>
        <PremiumImageOverlay />
      </div>

      <div
        className="relative z-10 flex h-full flex-col items-center justify-center px-6 pb-16 text-center sm:px-10"
        style={{
          opacity: fade,
          transform: reduceMotion ? undefined : `translateY(${lift}px)`,
        }}
      >
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-accent-gold drop-shadow-[0_1px_12px_rgba(0,0,0,0.55)] sm:text-xs">
          {tagline}
        </p>
        <h1 className="mt-5 max-w-4xl font-bold tracking-tight text-text-primary text-[clamp(2.35rem,6.5vw,4.25rem)] leading-[1.06] [text-shadow:0_2px_32px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.45)]">
          {title}
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/92 drop-shadow-[0_1px_14px_rgba(0,0,0,0.45)] sm:text-lg">
          {subtitle}
        </p>

        <div className="mt-10 flex w-full max-w-md flex-col items-stretch gap-3 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
          <Link href={`/${locale}/products`} className={premiumPrimaryCtaClass}>
            {ctaProducts}
          </Link>
          <Link href={`/${locale}/blog`} className={premiumSecondaryCtaClass}>
            {ctaJournal}
          </Link>
        </div>
      </div>

      <div
        className="pointer-events-none absolute bottom-6 left-1/2 z-10 -translate-x-1/2 motion-reduce:hidden"
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
