"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Etiqueta accesible del botón */
  ariaLabel?: string;
};

/**
 * Brújula circular decorativa: la aguja principal apunta hacia la posición del cursor
 * (o del dedo en touch). Pensada para el hero editorial Go Natural.
 */
export default function HeroCompassCursor({
  ariaLabel = "Brújula — la aguja sigue el puntero",
}: Props) {
  const rootRef = useRef<HTMLButtonElement>(null);
  const [angleDeg, setAngleDeg] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const update = (clientX: number, clientY: number) => {
      const el = rootRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const rad = Math.atan2(clientY - cy, clientX - cx);
      setAngleDeg((rad * 180) / Math.PI);
    };

    const schedule = (clientX: number, clientY: number) => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(() => update(clientX, clientY));
    };

    const onMouse = (e: MouseEvent) => schedule(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) schedule(t.clientX, t.clientY);
    };

    window.addEventListener("mousemove", onMouse, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });

    return () => {
      window.removeEventListener("mousemove", onMouse);
      window.removeEventListener("touchmove", onTouch);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <button
      ref={rootRef}
      type="button"
      aria-label={ariaLabel}
      className="relative isolate flex h-[clamp(7.25rem,14vw,10.5rem)] w-[clamp(7.25rem,14vw,10.5rem)] shrink-0 items-center justify-center rounded-full border border-earth-brown/25 bg-white/75 shadow-[0_12px_40px_-12px_rgba(17,23,19,0.18)] backdrop-blur-md transition-shadow duration-300 hover:border-earth-brown/40 hover:shadow-[0_18px_48px_-14px_rgba(17,23,19,0.22)] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/45 focus-visible:ring-offset-2 focus-visible:ring-offset-warm-sand motion-reduce:hover:shadow-[0_12px_40px_-12px_rgba(17,23,19,0.18)]"
    >
      {/* Rosa de los vientos estática */}
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
        <text
          x="50"
          y="14"
          textAnchor="middle"
          fill="#8A6A4F"
          fillOpacity={0.65}
          style={{ fontSize: "9px", fontFamily: "system-ui, sans-serif", fontWeight: 600 }}
        >
          N
        </text>
      </svg>

      {/* Aguja: apunta hacia +X local; rotamos el grupo con el ángulo al cursor */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 z-[1] h-[72%] w-[72%] transition-transform duration-75 ease-out motion-reduce:transition-none"
        style={{
          transform: `translate(-50%, -50%) rotate(${angleDeg}deg)`,
        }}
      >
        <svg className="h-full w-full" viewBox="-50 -50 100 100" aria-hidden>
          {/* Contrapeso (sur) */}
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
          {/* Aguja principal hacia el cursor */}
          <polygon points="0,-38 -7,10 7,10" fill="#D98A24" stroke="#111713" strokeOpacity={0.12} strokeWidth="0.5" />
          <circle cx="0" cy="0" r="4" fill="#F5F2EC" stroke="#8A6A4F" strokeOpacity={0.45} strokeWidth="1" />
        </svg>
      </div>
    </button>
  );
}
