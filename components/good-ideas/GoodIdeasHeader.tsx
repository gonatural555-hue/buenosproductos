"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import GoodProductsBrandName from "@/components/good-ideas/GoodProductsBrandName";
import { useGoodIdeasCart } from "@/context/GoodIdeasCartContext";
import { headerLocales, locales, type Locale } from "@/lib/i18n/config";
import {
  blogPath,
  cartPath,
  homePath,
  isCartPath,
  productsPath,
} from "@/lib/routing/paths";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import HeaderCurrencySwitcher from "@/components/header/HeaderCurrencySwitcher";
import HeaderAccountMenu from "@/components/good-ideas/HeaderAccountMenu";
import { useCartHeaderAutoHide } from "@/hooks/useCartHeaderAutoHide";
import { useSmartHeaderScroll } from "@/hooks/useSmartHeaderScroll";
import { giType } from "@/lib/ui/gi-typography";

export default function GoodIdeasHeader() {
  const locale = useLocale();
  const t = useTranslations();
  const { totalItems } = useGoodIdeasCart();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isPdp = /^\/[^/]+\/products\/[^/]+$/.test(pathname ?? "");
  const isCart = isCartPath(pathname ?? "");
  const hideForPaymentMethods = useCartHeaderAutoHide(isCart);
  const { hidden: scrollHidden, transitionClass } = useSmartHeaderScroll(
    isPdp || isCart
  );
  const hidden = isCart ? hideForPaymentMethods || scrollHidden : scrollHidden;

  const buildLocaleHref = (nextLocale: Locale) => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return homePath(nextLocale);
    if (locales.includes(segments[0] as Locale)) {
      segments[0] = nextLocale;
    } else {
      segments.unshift(nextLocale);
    }
    const query = searchParams.toString();
    return `/${segments.join("/")}${query ? `?${query}` : ""}`;
  };

  const nav = [
    { href: homePath(locale), label: t("goodIdeas.nav.home") },
    { href: productsPath(locale), label: t("goodIdeas.nav.products") },
    { href: blogPath(locale), label: t("goodIdeas.nav.blog") },
  ];

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-[rgba(11,15,20,0.88)] backdrop-blur-xl ${transitionClass} ${
        hidden ? "-translate-y-full" : "translate-y-0"
      }`}
    >
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6 md:py-3.5">
        <Link
          href={homePath(locale)}
          className={`group ${giType.brandLogo}`}
        >
          <GoodProductsBrandName
            locale={locale}
            prefixClassName="text-white transition-colors duration-200 group-hover:text-[#3B82F6]"
            suffixClassName="text-[#3B82F6] transition-colors duration-200 group-hover:text-white"
          />
        </Link>

        <nav
          className="hidden items-center gap-8 md:ml-[99px] md:flex"
          aria-label={t("goodIdeas.brandName")}
        >
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${giType.navLink} text-white hover:text-[var(--gi-primary)]`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <HeaderCurrencySwitcher variant="good-ideas" />
          <div className="flex items-center gap-0.5 rounded-full border border-white/10 px-1 py-0.5">
            {headerLocales.map((lang) => (
              <Link
                key={lang}
                href={buildLocaleHref(lang)}
                className={`rounded-full px-2.5 py-1 ${giType.navUtility} ${
                  lang === locale
                    ? "text-[var(--gi-primary)]"
                    : "text-white hover:text-[var(--gi-primary)]"
                }`}
              >
                {lang}
              </Link>
            ))}
          </div>

          <HeaderAccountMenu />

          <Link
            href={cartPath(locale)}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors duration-200 hover:bg-white/8 hover:text-[#3B82F6]"
            aria-label={`${t("goodIdeas.nav.cart")} (${totalItems})`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.65}
              stroke="currentColor"
              className="h-5 w-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
              />
            </svg>
            {totalItems > 0 ? (
              <span className={`absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--gi-primary)] px-0.5 ${giType.btnSm} text-white`}>
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
