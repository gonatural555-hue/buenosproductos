import type { CSSProperties } from "react";

export type GnHeroCtaColors = {
  bg: string;
  fg: string;
};

/** Clase base — raised block + hover outline (ver `app/globals.css`). */
export const GN_HERO_CTA_CLASS = "gn-hero-cta";

/** CTAs secundarios en grid (p. ej. categorías en Products). */
export const GN_HERO_CTA_CLASS_COMPACT = "gn-hero-cta gn-hero-cta--compact";

/** CTA ancho en móvil (discover, blog). */
export const GN_HERO_CTA_CLASS_WIDE = "gn-hero-cta gn-hero-cta--wide";

export const GN_HERO_CTA_HOME: GnHeroCtaColors = {
  bg: "#000000",
  fg: "#FFFFFF",
};

/** Product card “Agregar ahora” — blanco + mustard, invertido en hover. */
export const GN_MUSTARD = "#D9A441";

export const GN_HERO_CTA_MUSTARD_INVERSE: GnHeroCtaColors = {
  bg: "#FFFFFF",
  fg: GN_MUSTARD,
};

/** Discover / explore — verde bosque sólido (sin gradiente). */
export const GN_HERO_CTA_FOREST: GnHeroCtaColors = {
  bg: "#2E4A36",
  fg: "#F4EBDD",
};

const GN_HERO_CTA_HOVER_BG = "#F4EBDD";

function parseHex(hex: string): [number, number, number] | null {
  const raw = hex.trim().replace(/^#/, "");
  if (raw.length === 3) {
    const r = parseInt(raw[0]! + raw[0], 16);
    const g = parseInt(raw[1]! + raw[1], 16);
    const b = parseInt(raw[2]! + raw[2], 16);
    return [r, g, b];
  }
  if (raw.length === 6) {
    const r = parseInt(raw.slice(0, 2), 16);
    const g = parseInt(raw.slice(2, 4), 16);
    const b = parseInt(raw.slice(4, 6), 16);
    if ([r, g, b].some((n) => Number.isNaN(n))) return null;
    return [r, g, b];
  }
  return null;
}

function toHex(r: number, g: number, b: number): string {
  const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
  return `#${[clamp(r), clamp(g), clamp(b)]
    .map((n) => n.toString(16).padStart(2, "0"))
    .join("")}`;
}

/** Oscurece un hex para la sombra dura del estado raised. */
export function darkenHex(hex: string, amount = 0.22): string {
  const rgb = parseHex(hex);
  if (!rgb) return hex;
  const [r, g, b] = rgb;
  const factor = 1 - amount;
  return toHex(r * factor, g * factor, b * factor);
}

export function gnHeroCtaStyle(
  colors: GnHeroCtaColors,
  options?: { hoverBg?: string }
): CSSProperties {
  return {
    "--gn-cta-bg": colors.bg,
    "--gn-cta-fg": colors.fg,
    "--gn-cta-border": colors.bg,
    "--gn-cta-shadow": darkenHex(colors.bg),
    "--gn-cta-hover-bg": options?.hoverBg ?? GN_HERO_CTA_HOVER_BG,
  } as CSSProperties;
}

export const gnHeroCtaMustardInverseStyle = gnHeroCtaStyle(
  GN_HERO_CTA_MUSTARD_INVERSE,
  { hoverBg: GN_MUSTARD }
);
