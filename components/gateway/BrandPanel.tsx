"use client";

import { motion } from "framer-motion";
import { useCallback, useRef, useState } from "react";
import { GN_GATEWAY_PARALLAX_MAX_PX } from "@/lib/ui/gateway-mountains";
import type { BrandId } from "@/lib/routing/brands";
import { GN_EASE_PREMIUM } from "@/lib/ui/gonatural-design";
import GoNaturalEditorialColumn from "@/components/gateway/GoNaturalEditorialColumn";
import GoodIdeasEditorialColumn from "@/components/gateway/GoodIdeasEditorialColumn";
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
        <GoNaturalMountainLayer revealed={isGoNaturalHovered} parallax={parallax} />
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
        className={`relative z-10 flex h-full w-full flex-col items-center justify-center px-8 py-12 sm:px-12 md:px-14 ${
          layout === "column" ? "min-h-[50dvh]" : ""
        }`}
      >
        {isGoNatural ? (
          <GoNaturalEditorialColumn
            title={title}
            tagline={tagline}
            cta={cta}
            href={href}
            isActive={isActive}
          />
        ) : (
          <GoodIdeasEditorialColumn
            title={title}
            tagline={tagline}
            cta={cta}
            href={href}
            isActive={isActive}
          />
        )}
      </div>
    </motion.section>
  );
}
