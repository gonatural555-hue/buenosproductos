"use client";

import Image from "next/image";
import type { MotionValue } from "framer-motion";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import { GN_EASE_PREMIUM } from "@/lib/ui/gonatural-design";

const easePremium = GN_EASE_PREMIUM;

const BASE = "/assets/brand/mountains";

type Side = "left" | "right";

export type MountainDecorationSpec = {
  id: string;
  side: Side;
  /** Filename only, e.g. left-1.png */
  file: string;
  /** Vertical position as % of the scroll track (0–100), staircase down the page. */
  topPct: number;
  /** Tailwind width utilities: tighter on md (tablet), full on lg+. */
  wClasses: string;
  /** Extra translateY (px) at end of parallax scroll range (subtle drift). */
  parallax: number;
  /** Extra delay (s) on top of index-based stagger for whileInView. */
  viewDelay: number;
};

/**
 * Order and rhythm follow a long-page “staircase” (hero → mid → deep).
 * Missing files (e.g. left-5/right-5) are skipped at runtime via onError.
 */
export const HOME_MOUNTAIN_DECORATIONS: readonly MountainDecorationSpec[] = [
  {
    id: "l1",
    side: "left",
    file: "left-1.png",
    topPct: 4.2,
    wClasses:
      "w-[min(20vw,9rem)] md:w-[min(17vw,8rem)] lg:w-[min(22vw,11rem)] xl:w-[min(24vw,12rem)]",
    parallax: -14,
    viewDelay: 0,
  },
  {
    id: "r1",
    side: "right",
    file: "right-1.png",
    topPct: 6.8,
    wClasses:
      "w-[min(19vw,8.5rem)] md:w-[min(16vw,7.5rem)] lg:w-[min(21vw,10.5rem)] xl:w-[min(23vw,11.5rem)]",
    parallax: 18,
    viewDelay: 0.04,
  },
  {
    id: "l2",
    side: "left",
    file: "left-2.png",
    topPct: 18,
    wClasses:
      "w-[min(22vw,10rem)] md:w-[min(18vw,8.5rem)] lg:w-[min(24vw,12rem)] xl:w-[min(26vw,13rem)]",
    parallax: 20,
    viewDelay: 0.08,
  },
  {
    id: "r2",
    side: "right",
    file: "right-2.png",
    topPct: 24,
    wClasses:
      "w-[min(21vw,9.5rem)] md:w-[min(17vw,8rem)] lg:w-[min(23vw,11.5rem)] xl:w-[min(25vw,12.5rem)]",
    parallax: -16,
    viewDelay: 0.1,
  },
  {
    id: "l3",
    side: "left",
    file: "left-3.png",
    topPct: 36,
    wClasses:
      "w-[min(24vw,11rem)] md:w-[min(19vw,9rem)] lg:w-[min(26vw,13rem)] xl:w-[min(28vw,14rem)]",
    parallax: -22,
    viewDelay: 0.12,
  },
  {
    id: "r3",
    side: "right",
    file: "right-3.png",
    topPct: 44,
    wClasses:
      "w-[min(23vw,10.5rem)] md:w-[min(18vw,8.75rem)] lg:w-[min(25vw,12.5rem)] xl:w-[min(27vw,13.5rem)]",
    parallax: 20,
    viewDelay: 0.14,
  },
  {
    id: "l4",
    side: "left",
    file: "left-4.png",
    topPct: 58,
    wClasses:
      "w-[min(26vw,12rem)] md:w-[min(21vw,10rem)] lg:w-[min(28vw,14.5rem)] xl:w-[min(30vw,15.5rem)]",
    parallax: 24,
    viewDelay: 0.16,
  },
  {
    id: "r4",
    side: "right",
    file: "right-4.png",
    topPct: 66,
    wClasses:
      "w-[min(25vw,11.5rem)] md:w-[min(20vw,9.5rem)] lg:w-[min(27vw,14rem)] xl:w-[min(29vw,15rem)]",
    parallax: -18,
    viewDelay: 0.18,
  },
  {
    id: "l5",
    side: "left",
    file: "left-5.png",
    topPct: 80,
    wClasses:
      "w-[min(28vw,13rem)] md:w-[min(22vw,10.5rem)] lg:w-[min(30vw,16rem)] xl:w-[min(32vw,17rem)]",
    parallax: -20,
    viewDelay: 0.2,
  },
  {
    id: "r5",
    side: "right",
    file: "right-5.png",
    topPct: 88,
    wClasses:
      "w-[min(27vw,12.5rem)] md:w-[min(21vw,10rem)] lg:w-[min(29vw,15.5rem)] xl:w-[min(31vw,16.5rem)]",
    parallax: 22,
    viewDelay: 0.22,
  },
] as const;

