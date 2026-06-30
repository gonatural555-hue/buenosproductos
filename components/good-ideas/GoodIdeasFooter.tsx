"use client";

import Link from "next/link";
import GoodProductsBrandName from "@/components/good-ideas/GoodProductsBrandName";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import type { Locale } from "@/lib/i18n/config";
import {
  blogPath,
  homePath,
  productsPath,
} from "@/lib/routing/paths";
import { LEGAL_SLUGS, type LegalSlugKey } from "@/lib/seo";
import { giType } from "@/lib/ui/gi-typography";

function legalHref(key: LegalSlugKey, locale: Locale) {
  return `/${locale}/${LEGAL_SLUGS[key][locale]}`;
}

type Props = {
  variant?: "dark" | "light";
};

export default function GoodIdeasFooter({ variant = "dark" }: Props) {
  const locale = useLocale();
  const t = useTranslations();
  const year = new Date().getFullYear();
  const isLight = variant === "light";

  const shopLinks = [
    { href: homePath(locale), label: t("goodIdeas.footer.home") },
    { href: productsPath(locale), label: t("goodIdeas.footer.products") },
    { href: blogPath(locale), label: t("goodIdeas.footer.blog") },
  ];

  const legalLinks: { href: string; label: string; highlight?: boolean }[] = [
    {
      href: legalHref("regret", locale),
      label: t("goodIdeas.footer.regret"),
      highlight: true,
    },
    { href: legalHref("returns", locale), label: t("goodIdeas.footer.returns") },
    { href: legalHref("shipping", locale), label: t("goodIdeas.footer.shipping") },
    { href: legalHref("terms", locale), label: t("goodIdeas.footer.terms") },
    { href: legalHref("privacy", locale), label: t("goodIdeas.footer.privacy") },
    { href: legalHref("cookies", locale), label: t("goodIdeas.footer.cookies") },
    { href: legalHref("disclaimer", locale), label: t("goodIdeas.footer.disclaimer") },
  ];

  const linkClass = isLight
    ? "font-body text-sm text-[#111111] transition hover:text-[#3B82F6]"
    : giType.footerLink;

  const highlightLinkClass = isLight
    ? "font-body text-sm font-semibold text-[#2563EB] transition hover:text-[#3B82F6]"
    : "font-body text-sm font-semibold text-[#93C5FD] transition-colors hover:text-[#BFDBFE]";

  return (
    <footer
      className={
        isLight
          ? "border-t border-[#E5E5E5] bg-white text-[#111111]"
          : "border-t border-white/[0.08] bg-[#0B0F14] text-[#E8ECF1]"
      }
    >
      <div className="mx-auto max-w-[1315px] px-8 py-14 md:py-16">
        <div className="grid gap-10 md:grid-cols-3 md:gap-12">
          <div>
            <p className={giType.brandLogo}>
              <GoodProductsBrandName
                locale={locale}
                prefixClassName={isLight ? "text-[#111111]" : undefined}
                suffixClassName={isLight ? "text-[#3B82F6]" : undefined}
              />
            </p>
            <p
              className={`mt-3 max-w-xs font-body text-sm leading-relaxed ${
                isLight ? "text-[#737373]" : giType.footerBody
              }`}
            >
              {t("goodIdeas.footer.tagline")}
            </p>
          </div>

          <div>
            <p
              className={`${giType.footerHeading} ${
                isLight ? "text-[#111111]" : "text-[var(--gi-text-muted-on-dark)]"
              }`}
            >
              {t("goodIdeas.footer.shopHeading")}
            </p>
            <ul className="mt-4 space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p
              className={`${giType.footerHeading} ${
                isLight ? "text-[#111111]" : "text-[var(--gi-text-muted-on-dark)]"
              }`}
            >
              {t("goodIdeas.footer.legalHeading")}
            </p>
            <ul className="mt-4 space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={link.highlight ? highlightLinkClass : linkClass}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p
          className={`mt-12 border-t pt-6 text-center font-body text-xs ${
            isLight
              ? "border-[#E5E5E5] text-[#737373]"
              : `border-white/[0.08] ${giType.footerLegal}`
          }`}
        >
          © {year}{" "}
          <GoodProductsBrandName
            locale={locale}
            prefixClassName={isLight ? "text-[#111111]" : undefined}
            suffixClassName={isLight ? "text-[#3B82F6]" : undefined}
          />
          . {t("goodIdeas.footer.rights")}
        </p>
      </div>
    </footer>
  );
}
