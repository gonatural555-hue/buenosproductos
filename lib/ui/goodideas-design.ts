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
  gray400: "#9CA3AF",
  gray500: "#6B7280",
  grayBlue: "#94A3B8",
  blueLight: "#60A5FA",
  white: "#FFFFFF",
  black: "#111111",
} as const;

/** Copy de heroes oscuros (Home + Products) sobre grilla hex blanca. */
export const GI_HERO_EDITORIAL = {
  eyebrow:
    "text-center font-inter text-[11px] font-semibold uppercase tracking-[0.24em] text-[#94A3B8] md:mb-4",
  titleMuted: "text-[#CBD5E1]",
  titleAccent: "text-[#3B82F6]",
  titleAccentSoft: "text-[#60A5FA]",
  subtitle:
    "max-w-lg text-center font-inter text-[clamp(16px,3.8vw,18px)] leading-relaxed text-[#9CA3AF] md:mt-5",
  plpTitle: "text-balance text-[#FFFFFF]",
  plpTitleLine2: "text-balance text-[#94A3B8]",
  plpSubtitle:
    "max-w-lg font-inter text-[clamp(15px,3.2vw,17px)] leading-relaxed text-[#9CA3AF] md:mt-5",
} as const;

/** CTA azul marca en heroes oscuros (hex wireframe). */
export const GI_HERO_DARK_CTA_CLASS =
  "group inline-flex h-[56px] min-h-[56px] w-full max-w-md items-center justify-center rounded-full bg-[#3B82F6] px-9 text-center font-body text-sm font-semibold text-white shadow-[0_12px_40px_rgba(59,130,246,0.35)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-[#2563EB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#60A5FA]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F14] motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:h-[58px] md:min-h-[58px] md:px-10 md:text-base";

export const GI_HERO_TOP_PAD =
  "pt-[calc(env(safe-area-inset-top,0px)+5.5rem)] md:pt-[calc(env(safe-area-inset-top,0px)+6.5rem)]";

/** Altura efectiva del header fijo (64px móvil, 72px md — GoodIdeasHeader). */
export const GI_PDP_HEADER_HEIGHT = "4.5rem";

/** Aire entre el borde inferior del header y el contenido del PDP. */
export const GI_PDP_HEADER_GAP_PX = 8;

/** PDP DTC — clearance header + gap mínimo (≈50px menos que layout anterior). */
export const GI_PDP_DTC_TOP_PAD =
  "pt-[calc(env(safe-area-inset-top,0px)+4rem)] md:pt-[calc(env(safe-area-inset-top,0px)+4.5rem+8px)]";

/** Offset sticky buy box / galería en desktop PDP. */
export const GI_PDP_STICKY_TOP =
  "lg:top-[calc(env(safe-area-inset-top,0px)+4.5rem+8px)]";

/** Order success — mismo clearance que PDP DTC (header blanco visible). */
export const GI_ORDER_SUCCESS_TOP_PAD = GI_PDP_DTC_TOP_PAD;

/** PLP carousel — clearance del header fijo, sin aire extra de hero full-screen. */
export const GI_PLP_CAROUSEL_TOP_PAD =
  "pt-[calc(env(safe-area-inset-top,0px)+4.25rem)] md:pt-[calc(env(safe-area-inset-top,0px)+4.5rem)]";

/** Fondo editorial heroes: glow azul + grilla cuadrada 56px (sin hex interactivo). */
export const GI_HERO_GRID_OVERLAY = {
  radial:
    "bg-[radial-gradient(ellipse_80%_55%_at_50%_-10%,rgba(59,130,246,0.22),transparent_60%)]",
  grid:
    "opacity-30 [background-image:linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] [background-size:56px_56px]",
} as const;

export const GI_CATALOG_SECTION_ID = "gi-products-catalog";
export const GI_BLOG_POSTS_ANCHOR = "gi-blog-posts";
export const GI_SITE_FOOTER_ID = "gi-site-footer";
export const GI_PLP_ROW2_SENTINEL_SM = "gi-plp-row2-sentinel-sm";
export const GI_PLP_ROW2_SENTINEL_LG = "gi-plp-row2-sentinel-lg";
export const GI_BLOG_ARTICLE_CONTENT_ID = "gi-blog-article-content";

/** Tonos para CTAs de categoría en hero productos GI. */
export const GI_PRODUCTS_CATEGORY_TONES = {
  mist: { bg: "#E8ECF1", fg: "#0B0F14" },
  accent: { bg: "#3B82F6", fg: "#FFFFFF" },
  slate: { bg: "#1a2230", fg: "#E8ECF1", border: "rgba(255,255,255,0.12)" },
  soft: { bg: "rgba(59,130,246,0.22)", fg: "#E8ECF1", border: "rgba(59,130,246,0.35)" },
} as const;

export type GiProductsCategoryTone = keyof typeof GI_PRODUCTS_CATEGORY_TONES;

/** CTA principal de heroes editoriales (home, blog). */
export const GI_HERO_PRIMARY_CTA_CLASS =
  "group inline-flex h-[56px] min-h-[56px] w-full max-w-md items-center justify-center rounded-full bg-[#E8ECF1] px-9 text-center font-body text-sm font-semibold text-[#0B0F14] shadow-[0_12px_40px_rgba(0,0,0,0.35)] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:bg-white focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F14] motion-reduce:transition-none motion-reduce:hover:translate-y-0 md:h-[58px] md:min-h-[58px] md:px-10 md:text-base";

/** Título multilínea con acentos (misma lógica que blog). */
export function parseGoodIdeasEditorialTitle(title: string): {
  line1: string;
  row1Accent: string;
  row2Muted: string | null;
} {
  const raw = title.trim();
  if (!raw) return { line1: "", row1Accent: "", row2Muted: null };
  const lines = raw.split("\n").map((l) => l.trim()).filter(Boolean);
  const line1 = lines[0] ?? "";
  const secondLineText = lines.slice(1).join(" ").trim();
  const words = secondLineText.split(/\s+/).filter(Boolean);

  if (words.length === 0) {
    return { line1, row1Accent: "", row2Muted: null };
  }
  if (words.length === 1) {
    return { line1, row1Accent: "", row2Muted: words[0] ?? null };
  }
  return {
    line1,
    row1Accent: words[0] ?? "",
    row2Muted: words.slice(1).join(" "),
  };
}
