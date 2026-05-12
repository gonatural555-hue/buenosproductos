"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import HomeHeroCarousel from "@/components/home/HomeHeroCarousel";
import type { HomeHeroCarouselProps } from "@/components/home/HomeHeroCarousel";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { LUMINOUS_EDGE_CARD, LUMINOUS_EDGE_LIGHT } from "@/lib/ui/luminous-edge";

const BENTO_RADIUS = "rounded-[1.35rem] md:rounded-[1.75rem]";

const BENTO_CARD =
  `${BENTO_RADIUS} relative overflow-hidden border border-earth-brown/12 bg-white/95 ${LUMINOUS_EDGE_CARD} ring-1 ring-inset ring-white/45 transition-all duration-500 ease-out motion-reduce:transition-none`;

const BENTO_HOVER =
  "hover:-translate-y-0.5 hover:border-accent-gold/28 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.95),0_22px_56px_-24px_rgba(17,23,19,0.2),0_10px_28px_-14px_rgba(0,0,0,0.08)] motion-reduce:hover:translate-y-0";

const FALLBACK_IMG = "/assets/images/hero/hero.webp";

function ArrowCircle({ onDark = false }: { onDark?: boolean }) {
  return (
    <span
      className={
        onDark
          ? "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/12 text-white transition group-hover:border-accent-gold/50 group-hover:bg-white/22"
          : "flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-earth-brown/15 bg-soft-stone/90 text-charcoal transition group-hover:border-accent-gold/35 group-hover:bg-white group-hover:text-mountain-green"
      }
      aria-hidden
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="h-4 w-4">
        <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 19.5 15-15m0 0H8.25m11.25 0v11.25" />
      </svg>
    </span>
  );
}

