"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import type { Locale } from "@/lib/i18n/config";
import {
  goodIdeasBlogPath,
  goodIdeasHomePath,
  goodIdeasProductsPath,
} from "@/lib/routing/brands";

const legalSlugs = {
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
} as const;

function legalHref(key: keyof typeof legalSlugs, locale: Locale) {
  return `/${locale}/${legalSlugs[key][locale]}`;
}

export default function GoodIdeasFooter() {
  const locale = useLocale();
  const t = useTranslations();
  const year = new Date().getFullYear();

  const shopLinks = [
    { href: goodIdeasHomePath(locale), label: t("goodIdeas.footer.home") },
    { href: goodIdeasProductsPath(locale), label: t("goodIdeas.footer.products") },
    { href: goodIdeasBlogPath(locale), label: t("goodIdeas.footer.blog") },
  ];

  const legalLinks = [
    { href: legalHref("privacy", locale), label: t("goodIdeas.footer.privacy") },
    { href: legalHref("cookies", locale), label: t("goodIdeas.footer.cookies") },
    { href: legalHref("terms", locale), label: t("goodIdeas.footer.terms") },
  ];

  return (
    <footer className="border-t border-white/[0.08] bg-[#0B0F14] text-[#E8ECF1]">
      <div className="mx-auto max-w-[1200px] px-6 py-14 sm:px-10 md:py-16">
        <div className="grid gap-10 md:grid-cols-3 md:gap-12">
          <div>
            <p className="font-display text-[1.5rem] tracking-[-0.02em] text-white">
              {t("goodIdeas.brandName")}
            </p>
            <p className="mt-3 max-w-xs font-inter text-[14px] leading-relaxed text-[rgba(232,236,241,0.55)]">
              {t("goodIdeas.footer.tagline")}
            </p>
          </div>

          <div>
            <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(232,236,241,0.45)]">
              {t("goodIdeas.footer.shopHeading")}
            </p>
            <ul className="mt-4 space-y-2">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-inter text-[14px] text-[rgba(232,236,241,0.72)] transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="font-inter text-[11px] font-semibold uppercase tracking-[0.18em] text-[rgba(232,236,241,0.45)]">
              {t("goodIdeas.footer.legalHeading")}
            </p>
            <ul className="mt-4 space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-inter text-[14px] text-[rgba(232,236,241,0.72)] transition hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="mt-12 border-t border-white/[0.08] pt-6 text-center font-inter text-[12px] text-[rgba(232,236,241,0.4)]">
          © {year} {t("goodIdeas.brandName")}. {t("goodIdeas.footer.rights")}
        </p>
      </div>
    </footer>
  );
}
