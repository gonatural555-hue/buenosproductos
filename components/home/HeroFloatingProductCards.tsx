"use client";

import { useRouter } from "next/navigation";
import { motion, useReducedMotion } from "framer-motion";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
} from "react";
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
  microBadgeShipping: string;
  microBadgeSecure: string;
  viewProductLabel: string;
};

type CarouselSlot = "center" | "left" | "right" | "hidden";

const HERO_DECOR = {
  hex: "/assets/home/hero/hero-hex-accent.svg",
  orbit: "/assets/home/hero/hero-orbit.svg",
  platform: "/assets/home/hero/hero-platform-glow.svg",
} as const;

const AUTOPLAY_MS = 1500;
const TRANSITION_MS = 600;
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";
const SWIPE_THRESHOLD = 48;
/** Caja fija para cards laterales — evita saltos verticales al rotar. */
const DESKTOP_SIDE_CARD_WIDTH = 210;
const DESKTOP_SIDE_CARD_HEIGHT = 296;
const DESKTOP_SIDE_SCALE = 0.8;
const DESKTOP_CAROUSEL_ANCHOR_TOP = "52%";

function getCarouselSlot(cardIndex: number, activeIndex: number, total: number): CarouselSlot {
  const diff = (cardIndex - activeIndex + total) % total;
  if (diff === 0) return "center";
  if (diff === 1) return "right";
  if (diff === 2) return "hidden";
  return "left";
}

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
    <span className="inline-flex items-center gap-2 rounded-full border border-white/[0.12] bg-[rgba(21,27,36,0.82)] px-3 py-[7px] font-body text-xs font-medium text-[#E8ECF1] shadow-[0_8px_24px_rgba(0,0,0,0.2)] backdrop-blur-sm sm:px-3.5 sm:py-2 sm:text-[13px]">
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

function CarouselDots({
  count,
  activeIndex,
  onSelect,
  productTitles,
}: {
  count: number;
  activeIndex: number;
  onSelect: (index: number) => void;
  productTitles: string[];
}) {
  return (
    <div className="flex items-center justify-center gap-2" role="tablist" aria-label="Product carousel">
      {Array.from({ length: count }, (_, index) => {
        const active = index === activeIndex;
        return (
          <button
            key={index}
            type="button"
            role="tab"
            aria-selected={active}
            aria-label={productTitles[index] ?? `Product ${index + 1}`}
            className={`h-2 w-2 rounded-full transition-[transform,background-color] duration-300 motion-reduce:transition-none ${
              active
                ? "scale-110 bg-[#3B82F6]"
                : "bg-[rgba(232,236,241,0.35)] hover:bg-[rgba(232,236,241,0.55)]"
            }`}
            onClick={() => onSelect(index)}
          />
        );
      })}
    </div>
  );
}

