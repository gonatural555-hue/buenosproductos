"use client";

import Link from "next/link";
import GoodProductsBrandName from "@/components/good-ideas/GoodProductsBrandName";
import GoodIdeasFooterAccordion from "@/components/good-ideas/footer/GoodIdeasFooterAccordion";
import GoodIdeasFooterNewsletter from "@/components/good-ideas/footer/GoodIdeasFooterNewsletter";
import GoodIdeasFooterPaymentMethods from "@/components/good-ideas/footer/GoodIdeasFooterPaymentMethods";
import GoodIdeasPromoHexPattern from "@/components/good-ideas/home/GoodIdeasPromoHexPattern";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import type { Locale } from "@/lib/i18n/config";
import {
  accountSectionPath,
  blogPath,
  productsPath,
} from "@/lib/routing/paths";
import { buildGoodIdeasProductsListHref } from "@/lib/good-ideas-plp-segments";
import { LEGAL_SLUGS, type LegalSlugKey } from "@/lib/seo";
import {
  INSTAGRAM_URL,
  PINTEREST_URL,
  TIKTOK_URL,
  YOUTUBE_URL,
} from "@/lib/social-links";
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

function FooterSocialLinks({
  variant,
  instagramAria,
  tiktokAria,
  youtubeAria,
  pinterestAria,
}: {
  variant: "dark" | "light";
  instagramAria: string;
  tiktokAria: string;
  youtubeAria: string;
  pinterestAria: string;
}) {
  const items = [
    INSTAGRAM_URL
      ? {
          href: INSTAGRAM_URL,
          label: instagramAria,
          icon: (
            <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm10.5 1.5a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z" />
          ),
        }
      : null,
    TIKTOK_URL
      ? {
          href: TIKTOK_URL,
          label: tiktokAria,
          icon: (
            <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
          ),
        }
      : null,
    YOUTUBE_URL
      ? {
          href: YOUTUBE_URL,
          label: youtubeAria,
          icon: (
            <path d="M21.8 8.001a2.5 2.5 0 00-1.77-1.775C18.254 6 12 6 12 6s-6.254 0-8.03.226A2.5 2.5 0 002.2 8.001 26.3 26.3 0 002 12a26.3 26.3 0 00.2 3.999 2.5 2.5 0 001.77 1.775C5.746 18 12 18 12 18s6.254 0 8.03-.226a2.5 2.5 0 001.77-1.775A26.3 26.3 0 0022 12a26.3 26.3 0 00-.2-3.999zM10 15.5v-7l6 3.5-6 3.5z" />
          ),
        }
      : null,
    PINTEREST_URL
      ? {
          href: PINTEREST_URL,
          label: pinterestAria,
          icon: (
            <path d="M12 2C6.477 2 2 6.477 2 12c0 4.237 2.636 7.855 6.356 9.312-.088-.791-.167-2.005.035-2.868.182-.78 1.172-4.97 1.172-4.97s-.299-.599-.299-1.484c0-1.391.806-2.428 1.81-2.428.852 0 1.264.64 1.264 1.408 0 .858-.546 2.14-.828 3.33-.236.995.499 1.805 1.48 1.805 1.778 0 3.144-1.874 3.144-4.58 0-2.393-1.72-4.068-4.177-4.068-2.845 0-4.515 2.135-4.515 4.34 0 .859.331 1.781.744 2.281a.3.3 0 01.069.288l-.278 1.133c-.044.183-.145.223-.334.134-1.249-.581-2.03-2.407-2.03-3.874 0-3.154 2.292-6.052 6.608-6.052 3.469 0 6.165 2.473 6.165 5.774 0 3.447-2.173 6.22-5.19 6.22-1.013 0-1.965-.527-2.292-1.148l-.623 2.378c-.226.869-.835 1.958-1.244 2.621.936.29 1.931.446 2.964.446 5.523 0 10-4.477 10-10S17.523 2 12 2z" />
          ),
        }
      : null,
  ].filter(Boolean) as {
    href: string;
    label: string;
    icon: React.ReactNode;
  }[];

  if (items.length === 0) return null;

  const buttonClass =
    variant === "light"
      ? "inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#E5E5E5] bg-[#FAFAFA] text-[#111111] transition duration-160 hover:border-[rgba(59,130,246,0.35)] hover:bg-[rgba(59,130,246,0.08)] hover:text-[#3B82F6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/40"
      : "inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-[rgba(232,236,241,0.72)] transition duration-160 hover:border-[rgba(59,130,246,0.35)] hover:bg-[rgba(59,130,246,0.14)] hover:text-[#3B82F6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/40";

  return (
    <div className="mt-5 flex flex-wrap gap-2.5">
      {items.map((item) => (
        <a
          key={item.href}
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={item.label}
          className={buttonClass}
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            {item.icon}
          </svg>
        </a>
      ))}
    </div>
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
          : "relative border-t border-white/[0.08] bg-[#0B0F14] text-[#E8ECF1]"
      }
    >
      {!isLight ? (
        <>
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(circle_at_center_top,rgba(59,130,246,0.16),transparent_45%)]"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-[0.35]" aria-hidden>
            <GoodIdeasPromoHexPattern patternId="gi-footer-hex-pattern" />
          </div>
        </>
      ) : null}

      <div className="relative mx-auto max-w-[1320px] px-5 pb-12 pt-12 sm:px-6 md:pb-14 md:pt-16 lg:px-10 lg:pb-12 lg:pt-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.75fr)_minmax(0,0.75fr)_minmax(0,0.75fr)_minmax(0,1.15fr)] lg:gap-x-8 lg:gap-y-0 xl:gap-x-10">
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
            <FooterSocialLinks
              variant={variant}
              instagramAria={t("orderSuccessPage.instagramAria")}
              tiktokAria={t("orderSuccessPage.tiktokAria")}
              youtubeAria={t("goodIdeas.footer.youtubeAria")}
              pinterestAria={t("goodIdeas.footer.pinterestAria")}
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

          <div className="order-2 lg:order-none">
            <GoodIdeasFooterNewsletter variant={variant} />
            <div className="mt-5 lg:hidden">
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
