import { isBrandGatewayPath, isGoNaturalHomePath } from "@/lib/routing/brands";

/** Rutas donde el CTA newsletter no debe mostrarse (redundante o destructivo). */
const EXCLUDED_PATH_SNIPPETS = ["/checkout", "/cart", "/account", "/auth"] as const;

/**
 * Muestra el CTA solo en rutas con prefijo de locale (/en/..., /es, etc.)
 * y fuera de checkout, carrito, cuenta y auth.
 */
export function shouldShowNewsletterCta(pathname: string | null): boolean {
  if (!pathname) return false;
  if (isBrandGatewayPath(pathname)) return false;
  if (!/^\/[a-z]{2}(\/|$)/i.test(pathname)) return false;
  const lower = pathname.toLowerCase();
  return !EXCLUDED_PATH_SNIPPETS.some((snippet) => lower.includes(snippet));
}

/** CTA flotante global; excluye home GN (modal dedicado). */
export function shouldShowRegistrationCta(pathname: string | null): boolean {
  if (!pathname || !shouldShowNewsletterCta(pathname)) return false;
  if (isGoNaturalHomePath(pathname)) return false;
  return true;
}
