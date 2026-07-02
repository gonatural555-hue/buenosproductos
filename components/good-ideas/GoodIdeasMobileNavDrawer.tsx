"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import GoodProductsCompactLogo from "@/components/good-ideas/GoodProductsCompactLogo";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { useUser } from "@/context/UserContext";
import { headerLocales, type Locale } from "@/lib/i18n/config";
import type { GiHeaderNavItem } from "@/lib/good-ideas-header-nav";
import {
  accountPath,
  accountSectionPath,
  authPath,
  homePath,
  type AccountSection,
} from "@/lib/routing/paths";

type Props = {
  open: boolean;
  onClose: () => void;
  navItems: GiHeaderNavItem[];
  buildLocaleHref: (locale: Locale) => string;
  isNavItemActive: (item: GiHeaderNavItem) => boolean;
};

function CloseIcon() {
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
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}

export default function GoodIdeasMobileNavDrawer({
  open,
  onClose,
  navItems,
  buildLocaleHref,
  isNavItemActive,
}: Props) {
  const locale = useLocale();
  const t = useTranslations();
  const router = useRouter();
  const { isLoggedIn, logout } = useUser();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  const accountItems: { section: AccountSection; label: string }[] = [
    { section: "account", label: t("accountPage.sections.account") },
    { section: "orders", label: t("accountPage.sections.orders") },
    { section: "addresses", label: t("accountPage.sections.addresses") },
  ];

  const handleLogout = async () => {
    onClose();
    await logout();
    router.push(homePath(locale));
  };

  const navLinkClass = (active: boolean) =>
    `block rounded-xl px-4 py-3.5 font-body text-base font-medium transition-colors ${
      active
        ? "bg-[#F3F4F6] font-semibold text-[#3B82F6]"
        : "text-[#111111] hover:bg-[#F9FAFB] hover:text-[#3B82F6]"
    }`;

  const langBtnClass = (active: boolean) =>
    `rounded-full px-4 py-2 font-body text-sm font-semibold transition-colors ${
      active
        ? "bg-[#3B82F6] text-white"
        : "border border-[#E5E7EB] bg-white text-[#374151] hover:border-[#3B82F6] hover:text-[#3B82F6]"
    }`;

  return (
    <div className="fixed inset-0 z-[60] md:hidden" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-[rgba(11,15,20,0.45)] backdrop-blur-[2px]"
        aria-label={t("goodIdeas.nav.closeMenu")}
        onClick={onClose}
      />

      <aside
        className="absolute left-0 top-0 flex h-full w-[min(88vw,320px)] flex-col bg-white shadow-[0_24px_64px_rgba(0,0,0,0.18)]"
        aria-label={t("goodIdeas.brandName")}
      >
        <div className="flex items-center justify-between border-b border-[#E5E7EB] px-4 py-4">
          <Link href={homePath(locale)} className="shrink-0" onClick={onClose}>
            <span className="sr-only">{t("goodIdeas.brandName")}</span>
            <GoodProductsCompactLogo />
          </Link>
          <button
            type="button"
            className="flex h-11 w-11 items-center justify-center rounded-full text-[#0B0F14] transition hover:bg-[#F3F4F6]"
            aria-label={t("goodIdeas.nav.closeMenu")}
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="flex flex-col gap-0.5">
            {navItems.map((item) => {
              const active = isNavItemActive(item);
              return (
                <li key={item.id}>
                  <Link
                    href={item.href}
                    className={navLinkClass(active)}
                    aria-current={active ? "page" : undefined}
                    onClick={onClose}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>

          <div className="mt-6 border-t border-[#E5E7EB] pt-5">
            <p className="px-4 font-body text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">
              {t("header.localeNavAria")}
            </p>
            <div className="mt-3 flex flex-wrap gap-2 px-4">
              {headerLocales.map((lang) => (
                <Link
                  key={lang}
                  href={buildLocaleHref(lang)}
                  className={langBtnClass(lang === locale)}
                  onClick={onClose}
                >
                  {lang.toUpperCase()}
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-6 border-t border-[#E5E7EB] pt-5">
            <p className="px-4 font-body text-xs font-semibold uppercase tracking-[0.14em] text-[#6B7280]">
              {t("goodIdeas.nav.account")}
            </p>
            <div className="mt-2 flex flex-col gap-0.5">
              {isLoggedIn ? (
                <>
                  {accountItems.map((item) => (
                    <Link
                      key={item.section}
                      href={accountSectionPath(locale, item.section)}
                      className="block rounded-xl px-4 py-3 font-body text-base font-medium text-[#111111] transition hover:bg-[#F9FAFB] hover:text-[#3B82F6]"
                      onClick={onClose}
                    >
                      {item.label}
                    </Link>
                  ))}
                  <button
                    type="button"
                    className="block w-full rounded-xl px-4 py-3 text-left font-body text-base font-medium text-[#111111] transition hover:bg-[#F9FAFB] hover:text-[#3B82F6]"
                    onClick={() => void handleLogout()}
                  >
                    {t("accountPage.logout")}
                  </button>
                </>
              ) : (
                <Link
                  href={authPath(locale, accountPath(locale))}
                  className="block rounded-xl px-4 py-3 font-body text-base font-medium text-[#111111] transition hover:bg-[#F9FAFB] hover:text-[#3B82F6]"
                  onClick={onClose}
                >
                  {t("header.signIn")}
                </Link>
              )}
            </div>
          </div>
        </nav>
      </aside>
    </div>
  );
}