/** Grid bento con carrusel (antes Hero de Home; ahora reutilizable en Journal). */
export default function BentoHeroSection(props: HomeHeroCarouselProps) {
  const locale = useLocale();
  const t = useTranslations();
  const [bannerImg, setBannerImg] = useState("/assets/images/hero/trekking.webp");
  const [mountainImg, setMountainImg] = useState("/assets/images/categories/mountain-snow.webp");
  const [outdoorImg, setOutdoorImg] = useState("/assets/images/hero/storysection.webp");

  return (
    <section
      className={`relative bg-[#FFFFFF] pb-8 pt-[calc(env(safe-area-inset-top,0px)+4.75rem+1rem)] sm:pb-10 sm:pt-[calc(env(safe-area-inset-top,0px)+5rem+1rem)] md:pb-12 md:pt-[calc(env(safe-area-inset-top,0px)+5.25rem+1rem)] lg:pt-[calc(env(safe-area-inset-top,0px)+5.5rem+1.25rem)] ${LUMINOUS_EDGE_LIGHT}`}
      aria-label="Hero"
    >
      <div className="mx-auto w-full max-w-none px-4 sm:px-5 md:px-6 lg:w-[calc(100%-48px)] lg:max-w-none lg:px-0">
        <div className="flex flex-col gap-4 lg:min-h-[min(calc(100svh-7.25rem),820px)] lg:grid lg:grid-cols-[minmax(0,7fr)_minmax(0,3fr)] lg:grid-rows-[1fr_1fr] lg:items-stretch lg:gap-5">
          <div className="flex min-h-0 w-full flex-col gap-4 lg:col-start-1 lg:row-span-2 lg:min-h-0">
            <div className={`${BENTO_CARD} ${BENTO_HOVER} flex min-h-[min(68vh,560px)] flex-1 flex-col lg:min-h-0`}>
              <div className="relative min-h-0 flex-1">
                <HomeHeroCarousel {...props} embedded />
              </div>
            </div>

            <Link
              href={`/${locale}/products`}
              aria-label={`${t("heroBento.bannerTitle")} — ${t("heroBento.bannerCta")}`}
              className={`${BENTO_CARD} ${BENTO_HOVER} group pointer-events-auto flex min-h-[9.5rem] flex-col overflow-hidden sm:min-h-[10.5rem] sm:flex-row sm:items-stretch`}
            >
              <div className="relative flex min-h-[7rem] flex-1 flex-col justify-center px-5 py-5 text-left sm:min-h-0 sm:px-7 sm:py-6 lg:max-w-[58%]">
                <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.28em] text-accent-gold">
                  {t("heroBento.bannerEyebrow")}
                </p>
                <h2 className="section-display mt-2 text-xl font-semibold leading-tight tracking-tight text-dark-base sm:text-2xl">
                  {t("heroBento.bannerTitle")}
                </h2>
                <p className="mt-2 font-sans text-sm leading-relaxed text-muted-gray sm:text-[0.95rem]">
                  {t("heroBento.bannerSubtitle")}
                </p>
                <span className="mt-4 inline-flex items-center gap-2 font-sans text-sm font-semibold text-mountain-green">
                  {t("heroBento.bannerCta")}
                  <ArrowCircle />
                </span>
              </div>
              <div className="relative min-h-[8rem] flex-1 sm:min-h-full sm:min-w-[40%]">
                <Image
                  src={bannerImg}
                  alt=""
                  fill
                  className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-[1.04] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                  sizes="(max-width:640px) 100vw, 38vw"
                  onError={() => setBannerImg(FALLBACK_IMG)}
                />
                <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-white/95 sm:via-white/55" />
              </div>
            </Link>
          </div>

          <div className="contents">
            <Link
              href={`/${locale}/category/mountain-snow`}
              aria-label={`${t("heroBento.rightMountainTitle")} — ${t("heroBento.exploreAria")}`}
              className={`${BENTO_CARD} ${BENTO_HOVER} group pointer-events-auto relative flex min-h-[13rem] flex-col justify-end overflow-hidden p-5 sm:min-h-[14rem] sm:p-6 lg:col-start-2 lg:row-start-1 lg:min-h-0`}
            >
              <Image
                src={mountainImg}
                alt=""
                fill
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                sizes="(max-width:1024px) 100vw, 32vw"
                onError={() => setMountainImg(FALLBACK_IMG)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-dark-base via-dark-base/55 to-dark-base/10" />
              <div className="relative z-[1] flex items-end justify-between gap-3">
                <div className="min-w-0 text-left">
                  <h3 className="section-display text-lg font-semibold tracking-tight text-white sm:text-xl">
                    {t("heroBento.rightMountainTitle")}
                  </h3>
                  <p className="mt-1 font-sans text-xs leading-snug text-white/85 sm:text-sm">
                    {t("heroBento.rightMountainBody")}
                  </p>
                </div>
                <ArrowCircle onDark />
              </div>
            </Link>

            <Link
              href={`/${locale}/products`}
              aria-label={`${t("heroBento.rightOutdoorTitle")} — ${t("heroBento.exploreAria")}`}
              className={`${BENTO_CARD} ${BENTO_HOVER} group pointer-events-auto relative flex min-h-[13rem] flex-col justify-end overflow-hidden p-5 sm:min-h-[14rem] sm:p-6 lg:col-start-2 lg:row-start-2 lg:min-h-0`}
            >
              <Image
                src={outdoorImg}
                alt=""
                fill
                className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                sizes="(max-width:1024px) 100vw, 32vw"
                onError={() => setOutdoorImg(FALLBACK_IMG)}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-mountain-green/95 via-mountain-green/45 to-moss-green/20" />
              <div className="relative z-[1] flex items-end justify-between gap-3">
                <div className="min-w-0 text-left">
                  <h3 className="section-display text-lg font-semibold tracking-tight text-white sm:text-xl">
                    {t("heroBento.rightOutdoorTitle")}
                  </h3>
                  <p className="mt-1 font-sans text-xs leading-snug text-white/88 sm:text-sm">
                    {t("heroBento.rightOutdoorBody")}
                  </p>
                </div>
                <ArrowCircle onDark />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
