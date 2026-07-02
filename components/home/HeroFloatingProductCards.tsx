"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { GoodIdeasTrustBarIcon } from "@/components/good-ideas/home/GoodIdeasTrustBarIcons";
import SmartImage from "@/components/SmartImage";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { useCurrency } from "@/context/CurrencyContext";
import type { GoodIdeasHomeHeroCardEntry } from "@/lib/good-ideas-home-hero-cards";
import { localizeGoodIdeasProduct } from "@/lib/good-ideas-products";
import type { ProductReviewStatsSnapshot } from "@/lib/good-ideas-product-review-stats";
import { isValidImageSrc } from "@/lib/image-src";
import { productPath } from "@/lib/routing/paths";
import { GI_EASE } from "@/lib/ui/goodideas-design";

type Props = {
  entries: GoodIdeasHomeHeroCardEntry[];
  reviewStatsMap: Record<string, ProductReviewStatsSnapshot>;
  badge: string;
  microBadgeShipping: string;
  microBadgeSecure: string;
  viewProductLabel: string;
};

const HERO_DECOR = {
  hex: "/assets/home/hero/hero-hex-accent.svg",
  orbit: "/assets/home/hero/hero-orbit.svg",
  platform: "/assets/home/hero/hero-platform-glow.svg",
} as const;

const CARD_HOVER =
  "transition duration-[220ms] ease-out hover:-translate-y-1.5 hover:scale-[1.015] hover:border-[rgba(59,130,246,0.45)] hover:shadow-[0_32px_96px_rgba(0,0,0,0.45)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 motion-reduce:hover:scale-100";

function DecorImg({ src, className }: { src: string; className: string }) {
  return (
    <img
      src={src}
      alt=""
      draggable={false}
      className={`pointer-events-none select-none ${className}`}
    />
  );
}

function MicroBadge({ iconId, label }: { iconId: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-[rgba(21,27,36,0.82)] px-3.5 py-2 font-body text-[13px] font-medium text-[#E8ECF1] shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur-sm">
      <GoodIdeasTrustBarIcon id={iconId} className="h-3.5 w-3.5 shrink-0 text-[#3B82F6]" />
      {label}
    </span>
  );
}

function MiniStars({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = rating >= i + 0.75;
        return (
          <svg
            key={i}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            className="h-3 w-3"
            fill={filled ? "#FBBF24" : "none"}
            stroke="#FBBF24"
            strokeWidth={1.2}
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 0 0 .95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 0 0-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 0 0-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 0 0-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 0 0 .951-.69l1.07-3.292Z" />
          </svg>
        );
      })}
    </div>
  );
}

