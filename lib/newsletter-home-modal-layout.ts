export type ElementOffset = {
  x: number;
  y: number;
};

export type HomeNewsletterLayoutElementId =
  | "block"
  | "logo"
  | "eyebrow"
  | "headline"
  | "subtitle"
  | "form"
  | "login"
  | "legal"
  | "minimize";

export type HomeNewsletterBlockLayout = Record<
  HomeNewsletterLayoutElementId,
  ElementOffset
>;

export const HOME_NEWSLETTER_LAYOUT_ELEMENT_LABELS: Record<
  HomeNewsletterLayoutElementId,
  string
> = {
  block: "Contenedor (panel)",
  logo: "Logo",
  eyebrow: "Eyebrow",
  headline: "Titular",
  subtitle: "Descripción",
  form: "Formulario (email + CTA)",
  login: "¿Ya tenés cuenta?",
  legal: "Texto legal",
  minimize: "Minimizar",
};

export const GN_HOME_NEWSLETTER_LAYOUT_STORAGE_KEY =
  "gn-home-newsletter-block-layout";

const ZERO: ElementOffset = { x: 0, y: 0 };

export const DEFAULT_HOME_NEWSLETTER_BLOCK_LAYOUT: HomeNewsletterBlockLayout =
  {
    block: { x: 0, y: 0 },
    logo: { x: 52, y: -64 },
    eyebrow: { x: 0, y: -121 },
    headline: { x: 0, y: -105 },
    subtitle: { x: 0, y: -90 },
    form: { x: 0, y: -72 },
    login: { x: 0, y: -35 },
    legal: { x: 0, y: -20 },
    minimize: { x: 0, y: 0 },
  };

function parseOffset(raw: unknown): ElementOffset {
  if (!raw || typeof raw !== "object") return { ...ZERO };
  const o = raw as Record<string, unknown>;
  const x =
    typeof o.x === "number" && Number.isFinite(o.x) ? Math.round(o.x) : 0;
  const y =
    typeof o.y === "number" && Number.isFinite(o.y) ? Math.round(o.y) : 0;
  return { x, y };
}

export function parseHomeNewsletterBlockLayout(
  raw: unknown
): HomeNewsletterBlockLayout {
  const base = { ...DEFAULT_HOME_NEWSLETTER_BLOCK_LAYOUT };
  if (!raw || typeof raw !== "object") return base;

  const o = raw as Record<string, unknown>;

  // Migración desde formato anterior { offsetX, offsetY }
  if ("offsetX" in o || "offsetY" in o) {
    base.block = {
      x:
        typeof o.offsetX === "number" && Number.isFinite(o.offsetX)
          ? Math.round(o.offsetX)
          : 0,
      y:
        typeof o.offsetY === "number" && Number.isFinite(o.offsetY)
          ? Math.round(o.offsetY)
          : 0,
    };
  }

  const ids = Object.keys(
    DEFAULT_HOME_NEWSLETTER_BLOCK_LAYOUT
  ) as HomeNewsletterLayoutElementId[];

  for (const id of ids) {
    if (o[id] != null) {
      base[id] = parseOffset(o[id]);
    }
  }

  return base;
}

export function loadHomeNewsletterBlockLayout(): HomeNewsletterBlockLayout {
  if (typeof window === "undefined") {
    return { ...DEFAULT_HOME_NEWSLETTER_BLOCK_LAYOUT };
  }
  try {
    const raw = localStorage.getItem(GN_HOME_NEWSLETTER_LAYOUT_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_HOME_NEWSLETTER_BLOCK_LAYOUT };
    return parseHomeNewsletterBlockLayout(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_HOME_NEWSLETTER_BLOCK_LAYOUT };
  }
}

export function saveHomeNewsletterBlockLayout(
  layout: HomeNewsletterBlockLayout
): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      GN_HOME_NEWSLETTER_LAYOUT_STORAGE_KEY,
      JSON.stringify(layout)
    );
  } catch {
    /* ignore */
  }
}

export function isHomeNewsletterDirectorMode(
  searchParams: URLSearchParams | null
): boolean {
  return searchParams?.get("director") === "true";
}

export function elementOffsetTransform(
  offset: ElementOffset
): { transform: string } | undefined {
  if (offset.x === 0 && offset.y === 0) return undefined;
  return { transform: `translate(${offset.x}px, ${offset.y}px)` };
}

/** Offsets del director solo en viewport md+ (desktop). */
export function elementOffsetTransformDesktop(
  offset: ElementOffset,
  isDesktop: boolean
): { transform: string } | undefined {
  if (!isDesktop) return undefined;
  return elementOffsetTransform(offset);
}

/** Panel principal del modal (mismo diseño que RegistrationCTA). */
export const GN_HOME_NEWSLETTER_PANEL_CLASS =
  "w-full max-w-[420px] rounded-2xl border border-white/[0.08] bg-[#121921] px-6 py-8 shadow-[0_18px_48px_-20px_rgba(0,0,0,0.6),0_6px_20px_rgba(0,0,0,0.28)] md:max-w-[480px] md:px-8 md:py-7";
