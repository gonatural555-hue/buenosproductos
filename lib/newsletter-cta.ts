import { locales, type Locale } from "@/lib/i18n/config";

/** Rutas donde el CTA newsletter no debe mostrarse (redundante o destructivo). */
const EXCLUDED_PATH_SNIPPETS = ["/checkout", "/cart", "/account", "/auth"] as const;

/**
 * Muestra el CTA solo en rutas con prefijo de locale (/en/..., /es, etc.)
 * y fuera de checkout, carrito, cuenta y auth.
 */
export function shouldShowNewsletterCta(pathname: string | null): boolean {
  if (!pathname) return false;
  if (!/^\/[a-z]{2}(\/|$)/i.test(pathname)) return false;
  const lower = pathname.toLowerCase();
  return !EXCLUDED_PATH_SNIPPETS.some((snippet) => lower.includes(snippet));
}

/** CTA flotante global en rutas GI. */
export function shouldShowRegistrationCta(pathname: string | null): boolean {
  if (!pathname || !shouldShowNewsletterCta(pathname)) return false;
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 1 && locales.includes(segments[0] as Locale)) {
    return true;
  }
  return segments.length >= 2;
}
