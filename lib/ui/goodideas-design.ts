/** Good Ideas — tokens base (escalable para futuro catálogo). */
export const GI_EASE = [0.22, 1, 0.36, 1] as const;

export const GI_COLORS = {
  ink: "#0B0F14",
  slate: "#151B24",
  mist: "#E8ECF1",
  accent: "#3B82F6",
  accentSoft: "rgba(59, 130, 246, 0.14)",
  border: "rgba(255, 255, 255, 0.08)",
  textMuted: "rgba(232, 236, 241, 0.72)",
  textDim: "rgba(232, 236, 241, 0.5)",
} as const;

export const GI_HERO_TOP_PAD =
  "pt-[calc(env(safe-area-inset-top,0px)+5.5rem)] md:pt-[calc(env(safe-area-inset-top,0px)+6.5rem)]";

export const GI_CATALOG_SECTION_ID = "gi-products-catalog";
export const GI_BLOG_POSTS_ANCHOR = "gi-blog-posts";

/** Tonos para CTAs de categoría en hero productos GI. */
export const GI_PRODUCTS_CATEGORY_TONES = {
  mist: { bg: "#E8ECF1", fg: "#0B0F14" },
  accent: { bg: "#3B82F6", fg: "#FFFFFF" },
  slate: { bg: "#1a2230", fg: "#E8ECF1", border: "rgba(255,255,255,0.12)" },
  soft: { bg: "rgba(59,130,246,0.22)", fg: "#E8ECF1", border: "rgba(59,130,246,0.35)" },
} as const;

export type GiProductsCategoryTone = keyof typeof GI_PRODUCTS_CATEGORY_TONES;
