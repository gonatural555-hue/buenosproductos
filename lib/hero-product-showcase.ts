import fs from "node:fs";
import path from "node:path";
import type { GoodIdeasHomeHeroShowcaseItem } from "@/lib/good-ideas-home-showcase";

export type HeroProductShowcaseSlot = "main" | "secondary" | "tertiary";

export type HeroProductShowcaseLayer = {
  src: string;
  alt: string;
  /** `true` si existe `public/assets/home/hero/hero-product-{slot}.png|webp`. */
  usesDedicatedAsset: boolean;
  /** Imagen de catálogo (JSON `featured`) usada como fallback. */
  catalogFallbackSrc: string;
};

export type HeroProductShowcaseLayers = {
  main?: HeroProductShowcaseLayer;
  secondary?: HeroProductShowcaseLayer;
  tertiary?: HeroProductShowcaseLayer;
};

const SLOT_FILE_BASE: Record<HeroProductShowcaseSlot, string> = {
  main: "hero-product-main",
  secondary: "hero-product-secondary",
  tertiary: "hero-product-tertiary",
};

/** Rutas dedicadas — reemplazar PNG/WebP transparentes en `public/assets/home/hero/`. */
export function dedicatedHeroProductPublicPath(
  slot: HeroProductShowcaseSlot
): string {
  return `/assets/home/hero/${SLOT_FILE_BASE[slot]}.png`;
}

function resolveDedicatedHeroProductSrc(
  slot: HeroProductShowcaseSlot
): string | null {
  const base = SLOT_FILE_BASE[slot];
  const dir = path.join(process.cwd(), "public", "assets", "home", "hero");

  for (const ext of ["png", "webp"] as const) {
    const abs = path.join(dir, `${base}.${ext}`);
    if (fs.existsSync(abs)) {
      return `/assets/home/hero/${base}.${ext}`;
    }
  }

  return null;
}

function toLayer(
  slot: HeroProductShowcaseSlot,
  item?: GoodIdeasHomeHeroShowcaseItem
): HeroProductShowcaseLayer | undefined {
  if (!item) return undefined;

  const dedicated = resolveDedicatedHeroProductSrc(slot);
  return {
    src: dedicated ?? item.image,
    alt: item.title,
    usesDedicatedAsset: Boolean(dedicated),
    catalogFallbackSrc: item.image,
  };
}

export function buildHeroProductShowcaseLayers(
  items: GoodIdeasHomeHeroShowcaseItem[]
): HeroProductShowcaseLayers {
  const [mainItem, secondaryItem, tertiaryItem] = items;
  return {
    main: toLayer("main", mainItem),
    secondary: toLayer("secondary", secondaryItem),
    tertiary: toLayer("tertiary", tertiaryItem),
  };
}
