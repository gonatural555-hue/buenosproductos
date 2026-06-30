import type { Metadata } from "next";
import { defaultLocale, locales, type Locale } from "@/lib/i18n/config";

const OG_LOCALES: Record<Locale, string> = {
  en: "en_US",
  es: "es_ES",
  fr: "fr_FR",
  it: "it_IT",
};

export type LegalSlugKey =
  | "privacy"
  | "cookies"
  | "terms"
  | "disclaimer"
  | "returns"
  | "shipping"
  | "regret";

export const LEGAL_SLUGS: Record<LegalSlugKey, Record<Locale, string>> = {
  privacy: {
    en: "privacy-policy",
    es: "politica-de-privacidad",
    fr: "politique-de-confidentialite",
    it: "informativa-sulla-privacy",
  },
  cookies: {
    en: "cookie-policy",
    es: "politica-de-cookies",
    fr: "politique-de-cookies",
    it: "informativa-sui-cookie",
  },
  terms: {
    en: "terms-and-conditions",
    es: "terminos-y-condiciones",
    fr: "conditions-generales",
    it: "termini-e-condizioni",
  },
  disclaimer: {
    en: "disclaimer",
    es: "descargo-de-responsabilidad",
    fr: "avis-de-non-responsabilite",
    it: "esclusione-di-responsabilita",
  },
  returns: {
    en: "returns",
    es: "returns",
    fr: "returns",
    it: "returns",
  },
  shipping: {
    en: "shipping",
    es: "envios",
    fr: "shipping",
    it: "shipping",
  },
  regret: {
    en: "right-of-withdrawal",
    es: "boton-de-arrepentimiento",
    fr: "right-of-withdrawal",
    it: "right-of-withdrawal",
  },
};

export function legalPathByLocale(key: LegalSlugKey): Record<Locale, string> {
  return Object.fromEntries(
    locales.map((locale) => [locale, `/${locale}/${LEGAL_SLUGS[key][locale]}`])
  ) as Record<Locale, string>;
}

export function getSiteUrl() {
  const envUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const vercelUrl = process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : null;
  const baseUrl = envUrl || vercelUrl || "http://localhost:3000";
  return baseUrl.replace(/\/+$/, "");
}

export function toAbsoluteUrl(path: string) {
  if (!path) return getSiteUrl();
  if (path.startsWith("http")) return path;
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

export function buildAlternates({
  locale,
  pathByLocale,
}: {
  locale: Locale;
  pathByLocale: Record<Locale, string>;
}) {
  return {
    canonical: toAbsoluteUrl(pathByLocale[locale]),
    languages: {
      en: toAbsoluteUrl(pathByLocale.en),
      es: toAbsoluteUrl(pathByLocale.es),
      fr: toAbsoluteUrl(pathByLocale.fr),
      it: toAbsoluteUrl(pathByLocale.it),
      "x-default": toAbsoluteUrl(pathByLocale[defaultLocale]),
    },
  };
}

export function buildMetadata({
  locale,
  title,
  description,
  pathByLocale,
  ogImage,
  ogTitle,
  ogDescription,
  ogType = "website",
}: {
  locale: Locale;
  title: string;
  description: string;
  pathByLocale: Record<Locale, string>;
  ogImage?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogType?: "website" | "article" | "product";
}): Metadata {
  const url = toAbsoluteUrl(pathByLocale[locale]);
  const imageUrl = toAbsoluteUrl(ogImage || "/assets/images/blog/blog-hero.webp");
  const openGraphType = ogType === "product" ? "website" : ogType;

  return {
    title,
    description,
    alternates: buildAlternates({ locale, pathByLocale }),
    openGraph: {
      title: ogTitle || title,
      description: ogDescription || description,
      url,
      type: openGraphType,
      locale: OG_LOCALES[locale],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
        },
      ],
    },
  };
}

export function formatTemplate(template: string, params: Record<string, string>) {
  return Object.keys(params).reduce(
    (acc, key) => acc.replace(new RegExp(`\\{${key}\\}`, "g"), params[key]),
    template
  );
}

