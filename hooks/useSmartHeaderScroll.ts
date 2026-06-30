"use client";

import { useEffect, useRef, useState } from "react";
const TOP_REVEAL_PX = 72;
const DELTA_PX = 8;

/**
 * Oculta el header al bajar y lo muestra al subir (PDP y páginas largas).
 * Listener ligero con passive + umbral mínimo.
 */
export function useSmartHeaderScroll(enabled: boolean) {
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    if (!enabled) {
      setHidden(false);
      return;
    }

    lastY.current = window.scrollY;

    const update = () => {
      const y = window.scrollY;
      if (y <= TOP_REVEAL_PX) {
        setHidden(false);
      } else if (y - lastY.current > DELTA_PX) {
        setHidden(true);
      } else if (lastY.current - y > DELTA_PX) {
        setHidden(false);
      }
      lastY.current = y;
      ticking.current = false;
    };

    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(update);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [enabled]);

  return {
    hidden,
    transitionClass:
      "transition-transform duration-[220ms] ease-out motion-reduce:transition-none",
  };
}
