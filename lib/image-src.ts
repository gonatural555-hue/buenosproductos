/** Fallback editorial cuando no hay imagen válida. */
export const DEFAULT_IMAGE_PLACEHOLDER = "/assets/images/blog/blog-hero.webp";

export const PRODUCT_BLUR_DATA_URL =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMiIgaGVpZ2h0PSIyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjIiIGZpbGw9IiMxMDEyMTQiIC8+PC9zdmc+";

export function isExternalImage(src?: string | null): boolean {
  return typeof src === "string" && /^https?:\/\//i.test(src);
}

/**
 * Normaliza URLs de imágenes desde JSON de productos.
 * Acepta:
 * - URLs externas (`https://…`)
 * - Rutas públicas (`/assets/…`)
 * - Rutas locales sin slash (`assets/…` → `/assets/…`)
 */
export function normalizeImageSrc(src?: string | null): string | null {
  if (!src || typeof src !== "string") return null;
  const trimmed = src.trim();
  if (!trimmed) return null;
  if (isExternalImage(trimmed)) return trimmed;
  if (trimmed.startsWith("/")) return trimmed;
  if (trimmed.startsWith("assets/")) return `/${trimmed}`;
  return null;
}

/** Rutas públicas (`/…`), `assets/…` o URLs absolutas (`http(s)://…`). */
export function isValidImageSrc(src?: string | null): src is string {
  return normalizeImageSrc(src) !== null;
}

export function normalizeImageSrcList(sources: unknown): string[] {
  if (!Array.isArray(sources)) return [];
  const normalized: string[] = [];
  for (const src of sources) {
    const url = normalizeImageSrc(typeof src === "string" ? src : null);
    if (url) normalized.push(url);
  }
  return normalized;
}

const VIDEO_SRC_PATTERN = /\.(?:mp4|webm|mov|m4v|ogg)(?:\?|#|$)/i;

/** Archivo de vídeo directo (`/…`, `assets/…` o URL absoluta con extensión de vídeo). */
export function isVideoSrc(src?: string | null): src is string {
  const normalized = normalizeImageSrc(src);
  if (!normalized) return false;
  return VIDEO_SRC_PATTERN.test(normalized);
}

/** Primera URL válida de una lista, o placeholder opcional. */
export function resolveImageSrc(
  sources: Array<string | null | undefined>,
  fallback = DEFAULT_IMAGE_PLACEHOLDER
): string {
  for (const src of sources) {
    const normalized = normalizeImageSrc(src);
    if (normalized) return normalized;
  }
  return fallback;
}
