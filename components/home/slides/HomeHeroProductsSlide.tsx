"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Locale } from "@/lib/i18n/config";

const FALLBACK_IMG = "/assets/images/hero/hero.webp";

export type HeroProductPayload = {
  id: string;
  title: string;
  image?: string | null;
  price: number;
  href: string;
};

type Props = {
  eyebrow: string;
  headline: string;
  subline: string;
  ctaLabel: string;
  stripLabel: string;
  main: HeroProductPayload;
  strip: HeroProductPayload[];
};

function formatUsd(n: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(n);
}

function StripCard({ p }: { p: HeroProductPayload }) {
  const [src, setSrc] = useState(p.image || FALLBACK_IMG);

  return (
    <Link
      href={p.href}
      className="group relative flex min-w-[7.5rem] shrink-0 flex-col overflow-hidden rounded-lg border border-white/10 bg-white/[0.04] ring-1 ring-white/[0.04] transition-[border-color,transform] duration-300 hover:scale-[1.03] hover:border-accent-gold/30 motion-reduce:hover:scale-100 sm:min-w-[8.25rem]"
    >
      <div className="relative aspect-square w-full bg-dark-base/80">
        <Image
          src={src}
          alt=""
          fill
          sizes="120px"
          className="object-cover object-center transition-transform duration-500 group-hover:scale-105 motion-reduce:transition-none"
          onError={() => setSrc(FALLBACK_IMG)}
        />
      </div>
      <div className="p-2">
        <p className="font-sans text-[0.65rem] font-medium leading-tight text-white/90 line-clamp-2">
          {p.title}
        </p>
        <p className="mt-1 font-sans text-[0.65rem] tabular-nums text-accent-gold/95">
          {formatUsd(p.price)}
        </p>
      </div>
    </Link>
  );
}

export default function HomeHeroProductsSlide({
  eyebrow,
  headline,
  subline,
  ctaLabel,
  stripLabel,
  main,
  strip,
}: Props) {
  const [mainSrc, setMainSrc] = useState(main.image || FALLBACK_IMG);

  return (
    <div className="absolute inset-0 flex flex-col bg-gradient-to-br from-[#0f1512] via-dark-base to-[#121a16] md:flex-row">
      <div className="relative min-h-[42%] flex-1 md:min-h-0 md:w-[52%]">
        <Image
          src={mainSrc}
          alt=""
          fill
          sizes="(max-width:768px) 100vw, 50vw"
          className="object-cover object-center"
          priority={false}
          onError={() => setMainSrc(FALLBACK_IMG)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-base via-transparent to-dark-base/25 md:bg-gradient-to-r md:from-transparent md:via-transparent md:to-dark-base/85" />
      </div>

      <div className="relative z-[1] flex flex-1 flex-col justify-center px-5 pb-8 pt-6 md:w-[48%] md:px-8 md:pb-10 md:pt-10">
        <p className="font-sans text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-accent-gold/90">
          {eyebrow}
        </p>
        <h2 className="font-display mt-3 text-2xl font-semibold leading-[1.08] tracking-tight text-white sm:text-[clamp(1.5rem,3.5vw,2.25rem)]">
          {headline}
        </h2>
        <p className="mt-3 max-w-md font-sans text-sm leading-relaxed text-white/78">
          {subline}
        </p>

        <div className="mt-5 flex items-baseline gap-3">
          <span className="font-display text-xl font-semibold tabular-nums text-white sm:text-2xl">
            {formatUsd(main.price)}
          </span>
          <span className="font-sans text-xs text-white/45 line-clamp-1">{main.title}</span>
        </div>

        <Link
          href={main.href}
          className="font-sans mt-6 inline-flex w-fit items-center justify-center rounded-sm border border-mountain-green/40 bg-dark-base px-7 py-3 text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-white shadow-[0_12px_32px_-12px_rgba(17,23,19,0.5)] transition hover:border-accent-gold/45 hover:bg-mountain-green"
        >
          {ctaLabel}
        </Link>

        {strip.length > 0 ? (
          <div className="mt-8">
            <p className="font-sans mb-3 text-[0.6rem] font-semibold uppercase tracking-[0.22em] text-white/40">
              {stripLabel}
            </p>
            <div className="-mx-1 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] sm:gap-3 [&::-webkit-scrollbar]:hidden">
              {strip.map((p) => (
                <StripCard key={p.id} p={p} />
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
