export type PdpImageFramingPatch = {
  scale?: number;
  positionX?: number;
  positionY?: number;
};

export type PdpImageFraming = {
  scale: number;
  positionX: number;
  positionY: number;
};

export type PdpGalleryLayout = {
  defaults?: PdpImageFramingPatch;
  byIndex?: Record<string, PdpImageFramingPatch>;
};

export const PDP_GALLERY_FRAMING_DIRECTOR_IDS = new Set(["gn-cycling-017"]);

export const PDP_GALLERY_FRAMING_STORAGE_PREFIX = "pdp-gallery-framing";

export const DEFAULT_PDP_IMAGE_FRAMING: PdpImageFraming = {
  scale: 1,
  positionX: 50,
  positionY: 50,
};

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function parsePatch(raw: unknown): PdpImageFramingPatch {
  if (!raw || typeof raw !== "object") return {};
  const o = raw as Record<string, unknown>;
  const patch: PdpImageFramingPatch = {};
  if (typeof o.scale === "number" && Number.isFinite(o.scale)) {
    patch.scale = clamp(o.scale, 0.25, 2.5);
  }
  if (typeof o.positionX === "number" && Number.isFinite(o.positionX)) {
    patch.positionX = clamp(Math.round(o.positionX), 0, 100);
  }
  if (typeof o.positionY === "number" && Number.isFinite(o.positionY)) {
    patch.positionY = clamp(Math.round(o.positionY), 0, 100);
  }
  return patch;
}

export function parsePdpGalleryLayout(raw: unknown): PdpGalleryLayout | null {
  if (!raw || typeof raw !== "object") return null;
  const o = raw as Record<string, unknown>;
  const layout: PdpGalleryLayout = {};
  if (o.defaults != null) layout.defaults = parsePatch(o.defaults);
  if (o.byIndex && typeof o.byIndex === "object") {
    layout.byIndex = {};
    for (const [key, value] of Object.entries(o.byIndex as Record<string, unknown>)) {
      layout.byIndex[key] = parsePatch(value);
    }
  }
  return layout;
}

export function resolvePdpImageFraming(
  layout: PdpGalleryLayout | null | undefined,
  index: number
): PdpImageFraming {
  const base = { ...DEFAULT_PDP_IMAGE_FRAMING };
  if (!layout) return base;

  const apply = (patch?: PdpImageFramingPatch): PdpImageFraming => ({
    scale: patch?.scale ?? base.scale,
    positionX: patch?.positionX ?? base.positionX,
    positionY: patch?.positionY ?? base.positionY,
  });

  let result = apply(layout.defaults);
  const perIndex = layout.byIndex?.[String(index)];
  if (perIndex) {
    result = {
      scale: perIndex.scale ?? result.scale,
      positionX: perIndex.positionX ?? result.positionX,
      positionY: perIndex.positionY ?? result.positionY,
    };
  }
  return result;
}

export function framingToImageStyle(framing: PdpImageFraming): {
  objectPosition: string;
  transform: string;
} {
  return {
    objectPosition: `${framing.positionX}% ${framing.positionY}%`,
    transform: framing.scale === 1 ? "none" : `scale(${framing.scale})`,
  };
}

export function isPdpGalleryFramingDirectorMode(
  searchParams: URLSearchParams | null,
  productId: string
): boolean {
  return (
    searchParams?.get("pdpLayout") === "true" &&
    PDP_GALLERY_FRAMING_DIRECTOR_IDS.has(productId)
  );
}

function storageKey(productId: string): string {
  return `${PDP_GALLERY_FRAMING_STORAGE_PREFIX}:${productId}`;
}

export function loadPdpGalleryFramingDraft(
  productId: string
): PdpGalleryLayout | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(storageKey(productId));
    if (!raw) return null;
    return parsePdpGalleryLayout(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function savePdpGalleryFramingDraft(
  productId: string,
  layout: PdpGalleryLayout
): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(storageKey(productId), JSON.stringify(layout, null, 2));
  } catch {
    /* ignore */
  }
}

export function clearPdpGalleryFramingDraft(productId: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(storageKey(productId));
  } catch {
    /* ignore */
  }
}

export function normalizePdpGalleryLayout(
  layout: PdpGalleryLayout | null | undefined
): PdpGalleryLayout {
  const parsed = parsePdpGalleryLayout(layout);
  return {
    defaults: parsed?.defaults ?? {},
    byIndex: parsed?.byIndex ?? {},
  };
}

export function createEmptyPdpGalleryLayout(): PdpGalleryLayout {
  return { defaults: {}, byIndex: {} };
}
