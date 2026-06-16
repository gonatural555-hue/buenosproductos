/** Fallback editorial cuando no hay imagen válida. */
export const DEFAULT_IMAGE_PLACEHOLDER = "/assets/images/blog/blog-hero.webp";

export function isExternalImage(src?: string | null): boolean {
  return typeof src === "string" && /^https?:\/\//i.test(src);
}

/** Rutas públicas (`/…`) o URLs absolutas (`http(s)://…`). */
export function isValidImageSrc(src?: string | null): src is string {
  if (!src || typeof src !== "string") return false;
  if (isExternalImage(src)) return true;
  if (src.startsWith("/")) return true;
  return false;
}

/** Primera URL válida de una lista, o placeholder opcional. */
export function resolveImageSrc(
  sources: Array<string | null | undefined>,
  fallback = DEFAULT_IMAGE_PLACEHOLDER
): string {
  for (const src of sources) {
    if (isValidImageSrc(src)) return src;
  }
  return fallback;
}
