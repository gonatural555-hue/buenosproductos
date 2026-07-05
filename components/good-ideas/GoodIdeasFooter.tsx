"use client";

import Link from "next/link";
import GoodProductsBrandName from "@/components/good-ideas/GoodProductsBrandName";
import GoodIdeasFooterAccordion from "@/components/good-ideas/footer/GoodIdeasFooterAccordion";
import GoodIdeasFooterNewsletter from "@/components/good-ideas/footer/GoodIdeasFooterNewsletter";
import GoodIdeasFooterPaymentMethods from "@/components/good-ideas/footer/GoodIdeasFooterPaymentMethods";
import GoodIdeasFooterSocialLinks from "@/components/good-ideas/footer/GoodIdeasFooterSocialLinks";
import HexGridInteractiveBackground from "@/components/good-ideas/HexGridInteractiveBackground";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import type { Locale } from "@/lib/i18n/config";
import {
  accountSectionPath,
  blogPath,
  productsPath,
} from "@/lib/routing/paths";
import { buildGoodIdeasProductsListHref } from "@/lib/good-ideas-plp-segments";
import { LEGAL_SLUGS, type LegalSlugKey } from "@/lib/seo";
import { GI_SITE_FOOTER_ID } from "@/lib/ui/goodideas-design";
import { giType } from "@/lib/ui/gi-typography";

function legalHref(key: LegalSlugKey, locale: Locale) {
  return `/${locale}/${LEGAL_SLUGS[key][locale]}`;
}

type FooterLink = {
  href: string;
  label: string;
  highlight?: boolean;
};

type Props = {
  variant?: "dark" | "light";
};

