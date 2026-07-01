/**
 * Evita open redirects en `next` del callback de Supabase.
 * Solo permite rutas relativas internas (pathname + query + hash).
 */
export function resolveSafeInternalPath(
  next: string | null | undefined,
  fallback: string
): string {
  if (!next) return fallback;

  const trimmed = next.trim();
  if (!trimmed.startsWith("/") || trimmed.startsWith("//")) {
    return fallback;
  }

  try {
    const url = new URL(trimmed, "http://local.invalid");
    if (url.origin !== "http://local.invalid") return fallback;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return fallback;
  }
}
