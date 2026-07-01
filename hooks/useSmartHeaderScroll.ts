"use client";

import { useEffect, useRef, useState } from "react";
import {
  isBlogListPath,
  isBlogPostPath,
  isCartPath,
  isHomePath,
  isProductPdpPath,
  isProductsListPath,
} from "@/lib/routing/paths";
import {
  GI_BLOG_ARTICLE_CONTENT_ID,
  GI_BLOG_POSTS_ANCHOR,
  GI_PLP_ROW2_SENTINEL_LG,
  GI_PLP_ROW2_SENTINEL_SM,
  GI_SITE_FOOTER_ID,
} from "@/lib/ui/goodideas-design";

const TOP_REVEAL_PX = 72;
const DELTA_PX = 8;
const LG_BREAKPOINT = "(min-width: 1024px)";

export type SmartHeaderScrollMode = "off" | "scroll" | "threshold";

export type SmartHeaderScrollConfig = {
  mode: SmartHeaderScrollMode;
  /** Selector CSS del umbral (solo `mode: "threshold"`). */
  thresholdSelector?: string;
};

export function resolveSmartHeaderScrollConfig(
  pathname: string
): SmartHeaderScrollConfig {
  if (isProductPdpPath(pathname) || isCartPath(pathname)) {
    return { mode: "scroll" };
  }
  if (isHomePath(pathname)) {
    return { mode: "threshold", thresholdSelector: `#${GI_SITE_FOOTER_ID}` };
  }
  if (isProductsListPath(pathname)) {
    return {
      mode: "threshold",
      thresholdSelector: `#${GI_PLP_ROW2_SENTINEL_SM}, #${GI_PLP_ROW2_SENTINEL_LG}`,
    };
  }
  if (isBlogListPath(pathname)) {
    return { mode: "threshold", thresholdSelector: `#${GI_BLOG_POSTS_ANCHOR}` };
  }
  if (isBlogPostPath(pathname)) {
    return {
      mode: "threshold",
      thresholdSelector: `#${GI_BLOG_ARTICLE_CONTENT_ID}`,
    };
  }
  return { mode: "off" };
}

function resolvePlpThresholdSelector(): string {
  if (typeof window === "undefined") {
    return `#${GI_PLP_ROW2_SENTINEL_SM}`;
  }
  return window.matchMedia(LG_BREAKPOINT).matches
    ? `#${GI_PLP_ROW2_SENTINEL_LG}`
    : `#${GI_PLP_ROW2_SENTINEL_SM}`;
}

function resolveThresholdElement(selector: string): Element | null {
  if (selector.includes(GI_PLP_ROW2_SENTINEL_SM)) {
    return document.querySelector(resolvePlpThresholdSelector());
  }
  return document.querySelector(selector);
}

/**
 * Oculta el header al bajar y lo muestra al subir.
 * En PDP/carrito: activo tras salir del tope.
 * En home/products/blog: activo cuando el umbral de página entra en viewport.
 */
export function useSmartHeaderScroll(config: SmartHeaderScrollConfig) {
  const [hidden, setHidden] = useState(false);
  const [pastThreshold, setPastThreshold] = useState(false);
  const lastY = useRef(0);
  const ticking = useRef(false);
  const pastThresholdRef = useRef(false);

  const { mode, thresholdSelector } = config;
  const enabled = mode !== "off";

  useEffect(() => {
    pastThresholdRef.current = pastThreshold;
  }, [pastThreshold]);

  useEffect(() => {
    if (mode !== "threshold" || !thresholdSelector) {
      setPastThreshold(false);
      return;
    }

    let observer: IntersectionObserver | null = null;
    let observedEl: Element | null = null;
    let mediaQuery: MediaQueryList | null = null;

    const attachObserver = () => {
      observer?.disconnect();
      observedEl = resolveThresholdElement(thresholdSelector);
      if (!observedEl) {
        setPastThreshold(false);
        return;
      }

      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) {
            setPastThreshold(true);
          }
        },
        { root: null, threshold: 0 }
      );
      observer.observe(observedEl);
    };

    attachObserver();

    if (thresholdSelector.includes(GI_PLP_ROW2_SENTINEL_SM)) {
      mediaQuery = window.matchMedia(LG_BREAKPOINT);
      const onBreakpointChange = () => attachObserver();
      mediaQuery.addEventListener("change", onBreakpointChange);
      return () => {
        mediaQuery?.removeEventListener("change", onBreakpointChange);
        observer?.disconnect();
      };
    }

    return () => observer?.disconnect();
  }, [mode, thresholdSelector]);

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
      } else {
        const armed =
          mode === "scroll" ||
          (mode === "threshold" && pastThresholdRef.current);

        if (armed) {
          if (y - lastY.current > DELTA_PX) {
            setHidden(true);
          } else if (lastY.current - y > DELTA_PX) {
            setHidden(false);
          }
        } else {
          setHidden(false);
        }
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
  }, [enabled, mode]);

  return {
    hidden,
    transitionClass:
      "transition-transform duration-[220ms] ease-out motion-reduce:transition-none",
  };
}
