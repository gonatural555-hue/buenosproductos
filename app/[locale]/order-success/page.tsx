"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { useCurrency } from "@/context/CurrencyContext";
import { useUser, type Order } from "@/context/UserContext";
import {
  accountSectionPath,
  productsPath,
} from "@/lib/routing/paths";
import OrderSuccessEngagementBlock from "@/components/order-success/OrderSuccessEngagementBlock";
import OrderSuccessHero from "@/components/order-success/OrderSuccessHero";
import OrderNumberCapsule from "@/components/order-success/OrderNumberCapsule";
import OrderSummaryCard from "@/components/order-success/OrderSummaryCard";
import OrderDeliveryCard from "@/components/order-success/OrderDeliveryCard";
import OrderPaymentAlert from "@/components/order-success/OrderPaymentAlert";
import OrderWhatHappensNext from "@/components/order-success/OrderWhatHappensNext";
import OrderTrustSection from "@/components/order-success/OrderTrustSection";
import OrderSuccessCtas from "@/components/order-success/OrderSuccessCtas";
import { buildContactHref } from "@/lib/checkout/contact-link";
import { readGuestOrderSnapshot } from "@/lib/checkout/guest-order";
import { buildWhatsAppSupportHref } from "@/lib/checkout/whatsapp";
import { GI_DTC } from "@/lib/ui/gi-pdp-dtc";
import { GI_ORDER_SUCCESS_TOP_PAD } from "@/lib/ui/goodideas-design";
import { giCartText } from "@/lib/ui/gi-cart-light";

type FlowStep = { title: string; description: string };
type TrustItem = { title: string; description: string };

export default function OrderSuccessPage() {
  const locale = useLocale();
  const t = useTranslations();
  const { orders, lastOrderId, user } = useUser();
  const { formatMoney } = useCurrency();
  const [order, setOrder] = useState<Order | null>(null);

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

  const dateLocale = locale === "es" ? "es-AR" : "en-US";

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

  const whatHappensSteps = useMemo(() => {
    const raw = t("orderSuccessPage.whatHappensSteps");
    return Array.isArray(raw) ? (raw as FlowStep[]) : [];
  }, [t]);

  const trustItems = useMemo(() => {
    const raw = t("orderSuccessPage.trustItems");
    return Array.isArray(raw) ? (raw as TrustItem[]) : [];
  }, [t]);

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

  const whatsappHref = useMemo(() => {
    if (!order) return null;
    const message = t("orderSuccessPage.whatsappMessage")
      .replace("{orderId}", order.id)
      .replace("{amount}", formatMoney(order.subtotal));
    return buildWhatsAppSupportHref(message);
  }, [order, t, formatMoney]);

  const hintLine = useMemo(() => {
    if (!order) return t("orderSuccessPage.emailLine");
    if (order.paymentMethod === "whatsapp" || order.status === "pending") {
      return t("orderSuccessPage.emailLineCoordinatingWhatsapp");
    }
    return t("orderSuccessPage.emailLine");
  }, [order, t]);

  return (
    <main
      data-route="order-success"
      className={`overflow-x-hidden bg-white text-[#111111] ${GI_ORDER_SUCCESS_TOP_PAD}`}
    >
      <OrderSuccessHero
        title={t("orderSuccessPage.headline")}
        subtitle={t("orderSuccessPage.subheadline")}
        hint={hintLine}
      />

      <div className={GI_DTC.container}>
        {order ? (
          <OrderNumberCapsule
            orderId={order.id}
            label={t("orderSuccessPage.orderNumber")}
            copyLabel={t("orderSuccessPage.copyOrder")}
            copiedLabel={t("orderSuccessPage.copiedOrder")}
          />
        ) : null}

        {!order ? (
          <section className="mx-auto max-w-lg py-10 md:py-14">
            <div className="rounded-[20px] border border-[#ECECEC] bg-white p-8 text-center shadow-[0_8px_28px_rgba(0,0,0,0.06)] md:p-10">
              <h2 className={giCartText.title}>{t("orderSuccessPage.noOrderTitle")}</h2>
              <p className="mx-auto mt-3 max-w-md font-body text-[15px] leading-relaxed text-[#6B7280]">
                {t("orderSuccessPage.noOrderHint")}
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <Link href={productsPath(locale)} className={giCartText.cta}>
                  {t("orderSuccessPage.continueShopping")}
                </Link>
                <Link
                  href={accountSectionPath(locale, "orders")}
                  className="inline-flex min-h-[48px] items-center justify-center rounded-full border border-[#E5E5E5] px-6 font-body text-sm font-semibold text-[#111111] transition hover:bg-[#FAFAFA]"
                >
                  {t("orderSuccessPage.viewAccount")}
                </Link>
              </div>
            </div>
          </section>
        ) : (
          <>
            <section className="pb-4 md:pb-6">
              <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
                <OrderSummaryCard
                  order={order}
                  formatPrice={formatPrice}
                  formattedDate={formattedDate}
                />
                <div className="flex flex-col gap-6">
                  <OrderPaymentAlert order={order} />
                  <OrderDeliveryCard order={order} customerEmail={user?.email} />
                </div>
              </div>
            </section>

            <OrderWhatHappensNext
              title={t("orderSuccessPage.stepsTitle")}
              subtitle={t("orderSuccessPage.stepsSubtitle")}
              steps={whatHappensSteps}
            />

            <OrderTrustSection items={trustItems} />

            <OrderSuccessCtas
              viewOrderHref={accountSectionPath(locale, "orders")}
              viewOrderLabel={t("orderSuccessPage.viewAccount")}
              continueShoppingHref={productsPath(locale)}
              continueShoppingLabel={t("orderSuccessPage.continueShopping")}
              whatsappHref={whatsappHref}
              whatsappLabel={t("orderSuccessPage.whatsappCta")}
              contactHref={contactHref}
              contactLabel={t("orderSuccessPage.contactCta")}
            />

            <div className="border-t border-[#E5E7EB] pb-12 md:pb-16">
              <OrderSuccessEngagementBlock />
            </div>
          </>
        )}
      </div>
    </main>
  );
}
