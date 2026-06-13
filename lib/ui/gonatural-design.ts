/**
 * Go Natural — tokens de diseño editorial (deben coincidir con :root en app/globals.css).
 * Usar en animaciones (Framer), lógica de layout o pruebas; preferir utilidades Tailwind en UI.
 */
export const GN_EASE_PREMIUM = [0.22, 1, 0.36, 1] as const;

/**
 * Padding superior en heroes: clearance bajo header sticky REI (~9.5rem desktop).
 */
export const GN_HERO_TOP_PAD =
  "pt-[calc(env(safe-area-inset-top,0px)+4.5rem)] sm:pt-[calc(env(safe-area-inset-top,0px)+5rem)] md:pt-[calc(env(safe-area-inset-top,0px)+9.5rem)] lg:pt-[calc(env(safe-area-inset-top,0px)+9.75rem)]";

/** Páginas sin hero full-bleed: el header sticky ocupa flujo normal; padding mínimo mobile. */
export const GN_FLOAT_HEADER_CLEARANCE =
  "pt-[calc(env(safe-area-inset-top,0px)+3.5rem)] md:pt-0";

/** @deprecated Header REI usa sticky; mantener alias vacío por compatibilidad. */
export const GN_HEADER_SHELL_CLASS = "font-inter";

export const GN_SPACE_PX = {
  xs: 8,
  s: 16,
  m: 24,
  l: 40,
  xl: 64,
  xxl: 96,
  heroMin: 140,
  heroMax: 220,
} as const;

export const GN_COLORS = {
  forest: "#2E4A36",
  burgundy: "#6E1F28",
  burntOrange: "#C9622B",
  mustard: "#D9A441",
  cream: "#F4EBDD",
  navy: "#2A2E4B",
} as const;

/** Misma secuencia que enlaces Header: Inicio → Productos → Blog → Categorías (cicla en el título). */
export const GN_HEADER_TITLE_WORD_COLORS = [
  GN_COLORS.navy,
  GN_COLORS.burgundy,
  GN_COLORS.burntOrange,
  GN_COLORS.mustard,
] as const;
