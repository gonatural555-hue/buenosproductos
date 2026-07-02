import fs from "node:fs";
import path from "node:path";
import type { GoodIdeasHomeHeroShowcaseItem } from "@/lib/good-ideas-home-showcase";

export type HeroProductShowcaseSlot = "main" | "secondary" | "tertiary";

export type HeroProductShowcaseLayer = {
  src: string;
  alt: string;
  /** `true` si existe un asset dedicado en `public/assets/home/hero/`. */
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

const DEDICATED_EXTENSIONS = ["png", "webp", "svg"] as const;

const HERO_ASSETS_DIR = path.join(
  process.cwd(),
  "public",
  "assets",
  "home",
  "hero"
);

function resolveDedicatedAssetSrc(base: string): string | null {
  for (const ext of DEDICATED_EXTENSIONS) {
    const abs = path.join(HERO_ASSETS_DIR, `${base}.${ext}`);
    if (fs.existsSync(abs)) {
      return `/assets/home/hero/${base}.${ext}`;
    }
  }

  return null;
}

/** Ruta pública por defecto del asset dedicado del slot. */
export function dedicatedHeroProductPublicPath(
  slot: HeroProductShowcaseSlot
): string {
  return `/assets/home/hero/${SLOT_FILE_BASE[slot]}.png`;
}

function resolveDedicatedHeroProductSrc(
  slot: HeroProductShowcaseSlot
): string | null {
  return resolveDedicatedAssetSrc(SLOT_FILE_BASE[slot]);
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
