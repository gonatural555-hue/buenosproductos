"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import { useLayoutEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { getAllCategories } from "@/lib/categories";
import { locales, type Locale } from "@/lib/i18n/config";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { usePathname, useSearchParams } from "next/navigation";

const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;
const PREMIUM_MS = 0.58;

/** Orden editorial del menú móvil de categorías (coincide con categorías padre). */
const MAIN_CATEGORY_ORDER = [
  "fishing",
  "water-sports",
  "outdoor-adventure",
  "active-sports",
  "mountain-snow",
] as const;

const HEADER_TOOLBAR_ROW =
  "relative flex w-full max-w-[1440px] items-center gap-2 py-1.5 md:gap-3 md:py-2";

const HEADER_PILL =
  "pointer-events-auto relative w-full rounded-none border-0 border-b border-[rgba(46,74,54,0.08)] bg-[#F4EBDD] px-3 py-2.5 shadow-none sm:px-4 md:rounded-full md:border md:border-[rgba(46,74,54,0.10)] md:bg-[rgba(244,235,221,0.72)] md:px-4 md:py-0 md:shadow-[0_10px_40px_rgba(0,0,0,0.05)] md:backdrop-blur-[16px] md:supports-[backdrop-filter]:bg-[rgba(244,235,221,0.62)]";

const LOCALE_FLOAT =
  "rounded-full px-2 py-1 font-inter text-[11px] font-semibold uppercase tracking-[0.12em] text-[rgba(46,74,54,0.72)] transition-colors duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[rgba(46,74,54,0.06)] hover:text-[#2E4A36] md:text-[12px] md:tracking-[0.12em]";

const ICON_GHOST =
  "flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[rgba(46,74,54,0.65)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[rgba(46,74,54,0.06)] hover:text-[#2E4A36]";

const MOBILE_DRAWER =
  "pointer-events-auto mt-2 overflow-hidden rounded-[1.35rem] border border-[rgba(46,74,54,0.08)] bg-[#F4EBDD] p-5 shadow-[0_20px_60px_rgba(0,0,0,0.06)] md:hidden";

const MOBILE_PRIMARY_LINK =
  "font-inter text-[13px] font-medium uppercase tracking-[0.12em] text-[rgba(46,74,54,0.78)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-[#2E4A36]";

const logoEase = PREMIUM_EASE;

function PremiumNavLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const reduceMotion = useReducedMotion() ?? false;
  return (
    <motion.span
      className="inline-flex will-change-transform"
      whileHover={reduceMotion ? undefined : { y: -2 }}
      transition={{ duration: PREMIUM_MS, ease: PREMIUM_EASE }}
    >
      <Link
        href={href}
        className="relative inline-block whitespace-nowrap rounded-full px-1.5 py-1 font-inter text-[13px] font-medium uppercase tracking-[0.12em] text-[rgba(46,74,54,0.72)] transition-[color,box-shadow,opacity] duration-[580ms] ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-[#2E4A36] hover:shadow-[0_0_36px_rgba(217,164,65,0.16),0_10px_32px_-14px_rgba(46,74,54,0.1)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441]/35 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(244,235,221,0.85)] md:text-[14px]"
      >
        {children}
      </Link>
    </motion.span>
  );
}