function FloatingProductCard({
  entry,
  size,
  reviewStats,
  viewProductLabel,
  className = "",
  priority = false,
  delay = 0,
  reduceMotion,
}: {
  entry: GoodIdeasHomeHeroCardEntry;
  size: "main" | "secondary" | "tertiary";
  reviewStats?: ProductReviewStatsSnapshot;
  viewProductLabel: string;
  className?: string;
  priority?: boolean;
  delay?: number;
  reduceMotion: boolean;
}) {
  const locale = useLocale();
  const { formatMoney } = useCurrency();
  const localized = localizeGoodIdeasProduct(entry.product, locale);
  const href = productPath(locale, entry.product.id);
  const imageSrc = isValidImageSrc(entry.cardImage) ? entry.cardImage : null;
  const salesBadge = localized.salesBadge?.trim();

  const widthClass =
    size === "main"
      ? "w-full max-w-[320px] lg:w-[320px]"
      : size === "secondary"
        ? "w-full max-w-[200px] lg:w-[200px]"
        : "w-full max-w-[180px] lg:w-[180px]";

  const imageHeightClass =
    size === "main"
      ? "h-[200px] sm:h-[220px] lg:h-[240px]"
      : size === "secondary"
        ? "h-[120px] sm:h-[130px] lg:h-[140px]"
        : "h-[110px] sm:h-[120px] lg:h-[130px]";

  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 16, scale: 0.96 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.55, delay, ease: GI_EASE }}
      className={`${className} ${widthClass}`}
    >
      <Link
        href={href}
        className={`group flex h-full flex-col overflow-hidden rounded-[28px] border border-white/[0.18] bg-white shadow-[0_24px_80px_rgba(0,0,0,0.35)] ${CARD_HOVER} lg:rounded-[30px]`}
      >
        <div className={`relative ${imageHeightClass} overflow-hidden bg-[#FAFAFA]`}>
          {salesBadge ? (
            <span className="absolute left-3 top-3 z-[2] rounded-full bg-[#3B82F6] px-2.5 py-1 font-body text-[10px] font-semibold uppercase tracking-wide text-white shadow-[0_6px_16px_rgba(59,130,246,0.35)]">
              {salesBadge}
            </span>
          ) : null}

          {imageSrc ? (
            <SmartImage
              src={imageSrc}
              alt={localized.title}
              fill
              priority={priority}
              placeholder="empty"
              sizes={
                size === "main"
                  ? "(max-width: 1024px) 320px, 320px"
                  : size === "secondary"
                    ? "200px"
                    : "180px"
              }
              className="object-contain object-center p-3 transition duration-[220ms] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-body text-xs text-[#6B7280]">
              —
            </div>
          )}
        </div>

        <div
          className={`flex flex-1 flex-col gap-1.5 ${
            size === "main" ? "p-4 lg:p-5" : "p-3.5 lg:p-4"
          }`}
        >
          <h3
            className={`line-clamp-2 font-body font-semibold leading-snug text-[#111111] ${
              size === "main" ? "text-sm lg:text-[15px]" : "text-xs lg:text-[13px]"
            }`}
          >
            {localized.title}
          </h3>

          <p
            className={`font-body font-bold tabular-nums text-[#3B82F6] ${
              size === "main" ? "text-lg lg:text-xl" : "text-base"
            }`}
          >
            {formatMoney(localized.price)}
          </p>

          {reviewStats && reviewStats.totalReviews > 0 ? (
            <div className="flex items-center gap-1.5">
              <MiniStars rating={reviewStats.averageRating} />
              <span className="font-body text-[11px] text-[#6B7280]">
                ({reviewStats.totalReviews})
              </span>
            </div>
          ) : null}

          <span
            className={`mt-auto inline-flex items-center gap-1 font-body font-medium text-[#6B7280] transition group-hover:text-[#3B82F6] ${
              size === "main" ? "text-xs" : "text-[11px]"
            }`}
          >
            {viewProductLabel}
            <span aria-hidden>→</span>
          </span>
        </div>
      </Link>
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
        className="pointer-events-none absolute inset-0 z-[1]"
        aria-hidden
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_52%_48%,rgba(59,130,246,0.22),transparent_62%)]" />
      </motion.div>

      <motion.div
        {...fade}
        className="pointer-events-none absolute inset-0 z-[2] hidden sm:block"
        aria-hidden
      >
        <DecorImg
          src={HERO_DECOR.hex}
          className="absolute right-[-4%] top-[4%] w-[min(72%,360px)] opacity-75 lg:right-[0%] lg:w-[380px]"
        />
      </motion.div>

      <motion.div
        {...fade}
        className="pointer-events-none absolute inset-0 z-[3] hidden md:block"
        aria-hidden
      >
        <div className="absolute left-[48%] top-[12%] h-[380px] w-[380px] -translate-x-1/2 rounded-full border border-[rgba(59,130,246,0.25)]" />
      </motion.div>

      <motion.div
        {...fade}
        className="pointer-events-none absolute inset-0 z-[4] hidden sm:block"
        aria-hidden
      >
        <DecorImg
          src={HERO_DECOR.orbit}
          className="absolute left-1/2 top-[-2%] h-[min(90%,440px)] w-[min(90%,440px)] -translate-x-1/2 object-contain opacity-85"
        />
      </motion.div>

      <motion.div
        {...fade}
        className="pointer-events-none absolute inset-x-0 bottom-[4%] z-[5] hidden lg:block"
        aria-hidden
      >
        <DecorImg
          src={HERO_DECOR.platform}
          className="mx-auto w-[108%] max-w-none object-contain opacity-90"
        />
      </motion.div>
    </>
  );
}

