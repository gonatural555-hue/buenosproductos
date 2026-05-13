"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { getAllCategories } from "@/lib/categories";
import { locales, type Locale } from "@/lib/i18n/config";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { usePathname, useSearchParams } from "next/navigation";

/**
 * Barra flotante **sin** pastilla contenedora (sin fondo/borde/sombra envolviendo todo el header).
 * Criterio de producto: no reintroducir un envoltorio tipo píldora alrededor de la fila del header.
 */
const HEADER_FLOAT_ROW =
  "relative flex min-h-[10rem] w-full max-w-[1440px] items-center py-2 md:min-h-[10.5rem] md:py-2.5";

const NAV_LINK_HEADER_DESKTOP =
  "whitespace-nowrap text-[12px] font-semibold uppercase tracking-[0.18em] text-[rgba(46,74,54,0.65)] transition-colors duration-200 hover:text-[#2E4A36]";

const LOCALE_FLOAT =
  "rounded-full px-2 py-1.5 font-inter text-[11px] font-semibold uppercase tracking-[0.16em] text-[rgba(46,74,54,0.65)] transition-colors hover:bg-[rgba(46,74,54,0.06)] hover:text-[#2E4A36] md:text-[12px] md:tracking-[0.18em]";

const ICON_GHOST =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[rgba(46,74,54,0.65)] transition-colors hover:bg-[rgba(46,74,54,0.06)] hover:text-[#2E4A36]";

/** Hoja menú móvil — enlaces con jerarquía cromática existente. */
const NAV_LINK =
  "font-inter text-[0.8125rem] font-semibold tracking-[0.04em] text-charcoal transition-opacity duration-200 hover:opacity-80 sm:text-[0.875rem]";

const logoEase = [0.22, 1, 0.36, 1] as const;

function BrandLogoLink({
  locale,
  alt,
  imageClassName,
}: {
  locale: Locale;
  alt: string;
  imageClassName: string;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  return (
    <motion.div
      className="flex shrink-0 justify-center will-change-transform"
      initial={reduceMotion ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.85,
        ease: logoEase,
        delay: reduceMotion ? 0 : 0.06,
      }}
      whileHover={
        reduceMotion
          ? undefined
          : {
              scale: 1.06,
              y: -3,
              transition: { duration: 0.3, ease: logoEase },
            }
      }
      whileTap={reduceMotion ? undefined : { scale: 0.98, transition: { duration: 0.15, ease: logoEase } }}
    >
      <Link
        href={`/${locale}`}
        className="relative block rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[#F4EBDD]"
        aria-label={alt}
      >
        <Image
          src="/assets/images/logo/LOGO-GONATURAL.png"
          alt={alt}
          width={640}
          height={256}
          priority
          draggable={false}
          className={`${imageClassName} drop-shadow-[0_6px_20px_rgba(46,74,54,0.08)]`}
        />
      </Link>
    </motion.div>
  );
}

function userInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const a = parts[0]?.[0] ?? "?";
  const b = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? "" : parts[0]?.[1] ?? "";
  return (a + b).toUpperCase().slice(0, 2);
}

