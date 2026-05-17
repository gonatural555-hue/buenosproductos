"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { GN_GATEWAY_PARALLAX_MAX_PX } from "@/lib/ui/gateway-mountains";
import type { BrandId } from "@/lib/routing/brands";
import { GN_EASE_PREMIUM } from "@/lib/ui/gonatural-design";
import GoNaturalEditorialColumn from "@/components/gateway/GoNaturalEditorialColumn";
import GoNaturalMountainLayer from "@/components/gateway/GoNaturalMountainLayer";

const TRANSITION_MS = 600;
const PANEL_EASE = GN_EASE_PREMIUM;

export type BrandPanelProps = {
  brand: BrandId;
  title: string;
  tagline: string;
  cta: string;
  href: string;
  isActive: boolean;
  isDimmed: boolean;
  onEnter: () => void;
  onLeave: () => void;
  layout: "row" | "column";
};

export default function BrandPanel({
  brand,
  title,
  tagline,
  cta,
  href,
  isActive,
  isDimmed,
  onEnter,
  onLeave,
  layout,
}: BrandPanelProps) {
  const isGoNatural = brand === "go-natural";
  const panelRef = useRef<HTMLElement>(null);
  const [isGoNaturalHovered, setIsGoNaturalHovered] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  const flexGrow = isActive ? 1.06 : isDimmed ? 0.94 : 1;

  const handleParallaxMove = useCallback(
    (e: React.MouseEvent<HTMLElement>) => {
      if (!isGoNatural || !isGoNaturalHovered) return;
      const el = panelRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      setParallax({
        x: nx * GN_GATEWAY_PARALLAX_MAX_PX,
        y: ny * (GN_GATEWAY_PARALLAX_MAX_PX * 0.45),
      });
    },
    [isGoNatural, isGoNaturalHovered]
  );

  const handleEnter = () => {
    onEnter();
    if (isGoNatural) setIsGoNaturalHovered(true);
  };

  const handleLeave = () => {
    onLeave();
    if (isGoNatural) {
      setIsGoNaturalHovered(false);
      setParallax({ x: 0, y: 0 });
    }
  };

  return (
    <motion.section
      ref={panelRef}
      className="relative flex min-h-[50dvh] flex-1 overflow-hidden md:min-h-0"
      style={{ flexGrow }}
      transition={{ duration: TRANSITION_MS / 1000, ease: PANEL_EASE }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={isGoNatural ? handleParallaxMove : undefined}
      onFocus={handleEnter}
      onBlur={handleLeave}
    >
      <motion.div
        className={`absolute inset-0 transition-[opacity,transform] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isGoNatural
            ? "bg-[#F4EBDD]"
            : "bg-[linear-gradient(165deg,#0B0F14_0%,#151B24_48%,#1a2230_100%)]"
        } ${isActive ? "opacity-100" : isDimmed ? "opacity-[0.72]" : "opacity-95"}`}
        aria-hidden
      />

      {isGoNatural ? (
        <>
          <motion.div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_30%_20%,rgba(46,74,54,0.12),transparent_55%)]"
            animate={{ opacity: isActive ? 1 : 0.55 }}
            transition={{ duration: TRANSITION_MS / 1000 }}
            aria-hidden
          />
          <motion.div
            className="pointer-events-none absolute -right-[20%] bottom-[-15%] h-[70%] w-[90%] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(46,74,54,0.14),transparent_68%)]"
            animate={{ scale: isActive ? 1.04 : 1, opacity: isActive ? 0.9 : 0.45 }}
            transition={{ duration: TRANSITION_MS / 1000 }}
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[1] h-[38%] bg-[linear-gradient(to_top,rgba(46,74,54,0.08),transparent)]"
            aria-hidden
          />
          <GoNaturalMountainLayer revealed={isGoNaturalHovered} parallax={parallax} />
          {/* Isla editorial — protege logo/texto/CTA de montañas en hover */}
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] h-[min(88%,560px)] bg-[radial-gradient(ellipse_90%_80%_at_50%_100%,#F4EBDD_0%,#F4EBDD_42%,rgba(244,235,221,0.92)_58%,transparent_78%)]"
            aria-hidden
          />
        </>
      ) : (
        <>
          <motion.div
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_50%_at_75%_15%,rgba(59,130,246,0.18),transparent_58%)]"
            animate={{ opacity: isActive ? 1 : 0.4 }}
            transition={{ duration: TRANSITION_MS / 1000 }}
            aria-hidden
          />
          <motion.div
            className="pointer-events-none absolute inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] [background-size:48px_48px]"
            aria-hidden
          />
        </>
      )}

      <div
        className={`relative z-10 flex h-full w-full flex-col px-8 pb-16 pt-24 sm:px-12 sm:pb-[4.5rem] md:px-14 md:pb-20 md:pt-28 ${
          isGoNatural ? "items-center justify-end" : "justify-end"
        } ${layout === "column" ? "min-h-[50dvh]" : ""}`}
      >
        {isGoNatural ? (
          <GoNaturalEditorialColumn
            tagline={tagline}
            cta={cta}
            href={href}
            isActive={isActive}
          />
        ) : (
          <>
            <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.22em] text-[rgba(232,236,241,0.5)]">
              Lifestyle & Tech
            </p>
            <h2 className="mt-3 max-w-[14ch] font-display text-[clamp(2.25rem,5vw,3.75rem)] font-normal leading-[0.95] tracking-[-0.02em] text-[#E8ECF1]">
              {title}
            </h2>
            <p className="mt-4 max-w-md font-inter text-[15px] leading-relaxed text-[rgba(232,236,241,0.72)] md:text-[16px]">
              {tagline}
            </p>
            <motion.div
              className="mt-8"
              animate={{
                opacity: isActive ? 1 : 0.82,
                y: isActive ? 0 : 4,
              }}
              transition={{ duration: TRANSITION_MS / 1000, ease: PANEL_EASE }}
            >
              <Link
                href={href}
                className="group inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#E8ECF1] px-8 font-inter text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0B0F14] shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition-[transform,box-shadow,background-color] duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50 focus-visible:ring-offset-[#0B0F14] motion-reduce:transition-none"
              >
                <span className="flex items-center gap-2">
                  {cta}
                  <span
                    className="inline-block transition-transform duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0.5"
                    aria-hidden
                  >
                    →
                  </span>
                </span>
              </Link>
            </motion.div>
          </>
        )}
      </div>
    </motion.section>
  );
}
