"use client";

import { useReducedMotion } from "framer-motion";
import { useEffect, useId, useRef } from "react";

export type CompassCardinalLabels = {
  north: string;
  south: string;
  east: string;
  west: string;
};

type Props = {
  ariaLabel?: string;
  cardinalLabels: CompassCardinalLabels;
  /** `brand`: brújula editorial Go Natural (home). `expedition`: bronce legacy. */
  variant?: "expedition" | "brand";
};

function shortestAngleDiff(from: number, to: number): number {
  let diff = to - from;
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  return diff;
}

/** Spring-like smoothing (higher = snappier, lower = silkier). */
const NEEDLE_LERP = 0.058;

export default function HeroCompassCursor({
  ariaLabel = "Brújula",
  cardinalLabels,
  variant = "expedition",
}: Props) {
  const isBrand = variant === "brand";
  const reduceMotion = useReducedMotion();
  const uid = useId().replace(/:/g, "");
  const tickGradId = `compass-tick-${uid}`;
  const faceShadeId = `compass-face-shade-${uid}`;
  const needleGoldId = `needle-gold-${uid}`;
  const needleShadowId = `needle-shadow-${uid}`;
  const rootRef = useRef<HTMLButtonElement>(null);
  const needleRef = useRef<HTMLDivElement>(null);
  const targetAngleRef = useRef(0);
  const currentAngleRef = useRef(0);

  const { north, south, east, west } = cardinalLabels;

  useEffect(() => {
    const updateTarget = (clientX: number, clientY: number) => {
      const el = rootRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const rad = Math.atan2(clientY - cy, clientX - cx);
      targetAngleRef.current = (rad * 180) / Math.PI;
    };

    const onMouse = (e: MouseEvent) => updateTarget(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) updateTarget(t.clientX, t.clientY);
    };

    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
    };
  }, []);

  useEffect(() => {
    let rafId = 0;
    let alive = true;

    const loop = () => {
      if (!alive) return;

      const target = targetAngleRef.current;
      let cur = currentAngleRef.current;

      if (reduceMotion) {
        cur = target;
      } else {
        const diff = shortestAngleDiff(cur, target);
        cur += diff * NEEDLE_LERP;
      }

      currentAngleRef.current = cur;

      const needle = needleRef.current;
      if (needle) {
        needle.style.transform = `translate(-50%, -50%) rotate(${cur}deg)`;
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
    };
  }, [reduceMotion]);

  const labelLuxury =
    "pointer-events-none absolute font-sans text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2E4A36]/72 md:text-[11px]";

  const dialLuxury =
    "relative mx-auto flex h-[clamp(13.75rem,34vmin,23.75rem)] w-[clamp(13.75rem,34vmin,23.75rem)] items-center justify-center";

  const focusLuxury =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441]/45 focus-visible:ring-offset-4 focus-visible:ring-offset-[#F4EBDD]";

  if (isBrand) {
    return (
      <button
        ref={rootRef}
        type="button"
        aria-label={ariaLabel}
        className={`relative isolate shrink-0 px-8 pb-10 pt-8 transition-[filter,transform] duration-500 ease-out md:px-10 md:pb-11 md:pt-9 ${focusLuxury}`}
      >
        <span className={`${labelLuxury} left-1/2 top-0 -translate-x-1/2`} aria-hidden>
          {north}
        </span>
        <span className={`${labelLuxury} bottom-0 left-1/2 -translate-x-1/2`} aria-hidden>
          {south}
        </span>
        <span className={`${labelLuxury} left-0 top-1/2 -translate-y-1/2`} aria-hidden>
          {west}
        </span>
        <span className={`${labelLuxury} right-0 top-1/2 -translate-y-1/2`} aria-hidden>
          {east}
        </span>

        <div className={`${dialLuxury} drop-shadow-[0_18px_48px_-16px_rgba(42,46,75,0.18),0_8px_24px_-12px_rgba(46,74,54,0.15)]`}>
          {/* Bezel exterior — crema cálida + filo forest */}
          <div
            className="absolute inset-0 rounded-full bg-gradient-to-br from-[#ede4d4] via-[#F4EBDD] to-[#dccfb8] shadow-[inset_0_2px_6px_rgba(255,255,255,0.85),inset_0_-4px_12px_rgba(46,74,54,0.06),0_2px_0_rgba(255,255,255,0.5)] ring-[1.5px] ring-[#2E4A36]/18"
            aria-hidden
          />
          <div
            className="absolute inset-[5px] rounded-full bg-gradient-to-b from-[#2E4A36]/12 via-transparent to-[#2A2E4B]/08"
            aria-hidden
          />

          {/* Anillo metálico fino */}
          <div
            className="absolute inset-[10px] rounded-full ring-1 ring-[#D9A441]/35 ring-inset shadow-[inset_0_0_0_1px_rgba(255,255,255,0.35)]"
            aria-hidden
          />

          {/* Cara interior */}
          <div className="absolute inset-[14px] overflow-hidden rounded-full bg-gradient-to-b from-[#faf6ee] via-[#F4EBDD] to-[#e8dcc8] shadow-[inset_0_4px_14px_rgba(255,255,255,0.9),inset_0_-10px_22px_rgba(46,74,54,0.06)] ring-1 ring-[#2E4A36]/10">
            <div
              className="pointer-events-none absolute inset-0 rounded-full opacity-50"
              style={{
                background: `radial-gradient(ellipse 72% 48% at 48% 28%, rgba(255,255,255,0.95), transparent 55%), radial-gradient(circle at 72% 78%, rgba(217,164,65,0.14), transparent 42%), radial-gradient(circle at 22% 68%, rgba(201,98,43,0.08), transparent 38%)`,
              }}
              aria-hidden
            />
            <svg className="pointer-events-none absolute inset-[8%] z-[1]" viewBox="0 0 100 100" aria-hidden>
              <defs>
                <linearGradient id={faceShadeId} x1="50%" y1="0%" x2="50%" y2="100%">
                  <stop offset="0%" stopColor="#2E4A36" stopOpacity="0.06" />
                  <stop offset="100%" stopColor="#2A2E4B" stopOpacity="0.12" />
                </linearGradient>
                <linearGradient id={tickGradId} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2E4A36" stopOpacity="0.2" />
                  <stop offset="50%" stopColor="#D9A441" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#2E4A36" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <circle cx="50" cy="50" r="48" fill="none" stroke={`url(#${tickGradId})`} strokeWidth="0.28" opacity="0.55" />
              <circle cx="50" cy="50" r="44.5" fill="none" stroke="#2E4A36" strokeWidth="0.18" opacity="0.14" />
              <circle cx="50" cy="50" r="40.5" fill="none" stroke="#2E4A36" strokeWidth="0.12" opacity="0.1" />
              <circle cx="50" cy="50" r="36" fill="none" stroke="#D9A441" strokeWidth="0.15" opacity="0.22" />
              {Array.from({ length: 72 }).map((_, i) => {
                const deg = i * 5;
                const major = i % 6 === 0;
                const med = i % 3 === 0 && !major;
                return (
                  <line
                    key={deg}
                    x1="50"
                    y1="50"
                    x2="50"
                    y2={major ? "10" : med ? "11.5" : "12.4"}
                    stroke={major ? "#2E4A36" : "#2E4A36"}
                    strokeWidth={major ? 0.42 : med ? 0.28 : 0.16}
                    strokeLinecap="round"
                    opacity={major ? 0.38 : med ? 0.26 : 0.14}
                    transform={`rotate(${deg} 50 50)`}
                  />
                );
              })}
              {[0, 90, 180, 270].map((deg) => (
                <line
                  key={`maj${deg}`}
                  x1="50"
                  y1="50"
                  x2="50"
                  y2="8.2"
                  stroke="#C9622B"
                  strokeWidth="0.5"
                  strokeLinecap="square"
                  opacity="0.35"
                  transform={`rotate(${deg} 50 50)`}
                />
              ))}
              <circle cx="50" cy="50" r="47" fill={`url(#${faceShadeId})`} opacity="0.35" />
            </svg>

            {/* Aguja — oro / bronce, cap navy */}
            <div
              ref={needleRef}
              className="pointer-events-none absolute left-1/2 top-1/2 z-[2] h-[74%] w-[74%] will-change-transform motion-reduce:!transition-none"
              style={{ transform: "translate(-50%, -50%) rotate(0deg)" }}
            >
              <svg className="h-full w-full drop-shadow-[0_4px_12px_rgba(46,74,54,0.18)]" viewBox="-50 -50 100 100" aria-hidden>
                <defs>
                  <linearGradient id={needleGoldId} x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#f0d78a" />
                    <stop offset="35%" stopColor="#D9A441" />
                    <stop offset="70%" stopColor="#C9622B" />
                    <stop offset="100%" stopColor="#8a6220" />
                  </linearGradient>
                  <linearGradient id={needleShadowId} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#2A2E4B" stopOpacity="0.25" />
                    <stop offset="50%" stopColor="#ffffff" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#2A2E4B" stopOpacity="0.2" />
                  </linearGradient>
                </defs>
                <polygon
                  points="0,-42 -7,14 7,14"
                  fill={`url(#${needleGoldId})`}
                  stroke="#6b541c"
                  strokeWidth="0.35"
                  strokeOpacity="0.35"
                />
                <polygon points="0,-38 -4,11 4,11" fill={`url(#${needleShadowId})`} opacity="0.45" />
                <line
                  x1="0"
                  y1="8"
                  x2="0"
                  y2="32"
                  stroke="#2E4A36"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  opacity="0.35"
                />
                <path
                  d="M-4.5 30 L4.5 30 L2.5 38 L-2.5 38 Z"
                  fill="#2E4A36"
                  stroke="#1a1f38"
                  strokeWidth="0.25"
                  opacity="0.88"
                />
                <circle cx="0" cy="0" r="6" fill="#f4ebdd" stroke="#2E4A36" strokeWidth="0.55" />
                <circle cx="0" cy="0" r="4.2" fill="#2A2E4B" stroke="#D9A441" strokeWidth="0.35" strokeOpacity="0.5" />
                <circle cx="-1.1" cy="-1.1" r="1.2" fill="white" opacity="0.4" />
              </svg>
            </div>

            <div
              className="pointer-events-none absolute inset-[15px] rounded-full ring-1 ring-white/40 ring-inset shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]"
              aria-hidden
            />
          </div>
        </div>
      </button>
    );
  }

  /* ─── Expedition (legacy) ─── */
  const needleBrassId = `needle-brass-${uid}`;
  const needleSteelId = `needle-steel-${uid}`;
  const needleNorthBrandId = `needle-north-brand-${uid}`;

  const labelClass =
    "pointer-events-none absolute font-sans text-[10px] font-semibold uppercase tracking-[0.32em] text-earth-brown/72 md:text-[11px] md:tracking-[0.34em]";

  const dialSize = "h-[clamp(10rem,19vw,14.75rem)] w-[clamp(10rem,19vw,14.75rem)]";

  const focusRing = "focus-visible:ring-2 focus-visible:ring-accent-gold/40 focus-visible:ring-offset-4 focus-visible:ring-offset-white";

  const dropShadow = "drop-shadow-[0_22px_48px_-18px_rgba(17,23,19,0.38)]";

  return (
    <button
      ref={rootRef}
      type="button"
      aria-label={ariaLabel}
      className={`relative isolate shrink-0 px-[2.1rem] pb-[2.5rem] pt-[2.1rem] transition-[filter,transform] duration-500 ease-out focus:outline-none md:px-[2.35rem] md:pb-[2.65rem] md:pt-[2.35rem] ${focusRing}`}
    >
      <span className={`${labelClass} left-1/2 top-0 -translate-x-1/2`} aria-hidden>
        {north}
      </span>
      <span className={`${labelClass} bottom-0 left-1/2 -translate-x-1/2`} aria-hidden>
        {south}
      </span>
      <span className={`${labelClass} left-0 top-1/2 -translate-y-1/2`} aria-hidden>
        {west}
      </span>
      <span className={`${labelClass} right-0 top-1/2 -translate-y-1/2`} aria-hidden>
        {east}
      </span>

      <div className={`relative mx-auto flex ${dialSize} items-center justify-center ${dropShadow}`}>
        <div
          className="absolute inset-0 rounded-full bg-gradient-to-br from-[#3d3429] via-[#2a241c] to-[#1a1612] shadow-[inset_0_2px_3px_rgba(255,255,255,0.08),inset_0_-4px_12px_rgba(0,0,0,0.55),0_12px_32px_-8px_rgba(0,0,0,0.45)] ring-1 ring-black/40"
          aria-hidden
        />
        <div
          className="absolute inset-[5px] rounded-full bg-gradient-to-br from-[#5c4f3f] via-[#3a3228] to-[#252018] shadow-[inset_0_1px_0_rgba(255,255,255,0.12)]"
          aria-hidden
        />

        <div className="absolute inset-[11px] overflow-hidden rounded-full bg-gradient-to-b from-[#f7f4ed] via-[#e8e2d6] to-[#d8d0c2] shadow-[inset_0_3px_8px_rgba(255,255,255,0.65),inset_0_-6px_14px_rgba(0,0,0,0.12)] ring-1 ring-white/50">
          <div
            className="pointer-events-none absolute inset-0 rounded-full opacity-[0.18]"
            style={{
              background:
                "radial-gradient(ellipse 80% 55% at 50% 28%, rgba(255,255,255,0.95), transparent 55%), radial-gradient(circle at 70% 75%, rgba(217,138,36,0.08), transparent 45%)",
            }}
            aria-hidden
          />
        </div>

        <svg
          className="pointer-events-none absolute inset-[14%] z-[1] text-[#4a4338]/55"
          viewBox="0 0 100 100"
          aria-hidden
        >
          <defs>
            <linearGradient id={tickGradId} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#6b5e4f" stopOpacity="0.35" />
              <stop offset="50%" stopColor="#3d362c" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#6b5e4f" stopOpacity="0.35" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="47.2" fill="none" stroke={`url(#${tickGradId})`} strokeWidth="0.35" opacity="0.9" />
          <circle cx="50" cy="50" r="43.5" fill="none" stroke="currentColor" strokeWidth="0.22" opacity="0.45" />
          {Array.from({ length: 36 }).map((_, i) => {
            const deg = i * 10;
            const major = i % 3 === 0;
            return (
              <line
                key={deg}
                x1="50"
                y1="50"
                x2="50"
                y2={major ? "9.5" : "11.2"}
                stroke="currentColor"
                strokeWidth={major ? 0.55 : 0.28}
                strokeLinecap="round"
                opacity={major ? 0.85 : 0.4}
                transform={`rotate(${deg} 50 50)`}
              />
            );
          })}
          {[0, 90, 180, 270].map((deg) => (
            <line
              key={`m${deg}`}
              x1="50"
              y1="50"
              x2="50"
              y2="7"
              stroke="#2c2620"
              strokeWidth="0.65"
              strokeLinecap="square"
              opacity={0.5}
              transform={`rotate(${deg} 50 50)`}
            />
          ))}
        </svg>

        <div
          ref={needleRef}
          className="pointer-events-none absolute left-1/2 top-1/2 z-[2] h-[76%] w-[76%] will-change-transform motion-reduce:!transition-none"
          style={{ transform: "translate(-50%, -50%) rotate(0deg)" }}
        >
          <svg className="h-full w-full drop-shadow-[0_3px_8px_rgba(46,74,54,0.2)]" viewBox="-50 -50 100 100" aria-hidden>
            <defs>
              <linearGradient id={needleBrassId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#e8c066" />
                <stop offset="45%" stopColor="#c8942e" />
                <stop offset="100%" stopColor="#8a5a18" />
              </linearGradient>
              <linearGradient id={needleSteelId} x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#9a9a98" />
                <stop offset="50%" stopColor="#f0eeea" />
                <stop offset="100%" stopColor="#7a7874" />
              </linearGradient>
              <linearGradient id={needleNorthBrandId} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#6E1F28" />
                <stop offset="55%" stopColor="#C9622B" />
                <stop offset="100%" stopColor="#D9A441" />
              </linearGradient>
            </defs>
            <path
              d="M-5 18 L5 18 L3 28 L-3 28 Z"
              fill={`url(#${needleBrassId})`}
              stroke="#2a2218"
              strokeWidth="0.35"
              strokeOpacity="0.45"
            />
            <line x1="0" y1="10" x2="0" y2="30" stroke="#3a3228" strokeWidth="2.2" strokeLinecap="round" />
            <polygon
              points="0,-40 -8.5,12 8.5,12"
              fill={`url(#${needleBrassId})`}
              stroke="#1f1810"
              strokeWidth="0.45"
              strokeOpacity="0.4"
            />
            <polygon points="0,-36 -4.5,10 4.5,10" fill={`url(#${needleSteelId})`} opacity={0.55} />
            <circle cx="0" cy="0" r="5.5" fill={`url(#${needleSteelId})`} stroke="#4a4338" strokeWidth="0.5" />
            <circle cx="0" cy="0" r="2.8" fill="#2a241c" stroke="#8a7a68" strokeWidth="0.35" />
            <circle cx="-1" cy="-1" r="1" fill="white" opacity="0.35" />
          </svg>
        </div>

        <div
          className="pointer-events-none absolute inset-[13px] rounded-full ring-1 ring-white/25 ring-inset"
          aria-hidden
        />
      </div>
    </button>
  );
}
