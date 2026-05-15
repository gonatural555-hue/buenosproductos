"use client";

import Image from "next/image";
import Link from "next/link";
import {
  premiumPrimaryCtaClass,
  premiumSecondaryLightCtaClass,
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
  isActive: boolean;
  scroll: number;
  reduceMotion: boolean;
  /** En carrusel embebido (blog): un solo H1 vive en el hero editorial. */
  titleHeadingTag?: "h1" | "h2";
};

/** Hero inicio: fondo crema, logo de marca, titular y subtítulo (sin vídeo ni foto de fondo). */
export default function HomeHeroVideoSlide({
  locale,
  tagline: _tagline,
  title,
  subtitle,
  ctaProducts,
  ctaJournal,
  imageSrc: _imageSrc,
  imageAlt: _imageAlt,
  videoSrc: _videoSrc,
  videoSrcMobile: _videoSrcMobile,
  isActive: _isActive,
  scroll: _scroll,
  reduceMotion: _reduceMotion,
  titleHeadingTag = "h1",
}: HomeHeroVideoSlideProps) {
  const displayTitle = title.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
  const TitleTag = titleHeadingTag;

  return (
    <div className="absolute inset-0 flex flex-col bg-[#F4EBDD]">
      <div className="relative z-10 flex flex-1 flex-col items-center justify-center overflow-hidden px-5 py-10 text-center sm:px-10 sm:py-12 md:py-14">
        <div className="mx-auto flex w-full max-w-3xl flex-col items-center">
          <Image
            src="/assets/images/logo/LOGO.png"
            alt="Go Natural"
            width={640}
            height={256}
            priority
            sizes="(max-width: 640px) 90vw, 22rem"
            className="mb-6 h-auto w-full max-w-[min(90vw,22rem)] shrink-0 object-contain sm:max-w-[24rem] md:max-w-[26rem]"
          />
          <TitleTag className="hero-display max-w-full shrink-0 text-balance text-[clamp(1.65rem,4.8vw,3rem)] font-semibold leading-[1.12] tracking-tight text-[#2E4A36] sm:max-w-3xl">
            {displayTitle}
          </TitleTag>
          {subtitle ? (
            <p className="mt-5 max-w-2xl text-pretty font-sans text-base leading-relaxed text-[#D9A441] sm:mt-6 sm:text-lg">
              {subtitle}
            </p>
          ) : null}
          <div className="pointer-events-auto mt-9 flex w-full max-w-md shrink-0 flex-col items-stretch gap-3 sm:mt-10 sm:max-w-none sm:flex-row sm:justify-center sm:gap-4 md:mt-12">
            <Link href={`/${locale}/products`} className={premiumPrimaryCtaClass}>
              {ctaProducts}
            </Link>
            <Link href={`/${locale}/blog`} className={premiumSecondaryLightCtaClass}>
              {ctaJournal}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
