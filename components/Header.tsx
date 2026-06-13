"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { Suspense, useState } from "react";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/AuthModal";
import HeaderCategoryBar from "@/components/header/HeaderCategoryBar";
import HeaderMainRow from "@/components/header/HeaderMainRow";
import HeaderUtilityBar from "@/components/header/HeaderUtilityBar";
import { getHeaderNavTabs } from "@/lib/header-nav-categories";
import { goNaturalHomePath } from "@/lib/routing/brands";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";

const PREMIUM_EASE = [0.22, 1, 0.36, 1] as const;

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
      className="block py-1 font-inter text-[14px] text-[rgba(48,76,61,0.72)] hover:text-[#304C3D]"
    >
      {label}
    </Link>
  );
}

function HeaderMobileDrawer({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const locale = useLocale();
  const t = useTranslations();
  const headerNavTabs = getHeaderNavTabs();
  const [categoriesOpen, setCategoriesOpen] = useState(false);

  if (!open) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.4, ease: PREMIUM_EASE }}
      className="border-t border-[rgba(48,76,61,0.1)] bg-[#F4EBDD] p-4 md:hidden"
    >
      <div className="flex flex-col gap-3">
        <Link href={goNaturalHomePath(locale)} className="font-inter text-sm font-medium text-[#304C3D]" onClick={onClose}>
          {t("header.nav.home")}
        </Link>
        <Link href={`/${locale}/products`} className="font-inter text-sm font-medium text-[#304C3D]" onClick={onClose}>
          {t("header.shop")}
        </Link>
        <Link href={`/${locale}/blog`} className="font-inter text-sm font-medium text-[#304C3D]" onClick={onClose}>
          {t("header.utility.expertAdvice")}
        </Link>
        <button
          type="button"
          className="flex w-full items-center justify-between py-1 text-left font-inter text-sm font-medium text-[#304C3D]"
          onClick={() => setCategoriesOpen((o) => !o)}
        >
          {t("header.nav.categories")}
          <span>{categoriesOpen ? "−" : "+"}</span>
        </button>
        {categoriesOpen ? (
          <div className="space-y-4 border-l border-[rgba(48,76,61,0.12)] pl-3">
            {headerNavTabs.map((tab) => (
              <div key={tab.id}>
                <Link
                  href={`/${locale}/category/${tab.parentSlug}`}
                  className="block font-inter text-base font-semibold text-[#304C3D]"
                  onClick={onClose}
                >
                  {t(`header.tabs.${tab.labelKey}`, tab.labelKey)}
                </Link>
                <div className="mt-1 flex flex-col">
                  {tab.items.map((item, si) => (
                    <MegaSubLink
                      key={`${tab.id}-${si}`}
                      href={`/${locale}/category/${item.categorySlug}`}
                      label={
                        item.labelKey
                          ? t(
                              `header.tabs.subs.${item.labelKey}`,
                              t(`categories.names.${item.categorySlug}`, item.categorySlug)
                            )
                          : t(`categories.names.${item.categorySlug}`, item.categorySlug)
                      }
                      onNavigate={onClose}
                    />
                  ))}
                </div>
              </div>
            ))}
            <Link
              href={`/${locale}/products?deals=1`}
              className="block font-inter text-base font-semibold text-[#C9622B]"
              onClick={onClose}
            >
              {t("header.tabs.deals")}
            </Link>
          </div>
        ) : null}
      </div>
    </motion.nav>
  );
}

function HeaderInner() {
  const { totalItems } = useCart();
  const { isLoggedIn, user } = useUser();
  const { authOpen, setAuthOpen, openAuthModal, initialTab } = useAuth();
  const locale = useLocale();
  const t = useTranslations();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="gn-rei-header font-inter">
        <HeaderUtilityBar locale={locale} />

        <div className="gn-rei-band">
          <div className="gn-rei-header__max gn-rei-band__shell">
            <HeaderMainRow
              locale={locale}
              totalItems={totalItems}
              isLoggedIn={isLoggedIn}
              userName={user?.name}
              onSignIn={() => openAuthModal("login")}
            />

            <HeaderCategoryBar locale={locale} />
          </div>

          <div className="gn-rei-header__max gn-rei-mobile">
            <button
              type="button"
              className="flex h-10 w-10 items-center justify-center text-[#304C3D]"
              aria-label="Menu"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((o) => !o)}
            >
              {mobileOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="h-6 w-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
            <Link href={goNaturalHomePath(locale)}>
              <Image
                src="/assets/images/logo/LOGO-GONATURAL.png"
                alt={t("header.logoAlt")}
                width={120}
                height={48}
                className="gn-rei-mobile__logo"
              />
            </Link>
            <Link href={`/${locale}/cart`} className="relative flex h-10 w-10 items-center justify-center text-[#304C3D]" aria-label={t("header.nav.cart")}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" className="h-6 w-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 3.5h3l2.2 10.4a2 2 0 0 0 2 1.6h7.1a2 2 0 0 0 2-1.6l1.7-8.4H6.1" />
                <circle cx="9" cy="20" r="1.25" />
                <circle cx="18" cy="20" r="1.25" />
              </svg>
              {totalItems > 0 ? (
                <span className="absolute right-0 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-[#D9A441] px-0.5 text-[9px] font-bold text-[#304C3D]">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              ) : null}
            </Link>
          </div>

          <AnimatePresence>
            {mobileOpen ? <HeaderMobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} /> : null}
          </AnimatePresence>
        </div>
      </header>

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} initialTab={initialTab} />
    </>
  );
}

export default function Header() {
  return (
    <Suspense fallback={null}>
      <HeaderInner />
    </Suspense>
  );
}