function FooterLinkList({
  links,
  linkClass,
  highlightLinkClass,
}: {
  links: FooterLink[];
  linkClass: string;
  highlightLinkClass: string;
}) {
  return (
    <ul className="space-y-2.5 sm:space-y-3">
      {links.map((link) => (
        <li key={`${link.href}-${link.label}`}>
          <Link
            href={link.href}
            className={link.highlight ? highlightLinkClass : linkClass}
          >
            {link.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default function GoodIdeasFooter({ variant = "dark" }: Props) {
  const locale = useLocale();
  const t = useTranslations();
  const year = new Date().getFullYear();
  const isLight = variant === "light";

  const productsHref = productsPath(locale);
  const catalogHref = buildGoodIdeasProductsListHref(locale);
  const contactHref = `/${locale}/contact`;
  const aboutHref = `/${locale}/about`;

  const buyLinks: FooterLink[] = [
    { href: productsHref, label: t("goodIdeas.footer.allProducts") },
    { href: catalogHref, label: t("goodIdeas.footer.offers") },
    { href: catalogHref, label: t("goodIdeas.footer.newArrivals") },
    { href: catalogHref, label: t("goodIdeas.footer.bestSellers") },
    { href: productsHref, label: t("goodIdeas.footer.categories") },
  ];

  const infoLinks: FooterLink[] = [
    { href: aboutHref, label: t("goodIdeas.footer.aboutUs") },
    { href: legalHref("shipping", locale), label: t("goodIdeas.footer.shipping") },
    {
      href: legalHref("returns", locale),
      label: t("goodIdeas.footer.returnsPolicy"),
    },
    { href: contactHref, label: t("goodIdeas.footer.faq") },
    { href: blogPath(locale), label: t("goodIdeas.footer.blog") },
  ];

  const helpLinks: FooterLink[] = [
    { href: contactHref, label: t("goodIdeas.footer.contact") },
    {
      href: accountSectionPath(locale, "orders"),
      label: t("goodIdeas.footer.orderTracking"),
    },
    { href: legalHref("terms", locale), label: t("goodIdeas.footer.terms") },
    { href: legalHref("privacy", locale), label: t("goodIdeas.footer.privacy") },
    {
      href: legalHref("regret", locale),
      label: t("goodIdeas.footer.regret"),
      highlight: true,
    },
    { href: legalHref("cookies", locale), label: t("goodIdeas.footer.cookies") },
    {
      href: legalHref("disclaimer", locale),
      label: t("goodIdeas.footer.disclaimer"),
    },
  ];

  const bottomLegalLinks: FooterLink[] = [
    { href: legalHref("terms", locale), label: t("goodIdeas.footer.terms") },
    { href: legalHref("privacy", locale), label: t("goodIdeas.footer.privacy") },
    { href: legalHref("cookies", locale), label: t("goodIdeas.footer.cookies") },
    {
      href: legalHref("disclaimer", locale),
      label: t("goodIdeas.footer.disclaimer"),
    },
  ];

  const darkLinkClass =
    "font-body text-[13px] leading-relaxed text-[rgba(232,236,241,0.55)] transition-colors duration-160 hover:text-[#60A5FA] sm:text-sm";
  const darkHighlightLinkClass =
    "font-body text-[13px] font-semibold leading-relaxed text-[#93C5FD] transition-colors duration-160 hover:text-[#60A5FA] sm:text-sm";
  const darkHeadingClass =
    "font-body text-sm font-bold text-[#E8ECF1]";
  const darkTaglineClass =
    "font-body text-sm leading-relaxed text-[rgba(232,236,241,0.72)] sm:text-[15px]";
  const darkClaimClass =
    "font-body text-[13px] leading-relaxed text-[rgba(232,236,241,0.55)]";

  const linkClass = isLight
    ? "font-body text-[13px] leading-relaxed text-[#737373] transition-colors duration-160 hover:text-[#3B82F6] sm:text-sm"
    : darkLinkClass;

  const highlightLinkClass = isLight
    ? "font-body text-[13px] font-semibold leading-relaxed text-[#2563EB] transition-colors duration-160 hover:text-[#3B82F6] sm:text-sm"
    : darkHighlightLinkClass;

  const headingClass = isLight
    ? "font-body text-sm font-bold text-[#111111]"
    : darkHeadingClass;

  const taglineClass = isLight
    ? "font-body text-sm leading-relaxed text-[#737373] sm:text-[15px]"
    : darkTaglineClass;

  const claimClass = isLight
    ? "font-body text-[13px] leading-relaxed text-[#9CA3AF]"
    : darkClaimClass;

  const bottomLinkClass = isLight
    ? "font-body text-xs text-[#737373] transition-colors duration-160 hover:text-[#3B82F6]"
    : "font-body text-xs text-[rgba(232,236,241,0.55)] transition-colors duration-160 hover:text-[#60A5FA]";

  return (
    <footer
      id={GI_SITE_FOOTER_ID}
      className={
        isLight
          ? "relative border-t border-[#E5E5E5] bg-white text-[#111111]"
          : "relative isolate overflow-hidden border-t border-white/[0.08] bg-[#0B0F14] text-[#E8ECF1]"
      }
    >
      {!isLight ? (
        <>
          <HexGridInteractiveBackground />
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_80%_55%_at_28%_-8%,rgba(59,130,246,0.22),transparent_58%)]"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_55%_50%_at_88%_55%,rgba(59,130,246,0.14),transparent_58%)]"
            aria-hidden
          />
        </>
      ) : null}

      <div className="relative z-[2] mx-auto max-w-[1320px] px-5 pb-12 pt-12 sm:px-6 md:pb-14 md:pt-16 lg:px-10 lg:pb-12 lg:pt-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.45fr)_minmax(0,0.85fr)_minmax(0,0.85fr)_minmax(0,0.85fr)] lg:gap-x-10 lg:gap-y-0 xl:gap-x-12">
          <div className="min-w-0">
            <p className={giType.brandLogo}>
              <GoodProductsBrandName
                locale={locale}
                prefixClassName={isLight ? "text-[#111111]" : "text-[#E8ECF1]"}
                suffixClassName="text-[#3B82F6]"
              />
            </p>
            <p className={`mt-4 max-w-sm ${taglineClass}`}>
              {t("goodIdeas.footer.tagline")}
            </p>
            <p className={`mt-3 max-w-sm ${claimClass}`}>
              {t("goodIdeas.footer.miniClaim")}
            </p>
            <GoodIdeasFooterSocialLinks
              variant={variant}
              facebookAria={t("goodIdeas.footer.facebookAria")}
              instagramAria={t("goodIdeas.footer.instagramAria")}
              tiktokAria={t("goodIdeas.footer.tiktokAria")}
            />
          </div>

          <div className="order-3 lg:order-none">
            <div className="hidden lg:block">
              <p className={`mb-4 ${headingClass}`}>
                {t("goodIdeas.footer.buyHeading")}
              </p>
              <FooterLinkList
                links={buyLinks}
                linkClass={linkClass}
                highlightLinkClass={highlightLinkClass}
              />
            </div>
            <GoodIdeasFooterAccordion
              title={t("goodIdeas.footer.buyHeading")}
              links={buyLinks}
              variant={variant}
            />
          </div>

          <div className="order-4 lg:order-none">
            <div className="hidden lg:block">
              <p className={`mb-4 ${headingClass}`}>
                {t("goodIdeas.footer.infoHeading")}
              </p>
              <FooterLinkList
                links={infoLinks}
                linkClass={linkClass}
                highlightLinkClass={highlightLinkClass}
              />
            </div>
            <GoodIdeasFooterAccordion
              title={t("goodIdeas.footer.infoHeading")}
              links={infoLinks}
              variant={variant}
            />
          </div>

          <div className="order-5 lg:order-none">
            <div className="hidden lg:block">
              <p className={`mb-4 ${headingClass}`}>
                {t("goodIdeas.footer.helpHeading")}
              </p>
              <FooterLinkList
                links={helpLinks}
                linkClass={linkClass}
                highlightLinkClass={highlightLinkClass}
              />
            </div>
            <GoodIdeasFooterAccordion
              title={t("goodIdeas.footer.helpHeading")}
              links={helpLinks}
              variant={variant}
            />
          </div>

          <div className="order-2 lg:hidden">
            <GoodIdeasFooterNewsletter variant={variant} />
            <div className="mt-5">
              <GoodIdeasFooterPaymentMethods variant={variant} />
            </div>
          </div>
        </div>

        <div
          className={`mt-12 border-t pt-6 sm:pt-7 lg:mt-14 ${
            isLight ? "border-[#E5E5E5]" : "border-white/[0.08]"
          }`}
        >
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between lg:gap-8">
            <p
              className={`font-body text-xs leading-relaxed sm:text-[13px] ${
                isLight ? "text-[#737373]" : "text-[rgba(232,236,241,0.55)]"
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

            <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between lg:justify-end lg:gap-8">
              <div className="hidden lg:block">
                <GoodIdeasFooterPaymentMethods variant={variant} />
              </div>

              <nav
                className="flex flex-wrap gap-x-4 gap-y-2"
                aria-label={t("goodIdeas.footer.legalNavAria")}
              >
                {bottomLegalLinks.map((link) => (
                  <Link key={link.href} href={link.href} className={bottomLinkClass}>
                    {link.label}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
