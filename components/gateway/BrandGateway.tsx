"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { locales, type Locale } from "@/lib/i18n/config";
import {
  goNaturalHomePath,
  goodIdeasHomePath,
} from "@/lib/routing/brands";
import BrandPanel from "@/components/gateway/BrandPanel";

export type BrandGatewayCopy = {
  goNatural: { title: string; tagline: string; cta: string };
  goodIdeas: { title: string; tagline: string; cta: string };
  localeAria: string;
};

export default function BrandGateway({
  locale,
  copy,
}: {
  locale: Locale;
  copy: BrandGatewayCopy;
}) {
  const [hovered, setHovered] = useState<"go-natural" | "good-ideas" | null>(null);

  return (
    <div className="relative flex min-h-[100dvh] flex-col bg-[#0B0F14] md:flex-row">
      <motion.div
        className="pointer-events-none absolute inset-x-0 top-0 z-20 flex justify-end px-5 pt-[max(1rem,env(safe-area-inset-top))] sm:px-8"
        initial={false}
      >
        <nav
          className="pointer-events-auto flex items-center gap-1 rounded-full border border-white/10 bg-black/20 px-2 py-1 backdrop-blur-md"
          aria-label={copy.localeAria}
        >
          {locales.map((lang) => (
            <Link
              key={lang}
              href={`/${lang}`}
              className={`rounded-full px-2.5 py-1 font-inter text-[11px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300 ${
                lang === locale
                  ? "bg-white/15 text-white"
                  : "text-white/55 hover:text-white/90"
              }`}
            >
              {lang}
            </Link>
          ))}
        </nav>
      </motion.div>

      <BrandPanel
        brand="go-natural"
        title={copy.goNatural.title}
        tagline={copy.goNatural.tagline}
        cta={copy.goNatural.cta}
        href={goNaturalHomePath(locale)}
        isActive={hovered === "go-natural" || hovered === null}
        isDimmed={hovered === "good-ideas"}
        onEnter={() => setHovered("go-natural")}
        onLeave={() => setHovered(null)}
        layout="column"
      />

      <div
        className="hidden w-px shrink-0 bg-[rgba(46,74,54,0.12)] md:block"
        aria-hidden
      />

      <BrandPanel
        brand="good-ideas"
        title={copy.goodIdeas.title}
        tagline={copy.goodIdeas.tagline}
        cta={copy.goodIdeas.cta}
        href={goodIdeasHomePath(locale)}
        isActive={hovered === "good-ideas" || hovered === null}
        isDimmed={hovered === "go-natural"}
        onEnter={() => setHovered("good-ideas")}
        onLeave={() => setHovered(null)}
        layout="column"
      />
    </div>
  );
}