export default function Header() {
  const { totalItems } = useCart();
  const { isLoggedIn, user } = useUser();
  const { authOpen, setAuthOpen, openAuthModal, initialTab } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const categoriesCloseTimeout = useRef<NodeJS.Timeout | null>(null);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  /** Ancla el bloque al viewport (encima del hero): evita que un ancestro con transform rompa `fixed`. */
  const [headerPortalRoot, setHeaderPortalRoot] = useState<HTMLElement | null>(null);
  useLayoutEffect(() => {
    const id = "gn-header-fixed-root";
    let el = document.getElementById(id) as HTMLElement | null;
    if (!el) {
      el = document.createElement("div");
      el.id = id;
      document.body.insertAdjacentElement("afterbegin", el);
    }
    setHeaderPortalRoot(el);
  }, []);

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

  const mobileNavLinkClass = `${NAV_LINK} rounded-md py-2 px-2 text-charcoal`;
  const mobileNavHome = `${NAV_LINK} rounded-md py-2 px-2 text-[#2A2E4B]`;
  const mobileNavProducts = `${NAV_LINK} rounded-md py-2 px-2 text-[#6E1F28]`;
  const mobileNavBlog = `${NAV_LINK} rounded-md py-2 px-2 text-[#C9622B]`;
  const mobileNavCategories = `${NAV_LINK} rounded-md py-2 px-2 text-[#D9A441]`;

  const megaCatTitle =
    "font-inter text-[calc(1rem*1.05)] font-semibold tracking-[0.05em] text-dark-base hover:text-accent-gold transition-colors duration-200";

  const megaCatSub =
    "mb-2 block break-inside-avoid font-inter text-[calc(0.875rem*1.05)] font-medium tracking-[0.02em] text-muted-gray hover:text-dark-base transition-colors duration-200";

  const categoriesBackdropClass = "bg-black/45 backdrop-blur-sm";

  const categoriesPanelShell =
    "border-earth-brown/15 bg-soft-stone/98 shadow-[0_24px_56px_-20px_rgba(17,23,19,0.18)] ring-1 ring-earth-brown/10 backdrop-blur-md supports-[backdrop-filter]:bg-soft-stone/95";

  /** Carrito reconocible (cesta + ruedas), trazo clásico tipo carrito de compras */
  const cartIcon = (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.75}
      stroke="currentColor"
      className="h-[1.35rem] w-[1.35rem]"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.5 3.5h3l2.2 10.4a2 2 0 0 0 2 1.6h7.1a2 2 0 0 0 2-1.6l1.7-8.4H6.1"
      />
      <circle cx="9" cy="20" r="1.25" />
      <circle cx="18" cy="20" r="1.25" />
    </svg>
  );

  const headerUi = (
    <header className="pointer-events-none !fixed inset-x-0 top-0 z-50 w-full font-inter">
      <div className="mx-auto w-full max-w-[1440px] px-[18px] pt-6 md:px-7 lg:px-12">
        {/* Desktop: idiomas a la izquierda; Home/Blog al borde interior (junto al logo); Products/Categories + utilidades */}
        <div className={`${HEADER_FLOAT_ROW} pointer-events-auto hidden w-full md:flex`}>
          <div className="flex min-h-0 min-w-0 flex-1 items-center pr-[calc(9.5rem+8px)] md:pr-[calc(10rem+10px)] lg:pr-[calc(10.5rem+12px)]">
            <nav
              className="flex shrink-0 items-center gap-0.5"
              aria-label={t("header.localeNavAria")}
            >
              {locales.map((lang) => (
                <Link
                  key={lang}
                  href={buildLocaleHref(lang)}
                  className={`${LOCALE_FLOAT} ${
                    lang === locale ? "bg-[rgba(46,74,54,0.1)] text-[#2E4A36]" : ""
                  }`}
                >
                  {lang.toUpperCase()}
                </Link>
              ))}
            </nav>
            <div className="flex min-h-0 min-w-0 flex-1 items-center justify-end">
              <nav
                className="flex shrink-0 items-center gap-4 md:gap-5 lg:gap-6"
                aria-label={`${t("header.nav.home")}, ${t("header.nav.blog")}`}
              >
                <Link href={`/${locale}`} className={`${NAV_LINK_HEADER_DESKTOP} font-inter`}>
                  {t("header.nav.home")}
                </Link>
                <Link href={`/${locale}/blog`} className={`${NAV_LINK_HEADER_DESKTOP} font-inter`}>
                  {t("header.nav.blog")}
                </Link>
              </nav>
            </div>
          </div>

          <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
            <div className="pointer-events-auto">
              <BrandLogoLink
                locale={locale}
                alt={t("header.logoAlt")}
                imageClassName="h-[7.5rem] w-auto max-h-[8rem] max-w-[min(28vw,16.5rem)] object-contain object-center md:h-[8rem] md:max-h-[8.5rem] md:max-w-[18rem] lg:max-h-[9rem] lg:max-w-[19rem]"
              />
            </div>
          </div>

          <div className="flex min-h-0 min-w-0 flex-1 items-center justify-start gap-2 pl-[calc(9.5rem+8px)] md:gap-3 md:pl-[calc(10rem+10px)] lg:pl-[calc(10.5rem+12px)]">
            <nav
              className="flex min-w-0 shrink-0 items-center gap-4 md:gap-5 lg:gap-6"
              aria-label={`${t("header.nav.products")}, ${t("header.nav.categories")}`}
            >
              <Link href={`/${locale}/products`} className={`${NAV_LINK_HEADER_DESKTOP} font-inter`}>
                {t("header.nav.products")}
              </Link>
              <div
                className="relative"
                onMouseEnter={openCategoriesMenu}
                onMouseLeave={scheduleCloseCategories}
              >
                <button
                  type="button"
                  className={`${NAV_LINK_HEADER_DESKTOP} cursor-pointer border-0 bg-transparent font-inter text-left`}
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

            <div className="ml-auto flex shrink-0 items-center gap-1 lg:gap-2">
              <Link
                href={`/${locale}/cart`}
                className={`${ICON_GHOST} relative`}
                aria-label={`Cart with ${totalItems} items`}
              >
                {cartIcon}
                {totalItems > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#D9A441] px-0.5 font-inter text-[9px] font-semibold text-[#2E4A36]">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </Link>

              {isLoggedIn && user ? (
                <Link
                  href={`/${locale}/account`}
                  className="flex max-w-[9.5rem] shrink-0 items-center gap-2 rounded-full border border-transparent py-1.5 pl-2.5 pr-1.5 font-inter text-[12px] font-semibold uppercase tracking-[0.14em] text-[rgba(46,74,54,0.65)] transition-colors hover:border-[rgba(46,74,54,0.08)] hover:bg-[rgba(46,74,54,0.04)] hover:text-[#2E4A36]"
                >
                  <span className="truncate">{user.name}</span>
                  <span
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#2E4A36] to-[#1e3228] font-inter text-[10px] font-semibold uppercase tracking-wide text-[#F4EBDD] shadow-inner"
                    aria-hidden
                  >
                    {userInitials(user.name)}
                  </span>
                </Link>
              ) : (
                <button
                  type="button"
                  onClick={() => openAuthModal("login")}
                  className="shrink-0 rounded-full border border-transparent px-3 py-2 font-inter text-[12px] font-semibold uppercase tracking-[0.18em] text-[rgba(46,74,54,0.65)] transition-colors hover:border-[rgba(46,74,54,0.08)] hover:bg-[rgba(46,74,54,0.04)] hover:text-[#2E4A36] lg:px-4"
                >
                  {t("header.account")}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile — sin pastilla contenedora */}
        <div
          className={`${HEADER_FLOAT_ROW} pointer-events-auto flex w-full items-center justify-between gap-2 md:hidden`}
        >
          <nav
            className="flex shrink-0 items-center gap-0.5"
            aria-label={t("header.localeNavAria")}
          >
            {locales.map((lang) => (
              <Link
                key={lang}
                href={buildLocaleHref(lang)}
                className={`${LOCALE_FLOAT} px-1.5 py-1 text-[10px] ${
                  lang === locale ? "bg-[rgba(46,74,54,0.1)] text-[#2E4A36]" : ""
                }`}
              >
                {lang.toUpperCase()}
              </Link>
            ))}
          </nav>

          <div className="flex min-w-0 flex-1 justify-center px-1">
            <BrandLogoLink
              locale={locale}
              alt={t("header.logoAlt")}
              imageClassName="h-[8.5rem] w-auto max-w-[min(48vw,20rem)] object-contain object-center"
            />
          </div>

          <div className="flex shrink-0 items-center gap-1">
            <button
              type="button"
              className={ICON_GHOST}
              onClick={() => {
                setMobileMenuOpen((o) => !o);
              }}
              aria-label="Toggle menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="h-5 w-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>

            <Link href={`/${locale}/cart`} className={`${ICON_GHOST} relative`} aria-label={`Cart with ${totalItems} items`}>
              {cartIcon}
              {totalItems > 0 && (
                <span className="absolute -right-0.5 -top-0.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#D9A441] px-0.5 font-inter text-[9px] font-semibold text-[#2E4A36]">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
            </Link>

            {isLoggedIn && user ? (
              <Link
                href={`/${locale}/account`}
                className={`${ICON_GHOST} relative`}
                aria-label={t("header.account")}
              >
                <span
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#2E4A36] to-[#1e3228] font-inter text-[10px] font-semibold uppercase tracking-wide text-[#F4EBDD]"
                  aria-hidden
                >
                  {userInitials(user.name)}
                </span>
              </Link>
            ) : (
              <button
                type="button"
                className={ICON_GHOST}
                onClick={() => openAuthModal("login")}
                aria-label={t("header.account")}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.65} stroke="currentColor" className="h-5 w-5" aria-hidden>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
              </button>
            )}
          </div>
        </div>
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
            "top-[calc(1.5rem+10.5rem+10px)] md:top-[calc(1.5rem+10.5rem+12px)]",
            "overflow-y-auto overscroll-contain",
            categoriesPanelShell,
            categoriesOpen ? "opacity-100" : "pointer-events-none invisible opacity-0",
          ].join(" ")}
          onMouseEnter={openCategoriesMenu}
          onMouseLeave={scheduleCloseCategories}
          aria-hidden={!categoriesOpen}
        >
          <div className="mx-auto w-full max-w-[min(100%,1600px)] px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
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
              <Link href={`/${locale}`} className={mobileNavHome} onClick={() => setMobileMenuOpen(false)}>
                {t("header.nav.home")}
              </Link>
              <Link href={`/${locale}/products`} className={mobileNavProducts} onClick={() => setMobileMenuOpen(false)}>
                {t("header.nav.products")}
              </Link>
              <Link href={`/${locale}/blog`} className={mobileNavBlog} onClick={() => setMobileMenuOpen(false)}>
                {t("header.nav.blog")}
              </Link>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  className={`flex w-full items-center justify-between ${mobileNavCategories}`}
                  onClick={() => setMobileCategoriesOpen((open) => !open)}
                  aria-expanded={mobileCategoriesOpen}
                  aria-controls="mobile-categories-menu"
                >
                  <span>{t("header.nav.categories")}</span>
                  <span className="font-inter text-[13px] font-semibold tracking-[0.04em] text-muted-gray">{mobileCategoriesOpen ? "−" : "+"}</span>
                </button>
                {mobileCategoriesOpen ? (
                  <div id="mobile-categories-menu" className="space-y-4 border-l border-earth-brown/20 pl-3">
                    {mainCategories.map((category) => (
                      <div key={category.slug} className="space-y-2">
                        <Link
                          href={`/${locale}/category/${category.slug}`}
                          className="font-inter text-[13px] font-semibold tracking-[0.04em] text-dark-base hover:text-accent-gold"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {t(`categories.names.${category.slug}`, category.name)}
                        </Link>
                        <div className="flex flex-col gap-1">
                          {(subCategoriesByParent[category.slug] || []).map((sub) => (
                            <Link
                              key={sub.slug}
                              href={`/${locale}/category/${sub.slug}`}
                              className="font-inter text-[13px] font-medium tracking-[0.02em] text-muted-gray hover:text-dark-base"
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
                    className={`font-inter text-[12px] font-semibold uppercase tracking-[0.14em] transition-colors ${
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

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialTab={initialTab} />
    </header>
  );

  return headerPortalRoot ? createPortal(headerUi, headerPortalRoot) : headerUi;
}
