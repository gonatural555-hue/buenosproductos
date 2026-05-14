"use client";

import { useEffect, useId, useRef } from "react";

export type ProductsHeroCompassLabels = {
  north: string;
  south: string;
  east: string;
  west: string;
};

type Props = {
  ariaLabel: string;
  labels: ProductsHeroCompassLabels;
  reduceMotion: boolean;
};

function shortestAngleDiff(from: number, to: number): number {
  let diff = to - from;
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  return diff;
}

/** Suavizado tipo resorte, independiente del framerate (requestAnimationFrame). */
function useCursorNeedleAngle(reduceMotion: boolean) {
  const rootRef = useRef<HTMLDivElement>(null);
  const needleRef = useRef<HTMLDivElement>(null);
  const targetAngleRef = useRef(0);
  const currentAngleRef = useRef(0);
  const lastTsRef = useRef<number | null>(null);

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

    const loop = (ts: number) => {
      if (!alive) return;
      const last = lastTsRef.current ?? ts;
      lastTsRef.current = ts;
      const dt = Math.min(0.045, Math.max(0, (ts - last) / 1000));

      const target = targetAngleRef.current;
      let cur = currentAngleRef.current;

      if (reduceMotion) {
        cur = target;
      } else {
        const diff = shortestAngleDiff(cur, target);
        const lambda = 18;
        cur += diff * (1 - Math.exp(-lambda * dt));
      }

      currentAngleRef.current = cur;
      const needle = needleRef.current;
      if (needle) {
        needle.style.transform = `translate(-50%, -50%) rotate(${cur}deg)`;
      }

      if (alive) {
        rafId = requestAnimationFrame(loop);
      }
    };

    rafId = requestAnimationFrame(loop);
    return () => {
      alive = false;
      cancelAnimationFrame(rafId);
    };
  }, [reduceMotion]);

  return { rootRef, needleRef };
}

const LETTER =
  "pointer-events-none select-none font-inter text-[10px] font-semibold uppercase tracking-[0.2em] text-[#2E4A36]/55 sm:text-[11px]";

