"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import PremiumImageOverlay from "@/components/ui/PremiumImageOverlay";

type ProductsHeroProps = {
  title: string;
  subtitle: string;
  tagline: string;
  imageSrc: string;
  imageAlt: string;
  searchHint?: string | null;
};

/**
 * Hero editorial de altura media (no 100vh): alineado con Home/Blog (overlay, tipografía centrada).
 */
export default function ProductsHero({
  title,
  subtitle,
  tagline,
  imageSrc,
  imageAlt,
  searchHint,
}: ProductsHeroProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section className="relative overflow-hidden border-b border-white/[0.06] bg-dark-base">
      <div className="absolute inset-0 min-h-[min(52vh,620px)]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        <PremiumImageOverlay />
      </div>

      <div
        className={`relative z-10 mx-auto flex min-h-[min(48vh,560px)] max-w-4xl flex-col items-center justify-end px-6 pb-16 pt-28 text-center sm:px-10 md:pb-20 md:pt-32 ${
          mounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"
        }         motion-reduce:opacity-100 motion-reduce:translate-y-0 transition-all duration-[900ms] ease-out`}
      >
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.38em] text-accent-gold drop-shadow-[0_1px_12px_rgba(0,0,0,0.55)] sm:text-xs">
          {tagline}
        </p>
        <h1 className="hero-display mt-5 font-bold tracking-tight text-text-primary text-[clamp(1.85rem,4.5vw,2.85rem)] leading-tight [text-shadow:0_2px_24px_rgba(0,0,0,0.5),0_1px_3px_rgba(0,0,0,0.4)]">
          {title}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-white/[0.92] drop-shadow-[0_1px_14px_rgba(0,0,0,0.45)] md:text-base">
          {subtitle}
        </p>
        {searchHint ? (
          <p className="mt-5 text-xs font-medium text-white/90 md:text-sm [text-shadow:0_1px_12px_rgba(0,0,0,0.45)]">
            {searchHint}
          </p>
        ) : null}
      </div>
    </section>
  );
}
