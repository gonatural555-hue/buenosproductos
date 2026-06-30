"use client";

import { useEffect, useState } from "react";

/**
 * true cuando el usuario ha scrolleado más allá del hero (#pdp-hero).
 */
export function usePdpHeroVisibility(heroId = "pdp-hero") {
  const [pastHero, setPastHero] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const hero = document.getElementById(heroId);
    if (!hero) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        setPastHero(!entry?.isIntersecting);
      },
      { threshold: 0, rootMargin: "-1px 0px 0px 0px" }
    );

    io.observe(hero);
    return () => io.disconnect();
  }, [heroId]);

  return { pastHero: mounted && pastHero, mounted };
}
