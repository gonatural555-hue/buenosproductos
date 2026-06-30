"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { useCurrency } from "@/context/CurrencyContext";
import { useUser, type Order } from "@/context/UserContext";
import {
  accountPath,
  productsPath,
} from "@/lib/routing/paths";
import OrderSuccessEngagementBlock from "@/components/order-success/OrderSuccessEngagementBlock";
import GoodProductsBrandName from "@/components/good-ideas/GoodProductsBrandName";
import UsdChargeNotice from "@/components/currency/UsdChargeNotice";
import { buildContactHref } from "@/lib/checkout/contact-link";
import { readGuestOrderSnapshot } from "@/lib/checkout/guest-order";

function interpolate(template: string, vars: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? `{${k}}`);
}

type FlowStep = { title: string; description: string };

export default function OrderSuccessPage() {
  const locale = useLocale();
  const t = useTranslations();
  const { orders, lastOrderId } = useUser();
  const { formatMoney } = useCurrency();
  const [order, setOrder] = useState<Order | null>(null);

  const previewOrder = useMemo(() => {
    if (orders && orders.length > 0) {
      return lastOrderId
        ? orders.find((entry) => entry.id === lastOrderId) ?? null
        : orders[0];
    }
    const guest = readGuestOrderSnapshot();
    if (guest && (!lastOrderId || guest.id === lastOrderId)) return guest;
    return null;
  }, [orders, lastOrderId]);

  useEffect(() => {
    if (orders && orders.length > 0) {
      const found = lastOrderId
        ? orders.find((entry) => entry.id === lastOrderId)
        : orders[0];
      if (found) setOrder(found);
      return;
    }
    const guest = readGuestOrderSnapshot();
    if (guest && (!lastOrderId || guest.id === lastOrderId)) {
      setOrder(guest);
    }
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

  const formatPrice = (price: number) => formatMoney(price);

  let flowSteps: FlowStep[] = [];
  if (order) {
    const key =
      order.paymentMethod === "paypal" && order.status === "paid"
        ? "orderSuccessPage.flows.paypalPaid"
        : "orderSuccessPage.flows.default";
    const raw = t(key);
    flowSteps = Array.isArray(raw) ? (raw as FlowStep[]) : [];
  }

  const contactHref = useMemo(() => {
    if (!order) return null;
    const orderId = order.id;
    const subject = t("orderSuccessPage.contactSubject").replace(
      "{orderId}",
      orderId
    );
    const message = t("orderSuccessPage.contactPrefill").replace(
      "{orderId}",
      orderId
    );
    return buildContactHref(locale, { orderId, subject, message });
  }, [order, locale, t]);

  return (
    <main
      data-route="order-success"
      className="mx-auto max-w-7xl overflow-x-hidden bg-gn-page-bg px-4 pb-16 pt-28 sm:px-6 md:pb-20 md:pt-32 lg:px-8"
    >
      <section className="relative mx-auto mb-14 max-w-2xl text-center md:mb-16">
        <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full border border-accent-gold/40 bg-accent-gold/10 shadow-[0_0_40px_-8px_rgba(200,155,60,0.4)]">
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
        <p className="mb-4 text-[0.65rem] uppercase tracking-[0.28em] text-accent-gold/90">
          <GoodProductsBrandName locale={locale} />
        </p>
        <h1 className="font-sans mb-4 text-3xl font-semibold leading-tight tracking-tight text-dark-base md:text-[2.15rem]">
          {t("orderSuccessPage.headline")}
        </h1>
        <p className="text-base leading-relaxed text-muted-gray md:text-lg">
          {t("orderSuccessPage.subheadline")}
        </p>
        <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-muted-gray">
          {t("orderSuccessPage.emailLine")}
        </p>
        {order ? (
          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-2 rounded-xl border border-earth-brown/18 bg-soft-stone px-5 py-3 shadow-sm">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-gray">
              {t("orderSuccessPage.orderNumber")}
            </span>
            <span className="font-mono text-sm font-semibold text-accent-gold">
              {order.id}
            </span>
          </div>
        ) : null}
      </section>

      {!order ? (
        <div className="rounded-2xl border border-earth-brown/15 bg-soft-stone p-8 text-center md:p-10">
          <h2 className="mb-2 text-lg font-semibold text-dark-base">
            {t("orderSuccessPage.noOrderTitle")}
          </h2>
          <p className="mx-auto mb-8 max-w-md text-sm leading-relaxed text-muted-gray">
            {t("orderSuccessPage.noOrderHint")}
          </p>
          <div className="flex flex-col justify-center gap-3 sm:flex-row">
            <Link
              href={productsPath(locale)}
              className="inline-flex justify-center rounded-lg bg-accent-gold px-8 py-3.5 text-sm font-semibold text-dark-base shadow-lg shadow-accent-gold/20 transition hover:bg-accent-gold/90 active:scale-[0.98]"
            >
              {t("orderSuccessPage.continueShopping")}
            </Link>
            <Link
              href={accountPath(locale)}
              className="inline-flex justify-center rounded-xl border border-earth-brown/20 bg-white px-8 py-3.5 text-sm font-semibold text-dark-base transition hover:bg-warm-sand/80"
            >
              {t("orderSuccessPage.viewAccount")}
            </Link>
          </div>
        </div>
      ) : (
        <div className="mx-auto max-w-5xl space-y-10 md:space-y-12">
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-earth-brown/15 bg-soft-stone p-6 shadow-[0_10px_36px_-18px_rgba(17,23,19,0.12)] md:p-8">
              <div className="mb-6 rounded-xl border border-emerald-500/25 bg-emerald-50 px-4 py-3 text-sm leading-relaxed text-emerald-900">
                <p className="mb-1 font-semibold">
                  {t("orderSuccessPage.paymentBanner.paidTitle")}
                </p>
                <p>{t("orderSuccessPage.paymentBanner.paidBody")}</p>
              </div>

              <h2 className="mb-6 text-lg font-semibold text-dark-base">
                {t("orderSuccessPage.orderSummary")}
              </h2>

              <ul className="mb-6 space-y-4">
                {order.items.map((item) => (
                  <li
                    key={item.id}
                    className="flex items-start justify-between gap-4 border-b border-earth-brown/12 pb-4 last:border-0 last:pb-0"
                  >
                    <div className="min-w-0">
                      <p className="font-medium leading-snug text-dark-base">
                        {item.title}
                      </p>
                      <p className="mt-1 text-xs text-muted-gray">
                        {t("checkoutPage.quantity")}: {item.quantity} ×{" "}
                        {formatPrice(item.price)}
                      </p>
                    </div>
                    <span className="shrink-0 font-semibold tabular-nums text-dark-base">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </li>
                ))}
              </ul>

              <UsdChargeNotice
                amountUsd={order.subtotal}
                variant="compact"
                className="mb-6"
              />

              <div className="border-t border-earth-brown/15 pt-4">
                <div className="mb-2 flex items-center justify-between text-lg font-semibold text-dark-base">
                  <span>{t("orderSuccessPage.total")}</span>
                  <span className="tabular-nums text-accent-gold">
                    {formatPrice(order.subtotal)}
                  </span>
                </div>
                {formattedDate ? (
                  <p className="text-xs text-muted-gray">
                    {interpolate(t("orderSuccessPage.placedOn"), {
                      date: formattedDate,
                    })}
                  </p>
                ) : null}
              </div>
            </div>

            <div className="rounded-2xl border border-earth-brown/15 bg-soft-stone p-6 shadow-[0_10px_36px_-18px_rgba(17,23,19,0.12)] md:p-8">
              <h2 className="mb-6 text-lg font-semibold text-dark-base">
                {t("orderSuccessPage.shippingTitle")}
              </h2>
              <div className="space-y-2 text-sm leading-relaxed text-muted-gray">
                <p className="text-base font-semibold text-dark-base">
                  {order.address.fullName}
                </p>
                <p>
                  {order.address.addressLine1}
                  {order.address.addressLine2
                    ? `, ${order.address.addressLine2}`
                    : ""}
                </p>
                <p>
                  {order.address.city}, {order.address.state}{" "}
                  {order.address.postalCode}
                </p>
                <p>{order.address.country}</p>
                <p className="pt-3 text-dark-base">{order.address.phone}</p>
              </div>
            </div>
          </div>

          <section className="rounded-2xl border border-earth-brown/15 bg-soft-stone p-6 md:p-10">
            <h2 className="mb-8 text-center text-lg font-semibold text-dark-base md:text-left md:text-xl">
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
                    <h3 className="mb-2 text-sm font-semibold leading-snug text-dark-base">
                      {step.title}
                    </h3>
                    <p className="text-xs leading-relaxed text-muted-gray">
                      {step.description}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <OrderSuccessEngagementBlock />

          <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row sm:gap-4">
            <Link
              href={productsPath(locale)}
              className="inline-flex items-center justify-center rounded-lg bg-accent-gold px-8 py-3.5 text-sm font-semibold text-dark-base shadow-lg shadow-accent-gold/20 transition hover:bg-accent-gold/90 active:scale-[0.98]"
            >
              {t("orderSuccessPage.continueShopping")}
            </Link>
            <Link
              href={accountPath(locale)}
              className="inline-flex items-center justify-center rounded-xl border border-earth-brown/20 bg-white px-8 py-3.5 text-sm font-semibold text-dark-base transition hover:bg-warm-sand/80"
            >
              {t("orderSuccessPage.viewAccount")}
            </Link>
            {contactHref ? (
              <Link
                href={contactHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-xl border border-earth-brown/20 bg-white px-8 py-3.5 text-sm font-semibold text-dark-base transition hover:bg-warm-sand/80"
              >
                {t("orderSuccessPage.contactCta")}
              </Link>
            ) : null}
          </div>
        </div>
      )}
    </main>
  );
}