function MountainLayer({
  scrollY,
  spec,
  index,
  reduceMotion,
}: {
  scrollY: MotionValue<number>;
  spec: MountainDecorationSpec;
  index: number;
  reduceMotion: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const fromX = spec.side === "left" ? -120 : 120;
  const rotateHover = spec.side === "left" ? -0.9 : 0.9;

  const parallaxY = useTransform(scrollY, [0, 2200], [0, reduceMotion ? 0 : spec.parallax]);

  const sideClass =
    spec.side === "left"
      ? "left-0 flex justify-start pl-0 md:-translate-x-[6%] lg:-translate-x-[4%] xl:-translate-x-[3%]"
      : "right-0 flex justify-end pr-0 md:translate-x-[6%] lg:translate-x-[4%] xl:translate-x-[3%]";

  if (failed) return null;

  return (
    <motion.div
      className={`pointer-events-none absolute flex ${sideClass} ${index >= 6 ? "hidden lg:flex" : ""}`}
      style={{
        top: `${spec.topPct}%`,
        y: parallaxY,
      }}
    >
      <motion.div
        className={`pointer-events-auto relative ${spec.wClasses} opacity-[0.62] will-change-transform md:opacity-[0.68] lg:opacity-[0.76]`}
        initial={
          reduceMotion ? false : { opacity: 0, x: fromX, y: 20, scale: 0.92 }
        }
        whileInView={
          reduceMotion
            ? { opacity: 0.72, x: 0, y: 0, scale: 1 }
            : { opacity: 0.78, x: 0, y: 0, scale: 1 }
        }
        viewport={{ once: true, amount: 0.14, margin: "0px 0px -12% 0px" }}
        transition={{
          duration: 1.15,
          delay: spec.viewDelay + index * 0.045,
          ease: easePremium,
        }}
        whileHover={
          reduceMotion
            ? undefined
            : {
                scale: 1.03,
                y: -6,
                rotate: rotateHover,
                opacity: 0.82,
                filter: "drop-shadow(0 16px 48px rgba(46, 74, 54, 0.12))",
                transition: { duration: 0.5, ease: easePremium },
              }
        }
        style={{
          transformOrigin: spec.side === "left" ? "70% 100%" : "30% 100%",
        }}
      >
        <Image
          src={`${BASE}/${spec.file}`}
          alt=""
          width={480}
          height={560}
          sizes="(min-width: 1280px) 28vw, (min-width: 1024px) 24vw, (min-width: 768px) 20vw, 0px"
          className="max-h-[28vh] h-auto w-full max-w-none object-contain object-bottom [filter:drop-shadow(0_10px_32px_rgba(0,0,0,0.06))] md:[filter:drop-shadow(0_12px_36px_rgba(0,0,0,0.07))]"
          draggable={false}
          priority={false}
          aria-hidden
          onError={() => setFailed(true)}
        />
      </motion.div>
    </motion.div>
  );
}

/**
 * Decorative mountain silhouettes for the home page only.
 * PNGs live under `/public/assets/brand/mountains/` (transparent).
 * Height follows `<main>` scroll height so peaks are placed down the full page, not only the first viewport.
 */
export default function MountainSideDecorations() {
  const reduceMotion = useReducedMotion() ?? false;
  const { scrollY } = useScroll();
  const rootRef = useRef<HTMLDivElement>(null);
  const [trackPx, setTrackPx] = useState(0);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const main = root?.closest("main");
    if (!main) return;

    const measure = () => {
      // Debe coincidir con la altura de scroll del <main>: un track más alto añade overflow fantasma y una “segunda” sensación de scroll.
      setTrackPx(main.scrollHeight);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(main);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="pointer-events-none absolute inset-0 z-0 hidden select-none overflow-x-clip md:block"
      aria-hidden
    >
      <div
        className="relative w-full overflow-x-clip"
        style={{
          minHeight: "100%",
          height: trackPx > 0 ? trackPx : undefined,
        }}
      >
        {HOME_MOUNTAIN_DECORATIONS.map((spec, index) => (
          <MountainLayer
            key={spec.id}
            scrollY={scrollY}
            spec={spec}
            index={index}
            reduceMotion={reduceMotion}
          />
        ))}
      </div>
    </div>
  );
}
