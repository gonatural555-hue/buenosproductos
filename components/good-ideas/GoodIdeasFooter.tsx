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
import { GI_SITE_FOOTER_ID } from "@/lib/ui/goodideas-design";
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

  const darkLinkClass =
    "font-body text-sm text-[rgba(232,236,241,0.72)] transition-colors duration-200 hover:text-[#3B82F6]";
  const darkHighlightLinkClass =
    "font-body text-sm font-semibold text-[#93C5FD] transition-colors duration-200 hover:text-[#3B82F6]";
  const darkHeadingClass =
    "font-body text-[11px] font-semibold uppercase tracking-[0.24em] text-[rgba(232,236,241,0.55)]";
  const darkTaglineClass =
    "font-body text-sm leading-relaxed text-[rgba(232,236,241,0.55)]";

  const linkClass = isLight
    ? "font-body text-sm text-[#111111] transition hover:text-[#3B82F6]"
    : darkLinkClass;

  const highlightLinkClass = isLight
    ? "font-body text-sm font-semibold text-[#2563EB] transition hover:text-[#3B82F6]"
    : darkHighlightLinkClass;

  const headingClass = isLight
    ? "font-body text-sm font-semibold text-[#111111]"
    : darkHeadingClass;

  const taglineClass = isLight
    ? "font-body text-sm leading-relaxed text-[#737373]"
    : darkTaglineClass;

  return (
    <footer
      id={GI_SITE_FOOTER_ID}
      className={
        isLight
          ? "border-t border-[#E5E5E5] bg-white text-[#111111]"
          : "border-t border-white/[0.08] bg-[#0B0F14] text-[#E8ECF1]"
      }
    >
      <div className="mx-auto max-w-[1320px] px-6 py-16 sm:px-10 md:py-20 lg:px-12">
        <div className="grid gap-12 md:grid-cols-3 md:gap-10 lg:gap-14">
          <div>
            <p className={giType.brandLogo}>
              <GoodProductsBrandName
                locale={locale}
                prefixClassName={isLight ? "text-[#111111]" : "text-[#E8ECF1]"}
                suffixClassName={isLight ? "text-[#3B82F6]" : "text-[#3B82F6]"}
              />
            </p>
            <p className={`mt-4 max-w-xs ${taglineClass}`}>
              {t("goodIdeas.footer.tagline")}
            </p>
          </div>

          <div>
            <p className={headingClass}>{t("goodIdeas.footer.shopHeading")}</p>
            <ul className="mt-5 space-y-3">
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
            <p className={headingClass}>{t("goodIdeas.footer.legalHeading")}</p>
            <ul className="mt-5 space-y-3">
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
          className={`mt-14 border-t pt-8 text-center font-body text-xs md:mt-16 ${
            isLight
              ? "border-[#E5E5E5] text-[#737373]"
              : "border-white/[0.08] text-[rgba(232,236,241,0.55)]"
          }`}
        >
          © {year}{" "}
          <GoodProductsBrandName
            locale={locale}
            prefixClassName={isLight ? "text-[#111111]" : "text-[#E8ECF1]"}
            suffixClassName="text-[#3B82F6]"
          />
          . {t("goodIdeas.footer.rights")}
        </p>
      </div>
    </footer>
  );
}
