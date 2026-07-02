"use client";

/**
 * Showcase premium del hero — productos reales (PNG/WebP o fallback catálogo).
 *
 * Assets dedicados (reemplazar manualmente cuando existan):
 * - public/assets/home/hero/hero-product-main.png
 * - public/assets/home/hero/hero-product-secondary.png
 * - public/assets/home/hero/hero-product-tertiary.png
 *
 * Decorativos SVG (solo glow/órbitas/plataforma):
 * - hero-hex-accent.svg · hero-orbit.svg · hero-platform-glow.svg
 */

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useState } from "react";
import { GoodIdeasTrustBarIcon } from "@/components/good-ideas/home/GoodIdeasTrustBarIcons";
import SmartImage from "@/components/SmartImage";
import type { HeroProductShowcaseLayer, HeroProductShowcaseLayers } from "@/lib/hero-product-showcase";
import { GI_EASE } from "@/lib/ui/goodideas-design";

type Props = {
  layers: HeroProductShowcaseLayers;
  badge: string;
  microBadgeShipping: string;
  microBadgeSecure: string;
};

const HERO_DECOR = {
  hex: "/assets/home/hero/hero-hex-accent.svg",
  orbit: "/assets/home/hero/hero-orbit.svg",
  platform: "/assets/home/hero/hero-platform-glow.svg",
} as const;

function DecorImg({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) {
  return (
    <img
      src={src}
      alt={alt}
      draggable={false}
      className={`pointer-events-none select-none ${className}`}
    />
  );
}

function MicroBadge({ iconId, label }: { iconId: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.1] bg-[rgba(21,27,36,0.82)] px-3 py-1.5 font-body text-[11px] font-medium text-[#E8ECF1] shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur-sm sm:text-xs">
      <GoodIdeasTrustBarIcon id={iconId} className="h-3.5 w-3.5 shrink-0" />
      {label}
    </span>
  );
}

function ProductCard({
  layer,
  size,
  priority = false,
  className = "",
  float = false,
  reduceMotion,
  delay = 0,
  rotate = 0,
}: {
  layer: HeroProductShowcaseLayer;
  size: "main" | "secondary" | "tertiary";
  priority?: boolean;
  className?: string;
  float?: boolean;
  reduceMotion: boolean;
  delay?: number;
  rotate?: number;
}) {
  const [src, setSrc] = useState(layer.src);
  const handleError = useCallback(() => {
    setSrc(layer.catalogFallbackSrc);
  }, [layer.catalogFallbackSrc]);

  const sizeClass =
    size === "main"
      ? "w-[min(58vw,220px)] sm:w-[240px] md:w-[260px] lg:w-[min(52%,300px)] xl:w-[320px]"
      : size === "secondary"
        ? "w-[min(36vw,130px)] sm:w-[140px] md:w-[160px] lg:w-[180px]"
        : "w-[min(30vw,110px)] sm:w-[120px] md:w-[135px] lg:w-[150px]";

  const paddingClass =
    size === "main" ? "p-4 lg:p-5" : size === "secondary" ? "p-3 lg:p-3.5" : "p-2.5 lg:p-3";

  const floatAnim = float && !reduceMotion
    ? {
        y: [0, -5, 0],
        transition: {
          duration: 5.5,
          repeat: Infinity,
          ease: "easeInOut" as const,
          delay: delay + 0.4,
        },
      }
    : undefined;

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 18, scale: 0.94 }}
      animate={
        reduceMotion
          ? { opacity: 1, y: 0, scale: 1, rotate }
          : { opacity: 1, y: 0, scale: 1, rotate, ...floatAnim }
      }
      transition={{ duration: 0.55, delay, ease: GI_EASE }}
      className={`group absolute ${className}`}
      style={{ rotate: reduceMotion ? `${rotate}deg` : undefined }}
    >
      <div
        className={`relative overflow-hidden rounded-[28px] border border-white/[0.18] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.35)] transition duration-300 ease-out hover:-translate-y-1 hover:shadow-[0_32px_96px_rgba(0,0,0,0.45)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 lg:rounded-[32px] ${sizeClass} ${paddingClass}`}
      >
        <div
          className={`relative w-full overflow-hidden rounded-[20px] bg-[#F8FAFC] ${
            size === "main" ? "aspect-[4/5]" : "aspect-square"
          }`}
        >
          <SmartImage
            src={src}
            alt={layer.alt}
            fill
            priority={priority}
            sizes={
              size === "main"
                ? "(max-width: 1024px) 240px, 320px"
                : size === "secondary"
                  ? "180px"
                  : "150px"
            }
            className="object-contain object-center p-2 transition duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            onError={handleError}
          />
        </div>
      </div>
    </motion.div>
  );
}

