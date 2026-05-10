"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import PremiumImageOverlay from "@/components/ui/PremiumImageOverlay";
import {
  premiumPrimaryCtaClass,
  premiumSecondaryCtaClass,
} from "@/lib/ui/premium-cta-classes";
import type { Locale } from "@/lib/i18n/config";

export type HomeHeroVideoSlideProps = {
  locale: Locale;
  tagline: string;
  title: string;
  subtitle: string;
  ctaProducts: string;
  ctaJournal: string;
  imageSrc: string;
  imageAlt: string;
  videoSrc: string;
  videoSrcMobile: string;
  /** Pausa vídeo cuando el slide no está activo (ahorro CPU). */
  isActive: boolean;
  scroll: number;
  reduceMotion: boolean;
};

export default function HomeHeroVideoSlide({
  locale,
  tagline,
  title,
  subtitle,
  ctaProducts,
  ctaJournal,
  imageSrc,
  imageAlt,
  videoSrc,
  videoSrcMobile,
  isActive,
  scroll,
  reduceMotion,
}: HomeHeroVideoSlideProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMobileViewport, setIsMobileViewport] = useState(false);

  useLayoutEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const sync = () => setIsMobileViewport(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const activeVideoSrc = isMobileViewport ? videoSrcMobile : videoSrc;

  useEffect(() => {
    const el = videoRef.current;
    if (!el || reduceMotion) return;
    if (isActive) {
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  }, [isActive, reduceMotion, activeVideoSrc]);

  return (
    <>
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
            sizes="(max-width:1024px) 92vw, 72rem"
            className="object-cover object-center"
          />
        ) : (
          <video
            ref={videoRef}
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

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center px-5 pb-8 pt-12 text-center sm:px-10 sm:pb-10 sm:pt-14">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.35em] text-accent-gold drop-shadow-[0_1px_12px_rgba(0,0,0,0.55)] sm:text-xs">
          {tagline}
        </p>
        <h1 className="font-display mt-4 max-w-full font-bold leading-[1.06] tracking-tight text-white text-[clamp(1.85rem,5.2vw,3.35rem)] [text-shadow:0_2px_32px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.45)] sm:mt-5 sm:max-w-3xl md:text-[clamp(2.1rem,4.2vw,3.75rem)]">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/92 drop-shadow-[0_1px_14px_rgba(0,0,0,0.45)] sm:mt-5 sm:max-w-xl sm:text-base md:text-lg">
          {subtitle}
        </p>

        <div className="mt-8 flex w-full max-w-md flex-col items-stretch gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4">
          <Link href={`/${locale}/products`} className={premiumPrimaryCtaClass}>
            {ctaProducts}
          </Link>
          <Link href={`/${locale}/blog`} className={premiumSecondaryCtaClass}>
            {ctaJournal}
          </Link>
        </div>
      </div>
    </>
  );
}
