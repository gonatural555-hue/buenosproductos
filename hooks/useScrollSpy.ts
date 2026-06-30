"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type ScrollSpySection = {
  id: string;
  label: string;
};

type Options = {
  sections: ScrollSpySection[];
  rootMargin?: string;
  debounceMs?: number;
};

/**
 * Detecta la sección activa en viewport (IntersectionObserver + debounce ligero).
 */
export function useScrollSpy({
  sections,
  rootMargin = "-15% 0px -55% 0px",
  debounceMs = 50,
}: Options) {
  const [activeId, setActiveId] = useState(sections[0]?.id ?? "");
  const ratiosRef = useRef<Record<string, number>>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const pickActive = useCallback(() => {
    const entries = Object.entries(ratiosRef.current).filter(([, r]) => r > 0);
    if (entries.length === 0) return;

    entries.sort((a, b) => b[1] - a[1]);
    const next = entries[0][0];
    setActiveId((prev) => (prev === next ? prev : next));
  }, []);

  const schedulePick = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(pickActive, debounceMs);
  }, [debounceMs, pickActive]);

  useEffect(() => {
    if (sections.length === 0) return;

    const elements = sections
      .map((s) => document.getElementById(s.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const id = entry.target.id;
          ratiosRef.current[id] = entry.isIntersecting
            ? entry.intersectionRatio
            : 0;
        }
        schedulePick();
      },
      { rootMargin, threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] }
    );

    elements.forEach((el) => io.observe(el));
    return () => {
      io.disconnect();
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [sections, rootMargin, schedulePick]);

  const scrollToSection = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
    setActiveId(id);
  }, []);

  return { activeId, scrollToSection };
}