export default function HeroFloatingProductCards({
  entries,
  reviewStatsMap,
  badge,
  microBadgeShipping,
  microBadgeSecure,
  viewProductLabel,
}: Props) {
  const reduceMotion = useReducedMotion() ?? false;
  const [main, secondary, tertiary] = entries;

  if (!main) {
    return (
      <div
        className="relative mx-auto flex h-[340px] w-full max-w-[600px] items-center justify-center rounded-3xl border border-dashed border-white/[0.12] bg-[#151B24]/30 lg:h-[580px]"
        aria-hidden
      />
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-[640px] overflow-hidden lg:overflow-visible">
      <div className="flex flex-col gap-4 lg:hidden">
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <MicroBadge iconId="shipping" label={microBadgeShipping} />
          <MicroBadge iconId="secure" label={microBadgeSecure} />
        </div>

        <FloatingProductCard
          entry={main}
          size="main"
          priority
          reviewStats={reviewStatsMap[main.product.id]}
          viewProductLabel={viewProductLabel}
          reduceMotion={reduceMotion}
          delay={0.08}
          className="mx-auto"
        />

        {secondary || tertiary ? (
          <div className="grid grid-cols-2 gap-3 px-1">
            {secondary ? (
              <FloatingProductCard
                entry={secondary}
                size="secondary"
                reviewStats={reviewStatsMap[secondary.product.id]}
                viewProductLabel={viewProductLabel}
                reduceMotion={reduceMotion}
                delay={0.14}
                className="mx-auto"
              />
            ) : (
              <div />
            )}
            {tertiary ? (
              <FloatingProductCard
                entry={tertiary}
                size="tertiary"
                reviewStats={reviewStatsMap[tertiary.product.id]}
                viewProductLabel={viewProductLabel}
                reduceMotion={reduceMotion}
                delay={0.2}
                className="mx-auto"
              />
            ) : null}
          </div>
        ) : null}

        <div className="mx-auto max-w-[320px] rounded-[22px] border border-white/[0.12] bg-[#151B24] px-4 py-3.5 shadow-[0_12px_40px_rgba(0,0,0,0.3)]">
          <div className="flex items-start gap-3">
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[#3B82F6]/25 bg-[#3B82F6]/10">
              <GoodIdeasTrustBarIcon id="innovative" className="h-4 w-4" />
            </span>
            <p className="font-body text-[13px] font-medium leading-snug text-[#E8ECF1]">
              {badge}
            </p>
          </div>
        </div>
      </div>

      <div className="relative mx-auto hidden h-[560px] w-full max-w-[600px] lg:block lg:h-[580px]">
        <ShowcaseDecor reduceMotion={reduceMotion} />

        <div className="absolute left-1/2 top-[2%] z-[20] flex -translate-x-1/2 flex-wrap items-center justify-center gap-2.5">
          <MicroBadge iconId="shipping" label={microBadgeShipping} />
          <MicroBadge iconId="secure" label={microBadgeSecure} />
        </div>

        {tertiary ? (
          <FloatingProductCard
            entry={tertiary}
            size="tertiary"
            reviewStats={reviewStatsMap[tertiary.product.id]}
            viewProductLabel={viewProductLabel}
            reduceMotion={reduceMotion}
            delay={0.18}
            className="absolute left-[6%] top-[14%] z-[24]"
          />
        ) : null}

        {secondary ? (
          <FloatingProductCard
            entry={secondary}
            size="secondary"
            reviewStats={reviewStatsMap[secondary.product.id]}
            viewProductLabel={viewProductLabel}
            reduceMotion={reduceMotion}
            delay={0.22}
            className="absolute bottom-[16%] left-[0%] z-[22]"
          />
        ) : null}

        <FloatingProductCard
          entry={main}
          size="main"
          priority
          reviewStats={reviewStatsMap[main.product.id]}
          viewProductLabel={viewProductLabel}
          reduceMotion={reduceMotion}
          delay={0.12}
          className="absolute right-[0%] top-[20%] z-[30]"
        />

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.34, ease: GI_EASE }}
          className="absolute bottom-[10%] right-[2%] z-[32] max-w-[260px] rounded-[22px] border border-white/[0.12] bg-[#151B24] px-4 py-3.5 shadow-[0_16px_48px_rgba(0,0,0,0.35)] lg:max-w-[272px] lg:px-5 lg:py-4"
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
