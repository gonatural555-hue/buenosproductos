"use client";

import { motion, useReducedMotion } from "framer-motion";
import HeroCutoutImage from "@/components/home/HeroCutoutImage";
import type { HeroProductShowcaseLayer, HeroProductShowcaseLayers } from "@/lib/hero-product-showcase";
import { GI_EASE } from "@/lib/ui/goodideas-design";

type Props = {
  layers: HeroProductShowcaseLayers;
};

function CutoutProduct({
  layer,
  className,
  priority = false,
  delay = 0,
  reduceMotion,
  float = false,
  rotate = 0,
  heightClass,
}: {
  layer: HeroProductShowcaseLayer;
  className: string;
  priority?: boolean;
  delay?: number;
  reduceMotion: boolean;
  float?: boolean;
  rotate?: number;
  heightClass: string;
}) {
  const floatAnim =
    float && !reduceMotion
      ? {
          y: [0, -6, 0],
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
      initial={reduceMotion ? false : { opacity: 0, y: 20, scale: 0.92 }}
      animate={
        reduceMotion
          ? { opacity: 1, y: 0, scale: 1, rotate }
          : { opacity: 1, y: 0, scale: 1, rotate, ...floatAnim }
      }
      transition={{ duration: 0.6, delay, ease: GI_EASE }}
      className={`pointer-events-none absolute ${className}`}
      style={{ rotate: reduceMotion ? `${rotate}deg` : undefined }}
    >
      <HeroCutoutImage
        src={layer.src}
        alt={layer.alt}
        heightClass={heightClass}
        fallbackSrc={layer.catalogFallbackSrc}
        priority={priority}
      />
    </motion.div>
  );
}

export default function BlogHeroProductMontage({ layers }: Props) {
  const reduceMotion = useReducedMotion() ?? false;
  const { main, secondary, tertiary } = layers;

  if (!main) return null;

  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-[10%] z-0 mx-auto h-[min(46vw,280px)] max-w-[920px] sm:bottom-[8%] sm:h-[min(40vh,360px)] md:bottom-[6%] md:h-[min(44vh,400px)]"
      aria-hidden
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_80%,rgba(59,130,246,0.2),transparent_68%)]" />

      <CutoutProduct
        layer={main}
        priority
        reduceMotion={reduceMotion}
        delay={0.1}
        heightClass="h-[min(38vw,220px)] sm:h-[260px] md:h-[300px]"
        className="bottom-[2%] right-[4%] z-[3] sm:right-[8%] md:right-[12%]"
      />

      {secondary ? (
        <CutoutProduct
          layer={secondary}
          reduceMotion={reduceMotion}
          delay={0.2}
          rotate={3}
          float
          heightClass="h-[min(28vw,150px)] sm:h-[170px] md:h-[190px]"
          className="bottom-0 left-[2%] z-[2] sm:left-[6%] md:left-[10%]"
        />
      ) : null}

      {tertiary ? (
        <CutoutProduct
          layer={tertiary}
          reduceMotion={reduceMotion}
          delay={0.28}
          rotate={-4}
          float
          heightClass="h-[min(24vw,120px)] sm:h-[140px] md:h-[160px]"
          className="right-[18%] top-0 z-[4] sm:right-[22%] md:right-[26%]"
        />
      ) : null}
    </div>
  );
}
