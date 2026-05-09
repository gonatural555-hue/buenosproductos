"use client";

import Link from "next/link";
import type { Locale } from "@/lib/i18n/config";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";

export default function Footer() {
  const locale = useLocale();
  const t = useTranslations();
  const currentYear = new Date().getFullYear();

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
    disclaimer: {
      en: "disclaimer",
      es: "descargo-de-responsabilidad",
      fr: "avis-de-non-responsabilite",
      it: "esclusione-di-responsabilita",
    },
  } as const;

  const buildLegalHref = (
    key: keyof typeof legalSlugs,
    currentLocale: Locale
  ) => `/${currentLocale}/${legalSlugs[key][currentLocale]}`;

  const navigationLinks = [
    { href: `/${locale}`, label: t("footer.links.home") },
    { href: `/${locale}/products`, label: t("footer.links.products") },
    { href: `/${locale}/cart`, label: t("footer.links.cart") },
    { href: `/${locale}/checkout`, label: t("footer.links.checkout") },
  ];

  const legalLinks = [
    { href: buildLegalHref("privacy", locale), label: t("footer.links.privacy") },
    { href: buildLegalHref("cookies", locale), label: t("footer.links.cookies") },
    { href: buildLegalHref("terms", locale), label: t("footer.links.terms") },
    {
      href: buildLegalHref("disclaimer", locale),
      label: t("footer.links.disclaimer"),
    },
  ];

  const companyLinks = [
    { href: `/${locale}/about`, label: t("footer.links.about") },
    { href: `/${locale}/contact`, label: t("footer.links.contact") },
  ];

  return (
    <footer className="bg-dark-base text-text-muted mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-12">
          {/* Branding Section */}
          <div className="lg:col-span-1">
            <Link
              href={`/${locale}`}
              className="group mb-4 inline-flex shrink-0 items-center transition-opacity duration-200 hover:opacity-90"
              aria-label="Go Natural"
            >
              <img
                src="/assets/images/logo/GONATURAL-LOGO.svg"
                alt="Go Natural"
                className="h-10 w-auto transition-transform duration-300 ease-out group-hover:scale-[1.03] sm:h-11 md:h-12"
                loading="lazy"
                decoding="async"
              />
            </Link>
            <p className="text-sm text-text-muted leading-relaxed max-w-xs">
              {t("footer.brandBlurb")}
            </p>
          </div>

          {/* Navigation Section */}
          <div>
            <h3 className="text-text-primary font-semibold text-xs uppercase tracking-wider mb-4">
              {t("footer.navigationTitle")}
            </h3>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Section */}
          <div>
            <h3 className="text-text-primary font-semibold text-xs uppercase tracking-wider mb-4">
              {t("footer.companyTitle")}
            </h3>
            <ul className="space-y-3">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted hover:text-text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Section */}
          <div>
            <h3 className="text-text-primary font-semibold text-xs uppercase tracking-wider mb-4">
              {t("footer.legalTitle")}
            </h3>
            <ul className="space-y-3">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-xs text-text-muted/80 hover:text-text-primary transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Trust Section */}
          <div>
            <h3 className="text-text-primary font-semibold text-xs uppercase tracking-wider mb-4">
              {t("footer.trustTitle")}
            </h3>
            <ul className="space-y-3 text-sm text-text-muted">
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 text-text-muted/60 flex-shrink-0 mt-0.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
                <span>{t("footer.trustItems.0")}</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 text-text-muted/60 flex-shrink-0 mt-0.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                  />
                </svg>
                <span>{t("footer.trustItems.1")}</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 text-text-muted/60 flex-shrink-0 mt-0.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-1.135 9.232 9.232 0 003.478-3.465c.33-.921-.074-1.9-.563-2.44a2.253 2.253 0 00-1.5-1.5c-.921-.33-1.9-.074-2.44.563a2.253 2.253 0 01-1.5 1.5 9.232 9.232 0 00-3.465 3.478 9.38 9.38 0 00-.372 2.625c0 .633.135 1.25.372 1.853a2.253 2.253 0 01-1.5 1.5 9.337 9.337 0 01-4.121 1.135 9.232 9.232 0 01-3.478-3.465 2.253 2.253 0 00-1.5-1.5 9.38 9.38 0 01-.372-2.625 9.38 9.38 0 00-.372-2.625 2.253 2.253 0 011.5-1.5 9.232 9.232 0 013.478-3.465 2.253 2.253 0 011.5-1.5c.921-.33 1.9-.074 2.44.563a2.253 2.253 0 011.5 1.5 9.232 9.232 0 003.465 3.478 9.38 9.38 0 00.372 2.625c0 .633-.135 1.25-.372 1.853a2.253 2.253 0 01-1.5 1.5z"
                  />
                </svg>
                <span>{t("footer.trustItems.2")}</span>
              </li>
              <li className="flex items-start gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2}
                  stroke="currentColor"
                  className="w-5 h-5 text-text-muted/60 flex-shrink-0 mt-0.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
                  />
                </svg>
                <span>{t("footer.trustItems.3")}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-text-muted">
            <p>
              © {currentYear} Go Natural. {t("footer.rights")}
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
