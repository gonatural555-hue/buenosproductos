"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { useUser, type Order } from "@/context/UserContext";
import OrderSuccessEngagementBlock from "@/components/order-success/OrderSuccessEngagementBlock";

function interpolate(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}

type FlowStep = { title: string; description: string };

export default function OrderSuccessPage() {
  const locale = useLocale();
  const t = useTranslations();
  const { orders, lastOrderId } = useUser();
  const [order, setOrder] = useState<Order | null>(null);

  const previewOrder = useMemo(() => {
    if (!orders || orders.length === 0) return null;
    return lastOrderId
      ? orders.find((entry) => entry.id === lastOrderId) ?? null
      : orders[0];
  }, [orders, lastOrderId]);

  useEffect(() => {
    if (!orders || orders.length === 0) return;
    const found = lastOrderId
      ? orders.find((entry) => entry.id === lastOrderId)
      : orders[0];
    if (found) setOrder(found);
  }, [orders, lastOrderId]);

  const dateLocale =
    locale === "es"
      ? "es-AR"
      : locale === "fr"
        ? "fr-FR"
        : locale === "it"
          ? "it-IT"
          : "en-US";

  const formattedDate = useMemo(() => {
    if (!order?.date) return "";
    const date = new Date(order.date);
    return date.toLocaleDateString(dateLocale, {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, [order?.date, dateLocale]);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(dateLocale, {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  let flowSteps: FlowStep[] = [];
  if (order) {
    const key =
      order.paymentMethod === "paypal" && order.status === "paid"
        ? "orderSuccessPage.flows.paypalPaid"
        : order.paymentMethod === "whatsapp"
          ? "orderSuccessPage.flows.whatsapp"
          : "orderSuccessPage.flows.default";
    const raw = t(key);
    flowSteps = Array.isArray(raw) ? (raw as FlowStep[]) : [];
  }

  const paymentBanner = (() => {
    if (!order) return null;
    if (order.paymentMethod === "paypal" && order.status === "paid") {
      return {
        title: t("orderSuccessPage.paymentBanner.paidTitle"),
        body: t("orderSuccessPage.paymentBanner.paidBody"),
        className: "border-emerald-400/30 bg-emerald-950/35 text-emerald-100/95",
      };
    }
    if (order.paymentMethod === "whatsapp") {
      return {
        title: t("orderSuccessPage.paymentBanner.whatsappTitle"),
        body: t("orderSuccessPage.paymentBanner.whatsappBody"),
        className: "border-amber-400/35 bg-amber-950/30 text-amber-50/95",
      };
    }
    return {
      title: t("orderSuccessPage.paymentBanner.paidTitle"),
      body: t("orderSuccessPage.paymentBanner.paidBody"),
      className: "border-emerald-400/30 bg-emerald-950/35 text-emerald-100/95",
    };
  })();

  return (
    <main
      data-route="order-success"
      className="max-w-5xl mx-auto px-4 pt-28 pb-20 md:pt-32 md:pb-28 overflow-x-hidden"
    >
      {/* Hero */}
      <section className="relative text-center max-w-2xl mx-auto mb-14 md:mb-16">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-accent-gold/40 bg-accent-gold/10 shadow-[0_0_40px_-8px_rgba(200,155,60,0.4)] transition-shadow duration-700 hover:shadow-[0_0_52px_-6px_rgba(200,155,60,0.55)]">
          <svg
            className="h-9 w-9 text-accent-gold"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <p className="text-[0.65rem] uppercase tracking-[0.28em] text-accent-gold/90 mb-4">
          Go Natural
        </p>
        <h1 className="font-sans text-3xl md:text-[2.15rem] font-semibold text-text-primary tracking-tight leading-tight mb-4">
          {t("orderSuccessPage.headline")}
        </h1>
        <p className="text-base md:text-lg text-text-muted leading-relaxed">
          {t("orderSuccessPage.subheadline")}
        </p>
        <p className="mt-6 text-sm text-text-muted/95 leading-relaxed max-w-lg mx-auto">
          {previewOrder?.paymentMethod === "whatsapp"
            ? t(
                "orderSuccessPage.emailLineCoordinatingWhatsapp",
                t("orderSuccessPage.emailLine", "")
              )
            : t("orderSuccessPage.emailLine")}
        </p>
        {order && (
          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3 backdrop-blur-sm">
            <span className="text-xs font-medium uppercase tracking-wider text-text-muted">
              {t("orderSuccessPage.orderNumber")}
            </span>
            <span className="text-sm font-mono font-semibold text-accent-gold">
              {order.id}
            </span>
          </div>
        )}
      </section>

      {!order ? (
        <div className="rounded-2xl border border-white/10 bg-dark-surface/80 p-8 md:p-10 text-center backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-text-primary mb-2">
            {t("orderSuccessPage.noOrderTitle")}
          </h2>
          <p className="text-sm text-text-muted mb-8 max-w-md mx-auto leading-relaxed">
            {t("orderSuccessPage.noOrderHint")}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={`/${locale}/products`}
              className="inline-flex justify-center rounded-xl bg-accent-gold px-8 py-3.5 text-sm font-semibold text-dark-base shadow-lg shadow-accent-gold/20 transition hover:bg-accent-gold/90 active:scale-[0.98]"
            >
              {t("orderSuccessPage.continueShopping")}
            </Link>
            <Link
              href={`/${locale}/account`}
              className="inline-flex justify-center rounded-xl border border-white/20 px-8 py-3.5 text-sm font-semibold text-text-primary transition hover:bg-white/5"
            >
              {t("orderSuccessPage.viewAccount")}
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-10 md:space-y-12">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-dark-surface/70 p-6 md:p-8">
              {paymentBanner && (
                <div
                  className={`mb-6 rounded-xl border px-4 py-3 text-sm leading-relaxed ${paymentBanner.className}`}
                >
                  <p className="font-semibold mb-1">{paymentBanner.title}</p>
                  <p className="opacity-95">{paymentBanner.body}</p>
                </div>
              )}

              <h2 className="text-lg font-semibold text-text-primary mb-6">
                {t("orderSuccessPage.orderSummary")}
              </h2>

              <ul className="space-y-4 mb-8">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start justify-between gap-4 pb-4 border-b border-white/10 last:border-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="font-medium text-text-primary leading-snug">
                        {item.title}
                      </p>
                      <p className="text-xs text-text-muted mt-1">
                        {t("checkoutPage.quantity")}: {item.quantity} ×{" "}
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <span className="font-semibold tabular-nums text-text-primary shrink-0">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-white/10">
                <div className="flex items-center justify-between text-lg font-semibold text-text-primary mb-2">
                  <span>{t("orderSuccessPage.total")}</span>
                  <span className="tabular-nums text-accent-gold">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>
                {formattedDate && (
                  <p className="text-xs text-text-muted">
                    {interpolate(t("orderSuccessPage.placedOn"), {
                      date: formattedDate,
                    })}
                  </p>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-accent-gold/20 bg-gradient-to-b from-dark-surface to-dark-base p-6 md:p-8">
              <h2 className="text-lg font-semibold text-text-primary mb-6">
                {t("orderSuccessPage.shippingTitle")}
              </h2>
              <div className="text-sm space-y-2 leading-relaxed text-text-muted">
                <p className="font-semibold text-text-primary text-base">
                  {order.address.fullName}
                </p>
                <p>
                  {order.address.addressLine1}
                  {order.address.addressLine2
                    ? `, ${order.address.addressLine2}`
                    : ""}
                </p>
                <p>
                  {order.address.city}, {order.address.postalCode}
                </p>
                <p>{order.address.country}</p>
                <p className="pt-3 text-text-primary/90">{order.address.phone}</p>
              </div>
            </div>
          </div>

          {/* What happens next */}
          <section className="rounded-2xl border border-white/10 bg-dark-surface/60 p-6 md:p-10">
            <h2 className="text-lg md:text-xl font-semibold text-text-primary mb-8 text-center md:text-left">
              {t("orderSuccessPage.stepsTitle")}
            </h2>
            <ol className="grid gap-6 md:grid-cols-3 md:gap-8">
              {flowSteps.map((step, index) => (
                <li
                  key={`${step.title}-${index}`}
                  className="relative flex gap-4 md:flex-col md:text-left"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-accent-gold/35 bg-accent-gold/10 text-sm font-semibold text-accent-gold">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-semibold text-text-primary text-sm mb-2 leading-snug">
                      {step.title}
                    </h3>
                    <p className="text-xs text-text-muted leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <OrderSuccessEngagementBlock />

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center pt-2">
            <Link
              href={`/${locale}/products`}
              className="inline-flex justify-center items-center rounded-xl bg-accent-gold px-8 py-3.5 text-sm font-semibold text-dark-base shadow-lg shadow-accent-gold/20 transition hover:bg-accent-gold/90 active:scale-[0.98]"
            >
              {t("orderSuccessPage.continueShopping")}
            </Link>
            <Link
              href={`/${locale}/account`}
              className="inline-flex justify-center items-center rounded-xl border border-white/20 px-8 py-3.5 text-sm font-semibold text-text-primary transition hover:bg-white/5"
            >
              {t("orderSuccessPage.viewAccount")}
            </Link>
          </div>
        </div>
      )}
    </main>
  );
}
