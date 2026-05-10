"use client";

import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import { useEffect, useMemo, useRef, useState } from "react";
import { getAllCategories } from "@/lib/categories";
import { locales, type Locale } from "@/lib/i18n/config";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

/** Navegación: Inter, compacta, legible (sin display). */
const NAV_LINK =
  "font-sans text-[13px] font-medium tracking-[0.02em] text-charcoal transition-colors duration-200 hover:text-mountain-green";

const FLOAT_ISLAND =
  "rounded-full border border-black/[0.07] bg-white/70 shadow-[0_10px_36px_-18px_rgba(17,23,19,0.14)] backdrop-blur-xl supports-[backdrop-filter]:bg-white/58";

export default function Header() {
  const { totalItems } = useCart();
  const { isLoggedIn, user } = useUser();
  const { authOpen, setAuthOpen, openAuthModal, initialTab } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const categoriesCloseTimeout = useRef<NodeJS.Timeout | null>(null);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const currentQuery = searchParams.get("q") || "";
    setSearchQuery(currentQuery);
  }, [searchParams]);

  const openCategoriesMenu = () => {
    if (categoriesCloseTimeout.current) {
      clearTimeout(categoriesCloseTimeout.current);
      categoriesCloseTimeout.current = null;
    }
    setCategoriesOpen(true);
  };

  const scheduleCloseCategories = () => {
    if (categoriesCloseTimeout.current) {
      clearTimeout(categoriesCloseTimeout.current);
    }
    categoriesCloseTimeout.current = setTimeout(() => {
      setCategoriesOpen(false);
    }, 200);
  };

  const closeCategoriesMenu = () => {
    if (categoriesCloseTimeout.current) {
      clearTimeout(categoriesCloseTimeout.current);
      categoriesCloseTimeout.current = null;
    }
    setCategoriesOpen(false);
  };

  useEffect(() => {
    if (!categoriesOpen) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [categoriesOpen]);

  const { mainCategories, subCategoriesByParent } = useMemo(() => {
    const all = getAllCategories();
    const mains = all.filter((cat) => !cat.parentSlug);
    const subsByParent: Record<string, typeof all> = {};
    all.filter((cat) => cat.parentSlug).forEach((sub) => {
      const key = sub.parentSlug || "";
      if (!subsByParent[key]) {
        subsByParent[key] = [];
      }
      subsByParent[key].push(sub);
    });
    return { mainCategories: mains, subCategoriesByParent: subsByParent };
  }, []);

  const buildLocaleHref = (nextLocale: Locale) => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return `/${nextLocale}`;
    if (locales.includes(segments[0] as Locale)) {
      segments[0] = nextLocale;
    } else {
      segments.unshift(nextLocale);
    }
    const query = searchParams.toString();
    return `/${segments.join("/")}${query ? `?${query}` : ""}`;
  };

  const submitSearch = () => {
    const trimmed = searchQuery.trim();
    router.push(
      trimmed
        ? `/${locale}/products?q=${encodeURIComponent(trimmed)}`
        : `/${locale}/products`
    );
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  };

  const mobileNavLinkClass = `${NAV_LINK} rounded-md py-2 px-2`;

  const megaCatTitle =
    "font-sans text-[calc(1rem*1.05)] font-semibold tracking-[0.02em] text-dark-base hover:text-accent-gold transition-colors duration-200";

  const megaCatSub =
    "mb-2 block break-inside-avoid font-sans text-[calc(0.875rem*1.05)] text-muted-gray hover:text-dark-base transition-colors duration-200";

  const categoriesBackdropClass = "bg-black/45 backdrop-blur-sm";

  const categoriesPanelShell =
    "border-earth-brown/15 bg-soft-stone/98 shadow-[0_24px_56px_-20px_rgba(17,23,19,0.18)] ring-1 ring-earth-brown/10 backdrop-blur-md supports-[backdrop-filter]:bg-soft-stone/95";

  const searchInputClass =
    "font-sans h-9 w-full min-w-0 rounded-full border border-earth-brown/18 bg-white/90 pl-8 pr-3 text-[13px] text-charcoal placeholder:text-muted-gray/80 transition focus:border-accent-gold/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/30";

  return (
    <header className="pointer-events-none fixed left-0 right-0 top-0 z-50 font-sans">
      <div className="mx-auto max-w-7xl px-3 pt-3 sm:px-5 sm:pt-4">
        {/* Desktop: tres islas flotantes */}
        <div className="pointer-events-auto relative hidden w-full items-center justify-between md:flex">
          <nav
            className={`relative z-[3] ${FLOAT_ISLAND} flex items-center gap-1 px-2 py-2 lg:gap-1.5 lg:px-3`}
            aria-label="Principal"
          >
            <Link href={`/${locale}`} className={`${NAV_LINK} whitespace-nowrap px-2 py-1`}>
              {t("header.nav.home")}
            </Link>
            <Link href={`/${locale}/products`} className={`${NAV_LINK} whitespace-nowrap px-2 py-1`}>
              {t("header.nav.products")}
            </Link>
            <Link href={`/${locale}/blog`} className={`${NAV_LINK} whitespace-nowrap px-2 py-1`}>
              {t("header.nav.blog")}
            </Link>
            <div
              className="relative"
              onMouseEnter={openCategoriesMenu}
              onMouseLeave={scheduleCloseCategories}
            >
              <button
                type="button"
                className={`${NAV_LINK} cursor-pointer whitespace-nowrap border-0 bg-transparent px-2 py-1 text-left`}
                aria-expanded={categoriesOpen}
                aria-haspopup="true"
                aria-controls="header-categories-mega"
                onFocus={openCategoriesMenu}
                onBlur={scheduleCloseCategories}
              >
                {t("header.nav.categories")}
              </button>
            </div>
          </nav>

          <Link
            href={`/${locale}`}
            className="pointer-events-auto absolute left-1/2 top-1/2 z-[2] flex -translate-x-1/2 -translate-y-1/2 shrink-0 items-center group"
            aria-label="Go Natural"
          >
            <img
              src="/assets/images/logo/GONATURAL-LOGO.svg"
              alt="Go Natural"
              className="h-[3.9rem] w-auto max-w-[min(52vw,20rem)] opacity-[0.96] transition-transform duration-300 ease-out group-hover:scale-[1.04] md:h-[4.2rem] lg:h-[4.5rem]"
              loading="eager"
              decoding="async"
            />
          </Link>

          <div className={`relative z-[3] ${FLOAT_ISLAND} flex items-center gap-2 px-2 py-1.5 pl-3 lg:gap-2.5`}>
            <form
              className="hidden lg:block"
              onSubmit={(e) => {
                e.preventDefault();
                submitSearch();
              }}
              role="search"
            >
              <label htmlFor="header-search" className="sr-only">
                {t("common.searchLabel")}
              </label>
              <div className="relative w-[10.5rem] xl:w-[12rem]">
                <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-gray">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-3.5 w-3.5"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6.65 6.65a7.5 7.5 0 0 0 10.6 10.6Z"
                    />
                  </svg>
                </span>
                <input
                  id="header-search"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("common.searchPlaceholder")}
                  className={searchInputClass}
                />
              </div>
            </form>

            <form
              className="lg:hidden"
              onSubmit={(e) => {
                e.preventDefault();
                submitSearch();
              }}
              role="search"
            >
              <label htmlFor="header-search-md" className="sr-only">
                {t("common.searchLabel")}
              </label>
              <div className="relative w-[8.25rem] sm:w-[9rem]">
                <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-gray">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-3.5 w-3.5"
                    aria-hidden
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6.65 6.65a7.5 7.5 0 0 0 10.6 10.6Z"
                    />
                  </svg>
                </span>
                <input
                  id="header-search-md"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("common.searchPlaceholder")}
                  className={searchInputClass}
                />
              </div>
            </form>

            <div className="flex items-center gap-1 border-l border-earth-brown/15 pl-2 lg:gap-1.5 lg:pl-2.5">
              {locales.map((lang) => (
                <Link
                  key={lang}
                  href={buildLocaleHref(lang)}
                  className={`font-sans text-[11px] font-semibold tracking-[0.14em] transition-colors ${
                    lang === locale
                      ? "text-accent-gold"
                      : "text-muted-gray hover:text-charcoal"
                  }`}
                >
                  {lang.toUpperCase()}
                </Link>
              ))}
            </div>

            {isLoggedIn && user ? (
              <Link
                href={`/${locale}/account`}
                className={`${NAV_LINK} hidden max-w-[6.5rem] truncate font-semibold lg:inline lg:max-w-[8.5rem] xl:max-w-[10rem]`}
              >
                {t("header.greeting")}, {user.name}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => openAuthModal("login")}
                className={`${NAV_LINK} hidden font-semibold lg:inline`}
              >
                {t("header.account")}
              </button>
            )}

            <Link
              href={`/${locale}/cart`}
              className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-charcoal transition-colors hover:text-mountain-green"
              aria-label={`Cart with ${totalItems} items`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="h-[1.35rem] w-[1.35rem]"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.277M7.5 14.25l13.5-5.25M5.106 5.277c.194-1.01.937-1.777 1.936-1.777h13.916c.999 0 1.742.767 1.936 1.777M5.106 5.277L2.25 3m0 0h18.75M2.25 3v18m18.75-18v18"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent-gold px-1 font-sans text-[10px] font-semibold text-dark-base">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile */}
        <div className="pointer-events-auto flex flex-col gap-2 md:hidden">
          <div className="relative flex items-center justify-between gap-2">
            <button
              type="button"
              className="relative z-[3] flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/[0.07] bg-white/75 text-charcoal shadow-[0_8px_28px_-14px_rgba(17,23,19,0.18)] backdrop-blur-md transition-colors hover:text-mountain-green focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/45"
              onClick={() => {
                setMobileMenuOpen((o) => !o);
                setMobileSearchOpen(false);
              }}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>

            <Link
              href={`/${locale}`}
              className="pointer-events-auto absolute left-1/2 top-1/2 z-[2] flex -translate-x-1/2 -translate-y-1/2 items-center group"
              aria-label="Go Natural"
            >
              <img
                src="/assets/images/logo/GONATURAL-LOGO.svg"
                alt="Go Natural"
                className="h-[3.6rem] w-auto max-w-[46vw] opacity-[0.96] transition-transform group-hover:scale-[1.03]"
                loading="eager"
                decoding="async"
              />
            </Link>

            <div className="relative z-[3] flex shrink-0 items-center gap-1.5">
              <button
                type="button"
                className="flex h-11 w-11 items-center justify-center rounded-full border border-black/[0.07] bg-white/75 text-charcoal shadow-[0_8px_28px_-14px_rgba(17,23,19,0.18)] backdrop-blur-md hover:text-mountain-green focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/45"
                onClick={() => {
                  setMobileSearchOpen((o) => !o);
                  setMobileMenuOpen(false);
                }}
                aria-label={t("common.searchLabel")}
                aria-expanded={mobileSearchOpen}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6.65 6.65a7.5 7.5 0 0 0 10.6 10.6Z" />
                </svg>
              </button>
              <Link
                href={`/${locale}/cart`}
                className={`${FLOAT_ISLAND} relative flex h-11 w-11 items-center justify-center text-charcoal`}
                aria-label={`Cart with ${totalItems} items`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-[1.35rem] w-[1.35rem]">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.277M7.5 14.25l13.5-5.25M5.106 5.277c.194-1.01.937-1.777 1.936-1.777h13.916c.999 0 1.742.767 1.936 1.777M5.106 5.277L2.25 3m0 0h18.75M2.25 3v18m18.75-18v18" />
                </svg>
                {totalItems > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent-gold px-1 font-sans text-[10px] font-semibold text-dark-base">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Link>
            </div>
          </div>

          {mobileSearchOpen ? (
            <form
              className={`${FLOAT_ISLAND} flex px-3 py-2`}
              onSubmit={(e) => {
                e.preventDefault();
                submitSearch();
              }}
              role="search"
            >
              <label htmlFor="header-search-mobile-bar" className="sr-only">
                {t("common.searchLabel")}
              </label>
              <div className="relative w-full">
                <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-gray">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="h-4 w-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-4.35-4.35m0 0A7.5 7.5 0 1 0 6.65 6.65a7.5 7.5 0 0 0 10.6 10.6Z" />
                  </svg>
                </span>
                <input
                  id="header-search-mobile-bar"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={t("common.searchPlaceholder")}
                  className="font-sans h-10 w-full rounded-full border border-earth-brown/18 bg-white/95 py-2 pl-10 pr-3 text-sm text-charcoal placeholder:text-muted-gray focus:border-accent-gold/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/30"
                  autoFocus
                />
              </div>
            </form>
          ) : null}
        </div>

        {/* Mega menu backdrop */}
        <div
          className={[
            "pointer-events-auto fixed inset-0 z-[38] transition-all duration-200 ease-out",
            categoriesBackdropClass,
            categoriesOpen ? "opacity-100" : "pointer-events-none invisible opacity-0",
          ].join(" ")}
          aria-hidden={!categoriesOpen}
          onClick={closeCategoriesMenu}
        />

        <div
          id="header-categories-mega"
          className={[
            "pointer-events-auto fixed inset-x-0 bottom-0 z-40 border-t transition-all duration-200 ease-out",
            "top-[6.75rem] md:top-[7.25rem]",
            "overflow-y-auto overscroll-contain",
            categoriesPanelShell,
            categoriesOpen ? "opacity-100" : "pointer-events-none invisible opacity-0",
          ].join(" ")}
          onMouseEnter={openCategoriesMenu}
          onMouseLeave={scheduleCloseCategories}
          aria-hidden={!categoriesOpen}
        >
          <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
            <div className="columns-1 gap-x-16 gap-y-10 sm:columns-2 lg:columns-3 xl:columns-4">
              {mainCategories.map((category) => (
                <div key={category.slug} className="mb-10 break-inside-avoid">
                  <Link
                    href={`/${locale}/category/${category.slug}`}
                    className={megaCatTitle}
                    onClick={closeCategoriesMenu}
                  >
                    {t(`categories.names.${category.slug}`, category.name)}
                  </Link>
                  <div className="mt-3 space-y-2">
                    {(subCategoriesByParent[category.slug] || []).map((sub) => (
                      <Link
                        key={sub.slug}
                        href={`/${locale}/category/${sub.slug}`}
                        className={megaCatSub}
                        onClick={closeCategoriesMenu}
                      >
                        {t(`categories.names.${sub.slug}`, sub.name)}
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile sheet menu */}
        {mobileMenuOpen ? (
          <nav className="pointer-events-auto mt-2 rounded-2xl border border-earth-brown/18 bg-soft-stone/98 p-4 shadow-[0_20px_50px_-24px_rgba(17,23,19,0.2)] ring-1 ring-earth-brown/10 backdrop-blur-md md:hidden">
            <div className="flex flex-col gap-3">
              <Link href={`/${locale}`} className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
                {t("header.nav.home")}
              </Link>
              <Link href={`/${locale}/products`} className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
                {t("header.nav.products")}
              </Link>
              <Link href={`/${locale}/blog`} className={mobileNavLinkClass} onClick={() => setMobileMenuOpen(false)}>
                {t("header.nav.blog")}
              </Link>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className={`flex w-full items-center justify-between ${mobileNavLinkClass}`}
                  onClick={() => setMobileCategoriesOpen((open) => !open)}
                  aria-expanded={mobileCategoriesOpen}
                  aria-controls="mobile-categories-menu"
                >
                  <span>{t("header.nav.categories")}</span>
                  <span className="font-sans text-[13px] text-muted-gray">{mobileCategoriesOpen ? "−" : "+"}</span>
                </button>
                {mobileCategoriesOpen ? (
                  <div id="mobile-categories-menu" className="space-y-4 border-l border-earth-brown/20 pl-3">
                    {mainCategories.map((category) => (
                      <div key={category.slug} className="space-y-2">
                        <Link
                          href={`/${locale}/category/${category.slug}`}
                          className="font-sans text-[13px] font-semibold text-dark-base hover:text-accent-gold"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {t(`categories.names.${category.slug}`, category.name)}
                        </Link>
                        <div className="flex flex-col gap-1">
                          {(subCategoriesByParent[category.slug] || []).map((sub) => (
                            <Link
                              key={sub.slug}
                              href={`/${locale}/category/${sub.slug}`}
                              className="font-sans text-[13px] text-muted-gray hover:text-dark-base"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {t(`categories.names.${sub.slug}`, sub.name)}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : null}
              </div>
              <div className="flex flex-wrap items-center gap-3 border-t border-earth-brown/20 pt-3">
                {locales.map((lang) => (
                  <Link
                    key={lang}
                    href={buildLocaleHref(lang)}
                    className={`font-sans text-[12px] font-semibold tracking-[0.12em] transition-colors ${
                      lang === locale ? "text-accent-gold" : "text-muted-gray hover:text-dark-base"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </Link>
                ))}
                {isLoggedIn && user ? (
                  <Link
                    href={`/${locale}/account`}
                    className={`${mobileNavLinkClass} font-semibold`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("header.greeting")}, {user.name}
                  </Link>
                ) : (
                  <Link
                    href={`/${locale}/auth?tab=login`}
                    className={`${mobileNavLinkClass} font-semibold`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("header.account")}
                  </Link>
                )}
              </div>
            </div>
          </nav>
        ) : null}
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialTab={initialTab} />
    </header>
  );
}
