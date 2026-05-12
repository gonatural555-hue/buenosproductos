"use client";

import { useCallback } from "react";

type Props = {
  heading: string;
  scrollTargetId: string;
  scrollLabel: string;
};

export default function HomeImmersiveHero({
  heading,
  scrollTargetId,
  scrollLabel,
}: Props) {
  const scrollToNext = useCallback(() => {
    const el = document.getElementById(scrollTargetId);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [scrollTargetId]);

  return (
    <section
      className="relative min-h-[100svh] flex flex-col items-center justify-center overflow-hidden"
      aria-label={heading}
    >
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="/assets/images/hero/hero.webp"
          alt=""
          className="home-hero-ken-burns h-full w-full object-cover object-center"
        />
      </div>

      {/* Sunset-inspired overlay: orange → red → purple + depth */}
      <div
        className="absolute inset-0 pointer-events-none"
        aria-hidden
        style={{
          background:
            "linear-gradient(165deg, rgba(234,88,12,0.42) 0%, rgba(185,28,28,0.38) 38%, rgba(88,28,135,0.45) 72%, rgba(15,23,42,0.88) 100%)",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-[#1F2D26]/95 pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center justify-center px-6 sm:px-8 text-center max-w-4xl mx-auto py-24 md:py-32">
        <h1 className="home-hero-fade hero-display text-[clamp(2.35rem,7.25vw,4.35rem)] font-semibold leading-[1.06] tracking-[0.04em] text-[#FFFEF9] [text-shadow:0_2px_40px_rgba(0,0,0,0.45),0_1px_3px_rgba(0,0,0,0.35)]">
          {heading}
        </h1>

        <div className="home-hero-fade home-hero-fade-delay-2 mt-16 md:mt-20 flex flex-col items-center gap-2">
          <button
            type="button"
            onClick={scrollToNext}
            className="group flex flex-col items-center gap-2 rounded-full px-4 py-2 text-[#FAF6F0]/90 transition hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-300/80 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
            aria-label={scrollLabel}
          >
            <span className="text-[0.65rem] uppercase tracking-[0.35em] text-[#FAF6F0]/70">
              {scrollLabel}
            </span>
            <span className="home-scroll-bounce inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-white/10 backdrop-blur-sm transition group-hover:border-orange-200/50 group-hover:bg-white/15">
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 14l-7 7m0 0l-7-7m7 7V3"
                />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
