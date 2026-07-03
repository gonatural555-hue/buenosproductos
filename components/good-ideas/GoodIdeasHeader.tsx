"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useId, useState } from "react";
import GoodIdeasMobileNavDrawer from "@/components/good-ideas/GoodIdeasMobileNavDrawer";
import GoodProductsBrandName from "@/components/good-ideas/GoodProductsBrandName";
import { useGoodIdeasCart } from "@/context/GoodIdeasCartContext";
import { headerLocales, locales, type Locale } from "@/lib/i18n/config";
import {
  buildGiHeaderNavItems,
  isGiHeaderNavItemActive,
} from "@/lib/good-ideas-header-nav";
import { cartPath, homePath } from "@/lib/routing/paths";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import HeaderCurrencySwitcher from "@/components/header/HeaderCurrencySwitcher";
import HeaderAccountMenu from "@/components/good-ideas/HeaderAccountMenu";
import {
  resolveSmartHeaderScrollConfig,
  useSmartHeaderScroll,
} from "@/hooks/useSmartHeaderScroll";
import { giHeaderClasses } from "@/lib/ui/gi-header";
import { giType } from "@/lib/ui/gi-typography";

function MenuIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.75}
      stroke="currentColor"
      className="h-5 w-5"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
      />
    </svg>
  );
}

function CartIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.65}
      stroke="currentColor"
      className="h-5 w-5"
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
      />
    </svg>
  );
}

