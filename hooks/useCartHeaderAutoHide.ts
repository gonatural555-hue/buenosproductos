"use client";

import { useEffect, useState } from "react";

/**
 * Oculta el header cuando el bloque de medios de pago entra en el viewport (carrito).
 */
export function useCartHeaderAutoHide(
  enabled: boolean,
  targetId = "cart-payment-methods"
) {
  const [shouldHide, setShouldHide] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setShouldHide(false);
      return;
    }

    const target = document.getElementById(targetId);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setShouldHide(Boolean(entry?.isIntersecting));
      },
      { threshold: 0, rootMargin: "0px 0px -8% 0px" }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [enabled, targetId]);

  return shouldHide;
}