function MegaSubLink({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="group relative flex items-center gap-3 py-1.5 font-inter text-[15px] font-normal leading-snug text-[rgba(46,74,54,0.62)] transition-[color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-[#2E4A36] md:text-[16px]"
    >
      <span
        className="flex h-2 w-2 shrink-0 items-center justify-center"
        aria-hidden
      >
        <span className="h-1.5 w-1.5 translate-x-[-4px] rounded-full bg-[#D9A441] opacity-0 shadow-[0_0_10px_rgba(217,164,65,0.45)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:translate-x-0 group-hover:opacity-100" />
      </span>
      <span>{label}</span>
    </Link>
  );
}

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
              scale: 1.04,
              y: -2,
              filter: "drop-shadow(0 0 22px rgba(217, 164, 65, 0.22)) drop-shadow(0 12px 28px rgba(46, 74, 54, 0.12))",
              transition: { duration: 0.55, ease: logoEase },
            }
      }
      whileTap={reduceMotion ? undefined : { scale: 0.98, transition: { duration: 0.15, ease: logoEase } }}
    >
      <Link
        href={`/${locale}`}
        className="relative block rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-[#D9A441]/40 focus-visible:ring-offset-2 focus-visible:ring-offset-[rgba(244,235,221,0.9)]"
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
  const reduceMotion = useReducedMotion() ?? false;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);
  const locale = useLocale();
  const t = useTranslations();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  /** PDP: header en flujo (no fixed) para que el contenido no quede bajo barra flotante. */
  const isPdp = useMemo(() => {
    const s = pathname.split("/").filter(Boolean);
    return (
      s.length >= 3 &&
      s[1] === "products" &&
      locales.includes(s[0] as Locale)
    );
  }, [pathname]);

  const [headerPortalRoot, setHeaderPortalRoot] = useState<HTMLElement | null>(null);
  useLayoutEffect(() => {
    if (typeof document === "undefined") return;
    if (isPdp) {
      const orphan = document.getElementById("gn-header-fixed-root");
      if (orphan) orphan.remove();
      setHeaderPortalRoot(null);
      return;
    }
    const id = "gn-header-fixed-root";
    let el = document.getElementById(id) as HTMLElement | null;
    if (!el) {
      el = document.createElement("div");
      el.id = id;
      document.body.insertAdjacentElement("afterbegin", el);
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- portal root sync
    setHeaderPortalRoot(el);
  }, [isPdp]);

  const { mainCategories, subCategoriesByParent } = useMemo(() => {
    const all = getAllCategories();
    const mains = all.filter((cat) => !cat.parentSlug);
    const orderRank = (slug: string) => {
      const i = MAIN_CATEGORY_ORDER.indexOf(slug as (typeof MAIN_CATEGORY_ORDER)[number]);
      return i === -1 ? 999 : i;
    };
    mains.sort((a, b) => orderRank(a.slug) - orderRank(b.slug));
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

  const headerShellClass = isPdp
    ? "pointer-events-auto relative z-50 w-full overflow-x-hidden font-inter"
    : "pointer-events-none !fixed inset-x-0 top-0 z-50 w-full overflow-x-hidden font-inter";

  const headerUi = (
    <header className={headerShellClass}>
      <div className="mx-auto w-full max-w-[1440px] px-0 pt-3 md:px-7 md:pt-5 lg:px-12">
        <div className={HEADER_PILL}>
          <div className={`${HEADER_TOOLBAR_ROW} hidden w-full md:flex`}>
            <div className="flex min-h-0 min-w-0 flex-1 items-center pr-[calc(11.5rem+6px)] md:pr-[calc(12rem+8px)] lg:pr-[calc(12.75rem+10px)]">
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
                  className="flex shrink-0 items-center"
                  aria-label={t("header.nav.outdoorKnowledge")}
                >
                  <PremiumNavLink href={`/${locale}/blog`}>
                    {t("header.nav.outdoorKnowledge")}
                  </PremiumNavLink>
                </nav>
              </div>
            </div>

            <div className="pointer-events-none absolute left-1/2 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2">
              <div className="pointer-events-auto">
                <BrandLogoLink
                  locale={locale}
                  alt={t("header.logoAlt")}
                  imageClassName="h-[9.375rem] w-auto max-h-[10rem] max-w-[min(30vw,20.5rem)] object-contain object-center md:h-[10rem] md:max-h-[10.5rem] md:max-w-[22.5rem] lg:max-h-[11.25rem] lg:max-w-[23.75rem]"
                />
              </div>
            </div>

            <div className="flex min-h-0 min-w-0 flex-1 items-center justify-start gap-2 pl-[calc(11.5rem+6px)] md:gap-2 md:pl-[calc(12rem+8px)] lg:pl-[calc(12.75rem+10px)]">
              <nav
                className="flex min-w-0 shrink-0 items-center"
                aria-label={t("header.nav.shopByCategories")}
              >
                <PremiumNavLink href={`/${locale}/products`}>
                  {t("header.nav.shopByCategories")}
                </PremiumNavLink>
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
                    className="flex max-w-[9.5rem] shrink-0 items-center gap-2 rounded-full border border-transparent py-1.5 pl-2.5 pr-1.5 font-inter text-[12px] font-semibold uppercase tracking-[0.12em] text-[rgba(46,74,54,0.72)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[rgba(46,74,54,0.08)] hover:bg-[rgba(46,74,54,0.04)] hover:text-[#2E4A36]"
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
                    className="shrink-0 rounded-full border border-transparent px-3 py-2 font-inter text-[12px] font-semibold uppercase tracking-[0.12em] text-[rgba(46,74,54,0.72)] transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[rgba(46,74,54,0.08)] hover:bg-[rgba(46,74,54,0.04)] hover:text-[#2E4A36] lg:px-4"
                  >
                    {t("header.account")}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className={`${HEADER_TOOLBAR_ROW} flex w-full items-center justify-between gap-2 md:hidden`}>
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

            <div className="min-w-0 flex-1" aria-hidden="true" />

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

        {mobileMenuOpen ? (
          <motion.nav
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: PREMIUM_EASE }}
            className={MOBILE_DRAWER}
          >
            <div className="flex flex-col gap-4">
              <Link
                href={`/${locale}/blog`}
                className={MOBILE_PRIMARY_LINK}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("header.nav.outdoorKnowledge")}
              </Link>
              <Link
                href={`/${locale}/products`}
                className={MOBILE_PRIMARY_LINK}
                onClick={() => setMobileMenuOpen(false)}
              >
                {t("header.nav.shopByCategories")}
              </Link>

              <div className="border-t border-[rgba(46,74,54,0.08)] pt-4">
                <button
                  type="button"
                  className="flex w-full items-center justify-between py-1 font-inter text-[13px] font-medium uppercase tracking-[0.12em] text-[rgba(46,74,54,0.82)] transition-opacity duration-500 hover:opacity-80"
                  onClick={() => setMobileCategoriesOpen((open) => !open)}
                  aria-expanded={mobileCategoriesOpen}
                  aria-controls="mobile-categories-menu"
                >
                  <span>{t("header.nav.categories")}</span>
                  <span className="font-inter text-[12px] font-medium tracking-[0.16em] text-[rgba(46,74,54,0.45)]">
                    {mobileCategoriesOpen ? "−" : "+"}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {mobileCategoriesOpen ? (
                    <motion.div
                      id="mobile-categories-menu"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.55, ease: PREMIUM_EASE }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 space-y-5 border-l border-[rgba(46,74,54,0.1)] pl-3">
                        {mainCategories.map((category, colIdx) => (
                          <motion.div
                            key={category.slug}
                            initial={{ opacity: 0, y: 6 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{
                              delay: colIdx * 0.05,
                              duration: 0.5,
                              ease: PREMIUM_EASE,
                            }}
                            className="space-y-2"
                          >
                            <Link
                              href={`/${locale}/category/${category.slug}`}
                              className="block font-inter text-[clamp(1.1rem,3.5vw,1.35rem)] font-semibold tracking-[-0.02em] text-[#2E4A36]"
                              onClick={() => setMobileMenuOpen(false)}
                            >
                              {t(`categories.names.${category.slug}`, category.name)}
                            </Link>
                            <div className="flex flex-col gap-1">
                              {(subCategoriesByParent[category.slug] || []).map((sub, si) => (
                                <motion.div
                                  key={sub.slug}
                                  initial={{ opacity: 0, x: -4 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{
                                    delay: 0.06 + colIdx * 0.04 + si * 0.03,
                                    duration: 0.45,
                                    ease: PREMIUM_EASE,
                                  }}
                                >
                                  <MegaSubLink
                                    href={`/${locale}/category/${sub.slug}`}
                                    label={t(`categories.names.${sub.slug}`, sub.name)}
                                    onNavigate={() => setMobileMenuOpen(false)}
                                  />
                                </motion.div>
                              ))}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </div>

              <div className="flex flex-wrap items-center gap-3 border-t border-[rgba(46,74,54,0.08)] pt-4">
                {locales.map((lang) => (
                  <Link
                    key={lang}
                    href={buildLocaleHref(lang)}
                    className={`font-inter text-[12px] font-medium uppercase tracking-[0.14em] transition-colors duration-500 ${
                      lang === locale ? "text-[#D9A441]" : "text-[rgba(46,74,54,0.55)] hover:text-[#2E4A36]"
                    }`}
                  >
                    {lang.toUpperCase()}
                  </Link>
                ))}
                {isLoggedIn && user ? (
                  <Link
                    href={`/${locale}/account`}
                    className="font-inter text-[13px] font-medium text-[#2E4A36]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("header.greeting")}, {user.name}
                  </Link>
                ) : (
                  <Link
                    href={`/${locale}/auth?tab=login`}
                    className="font-inter text-[13px] font-medium text-[#2E4A36]"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t("header.account")}
                  </Link>
                )}
              </div>
            </div>
          </motion.nav>
        ) : null}
      </div>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialTab={initialTab} />
    </header>
  );

  if (isPdp) return headerUi;
  return headerPortalRoot ? createPortal(headerUi, headerPortalRoot) : headerUi;
}
