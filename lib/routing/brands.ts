import { locales, type Locale } from "@/lib/i18n/config";

export const BRAND_SEGMENTS = {
  goNatural: "go-natural",
  goodIdeas: "good-ideas",
} as const;

export type BrandId = "go-natural" | "good-ideas";

export function brandGatewayPath(locale: Locale): string {
  return `/${locale}`;
}

export function goNaturalHomePath(locale: Locale): string {
  return `/${locale}/${BRAND_SEGMENTS.goNatural}`;
}

export function goodIdeasHomePath(locale: Locale): string {
  return `/${locale}/${BRAND_SEGMENTS.goodIdeas}`;
}

export function goodIdeasProductsPath(locale: Locale): string {
  return `/${locale}/${BRAND_SEGMENTS.goodIdeas}/products`;
}

export function goodIdeasProductPath(locale: Locale, id: string): string {
  return `/${locale}/${BRAND_SEGMENTS.goodIdeas}/products/${id}`;
}

export function goodIdeasBlogPath(locale: Locale): string {
  return `/${locale}/${BRAND_SEGMENTS.goodIdeas}/blog`;
}

export function goodIdeasBlogPostPath(locale: Locale, slug: string): string {
  return `/${locale}/${BRAND_SEGMENTS.goodIdeas}/blog/${slug}`;
}

export function goodIdeasCartPath(locale: Locale): string {
  return `/${locale}/${BRAND_SEGMENTS.goodIdeas}/cart`;
}

export function goodIdeasCheckoutPath(locale: Locale): string {
  return `/${locale}/${BRAND_SEGMENTS.goodIdeas}/checkout`;
}

/** `true` when pathname is exactly `/[locale]` (multi-brand gateway). */
export function isBrandGatewayPath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  return segments.length === 1 && locales.includes(segments[0] as Locale);
}

export function isGoNaturalHomePath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  return (
    segments.length === 2 &&
    locales.includes(segments[0] as Locale) &&
    segments[1] === BRAND_SEGMENTS.goNatural
  );
}

export function isGoodIdeasPath(pathname: string): boolean {
  const segments = pathname.split("/").filter(Boolean);
  return (
    segments.length >= 2 &&
    locales.includes(segments[0] as Locale) &&
    segments[1] === BRAND_SEGMENTS.goodIdeas
  );
}

export function resolveBrandFromPath(pathname: string): BrandId | null {
  if (isGoodIdeasPath(pathname)) return "good-ideas";
  if (isBrandGatewayPath(pathname)) return null;
  return "go-natural";
}

/** Go Natural chrome (global header) hidden on gateway and Good Ideas routes. */
export function shouldShowGoNaturalHeader(pathname: string): boolean {
  return !isBrandGatewayPath(pathname) && !isGoodIdeasPath(pathname);
}

export function shouldShowGoNaturalFooter(pathname: string): boolean {
  return !isBrandGatewayPath(pathname) && !isGoodIdeasPath(pathname);
}
