import type { Locale } from "@/lib/i18n/config";
import { LEGAL_SLUGS } from "@/lib/seo";

export function checkoutLegalLinks(locale: Locale) {
  return {
    returns: `/${locale}/${LEGAL_SLUGS.returns[locale]}`,
    shipping: `/${locale}/${LEGAL_SLUGS.shipping[locale]}`,
    regret: `/${locale}/${LEGAL_SLUGS.regret[locale]}`,
    privacy: `/${locale}/${LEGAL_SLUGS.privacy[locale]}`,
    terms: `/${locale}/${LEGAL_SLUGS.terms[locale]}`,
  };
}
