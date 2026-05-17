"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { locales, type Locale } from "@/lib/i18n/config";
import { brandGatewayPath } from "@/lib/routing/brands";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";

export default function GoodIdeasHeader() {
  const locale = useLocale();
  const t = useTranslations();
  const { totalItems } = useCart();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const buildLocaleHref = (nextLocale: Locale) => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return `/${nextLocale}/good-ideas`;
    if (locales.includes(segments[0] as Locale)) {
      segments[0] = nextLocale;
    } else {
      segments.unshift(nextLocale);
    }
    const query = searchParams.toString();
    return `/${segments.join("/")}${query ? `?${query}` : ""}`;
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-[rgba(11,15,20,0.88)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-3 sm:px-6 md:py-3.5">
        <Link
          href={`/${locale}/good-ideas`}
          className="font-tan-nimbus text-[1.35rem] tracking-[-0.02em] text-[#E8ECF1] transition-opacity hover:opacity-90"
        >
          Good Ideas
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <span className="font-inter text-[12px] font-medium uppercase tracking-[0.14em] text-white/40">
            {t("goodIdeas.nav.productsSoon")}
          </span>
          <Link
            href={brandGatewayPath(locale)}
            className="font-inter text-[12px] font-medium uppercase tracking-[0.14em] text-white/55 transition-colors hover:text-white"
          >
            {t("goodIdeas.nav.allBrands")}
          </Link>
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-0.5 rounded-full border border-white/10 px-1 py-0.5">
            {locales.map((lang) => (
              <Link
                key={lang}
                href={buildLocaleHref(lang)}
                className={`rounded-full px-2 py-1 font-inter text-[10px] font-semibold uppercase tracking-[0.12em] ${
                  lang === locale ? "bg-white/12 text-white" : "text-white/45 hover:text-white/80"
                }`}
              >
                {lang}
              </Link>
            ))}
          </div>

          <Link
            href={`/${locale}/cart`}
            className="relative flex h-10 w-10 items-center justify-center rounded-full text-white/70 transition hover:bg-white/8 hover:text-white"
            aria-label={`Cart (${totalItems})`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.65} stroke="currentColor" className="h-5 w-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            {totalItems > 0 ? (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#3B82F6] px-0.5 text-[9px] font-semibold text-white">
                {totalItems > 99 ? "99+" : totalItems}
              </span>
            ) : null}
          </Link>
        </div>
      </div>
    </header>
  );
}