export default function ProductsHeroLuxuryCompass({
  ariaLabel,
  labels,
  reduceMotion,
}: Props) {
  const uid = useId().replace(/:/g, "");
  const creamGrad = `lux-cream-${uid}`;
  const goldGrad = `lux-gold-${uid}`;
  const needleNorth = `lux-needle-n-${uid}`;
  const needleSouth = `lux-needle-s-${uid}`;
  const needleShadowFilter = `lux-needle-shadow-${uid}`;
  const { rootRef, needleRef } = useCursorNeedleAngle(reduceMotion);

  return (
    <div
      className="relative mx-auto flex aspect-square w-[clamp(292px,78vw,332px)] items-center justify-center lg:w-[clamp(412px,36vw,452px)]"
      role="img"
      aria-label={ariaLabel}
    >
      <span className={`${LETTER} absolute left-1/2 top-[2px] -translate-x-1/2`} aria-hidden>
        {labels.north}
      </span>
      <span className={`${LETTER} absolute bottom-[2px] left-1/2 -translate-x-1/2`} aria-hidden>
        {labels.south}
      </span>
      <span className={`${LETTER} absolute left-[2px] top-1/2 -translate-y-1/2`} aria-hidden>
        {labels.west}
      </span>
      <span className={`${LETTER} absolute right-[2px] top-1/2 -translate-y-1/2`} aria-hidden>
        {labels.east}
      </span>

      <div
        ref={rootRef}
        className="absolute left-1/2 top-1/2 aspect-square w-[clamp(220px,62vw,260px)] max-w-[90%] -translate-x-1/2 -translate-y-1/2 rounded-full lg:w-[clamp(320px,28vw,380px)]"
      >
        <div
          className="absolute inset-[5%] rounded-full shadow-[0_22px_48px_-18px_rgba(42,46,75,0.2),0_10px_28px_-14px_rgba(46,74,54,0.14),inset_0_1px_0_rgba(255,255,255,0.65)] ring-1 ring-[#2E4A36]/12"
          aria-hidden
        />
        <div
          className="absolute inset-[6%] rounded-full bg-gradient-to-br from-[#faf6ee] via-[#F4EBDD] to-[#e4d8c4] shadow-[inset_0_3px_10px_rgba(255,255,255,0.85),inset_0_-8px_18px_rgba(46,74,54,0.07)]"
          aria-hidden
        />
        <div
          className="absolute inset-[8%] rounded-full ring-1 ring-[#D9A441]/28 ring-inset shadow-[inset_0_0_0_1px_rgba(255,255,255,0.45)]"
          aria-hidden
        />
        <div
          className="absolute inset-[10%] rounded-full ring-[0.5px] ring-[#2E4A36]/10"
          aria-hidden
        />

        <svg
          className="absolute inset-[12%] z-[1] overflow-visible"
          viewBox="0 0 100 100"
          aria-hidden
        >
          <defs>
            <linearGradient id={creamGrad} x1="30%" y1="0%" x2="70%" y2="100%">
              <stop offset="0%" stopColor="#faf6ee" />
              <stop offset="50%" stopColor="#F4EBDD" />
              <stop offset="100%" stopColor="#dccfb8" />
            </linearGradient>
            <linearGradient id={goldGrad} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#e8c86a" />
              <stop offset="45%" stopColor="#D9A441" />
              <stop offset="100%" stopColor="#a67c1f" />
            </linearGradient>
          </defs>

          <circle cx="50" cy="50" r="48" fill={`url(#${creamGrad})`} />
          <circle
            cx="50"
            cy="50"
            r="47"
            fill="none"
            stroke="#2E4A36"
            strokeWidth="0.15"
            opacity="0.12"
          />
          <circle
            cx="50"
            cy="50"
            r="43"
            fill="none"
            stroke="#D9A441"
            strokeWidth="0.12"
            opacity="0.25"
          />
          <circle
            cx="50"
            cy="50"
            r="39"
            fill="none"
            stroke={`url(#${goldGrad})`}
            strokeWidth="0.14"
            opacity="0.22"
          />

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
                y2={major ? "9.5" : med ? "11" : "12"}
                stroke="#2E4A36"
                strokeWidth={major ? 0.38 : med ? 0.24 : 0.14}
                strokeLinecap="round"
                opacity={major ? 0.32 : med ? 0.2 : 0.11}
                transform={`rotate(${deg} 50 50)`}
              />
            );
          })}

          {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
            <line
              key={deg}
              x1="50"
              y1="50"
              x2="50"
              y2="14"
              stroke="#2E4A36"
              strokeWidth="0.22"
              strokeLinecap="round"
              opacity="0.16"
              transform={`rotate(${deg} 50 50)`}
            />
          ))}

          <circle
            cx="50"
            cy="50"
            r="6"
            fill="none"
            stroke="#D9A441"
            strokeWidth="0.2"
            opacity="0.35"
          />
          <circle cx="50" cy="50" r="2.2" fill="#2E4A36" opacity="0.88" />
          <circle cx="50" cy="50" r="1.1" fill="#D9A441" opacity="0.9" />
        </svg>

        <div
          ref={needleRef}
          className="pointer-events-none absolute left-1/2 top-1/2 z-[2] h-[42%] w-[9%] -translate-x-1/2 -translate-y-1/2 will-change-transform"
          style={{ transform: "translate(-50%, -50%) rotate(0deg)" }}
          aria-hidden
        >
          <svg className="h-full w-full overflow-visible" viewBox="0 0 20 90" preserveAspectRatio="none">
            <defs>
              <linearGradient id={needleNorth} x1="50%" y1="100%" x2="50%" y2="0%">
                <stop offset="0%" stopColor="#C9622B" stopOpacity="0.35" />
                <stop offset="55%" stopColor="#D9A441" />
                <stop offset="100%" stopColor="#f0e6bc" />
              </linearGradient>
              <linearGradient id={needleSouth} x1="50%" y1="0%" x2="50%" y2="100%">
                <stop offset="0%" stopColor="#2E4A36" stopOpacity="0.55" />
                <stop offset="100%" stopColor="#2A2E4B" stopOpacity="0.45" />
              </linearGradient>
              <filter id={needleShadowFilter} x="-50%" y="-15%" width="200%" height="140%">
                <feDropShadow dx="0" dy="0.8" stdDeviation="0.7" floodColor="#2A2E4B" floodOpacity="0.2" />
              </filter>
            </defs>
            <path
              d="M10 2 L17 44 L10 40 L3 44 Z"
              fill={`url(#${needleNorth})`}
              filter={`url(#${needleShadowFilter})`}
            />
            <path
              d="M10 40 L17 86 L10 82 L3 86 Z"
              fill={`url(#${needleSouth})`}
              opacity="0.92"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
