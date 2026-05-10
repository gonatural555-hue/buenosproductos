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
  tagline: _tagline,
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

      {/* CTAs anclados al borde inferior: misma posición en todos los idiomas (ES suele ocupar más líneas). */}
      <div className="absolute inset-0 z-10 px-5 pt-[clamp(2.25rem,10vh,5rem)] text-center sm:px-10 sm:pt-[clamp(3rem,12vh,6rem)] md:pt-16">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center pb-[clamp(7.75rem,21vh,11rem)] sm:pb-[clamp(8.5rem,23vh,12rem)] md:pb-[clamp(9.25rem,25vh,13rem)]">
          <img
            src="/assets/images/logo/logo-blanco.svg"
            alt="Go Natural"
            className="mb-4 h-14 w-auto max-w-[min(88vw,20rem)] opacity-[0.98] drop-shadow-[0_2px_20px_rgba(0,0,0,0.35)] sm:mb-5 sm:h-[4.25rem] md:h-[5rem] lg:h-[5.5rem]"
            loading="eager"
            decoding="async"
          />
          <h1 className="font-display max-w-full font-bold leading-[1.06] tracking-tight text-white text-[clamp(1.85rem,5.2vw,3.35rem)] [text-shadow:0_2px_32px_rgba(0,0,0,0.55),0_1px_3px_rgba(0,0,0,0.45)] sm:max-w-3xl md:text-[clamp(2.1rem,4.2vw,3.75rem)]">
            {title}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm font-semibold leading-relaxed tracking-[0.06em] text-accent-gold drop-shadow-[0_1px_12px_rgba(0,0,0,0.55)] sm:mt-5 sm:max-w-2xl sm:text-base md:text-[1.05rem]">
            {subtitle}
          </p>
        </div>

        <div
          className="pointer-events-auto absolute bottom-[clamp(4.25rem,12vh,7.5rem)] left-5 right-5 z-[11] mx-auto flex w-full max-w-md flex-col items-stretch gap-3 sm:bottom-[clamp(4.75rem,13vh,8rem)] sm:left-10 sm:right-10 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4 md:bottom-[clamp(5.25rem,14vh,8.75rem)]"
        >
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