export default function GoodIdeasHeader() {
  const locale = useLocale();
  const t = useTranslations();
  const { totalItems } = useGoodIdeasCart();
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();
  const scrollConfig = resolveSmartHeaderScrollConfig(pathname);
  const { hidden, transitionClass } = useSmartHeaderScroll(scrollConfig);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [locationHash, setLocationHash] = useState("");
  const mobileMenuId = useId();

  const navItems = buildGiHeaderNavItems(locale, {
    home: t("goodIdeas.nav.home"),
    products: t("goodIdeas.nav.products"),
    categories: t("goodIdeas.nav.categories"),
    blog: t("goodIdeas.nav.blog"),
  });

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

  const closeMobile = useCallback(() => setMobileOpen(false), []);

  const isNavActive = useCallback(
    (item: (typeof navItems)[number]) =>
      isGiHeaderNavItemActive(pathname, item, locationHash),
    [locationHash, pathname]
  );

  useEffect(() => {
    closeMobile();
  }, [pathname, closeMobile]);

  useEffect(() => {
    const syncHash = () => setLocationHash(window.location.hash.replace(/^#/, ""));
    syncHash();
    window.addEventListener("hashchange", syncHash);
    return () => window.removeEventListener("hashchange", syncHash);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMobile();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen, closeMobile]);

  const navLinkClass = (active: boolean) =>
    `${giHeaderClasses.navLinkLight} ${
      active ? giHeaderClasses.navLinkLightActive : ""
    }`;

  const mobileNavLinkClass = (active: boolean) =>
    `${giHeaderClasses.mobileNavLink} ${
      active ? giHeaderClasses.mobileNavLinkActive : ""
    }`;

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 ${transitionClass} ${
          hidden ? "-translate-y-full" : "translate-y-0"
        } ${giHeaderClasses.shell}`}
      >
        <div
          className={`${giHeaderClasses.inner} flex md:grid md:grid-cols-[auto_1fr_auto]`}
        >
          {/* ——— Mobile < md ——— */}
          <div className="flex w-full min-w-0 items-center gap-1.5 md:hidden">
            <Link
              href={homePath(locale)}
              className="group min-w-0 shrink py-1 pr-1"
              aria-label={t("goodIdeas.brandName")}
            >
              <GoodProductsBrandName
                locale={locale}
                className={`block truncate font-display text-[0.9375rem] font-bold leading-tight tracking-[-0.02em] sm:text-base`}
                prefixClassName="text-[#0B0F14] transition-colors group-hover:text-[#3B82F6]"
                suffixClassName="text-[#3B82F6] transition-colors group-hover:text-[#2563EB]"
              />
            </Link>

            <div className="-mr-1 ml-auto flex shrink-0 items-center gap-0.5 sm:-mr-2">
              <HeaderCurrencySwitcher variant="light" compact />
              <HeaderAccountMenu variant="light" iconOnly />
              <Link
                href={cartPath(locale)}
                className="relative flex h-11 w-11 items-center justify-center rounded-full text-[#0B0F14] transition-colors hover:bg-[#F3F4F6] hover:text-[#3B82F6]"
                aria-label={`${t("goodIdeas.nav.cart")} (${totalItems})`}
              >
                <CartIcon />
                {totalItems > 0 ? (
                  <span
                    className={`absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#3B82F6] px-0.5 ${giType.btnSm} text-white`}
                  >
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                ) : null}
              </Link>
              <button
                type="button"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-[#0B0F14] transition-colors hover:bg-[#F3F4F6]"
                aria-expanded={mobileOpen}
                aria-controls={mobileMenuId}
                aria-label={t("goodIdeas.nav.openMenu")}
                onClick={() => setMobileOpen(true)}
              >
                <MenuIcon />
              </button>
            </div>
          </div>

          {/* ——— Desktop / tablet md+ ——— */}
          <div className="hidden min-w-0 items-center gap-2 md:flex">
            <Link
              href={homePath(locale)}
              className={`group shrink-0 ${giType.brandLogo}`}
            >
              <GoodProductsBrandName
                locale={locale}
                prefixClassName="text-[#0B0F14] transition-colors duration-200 group-hover:text-[#3B82F6]"
                suffixClassName="text-[#3B82F6] transition-colors duration-200 group-hover:text-[#0B0F14]"
              />
            </Link>
          </div>

          <nav
            className={giHeaderClasses.navDesktop}
            aria-label={t("goodIdeas.brandName")}
          >
            {navItems.map((item) => {
              const active = isNavActive(item);
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  className={navLinkClass(active)}
                  aria-current={active ? "page" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className={`${giHeaderClasses.utilityCluster} hidden md:flex`}>
            <button
              type="button"
              className={giHeaderClasses.menuBtn}
              aria-expanded={mobileOpen}
              aria-controls={mobileMenuId}
              aria-label={
                mobileOpen ? t("goodIdeas.nav.closeMenu") : t("goodIdeas.nav.openMenu")
              }
              onClick={() => setMobileOpen((v) => !v)}
            >
              <MenuIcon />
            </button>

            <div className={giHeaderClasses.divider} aria-hidden />

            <HeaderCurrencySwitcher variant="light" />

            <div className={giHeaderClasses.pillGroup}>
              {headerLocales.map((lang) => (
                <Link
                  key={lang}
                  href={buildLocaleHref(lang)}
                  className={`rounded-full px-2.5 py-1 ${giType.navUtility} ${
                    lang === locale
                      ? "bg-white font-semibold text-[#0B0F14] shadow-sm"
                      : "text-[#6B7280] hover:text-[#0B0F14]"
                  }`}
                >
                  {lang}
                </Link>
              ))}
            </div>

            <div className={`hidden sm:block ${giHeaderClasses.divider}`} aria-hidden />

            <HeaderAccountMenu variant="light" />

            <Link
              href={cartPath(locale)}
              className={giHeaderClasses.iconBtnLight}
              aria-label={`${t("goodIdeas.nav.cart")} (${totalItems})`}
            >
              <CartIcon />
              {totalItems > 0 ? (
                <span
                  className={`absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-[var(--gi-primary)] px-0.5 ${giType.btnSm} text-white`}
                >
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              ) : null}
            </Link>
          </div>
        </div>

        {/* Panel tablet md–lg (sin nav desktop) */}
        {mobileOpen ? (
          <nav
            id={mobileMenuId}
            className={`${giHeaderClasses.mobilePanel} hidden md:block lg:hidden`}
            aria-label={t("goodIdeas.brandName")}
          >
            <ul className="flex flex-col gap-0.5">
              {navItems.map((item) => {
                const active = isNavActive(item);
                return (
                  <li key={item.id}>
                    <Link
                      href={item.href}
                      className={mobileNavLinkClass(active)}
                      aria-current={active ? "page" : undefined}
                      onClick={closeMobile}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
        ) : null}
      </header>

      <GoodIdeasMobileNavDrawer
        open={mobileOpen}
        onClose={closeMobile}
        navItems={navItems}
        buildLocaleHref={buildLocaleHref}
        isNavItemActive={isNavActive}
      />
    </>
  );
}
