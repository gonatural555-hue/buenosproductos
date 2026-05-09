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

/** ~15 % más grande que `text-sm` (0.875rem) */
const NAV_TEXT =
  "text-[calc(0.875rem*1.15)] font-medium transition-colors duration-200";

export default function Header() {
  const { totalItems } = useCart();
  const { isLoggedIn, user } = useUser();
  const { authOpen, setAuthOpen, openAuthModal, initialTab } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
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
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 80);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
  };

  /** Solo ficha de producto `/[locale]/products/[id]` — header claro para leer sobre fondo blanco. */
  const isProductDetailPage = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    return (
      segments.length === 3 &&
      segments[0] === locale &&
      segments[1] === "products" &&
      segments[2].length > 0
    );
  }, [pathname, locale]);

  /** Home, listado de productos, blog y contacto: misma barra semitransparente que el hero. */
  const isDarkHeroHeader = useMemo(() => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return false;
    if (segments[0] !== locale) return false;
    if (isProductDetailPage) return false;
    if (segments.length === 1) return true;
    const section = segments[1];
    if (section === "home-2" && segments.length === 2) return true;
    if (section === "products" && segments.length === 2) return true;
    if (section === "blog") return true;
    if (section === "contact" && segments.length === 2) return true;
    return false;
  }, [pathname, locale, isProductDetailPage]);

  const navLinkClass = isProductDetailPage
    ? `${NAV_TEXT} text-neutral-900 hover:text-neutral-600`
    : `${NAV_TEXT} text-white hover:text-white/80`;

  const mobileNavLinkClass = isProductDetailPage
    ? `${NAV_TEXT} rounded-md py-2 px-2 text-neutral-900 transition-colors hover:text-neutral-600`
    : `${NAV_TEXT} rounded-md py-2 px-2 text-white transition-colors hover:text-white/85`;

  const megaCatTitle = isProductDetailPage
    ? "text-[calc(1rem*1.15)] font-semibold tracking-[0.02em] text-neutral-900 hover:text-accent-gold transition-colors duration-200"
    : "text-[calc(1rem*1.15)] font-semibold tracking-[0.02em] text-white hover:text-accent-gold transition-colors duration-200";

  const megaCatSub = isProductDetailPage
    ? "mb-2 block break-inside-avoid text-[calc(0.875rem*1.15)] text-neutral-700 hover:text-neutral-900 transition-colors duration-200"
    : "mb-2 block break-inside-avoid text-[calc(0.875rem*1.15)] text-white/90 hover:text-white transition-colors duration-200";

  const categoriesBackdropClass = isProductDetailPage
    ? "bg-neutral-900/35 backdrop-blur-[2px]"
    : "bg-black/55 backdrop-blur-sm";

  const categoriesPanelShell = isProductDetailPage
    ? "border-neutral-200 bg-white/96 shadow-[0_14px_44px_rgba(0,0,0,0.12)] ring-1 ring-black/[0.04] backdrop-blur-md supports-[backdrop-filter]:bg-white/92"
    : "border-white/10 bg-dark-base/88 shadow-[0_20px_56px_rgba(0,0,0,0.5)] ring-1 ring-white/[0.06] backdrop-blur-xl supports-[backdrop-filter]:bg-dark-base/82";

  return (
    <header
      className={[
        "fixed top-0 z-50 w-full transition-all duration-300 ease-out",
        isScrolled
          ? isProductDetailPage
            ? "bg-white border-b border-neutral-200 shadow-sm"
            : "bg-dark-base border-b border-white/10 shadow-[0_8px_24px_rgba(0,0,0,0.25)]"
          : isProductDetailPage
            ? "bg-transparent"
            : isDarkHeroHeader
              ? "border-b border-white/[0.08] bg-dark-base/50 shadow-[0_4px_28px_rgba(0,0,0,0.22)] backdrop-blur-md supports-[backdrop-filter]:bg-dark-base/[0.42]"
              : "bg-transparent",
      ].join(" ")}
    >
      <div className="mx-auto max-w-7xl px-3 sm:px-5 lg:px-6">
        <div
          className={[
            "relative z-[45] grid h-16 items-center gap-x-2 sm:gap-x-3",
            "grid-cols-[auto_minmax(0,1fr)_auto]",
            "md:h-20 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] md:gap-x-4 lg:gap-x-5",
          ].join(" ")}
        >
          {/* Izquierda: hamburguesa (móvil) + nav pegado al borde izquierdo */}
          <div className="flex min-w-0 items-center justify-start gap-1 sm:gap-2 md:gap-3 md:pl-0">
            <button
              type="button"
              className={[
                "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/50 md:hidden",
                isProductDetailPage
                  ? "text-neutral-900 hover:text-neutral-600"
                  : "text-white hover:text-white/80",
              ].join(" ")}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>

            <nav
              className="hidden min-w-0 items-center justify-start gap-4 md:flex lg:gap-5 xl:gap-6"
              aria-label="Principal"
            >
              <Link href={`/${locale}`} className={navLinkClass}>
                {t("header.nav.home")}
              </Link>
              <Link href={`/${locale}/home-2`} className={navLinkClass}>
                {t("header.nav.home2")}
              </Link>
              <Link href={`/${locale}/products`} className={navLinkClass}>
                {t("header.nav.products")}
              </Link>
              <Link href={`/${locale}/blog`} className={navLinkClass}>
                {t("header.nav.blog")}
              </Link>
              <div
                className="relative"
                onMouseEnter={openCategoriesMenu}
                onMouseLeave={scheduleCloseCategories}
              >
                <button
                  type="button"
                  className={[
                    navLinkClass,
                    "cursor-pointer border-0 bg-transparent p-0 text-left",
                  ].join(" ")}
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
          </div>

          {/* Centro: logo */}
          <div className="flex min-w-0 justify-center justify-self-center px-1 sm:px-2">
            <Link
              href={`/${locale}`}
              className="group flex shrink-0 items-center"
              aria-label="Go Natural"
            >
              <img
                src="/assets/images/logo/GONATURAL-LOGO.svg"
                alt="Go Natural"
                className="h-11 w-auto opacity-95 transition-transform duration-300 ease-out group-hover:scale-[1.06] sm:h-12 md:h-14 lg:h-16"
                loading="lazy"
                decoding="async"
              />
            </Link>
          </div>

          {/* Derecha: búsqueda + idiomas + cuenta + carrito */}
          <div className="flex min-w-0 items-center justify-end gap-2 sm:gap-2.5 md:justify-start md:gap-3 md:pl-2 lg:gap-4">
            <form
              className="hidden w-[min(100%,11rem)] shrink-0 sm:w-[min(100%,12.5rem)] md:flex md:w-[min(100%,13rem)] md:items-center lg:w-[min(100%,14rem)]"
              onSubmit={(event) => {
                event.preventDefault();
                submitSearch();
              }}
              role="search"
            >
              <label htmlFor="header-search" className="sr-only">
                {t("common.searchLabel")}
              </label>
              <div className="relative w-full">
                <span
                  className={
                    isProductDetailPage
                      ? "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                      : "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
                  }
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="h-4 w-4"
                    aria-hidden="true"
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
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder={t("common.searchPlaceholder")}
                  className={
                    isProductDetailPage
                      ? `w-full rounded-full border border-neutral-200 bg-white py-2.5 pl-9 pr-3 ${NAV_TEXT} text-neutral-900 placeholder:text-neutral-400 transition-colors duration-200 ease-out focus:border-accent-gold/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/40`
                      : `w-full rounded-full border border-white/15 bg-dark-base py-2.5 pl-9 pr-3 ${NAV_TEXT} text-white placeholder:text-white/45 transition-colors duration-200 ease-out focus:border-accent-gold/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/40`
                  }
                />
              </div>
            </form>

            <div className="hidden items-center gap-2 md:flex md:gap-3">
              {locales.map((lang) => (
                <Link
                  key={lang}
                  href={buildLocaleHref(lang)}
                  className={`${NAV_TEXT} font-semibold tracking-[0.12em] transition-colors duration-200 ${
                    lang === locale
                      ? "text-accent-gold"
                      : isProductDetailPage
                        ? "text-neutral-500 hover:text-neutral-800"
                        : "text-white/70 hover:text-white"
                  }`}
                >
                  {lang.toUpperCase()}
                </Link>
              ))}
            </div>
            {isLoggedIn && user ? (
              <Link
                href={`/${locale}/account`}
                className={`hidden md:inline ${navLinkClass} font-semibold hover:text-accent-gold`}
              >
                {t("header.greeting")}, {user.name}
              </Link>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => openAuthModal("login")}
                  className={`hidden md:inline ${navLinkClass} font-semibold hover:text-accent-gold`}
                >
                  {t("header.account")}
                </button>
                <Link
                  href={`/${locale}/auth?tab=login`}
                  className={`md:hidden ${navLinkClass} font-semibold`}
                >
                  {t("header.account")}
                </Link>
              </>
            )}
            <Link
              href={`/${locale}/cart`}
              className={
                isProductDetailPage
                  ? "relative flex h-10 w-10 shrink-0 items-center justify-center text-neutral-900 transition-colors hover:text-neutral-600"
                  : "relative flex h-10 w-10 shrink-0 items-center justify-center text-white transition-colors hover:text-white/80"
              }
              aria-label={`Cart with ${totalItems} items`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.277M7.5 14.25l13.5-5.25M5.106 5.277c.194-1.01.937-1.777 1.936-1.777h13.916c.999 0 1.742.767 1.936 1.777M5.106 5.277L2.25 3m0 0h18.75M2.25 3v18m18.75-18v18"
                />
              </svg>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-accent-gold px-1.5 text-xs font-medium text-dark-base">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>
            {!isLoggedIn && (
              <Link
                href={`/${locale}/auth?tab=login`}
                className={
                  isProductDetailPage
                    ? "flex h-10 w-10 shrink-0 items-center justify-center text-neutral-900 transition-colors hover:text-neutral-600 md:hidden"
                    : "flex h-10 w-10 shrink-0 items-center justify-center text-white transition-colors hover:text-white/80 md:hidden"
                }
                aria-label={t("header.account")}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 7.5a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.5 20.25a7.5 7.5 0 0 1 15 0v.75H4.5v-.75Z"
                  />
                </svg>
              </Link>
            )}
          </div>
        </div>

        {/* Scrim a pantalla completa; el panel de categorías va encima (z-40) */}
        <div
          className={[
            "fixed inset-0 z-[38] transition-all duration-200 ease-out",
            categoriesBackdropClass,
            categoriesOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none invisible opacity-0",
          ].join(" ")}
          aria-hidden={!categoriesOpen}
          onClick={closeCategoriesMenu}
        />

        {/* Mega categorías: fondo ancho completo del viewport bajo el header */}
        <div
          id="header-categories-mega"
          className={[
            "fixed inset-x-0 bottom-0 z-40 border-t transition-all duration-200 ease-out",
            "top-16 md:top-20",
            "overflow-y-auto overscroll-contain",
            categoriesPanelShell,
            categoriesOpen
              ? "pointer-events-auto opacity-100"
              : "pointer-events-none invisible opacity-0",
          ].join(" ")}
          onMouseEnter={openCategoriesMenu}
          onMouseLeave={scheduleCloseCategories}
          aria-hidden={!categoriesOpen}
        >
          <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
            <div className="columns-1 gap-x-16 gap-y-10 sm:columns-2 lg:columns-3 xl:columns-4">
              {mainCategories.map((category) => (
                <div
                  key={category.slug}
                  className="mb-10 break-inside-avoid"
                >
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

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <nav
            className={
              isProductDetailPage
                ? "md:hidden pb-4 mt-2 pt-4 bg-white rounded-b-2xl border border-neutral-200 shadow-md ring-1 ring-black/[0.04]"
                : "md:hidden pb-4 mt-2 pt-4 bg-dark-base rounded-b-2xl border border-white/10 shadow-[0_12px_32px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.06]"
            }
          >
            <div className="flex flex-col gap-3">
              <form
                className="flex items-center gap-2 px-1"
                onSubmit={(event) => {
                  event.preventDefault();
                  submitSearch();
                }}
                role="search"
              >
                <label htmlFor="header-search-mobile" className="sr-only">
                  {t("common.searchLabel")}
                </label>
                <div className="relative flex-1">
                  <span
                    className={
                      isProductDetailPage
                        ? "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
                        : "pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-white/50"
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-4 w-4"
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
                    id="header-search-mobile"
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={t("common.searchPlaceholder")}
                    className={
                      isProductDetailPage
                        ? `w-full rounded-full border border-neutral-200 bg-white py-2.5 pl-9 pr-3 ${NAV_TEXT} text-neutral-900 placeholder:text-neutral-400 focus:border-accent-gold/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/40`
                        : `w-full rounded-full border border-white/15 bg-dark-base py-2.5 pl-9 pr-3 ${NAV_TEXT} text-white placeholder:text-white/45 focus:border-accent-gold/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/40`
                    }
                  />
                </div>
              </form>
              <Link
                href={`/${locale}`}
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("header.nav.home")}
              </Link>
              <Link
                href={`/${locale}/home-2`}
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("header.nav.home2")}
              </Link>
              <Link
                href={`/${locale}/products`}
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("header.nav.products")}
              </Link>
              <Link
                href={`/${locale}/blog`}
                className={mobileNavLinkClass}
                onClick={() => setMobileMenuOpen(false)}
              >
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
                  <span
                    className={
                      isProductDetailPage
                        ? `${NAV_TEXT} text-neutral-500`
                        : `${NAV_TEXT} text-white/60`
                    }
                  >
                    {mobileCategoriesOpen ? "−" : "+"}
                  </span>
                </button>
                {mobileCategoriesOpen && (
                  <div
                    id="mobile-categories-menu"
                    className={
                      isProductDetailPage
                        ? "pl-3 border-l border-neutral-200 space-y-4"
                        : "pl-3 border-l border-white/10 space-y-4"
                    }
                  >
                    {mainCategories.map((category) => (
                      <div key={category.slug} className="space-y-2">
                        <Link
                          href={`/${locale}/category/${category.slug}`}
                          className={`${NAV_TEXT} font-semibold ${
                            isProductDetailPage
                              ? "text-neutral-900 hover:text-accent-gold"
                              : "text-white hover:text-accent-gold"
                          }`}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {t(`categories.names.${category.slug}`, category.name)}
                        </Link>
                        <div className="flex flex-col gap-1">
                          {(subCategoriesByParent[category.slug] || []).map(
                            (sub) => (
                              <Link
                                key={sub.slug}
                                href={`/${locale}/category/${sub.slug}`}
                                className={
                                  isProductDetailPage
                                    ? `${NAV_TEXT} text-neutral-700 hover:text-neutral-900`
                                    : `${NAV_TEXT} text-white/90 hover:text-white`
                                }
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {t(`categories.names.${sub.slug}`, sub.name)}
                              </Link>
                            )
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div
                className={
                  isProductDetailPage
                    ? "flex flex-wrap items-center gap-3 border-t border-neutral-200 pt-3"
                    : "flex flex-wrap items-center gap-3 border-t border-white/10 pt-3"
                }
              >
                {locales.map((lang) => (
                  <Link
                    key={lang}
                    href={buildLocaleHref(lang)}
                    className={`${NAV_TEXT} font-semibold transition-colors duration-200 ${
                      lang === locale
                        ? "text-accent-gold"
                        : isProductDetailPage
                          ? "text-neutral-500 hover:text-neutral-800"
                          : "text-white/70 hover:text-white"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </Link>
                ))}
                {isLoggedIn && user ? (
                  <Link
                    href={`/${locale}/account`}
                    className={`${navLinkClass} font-semibold hover:text-accent-gold`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("header.greeting")}, {user.name}
                  </Link>
                ) : (
                  <Link
                    href={`/${locale}/auth?tab=login`}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`${navLinkClass} font-semibold hover:text-accent-gold`}
                  >
                    {t("header.account")}
                  </Link>
                )}
              </div>
            </div>
          </nav>
        )}
      </div>
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialTab={initialTab} />
    </header>
  );
}
