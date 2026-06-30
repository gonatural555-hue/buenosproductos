"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useUser } from "@/context/UserContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import AccountAddresses from "@/components/AccountAddresses";
import {
  accountPath,
  accountSectionPath,
  authPath,
  homePath,
  isAccountSection,
  registerPath,
  type AccountSection,
} from "@/lib/routing/paths";
import {
  GI_ACCOUNT_TOP_PAD,
  giAccountCard,
  giAccountNavBtn,
} from "@/lib/ui/gi-account";

type SectionKey = AccountSection;

export default function AccountPage() {
  const { isLoggedIn, user, logout, orders, authLoading } = useUser();
  const router = useRouter();
  const searchParams = useSearchParams();
  const locale = useLocale();
  const t = useTranslations();
  const sectionFromUrl = searchParams.get("section");
  const initialSection: SectionKey = isAccountSection(sectionFromUrl)
    ? sectionFromUrl
    : "account";
  const [activeSection, setActiveSection] = useState<SectionKey>(initialSection);
  const { formatMoney } = useCurrency();

  useEffect(() => {
    if (isAccountSection(sectionFromUrl)) {
      setActiveSection(sectionFromUrl);
    }
  }, [sectionFromUrl]);

  const setSection = (section: SectionKey) => {
    setActiveSection(section);
    router.replace(accountSectionPath(locale, section), { scroll: false });
  };

  const dateLocale =
    locale === "es" ? "es-AR" : locale === "fr" ? "fr-FR" : locale === "it" ? "it-IT" : "en-US";

  const content = useMemo(() => {
    if (activeSection === "orders") {
      if (orders.length === 0) {
        return (
          <div className={giAccountCard}>
            <p className="font-body text-sm text-[rgba(232,236,241,0.65)]">
              {t("accountPage.noOrders")}
            </p>
          </div>
        );
      }
      return (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order.id}
              className={`${giAccountCard} flex flex-col gap-2 md:flex-row md:items-center md:justify-between`}
            >
              <div>
                <p className="font-body text-sm font-semibold text-[#E8ECF1]">
                  {t("accountPage.orderLabel")} #{order.id}
                </p>
                <p className="font-body text-xs text-[rgba(232,236,241,0.55)]">
                  {new Date(order.date).toLocaleDateString(dateLocale, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-body text-sm font-semibold tabular-nums text-[#E8ECF1]">
                  {formatMoney(order.subtotal)}
                </span>
                <span className="font-body text-xs uppercase tracking-[0.1em] text-[rgba(232,236,241,0.5)]">
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeSection === "addresses") {
      return <AccountAddresses surface="gi" />;
    }

    return (
      <div className={giAccountCard}>
        <p className="font-body text-sm text-[rgba(232,236,241,0.65)]">
          {t("accountPage.welcomeText")}
        </p>
        <div className="mt-4 space-y-2">
          <p className="font-body text-sm font-semibold text-[#E8ECF1]">
            {user?.name || t("accountPage.userLabel")}
          </p>
          <p className="font-body text-sm text-[rgba(232,236,241,0.55)]">{user?.email}</p>
        </div>
      </div>
    );
  }, [activeSection, orders, user, t, dateLocale, formatMoney]);

  if (authLoading) {
    return (
      <main
        className={`flex min-h-[100dvh] items-center justify-center bg-[#0B0F14] px-6 ${GI_ACCOUNT_TOP_PAD}`}
      >
        <p className="font-body text-sm text-[rgba(232,236,241,0.65)]">
          {t("checkoutPage.loadingAuth")}
        </p>
      </main>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className={`min-h-[100dvh] bg-[#0B0F14] px-6 pb-16 sm:px-10 ${GI_ACCOUNT_TOP_PAD}`}>
        <div className="mx-auto max-w-xl">
          <div className={`${giAccountCard} p-8 text-center`}>
            <h1 className="font-body text-2xl font-semibold text-[#E8ECF1]">
              {t("accountPage.title")}
            </h1>
            <p className="mt-3 font-body text-sm text-[rgba(232,236,241,0.65)]">
              {t("accountPage.loginRequired")}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href={authPath(locale, accountPath(locale))}
                className="inline-flex items-center justify-center rounded-full bg-[#3B82F6] px-6 py-3 font-body text-sm font-semibold text-white transition hover:bg-[#2563EB]"
              >
                {t("accountPage.loginButton")}
              </Link>
              <Link
                href={registerPath(locale, accountPath(locale))}
                className="inline-flex items-center justify-center rounded-full border border-white/[0.14] px-6 py-3 font-body text-sm font-semibold text-[#E8ECF1] transition hover:border-white/25"
              >
                {t("goodIdeas.auth.registerTab")}
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  const navItems: { key: SectionKey; label: string }[] = [
    { key: "account", label: t("accountPage.sections.account") },
    { key: "orders", label: t("accountPage.sections.orders") },
    { key: "addresses", label: t("accountPage.sections.addresses") },
  ];

  return (
    <main className={`min-h-[100dvh] bg-[#0B0F14] px-6 pb-16 sm:px-10 lg:px-16 ${GI_ACCOUNT_TOP_PAD}`}>
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 max-w-2xl md:mb-12">
          <p className="mb-3 font-body text-xs font-semibold uppercase tracking-[0.2em] text-[#3B82F6]">
            {t("goodIdeas.brandName")}
          </p>
          <h1 className="font-body text-3xl font-semibold tracking-tight text-[#E8ECF1] md:text-4xl">
            {t("accountPage.title")}
          </h1>
          <p className="mt-3 font-body text-base leading-relaxed text-[rgba(232,236,241,0.65)]">
            {t("accountPage.subtitle")}
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-3">
            {navItems.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setSection(item.key)}
                className={giAccountNavBtn(activeSection === item.key)}
              >
                {item.label}
              </button>
            ))}

            <button
              type="button"
              onClick={() => {
                void (async () => {
                  await logout();
                  router.push(homePath(locale));
                })();
              }}
              className={giAccountNavBtn(false)}
            >
              {t("accountPage.logout")}
            </button>
          </aside>

          <section className="min-w-0">{content}</section>
        </div>
      </div>
    </main>
  );
}