function HeroCarouselProductCard({
  entry,
  slot,
  isActive,
  reviewStats,
  viewProductLabel,
  onActivate,
  onNavigate,
  reduceMotion,
  variant,
}: {
  entry: GoodIdeasHomeHeroCardEntry;
  slot: CarouselSlot;
  isActive: boolean;
  reviewStats?: ProductReviewStatsSnapshot;
  viewProductLabel: string;
  onActivate: () => void;
  onNavigate: () => void;
  reduceMotion: boolean;
  variant: "desktop" | "mobile";
}) {
  const locale = useLocale();
  const { formatMoney } = useCurrency();
  const localized = localizeGoodIdeasProduct(entry.product, locale);
  const imageSrc = isValidImageSrc(entry.cardImage) ? entry.cardImage : null;
  const salesBadge = localized.salesBadge?.trim();
  const isCenter = slot === "center";
  const isSide = slot === "left" || slot === "right";
  const isMain = isCenter || variant === "mobile";

  const widthClass = isMain
    ? variant === "mobile"
      ? "w-[min(88vw,340px)]"
      : "w-[min(100%,330px)]"
    : variant === "desktop"
      ? "h-full w-full"
      : "w-[min(100%,210px)]";

  const imageHeightClass = isMain
    ? "h-[200px] sm:h-[220px] lg:h-[240px]"
    : "h-[120px] sm:h-[130px] lg:h-[140px]";

  const handleClick = () => {
    if (isActive) onNavigate();
    else onActivate();
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  const shadowClass = isCenter
    ? "shadow-[0_28px_88px_rgba(0,0,0,0.42)]"
    : isSide
      ? "shadow-[0_18px_56px_rgba(0,0,0,0.28)]"
      : "shadow-[0_12px_40px_rgba(0,0,0,0.2)]";

  const borderClass = isCenter
    ? "border-[rgba(59,130,246,0.22)]"
    : "border-white/[0.18]";

  const hoverClass =
    isCenter && variant === "desktop"
      ? "hover:-translate-y-1 hover:border-[rgba(59,130,246,0.45)] hover:shadow-[0_36px_104px_rgba(0,0,0,0.48)]"
      : isSide
        ? "hover:border-[rgba(59,130,246,0.3)]"
        : "";

  return (
    <div
      role="button"
      tabIndex={slot === "hidden" ? -1 : 0}
      aria-label={localized.title}
      aria-current={isActive ? "true" : undefined}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`group cursor-pointer ${widthClass} ${
        slot === "hidden" ? "pointer-events-none" : ""
      }`}
    >
      <div
        className={`flex h-full flex-col overflow-hidden rounded-[28px] border bg-white ${borderClass} ${shadowClass} transition-[transform,box-shadow,border-color] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none lg:rounded-[30px] ${hoverClass}`}
        style={reduceMotion ? undefined : { willChange: "transform, opacity" }}
      >
        <div className={`relative ${imageHeightClass} overflow-hidden bg-white`}>
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
              priority={isCenter}
              placeholder="empty"
              sizes={isMain ? "(max-width: 1024px) 340px, 330px" : "210px"}
              className="object-cover object-center transition duration-[220ms] group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-body text-xs text-[#6B7280]">
              —
            </div>
          )}
        </div>

        <div className={`flex flex-1 flex-col gap-1.5 ${isMain ? "p-4 lg:p-5" : "p-3.5 lg:p-4"}`}>
          <h3
            className={`line-clamp-2 font-body font-semibold leading-snug text-[#111111] ${
              isMain ? "text-sm lg:text-[15px]" : "text-xs lg:text-[13px]"
            }`}
          >
            {localized.title}
          </h3>

          <p
            className={`font-body font-bold tabular-nums text-[#3B82F6] ${
              isMain ? "text-lg lg:text-xl" : "text-base"
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
          ) : isSide && variant === "desktop" ? (
            <div className="h-[18px] shrink-0" aria-hidden />
          ) : null}

          <span
            className={`mt-auto inline-flex items-center gap-1 font-body font-medium text-[#6B7280] transition group-hover:text-[#3B82F6] ${
              isMain ? "text-xs" : "text-[11px]"
            }`}
          >
            {viewProductLabel}
            <span aria-hidden>→</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function getDesktopSlotStyle(slot: CarouselSlot, reduceMotion: boolean): CSSProperties {
  const transition = reduceMotion
    ? "opacity 120ms ease-out"
    : `transform ${TRANSITION_MS}ms ${EASE}, opacity ${TRANSITION_MS}ms ${EASE}, left ${TRANSITION_MS}ms ${EASE}`;

  const sideBox: Pick<CSSProperties, "width" | "height"> = {
    width: DESKTOP_SIDE_CARD_WIDTH,
    height: DESKTOP_SIDE_CARD_HEIGHT,
  };

  const base: CSSProperties = {
    position: "absolute",
    top: DESKTOP_CAROUSEL_ANCHOR_TOP,
    transition,
    willChange: "transform, opacity, left",
    transformOrigin: "center center",
  };

  switch (slot) {
    case "center":
      return {
        ...base,
        left: "50%",
        zIndex: 30,
        opacity: 1,
        transform: "translate3d(-50%, -50%, 0) scale(1)",
      };
    case "left":
      return {
        ...base,
        ...sideBox,
        left: "24%",
        zIndex: 22,
        opacity: 0.88,
        transform: `translate3d(-50%, -50%, 0) scale(${DESKTOP_SIDE_SCALE})`,
      };
    case "right":
      return {
        ...base,
        ...sideBox,
        left: "76%",
        zIndex: 22,
        opacity: 0.88,
        transform: `translate3d(-50%, -50%, 0) scale(${DESKTOP_SIDE_SCALE})`,
      };
    case "hidden":
    default:
      return {
        ...base,
        ...sideBox,
        left: "24%",
        zIndex: 5,
        opacity: 0,
        transform: `translate3d(-50%, -50%, 0) scale(${DESKTOP_SIDE_SCALE * 0.9})`,
        pointerEvents: "none",
      };
  }
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
      <motion.div {...fade} className="pointer-events-none absolute inset-0 z-[1]" aria-hidden>
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
  microBadgeShipping,
  microBadgeSecure,
  viewProductLabel,
}: Props) {
  const router = useRouter();
  const locale = useLocale();
  const reduceMotion = useReducedMotion() ?? false;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isTouching, setIsTouching] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const autoplayEpoch = useRef(0);

  const count = entries.length;
  const productTitles = entries.map(
    (entry) => localizeGoodIdeasProduct(entry.product, locale).title
  );

  const goToIndex = useCallback((index: number) => {
    setActiveIndex(index);
    autoplayEpoch.current += 1;
  }, []);

  const goNext = useCallback(() => {
    if (count <= 1) return;
    setActiveIndex((prev) => (prev + 1) % count);
  }, [count]);

  const goPrev = useCallback(() => {
    if (count <= 1) return;
    setActiveIndex((prev) => (prev - 1 + count) % count);
  }, [count]);

  const navigateToProduct = useCallback(
    (entry: GoodIdeasHomeHeroCardEntry) => {
      router.push(productPath(locale, entry.product.id));
    },
    [locale, router]
  );

  useEffect(() => {
    if (reduceMotion || isPaused || isTouching || count <= 1) return;

    const epoch = autoplayEpoch.current;
    const timer = window.setInterval(() => {
      if (epoch !== autoplayEpoch.current) return;
      goNext();
    }, AUTOPLAY_MS);

    return () => window.clearInterval(timer);
  }, [activeIndex, count, goNext, isPaused, isTouching, reduceMotion]);

  const handleTouchStart = (clientX: number) => {
    touchStartX.current = clientX;
    setIsTouching(true);
  };

  const handleTouchEnd = (clientX: number) => {
    const start = touchStartX.current;
    touchStartX.current = null;
    setIsTouching(false);

    if (start === null) return;
    const delta = start - clientX;
    if (Math.abs(delta) < SWIPE_THRESHOLD) return;

    if (delta > 0) goNext();
    else goPrev();
    autoplayEpoch.current += 1;
  };

  if (count === 0) {
    return (
      <div
        className="relative mx-auto flex h-[340px] w-full max-w-[600px] items-center justify-center rounded-3xl border border-dashed border-white/[0.12] bg-[#151B24]/30 lg:h-[580px]"
        aria-hidden
      />
    );
  }

  const desktopTransition = reduceMotion
    ? "opacity 120ms ease-out"
    : `transform ${TRANSITION_MS}ms ${EASE}, opacity ${TRANSITION_MS}ms ${EASE}`;

  return (
    <div className="relative mx-auto w-full max-w-[640px] overflow-hidden lg:overflow-visible">
      {/* ——— Mobile ——— */}
      <div className="flex flex-col items-center gap-4 lg:hidden">
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          <MicroBadge iconId="shipping" label={microBadgeShipping} />
          <MicroBadge iconId="secure" label={microBadgeSecure} />
        </div>

        <div
          className="relative w-full touch-pan-y"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={(e) => handleTouchStart(e.touches[0]?.clientX ?? 0)}
          onTouchEnd={(e) => handleTouchEnd(e.changedTouches[0]?.clientX ?? 0)}
        >
          <div className="relative mx-auto flex min-h-[420px] w-full max-w-[380px] items-center justify-center overflow-hidden px-2">
            {entries.map((entry, index) => {
              const isActive = index === activeIndex;
              return (
                <div
                  key={entry.product.id}
                  className="absolute inset-x-0 flex justify-center"
                  style={{
                    opacity: isActive ? 1 : 0,
                    transform: isActive ? "translate3d(0,0,0) scale(1)" : "translate3d(0,8px,0) scale(0.96)",
                    transition: desktopTransition,
                    pointerEvents: isActive ? "auto" : "none",
                    zIndex: isActive ? 10 : 1,
                  }}
                >
                  <HeroCarouselProductCard
                    entry={entry}
                    slot="center"
                    isActive={isActive}
                    reviewStats={reviewStatsMap[entry.product.id]}
                    viewProductLabel={viewProductLabel}
                    onActivate={() => goToIndex(index)}
                    onNavigate={() => navigateToProduct(entry)}
                    reduceMotion={reduceMotion}
                    variant="mobile"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <CarouselDots
          count={count}
          activeIndex={activeIndex}
          onSelect={goToIndex}
          productTitles={productTitles}
        />
      </div>

      {/* ——— Desktop carousel ——— */}
      <div
        className="relative mx-auto hidden h-[580px] w-full max-w-[600px] lg:block"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <ShowcaseDecor reduceMotion={reduceMotion} />

        <div className="absolute left-1/2 top-[1%] z-[20] flex -translate-x-1/2 flex-wrap items-center justify-center gap-2.5 sm:gap-3">
          <MicroBadge iconId="shipping" label={microBadgeShipping} />
          <MicroBadge iconId="secure" label={microBadgeSecure} />
        </div>

        <div className="absolute inset-x-0 top-[10%] z-[10] h-[72%]">
          {entries.map((entry, index) => {
            const slot = getCarouselSlot(index, activeIndex, count);
            const isActive = index === activeIndex;
            const style = getDesktopSlotStyle(slot, reduceMotion);

            return (
              <div key={entry.product.id} style={style}>
                <HeroCarouselProductCard
                  entry={entry}
                  slot={slot}
                  isActive={isActive}
                  reviewStats={reviewStatsMap[entry.product.id]}
                  viewProductLabel={viewProductLabel}
                  onActivate={() => goToIndex(index)}
                  onNavigate={() => navigateToProduct(entry)}
                  reduceMotion={reduceMotion}
                  variant="desktop"
                />
              </div>
            );
          })}
        </div>

        <div className="absolute bottom-[8%] left-1/2 z-[25] -translate-x-1/2">
          <CarouselDots
            count={count}
            activeIndex={activeIndex}
            onSelect={goToIndex}
            productTitles={productTitles}
          />
        </div>
      </div>
    </div>
  );
}