function ShowcaseDecor({ reduceMotion }: { reduceMotion: boolean }) {
  const fade = reduceMotion
    ? {}
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.85, ease: GI_EASE },
      };

  return (
    <>
      <motion.div
        {...fade}
        className="pointer-events-none absolute inset-0 z-[1] overflow-hidden"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_42%,rgba(59,130,246,0.22),transparent_60%)]" />
      </motion.div>

      <motion.div
        {...fade}
        className="pointer-events-none absolute inset-0 z-[2]"
        aria-hidden
      >
        <DecorImg
          src={HERO_DECOR.hex}
          alt=""
          className="absolute -right-[8%] top-[8%] w-[min(88vw,340px)] opacity-70 sm:opacity-90 sm:-right-[4%] lg:right-[-2%] lg:top-[6%] lg:w-[400px]"
        />
      </motion.div>

      <motion.div
        {...fade}
        className="pointer-events-none absolute inset-0 z-[3] hidden sm:block"
        aria-hidden
      >
        <div className="absolute left-1/2 top-[14%] h-[min(70vw,420px)] w-[min(70vw,420px)] -translate-x-1/2 rounded-full border border-[rgba(59,130,246,0.25)] lg:left-[54%] lg:top-[10%] lg:h-[440px] lg:w-[440px]" />
      </motion.div>

      <motion.div
        {...fade}
        className="pointer-events-none absolute inset-0 z-[4]"
        aria-hidden
      >
        <DecorImg
          src={HERO_DECOR.orbit}
          alt=""
          className="absolute left-1/2 top-[0%] h-[min(88vw,400px)] w-[min(88vw,400px)] -translate-x-1/2 object-contain opacity-80 sm:opacity-95 lg:left-[55%] lg:top-[-6%] lg:h-[500px] lg:w-[500px]"
        />
      </motion.div>

      <motion.div
        {...fade}
        className="pointer-events-none absolute inset-x-[-6%] bottom-[8%] z-[5] hidden sm:block lg:bottom-[10%]"
        aria-hidden
      >
        <div className="mx-auto h-16 w-[72%] max-w-[420px] rounded-[50%] border border-[rgba(59,130,246,0.2)] bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.18),transparent_70%)] shadow-[0_0_60px_rgba(59,130,246,0.22)] lg:h-20 lg:w-[78%]" />
      </motion.div>

      <motion.div
        {...fade}
        className="pointer-events-none absolute inset-x-[-6%] bottom-[-6%] z-[6] sm:inset-x-0 lg:bottom-[-8%]"
        aria-hidden
      >
        <DecorImg
          src={HERO_DECOR.platform}
          alt=""
          className="mx-auto w-[min(112%,680px)] max-w-none object-contain lg:w-full"
        />
      </motion.div>
    </>
  );
}

export default function HeroProductShowcase({
  layers,
  badge,
  microBadgeShipping,
  microBadgeSecure,
}: Props) {
  const reduceMotion = useReducedMotion() ?? false;
  const { main, secondary, tertiary } = layers;

  if (!main) {
    return (
      <div
        className="relative mx-auto flex h-[340px] w-full max-w-[580px] items-center justify-center overflow-hidden rounded-3xl border border-dashed border-white/[0.12] bg-[#151B24]/30 lg:h-[560px]"
        aria-hidden
      />
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-[580px] overflow-hidden lg:max-w-[600px] xl:max-w-[620px]">
      <div className="relative mx-auto h-[360px] w-full sm:h-[400px] lg:h-[560px] lg:max-h-[600px]">
        <ShowcaseDecor reduceMotion={reduceMotion} />

        <div className="absolute left-0 top-1 z-[20] flex flex-wrap gap-2 sm:top-2 lg:left-[2%]">
          <MicroBadge iconId="shipping" label={microBadgeShipping} />
          <MicroBadge iconId="secure" label={microBadgeSecure} />
        </div>

        <ProductCard
          layer={main}
          size="main"
          priority
          reduceMotion={reduceMotion}
          delay={0.12}
          className="right-[2%] top-[18%] z-[14] sm:right-[4%] lg:right-[0%] lg:top-[14%]"
        />

        {secondary ? (
          <ProductCard
            layer={secondary}
            size="secondary"
            reduceMotion={reduceMotion}
            delay={0.22}
            rotate={2}
            float
            className="bottom-[14%] left-[0%] z-[13] sm:left-[2%] lg:bottom-[12%] lg:left-[0%]"
          />
        ) : null}

        {tertiary ? (
          <ProductCard
            layer={tertiary}
            size="tertiary"
            reduceMotion={reduceMotion}
            delay={0.3}
            rotate={-3}
            float
            className="right-[4%] top-[2%] z-[15] sm:right-[6%] lg:right-[10%] lg:top-[0%]"
          />
        ) : null}

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.38, ease: GI_EASE }}
          className="absolute bottom-[4%] right-[2%] z-[16] max-w-[min(92%,260px)] rounded-[20px] border border-white/[0.12] bg-[#151B24] px-4 py-3.5 shadow-[0_16px_48px_rgba(0,0,0,0.35)] sm:right-[4%] lg:bottom-[8%] lg:right-[2%] lg:max-w-[280px] lg:px-5 lg:py-4"
        >
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#3B82F6]/25 bg-[#3B82F6]/10">
              <GoodIdeasTrustBarIcon id="innovative" className="h-4 w-4" />
            </span>
            <p className="font-body text-[13px] font-medium leading-snug text-[#E8ECF1] sm:text-sm">
              {badge}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
