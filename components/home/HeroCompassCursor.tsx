"use client";

import { useEffect, useRef } from "react";

export type CompassCardinalLabels = {
  north: string;
  south: string;
  east: string;
  west: string;
};

type Props = {
  ariaLabel?: string;
  cardinalLabels: CompassCardinalLabels;
};

function shortestAngleDiff(from: number, to: number): number {
  let diff = to - from;
  while (diff > 180) diff -= 360;
  while (diff < -180) diff += 360;
  return diff;
}

/**
 * Brújula decorativa: aguja que interpola suavemente hacia la dirección del puntero en pantalla.
 * Etiquetas cardinales N / S / E / O|W según idioma.
 */
export default function HeroCompassCursor({
  ariaLabel = "Brújula",
  cardinalLabels,
}: Props) {
  const rootRef = useRef<HTMLButtonElement>(null);
  const needleRef = useRef<HTMLDivElement>(null);
  const targetAngleRef = useRef(0);
  const currentAngleRef = useRef(0);
  const reduceMotionRef = useRef(false);

  const { north, south, east, west } = cardinalLabels;

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => {
      reduceMotionRef.current = mq.matches;
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

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

      if (reduceMotionRef.current) {
        cur = target;
      } else {
        const diff = shortestAngleDiff(cur, target);
        cur += diff * 0.11;
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
  }, []);

  const labelClass =
    "pointer-events-none absolute font-sans text-[11px] font-semibold tracking-[0.18em] text-earth-brown/85 md:text-xs";

  return (
    <button
      ref={rootRef}
      type="button"
      aria-label={ariaLabel}
      className="relative isolate shrink-0 px-9 pb-10 pt-9 transition-shadow duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/45 focus-visible:ring-offset-2 focus-visible:ring-offset-warm-sand md:px-10 md:pb-11 md:pt-10"
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

      <div className="relative mx-auto flex h-[clamp(7.25rem,14vw,10.5rem)] w-[clamp(7.25rem,14vw,10.5rem)] items-center justify-center rounded-full border border-earth-brown/25 bg-white/75 shadow-[0_12px_40px_-12px_rgba(17,23,19,0.18)] backdrop-blur-md transition-[box-shadow,border-color] duration-300 hover:border-earth-brown/40 hover:shadow-[0_18px_48px_-14px_rgba(17,23,19,0.22)] motion-reduce:hover:shadow-[0_12px_40px_-12px_rgba(17,23,19,0.18)]">
        <svg
          className="pointer-events-none absolute inset-[10%] text-earth-brown/35"
          viewBox="0 0 100 100"
          aria-hidden
        >
          <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeWidth="0.8" />
          {[0, 45, 90, 135].map((rot) => (
            <line
              key={rot}
              x1="50"
              y1="50"
              x2="50"
              y2="8"
              stroke="currentColor"
              strokeWidth="0.9"
              strokeLinecap="round"
              transform={`rotate(${rot} 50 50)`}
            />
          ))}
        </svg>

        <div
          ref={needleRef}
          className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[72%] w-[72%] will-change-transform motion-reduce:!transition-none"
          style={{ transform: "translate(-50%, -50%) rotate(0deg)" }}
        >
          <svg className="h-full w-full" viewBox="-50 -50 100 100" aria-hidden>
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="26"
              stroke="#8A6A4F"
              strokeOpacity={0.55}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <polygon
              points="0,-38 -7,10 7,10"
              fill="#D98A24"
              stroke="#111713"
              strokeOpacity={0.12}
              strokeWidth="0.5"
            />
            <circle
              cx="0"
              cy="0"
              r="4"
              fill="#F5F2EC"
              stroke="#8A6A4F"
              strokeOpacity={0.45}
              strokeWidth="1"
            />
          </svg>
        </div>
      </div>
    </button>
  );
}
