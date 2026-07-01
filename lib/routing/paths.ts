import { locales, type Locale } from "@/lib/i18n/config";

/** Legacy segment — redirects only. */
export const LEGACY_GOOD_IDEAS_SEGMENT = "good-ideas";
export const LEGACY_GO_NATURAL_SEGMENT = "go-natural";

export function homePath(locale: Locale): string {
  return `/${locale}`;
}

export function productsPath(locale: Locale): string {
  return `/${locale}/products`;
}

export function productPath(locale: Locale, id: string): string {
  return `/${locale}/products/${id}`;
}

export function blogPath(locale: Locale): string {
  return `/${locale}/blog`;
}

export function blogPostPath(locale: Locale, slug: string): string {
  return `/${locale}/blog/${slug}`;
}

export function cartPath(locale: Locale): string {
  return `/${locale}/cart`;
}

export function checkoutPath(locale: Locale): string {
  return `/${locale}/checkout`;
}

export function orderSuccessPath(locale: Locale): string {
  return `/${locale}/order-success`;
}

export function accountPath(locale: Locale): string {
  return `/${locale}/account`;
}

export function resetPasswordPath(locale: Locale): string {
  return `/${locale}/account/reset-password`;
}

export type AccountSection = "account" | "orders" | "addresses";

const ACCOUNT_SECTIONS = new Set<AccountSection>(["account", "orders", "addresses"]);

export function isAccountSection(value: string | null | undefined): value is AccountSection {
  return Boolean(value && ACCOUNT_SECTIONS.has(value as AccountSection));
}

export function accountSectionPath(locale: Locale, section: AccountSection): string {
  if (section === "account") return accountPath(locale);
  return `${accountPath(locale)}?section=${section}`;
}

export function authPath(locale: Locale, redirect?: string): string {
  const base = `/${locale}/auth`;
  if (redirect) {
    return `${base}?redirect=${encodeURIComponent(redirect)}`;
  }
  return base;
}

export function loginPath(locale: Locale, redirect?: string): string {
  const base = `/${locale}/login`;
  if (redirect) {
    return `${base}?redirect=${encodeURIComponent(redirect)}`;
  }
  return base;
}

export function registerPath(locale: Locale, redirect?: string): string {
  const base = `/${locale}/register`;
  if (redirect) {
    return `${base}?redirect=${encodeURIComponent(redirect)}`;
  }
  return base;
}

/** Build `pathByLocale` for `buildMetadata()`. */
export function buildPathByLocale(
  builder: (locale: Locale) => string
): Record<Locale, string> {
  return Object.fromEntries(
    locales.map((l) => [l, builder(l)])
  ) as Record<Locale, string>;
}

export function isCheckoutPath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  return (
    segments.length >= 2 &&
    locales.includes(segments[0] as Locale) &&
    segments[1] === "checkout"
  );
}

export function isOrderSuccessPath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  return (
    segments.length >= 2 &&
    locales.includes(segments[0] as Locale) &&
    segments[1] === "order-success"
  );
}

export function isCartPath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  return (
    segments.length >= 2 &&
    locales.includes(segments[0] as Locale) &&
    segments[1] === "cart"
  );
}

export function shouldHideGiHeader(pathname: string): boolean {
  return isCheckoutPath(pathname);
}

/** @deprecated Use shouldHideGiHeader */
export function shouldHideGiChrome(pathname: string): boolean {
  return shouldHideGiHeader(pathname);
}

export function shouldUseLightCommerceFooter(pathname: string): boolean {
  return (
    isCartPath(pathname) ||
    isCheckoutPath(pathname) ||
    isOrderSuccessPath(pathname)
  );
}

/** Order success — shell blanco continuo (PDP / cart). */
export function shouldUseLightOrderSuccessChrome(pathname: string): boolean {
  return isOrderSuccessPath(pathname);
}

function pathSegments(pathname: string): string[] {
  return pathname.split("/").filter(Boolean);
}

function hasLocalePrefix(segments: string[]): boolean {
  return segments.length >= 1 && locales.includes(segments[0] as Locale);
}

/** Home Good Products: `/{locale}`. */
export function isHomePath(pathname: string): boolean {
  const segments = pathSegments(pathname);
  return segments.length === 1 && hasLocalePrefix(segments);
}

/** PLP catálogo: `/{locale}/products` (sin slug de producto). */
export function isProductsListPath(pathname: string): boolean {
  const segments = pathSegments(pathname);
  return (
    segments.length === 2 &&
    hasLocalePrefix(segments) &&
    segments[1] === "products"
  );
}

/** Listado blog: `/{locale}/blog`. */
export function isBlogListPath(pathname: string): boolean {
  const segments = pathSegments(pathname);
  return (
    segments.length === 2 &&
    hasLocalePrefix(segments) &&
    segments[1] === "blog"
  );
}

/** Artículo blog: `/{locale}/blog/{slug}`. */
export function isBlogPostPath(pathname: string): boolean {
  const segments = pathSegments(pathname);
  return (
    segments.length === 3 &&
    hasLocalePrefix(segments) &&
    segments[1] === "blog" &&
    Boolean(segments[2])
  );
}

/** PDP de producto Good Products: `/{locale}/products/{id}`. */
export function isProductPdpPath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  return (
    segments.length >= 3 &&
    locales.includes(segments[0] as Locale) &&
    segments[1] === "products" &&
    Boolean(segments[2])
  );
}

export function shouldUseLightPdpChrome(pathname: string): boolean {
  return isProductPdpPath(pathname);
}

/** Header minimalista blanco (estilo PDP) — todo el sitio salvo checkout. */
export function shouldUseLightGiHeader(pathname: string): boolean {
  return !isCheckoutPath(pathname);
}

/** @deprecated Use `homePath` — migration alias. */
export const goodIdeasHomePath = homePath;
/** @deprecated Use `productsPath` — migration alias. */
export const goodIdeasProductsPath = productsPath;
/** @deprecated Use `productPath` — migration alias. */
export const goodIdeasProductPath = productPath;
/** @deprecated Use `blogPath` — migration alias. */
export const goodIdeasBlogPath = blogPath;
/** @deprecated Use `blogPostPath` — migration alias. */
export const goodIdeasBlogPostPath = blogPostPath;
/** @deprecated Use `cartPath` — migration alias. */
export const goodIdeasCartPath = cartPath;
/** @deprecated Use `checkoutPath` — migration alias. */
export const goodIdeasCheckoutPath = checkoutPath;
/** @deprecated Gateway removed — maps to home. */
export const brandGatewayPath = homePath;
