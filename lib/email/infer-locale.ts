import type { GiEmailLocale } from "@/lib/email/layout";

export function inferOrderEmailLocale(
  shipping: Record<string, unknown> | undefined
): GiEmailLocale {
  if (shipping && typeof shipping.locale === "string" && shipping.locale === "en") {
    return "en";
  }
  return "es";
}

export function inferCountryFromShipping(
  shipping: Record<string, unknown> | undefined
): string | undefined {
  const country = shipping?.country;
  return typeof country === "string" && country.trim() ? country.trim() : undefined;
}
