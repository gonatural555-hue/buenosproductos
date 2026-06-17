const DEFAULT_SWATCH_HEX = "#9ca3af";

/** Tokens base (ES / EN) → hex visual para círculos de color. */
const TOKEN_SWATCH_HEX: Record<string, string> = {
  negro: "#1a1a1a",
  black: "#1a1a1a",
  blanco: "#f5f5f0",
  white: "#f5f5f0",
  rojo: "#9b2335",
  red: "#9b2335",
  azul: "#1e3a5f",
  blue: "#1e3a5f",
  navy: "#2a2e4b",
  verde: "#2e4a36",
  green: "#2e4a36",
  gris: "#6b7280",
  gray: "#6b7280",
  grey: "#6b7280",
  naranja: "#c45c26",
  orange: "#c45c26",
  amarillo: "#d4a017",
  yellow: "#d4a017",
  marron: "#5c4033",
  brown: "#5c4033",
  beige: "#d4c4a8",
  cream: "#f4ebdd",
  caqui: "#a8956b",
  khaki: "#8b7d5c",
  celeste: "#7eb8da",
  sapphire: "#1f4e79",
  gold: "#d9a441",
  burdeos: "#6e1f28",
  burgundy: "#6e1f28",
  lavanda: "#9b8aa8",
  lavender: "#9b8aa8",
  violeta: "#7c6b8a",
  purple: "#7c6b8a",
  camuflado: "#4a5d3f",
  camo: "#4a5d3f",
  arroz: "#ede6d6",
  special: "#4a5568",
  gum: "#3d342c",
  flat: "#1c1c1c",
  road: "#e8e8e4",
  mtb: "#ececec",
};

/** Claves compuestas exactas (value slug completo). */
const EXACT_SWATCH_HEX: Record<string, string> = {
  "arroz-blanco": "#ede6d6",
  "gris-oscuro": "#3d4349",
  "gris-claro": "#b5bac3",
  "verde-militar": "#3d4f3a",
  "verde-oscuro": "#2a3d2e",
  "azul-cielo": "#87b3d4",
  "black-green": "#1f2e24",
  "flat-black": "#1c1c1c",
  "flat-black-gum": "#1a1816",
  "flat-black-white": "#2a2a2a",
  "road-white": "#f5f5f0",
  "mtb-white": "#f0f0f0",
};

function normalizeSwatchKey(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

function isValidHex(color: string): boolean {
  return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})$/.test(color);
}

function resolveFromTokens(key: string): string | null {
  const tokens = key.split("-").filter(Boolean);
  if (tokens.length === 0) return null;

  const has = (token: string) => tokens.includes(token);

  if (has("gris") || has("grey") || has("gray")) {
    if (has("oscuro") || has("dark")) return "#3d4349";
    if (has("claro") || has("light")) return "#b5bac3";
  }

  if (has("verde") || has("green")) {
    if (has("oscuro") || has("dark") || has("militar")) return "#2a3d2e";
  }

  if (has("azul") || has("blue")) {
    if (has("cielo") || has("sky")) return "#87b3d4";
  }

  if (has("arroz") && has("blanco")) return "#ede6d6";

  if (has("flat") && has("black")) {
    if (has("gum")) return "#1a1816";
    if (has("white")) return "#2a2a2a";
    return "#1c1c1c";
  }

  if ((has("road") || has("mtb")) && has("white")) return "#f5f5f0";

  if (has("black") && has("green")) return "#1f2e24";

  for (let i = tokens.length - 1; i >= 0; i -= 1) {
    const hex = TOKEN_SWATCH_HEX[tokens[i]];
    if (hex) return hex;
  }

  return null;
}

/**
 * Resuelve el color de relleno de un swatch (PDP + product cards).
 * Prioridad: `swatchHex` explícito → clave exacta → tokens → fallback neutro.
 */
export function resolveSwatchHex(
  value: string,
  label: string,
  explicitHex?: string | null
): string {
  if (explicitHex && isValidHex(explicitHex)) {
    return explicitHex;
  }

  const candidates = [
    normalizeSwatchKey(value),
    normalizeSwatchKey(label),
  ].filter(Boolean);

  for (const key of candidates) {
    if (EXACT_SWATCH_HEX[key]) {
      return EXACT_SWATCH_HEX[key];
    }

    const fromTokens = resolveFromTokens(key);
    if (fromTokens) {
      return fromTokens;
    }

    if (TOKEN_SWATCH_HEX[key]) {
      return TOKEN_SWATCH_HEX[key];
    }
  }

  return DEFAULT_SWATCH_HEX;
}

export { DEFAULT_SWATCH_HEX };
