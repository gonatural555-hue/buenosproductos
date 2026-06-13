export type ElementOffset = {
  x: number;
  y: number;
};

export type GoNaturalHomeLayoutElementId = "header" | "hero";

export type GoNaturalHomeLayout = Record<
  GoNaturalHomeLayoutElementId,
  ElementOffset
>;

export const GN_HOME_LAYOUT_ELEMENT_LABELS: Record<
  GoNaturalHomeLayoutElementId,
  string
> = {
  header: "Header (completo)",
  hero: "Hero (bloque completo)",
};

export const GN_HOME_LAYOUT_STORAGE_KEY = "gn-home-layout-offsets";

const ZERO: ElementOffset = { x: 0, y: 0 };

export const DEFAULT_GO_NATURAL_HOME_LAYOUT: GoNaturalHomeLayout = {
  header: { x: 0, y: 0 },
  hero: { x: -320, y: 71 },
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

export function parseGoNaturalHomeLayout(raw: unknown): GoNaturalHomeLayout {
  const base = { ...DEFAULT_GO_NATURAL_HOME_LAYOUT };
  if (!raw || typeof raw !== "object") return base;

  const o = raw as Record<string, unknown>;
  const ids = Object.keys(
    DEFAULT_GO_NATURAL_HOME_LAYOUT
  ) as GoNaturalHomeLayoutElementId[];

  for (const id of ids) {
    if (o[id] != null) {
      base[id] = parseOffset(o[id]);
    }
  }

  return base;
}

export function loadGoNaturalHomeLayout(): GoNaturalHomeLayout {
  if (typeof window === "undefined") {
    return { ...DEFAULT_GO_NATURAL_HOME_LAYOUT };
  }
  try {
    const raw = localStorage.getItem(GN_HOME_LAYOUT_STORAGE_KEY);
    if (!raw) return { ...DEFAULT_GO_NATURAL_HOME_LAYOUT };
    return parseGoNaturalHomeLayout(JSON.parse(raw));
  } catch {
    return { ...DEFAULT_GO_NATURAL_HOME_LAYOUT };
  }
}

export function saveGoNaturalHomeLayout(layout: GoNaturalHomeLayout): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(GN_HOME_LAYOUT_STORAGE_KEY, JSON.stringify(layout));
  } catch {
    /* ignore */
  }
}

export function isGoNaturalHomeLayoutDirectorMode(
  searchParams: URLSearchParams | null
): boolean {
  return searchParams?.get("homeLayout") === "true";
}

export function elementOffsetTransform(
  offset: ElementOffset
): { transform: string } | undefined {
  if (offset.x === 0 && offset.y === 0) return undefined;
  return { transform: `translate(${offset.x}px, ${offset.y}px)` };
}
