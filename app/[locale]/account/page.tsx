"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import AuthModal from "@/components/AuthModal";
import { useUser } from "@/context/UserContext";
import { useCurrency } from "@/context/CurrencyContext";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import AccountAddresses from "@/components/AccountAddresses";
import {
  GN_CART_ACCOUNT_TOP_PAD,
  GN_CART_ACCOUNT_TOP_PAD_COMPACT,
} from "@/lib/ui/gonatural-design";

type Order = {
  id: string;
  date: string;
  total: string;
  status: "Procesando" | "Enviado" | "Completado";
};

type SectionKey = "account" | "orders" | "addresses";

export default function AccountPage() {
  const { isLoggedIn, user, logout, orders, authLoading } = useUser();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const [activeSection, setActiveSection] = useState<SectionKey>("account");
  const [authOpen, setAuthOpen] = useState(false);
  const { formatMoney } = useCurrency();
  const formatPrice = (price: number) => formatMoney(price);

  const userOrders = orders;

  const content = useMemo(() => {
    if (activeSection === "orders") {
      if (userOrders.length === 0) {
        return (
          <div className="rounded-2xl border border-earth-brown/15 bg-soft-stone p-6">
            <p className="text-sm text-muted-gray">
              {t("accountPage.noOrders")}
            </p>
          </div>
        );
      }
      return (
        <div className="space-y-3">
          {userOrders.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-2 rounded-2xl border border-earth-brown/15 bg-soft-stone p-5 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-text-primary">
                  {t("accountPage.orderLabel")} #{order.id}
                </p>
                <p className="text-xs text-text-muted">
                  {new Date(order.date).toLocaleDateString(
                    locale === "es"
                      ? "es-AR"
                      : locale === "fr"
                        ? "fr-FR"
                        : locale === "it"
                          ? "it-IT"
                          : "en-US",
                    {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    }
                  )}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-text-primary">
                  {formatPrice(order.subtotal)}
                </span>
                <span className="text-xs uppercase tracking-[0.12em] text-text-muted">
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      );
    }

    if (activeSection === "addresses") {
      return <AccountAddresses />;
    }

    return (
      <div className="rounded-2xl border border-earth-brown/15 bg-soft-stone p-6">
        <p className="text-sm text-muted-gray">
          {t("accountPage.welcomeText")}
        </p>
        <div className="mt-4 space-y-2">
          <p className="text-sm font-semibold text-dark-base">
            {user?.name || t("accountPage.userLabel")}
          </p>
          <p className="text-sm text-muted-gray">{user?.email}</p>
        </div>
      </div>
    );
  }, [activeSection, userOrders, user, t, locale]);

  if (authLoading) {
    return (
      <main className={`flex min-h-[100dvh] items-center justify-center bg-gn-page-bg px-6 pb-16 sm:px-10 lg:px-16 ${GN_CART_ACCOUNT_TOP_PAD_COMPACT}`}>
        <p className="text-sm text-muted-gray">{t("checkoutPage.loadingAuth")}</p>
      </main>
    );
  }

  if (!isLoggedIn) {
    return (
      <main className={`min-h-[100dvh] bg-dark-base px-6 pb-16 sm:px-10 lg:px-16 ${GN_CART_ACCOUNT_TOP_PAD_COMPACT}`}>
        <div className="mx-auto max-w-xl">
          <div className="rounded-3xl border border-white/10 bg-dark-surface/40 p-8 text-center">
            <h1 className="font-sans text-2xl font-semibold text-text-primary">
              {t("accountPage.title")}
            </h1>
            <p className="mt-3 text-sm text-text-muted">
              {t("accountPage.loginRequired")}
            </p>
            <button
              type="button"
              onClick={() => setAuthOpen(true)}
              className="mt-6 w-full rounded-xl bg-text-primary px-4 py-3 text-sm font-semibold text-dark-base transition-colors duration-200 ease-out hover:bg-white"
            >
              {t("accountPage.loginButton")}
            </button>
          </div>
        </div>
        <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      </main>
    );
  }

  return (
      <main className={`min-h-[100dvh] bg-gn-page-bg px-6 pb-16 sm:px-10 lg:px-16 ${GN_CART_ACCOUNT_TOP_PAD}`}>
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 max-w-2xl md:mb-12">
          <p className="mb-3 text-[0.65rem] uppercase tracking-[0.28em] text-accent-gold/90">
            Go Natural
          </p>
          <h1 className="font-sans mb-3 text-3xl font-semibold tracking-tight text-dark-base md:text-4xl">
            {t("accountPage.title")}
          </h1>
          <p className="text-base leading-relaxed text-muted-gray md:text-lg">
            {t("accountPage.subtitle")}
          </p>
        </header>

        <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
          <aside className="space-y-3">
            {[
              { key: "account", label: t("accountPage.sections.account") },
              { key: "orders", label: t("accountPage.sections.orders") },
              { key: "addresses", label: t("accountPage.sections.addresses") },
            ].map((item) => {
              const isActive = activeSection === item.key;
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setActiveSection(item.key as SectionKey)}
                  className={[
                    "w-full rounded-xl border px-4 py-3 text-left text-sm font-semibold transition-colors duration-200 ease-out",
                    isActive
                      ? "border-accent-gold/50 bg-warm-sand text-dark-base shadow-[0_8px_24px_-8px_rgba(17,23,19,0.12)]"
                      : "border-earth-brown/15 bg-soft-stone text-muted-gray hover:border-earth-brown/25 hover:text-dark-base",
                  ].join(" ")}
                >
                  {item.label}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => {
                void (async () => {
                  await logout();
                  router.push(`/${locale}/go-natural`);
                })();
              }}
              className="w-full rounded-xl border border-earth-brown/15 bg-soft-stone px-4 py-3 text-left text-sm font-semibold text-muted-gray transition-colors duration-200 ease-out hover:text-dark-base"
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

