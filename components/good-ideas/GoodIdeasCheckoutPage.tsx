"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import PayPalButton from "@/components/PayPalButton";
import {
  MercadoPagoMark,
  PayPalMark,
  WhatsAppMark,
} from "@/components/payment/PaymentBrandMarks";
import CheckoutAddressFields from "@/components/checkout/CheckoutAddressFields";
import CheckoutLegalFooter from "@/components/checkout/CheckoutLegalFooter";
import CheckoutShippingRequiredModal from "@/components/checkout/CheckoutShippingRequiredModal";
import CheckoutOrderSummary, {
  CheckoutMobileSummaryAccordion,
} from "@/components/checkout/CheckoutOrderSummary";
import CheckoutShell from "@/components/checkout/CheckoutShell";
import UsdChargeNotice from "@/components/currency/UsdChargeNotice";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { useCurrency } from "@/context/CurrencyContext";
import { useGoodIdeasCart } from "@/context/GoodIdeasCartContext";
import { useUser, type Address, type Order } from "@/context/UserContext";
import { createEmptyCheckoutAddress } from "@/lib/checkout/defaults";
import { persistGuestOrderSnapshot } from "@/lib/checkout/guest-order";
import {
  isCheckoutAddressComplete,
  isValidEmail,
  trimCheckoutAddress,
} from "@/lib/checkout/validation";
import {
  computePayPalCheckoutTotal,
  computePayPalSurcharge,
  type CheckoutPaymentMethod,
} from "@/lib/checkout/payment-methods";
import {
  buildWhatsAppHref,
  buildWhatsAppOrderMessage,
  buildWhatsAppSupportHrefFromNumber,
} from "@/lib/checkout/whatsapp";
import {
  authPath,
  orderSuccessPath,
  productsPath,
} from "@/lib/routing/paths";
import {
  cartLineToGa4Item,
  trackBeginCheckout,
  trackPurchase,
} from "@/lib/analytics/ga4";
import { getColorVariantLabel } from "@/lib/cart-line-id";
import { formatCartVariantSummary } from "@/lib/cart-formatting";
import { isSupabaseConfigured } from "@/lib/supabase/browser";

import {
  checkoutInputClass,
  checkoutPaymentCardClass,
  checkoutSectionTitleClass,
} from "@/lib/ui/checkout-form";
import { giCartText } from "@/lib/ui/gi-cart-light";

type BillingMode = "same" | "different";

type Props = {
  whatsappNumber: string | null;
  whatsappConfigured: boolean;
};

export default function GoodIdeasCheckoutPage({
  whatsappNumber,
  whatsappConfigured,
}: Props) {
  const { items, subtotal, clearCart } = useGoodIdeasCart();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const { formatMoney } = useCurrency();
  const {
    user,
    isLoggedIn,
    authLoading,
    addresses,
    upsertAddress,
    addOrder,
    refreshOrders,
  } = useUser();

  const [contactEmail, setContactEmail] = useState("");
  const [shippingForm, setShippingForm] = useState<Address>(
    createEmptyCheckoutAddress()
  );
  const [billingForm, setBillingForm] = useState<Address>(
    createEmptyCheckoutAddress()
  );
  const [billingMode, setBillingMode] = useState<BillingMode>("same");
  const [saveAsDefault, setSaveAsDefault] = useState(true);
  const [editShipping, setEditShipping] = useState(false);
  const [shippingInfoOpen, setShippingInfoOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] =
    useState<CheckoutPaymentMethod>("whatsapp");
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const [shippingRequiredModalOpen, setShippingRequiredModalOpen] =
    useState(false);
  const beginCheckoutTracked = useRef(false);

  const paypalSurcharge = useMemo(
    () => computePayPalSurcharge(subtotal),
    [subtotal]
  );
  const paypalTotal = useMemo(
    () => computePayPalCheckoutTotal(subtotal),
    [subtotal]
  );
  const checkoutTotal =
    paymentMethod === "paypal" ? paypalTotal : subtotal;
  const whatsappReady = whatsappConfigured;
  const supportWhatsAppHref = buildWhatsAppSupportHrefFromNumber(
    whatsappNumber,
    t("checkoutPage.checkoutQuestionsPrefill")
  );

  const savedAddress =
    addresses.find((a) => a.isDefault) || addresses[0];

  useEffect(() => {
    if (user?.email) setContactEmail(user.email);
    if (user?.name && !savedAddress) {
      setShippingForm((prev) =>
        prev.fullName ? prev : createEmptyCheckoutAddress(user.name)
      );
    }
  }, [user?.email, user?.name, savedAddress]);

  useEffect(() => {
    if (items.length === 0) {
      beginCheckoutTracked.current = false;
      return;
    }
    if (beginCheckoutTracked.current) return;
    beginCheckoutTracked.current = true;
    trackBeginCheckout(
      items.map((item) => cartLineToGa4Item(item, item.quantity))
    );
  }, [items, subtotal]);

  const formatPrice = (n: number) => formatMoney(n);

  const cartLines = useMemo(
    () =>
      items.map((item) => {
        const colorLabel = getColorVariantLabel(item.variantSelections);
        return {
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          variantSummary: colorLabel
            ? `${t("cartPage.variantLabels.color")}: ${colorLabel}`
            : undefined,
        };
      }),
    [items, t]
  );

  const resolvedShipping = useMemo((): Address | null => {
    if (savedAddress && !editShipping) return savedAddress;
    if (isCheckoutAddressComplete(shippingForm)) {
      return trimCheckoutAddress(shippingForm);
    }
    return null;
  }, [savedAddress, editShipping, shippingForm]);

  const resolvedBilling = useMemo((): Address | null => {
    if (billingMode === "same") return resolvedShipping;
    if (isCheckoutAddressComplete(billingForm)) {
      return trimCheckoutAddress(billingForm);
    }
    return null;
  }, [billingMode, resolvedShipping, billingForm]);

  const contactReady = isLoggedIn
    ? Boolean(user?.email)
    : isValidEmail(contactEmail);

  const canPay = Boolean(resolvedShipping && resolvedBilling && contactReady);

  const summaryProps = {
    items: cartLines,
    cartSubtotal: subtotal,
    checkoutTotal,
    paymentMethod,
    paypalSurcharge,
    formatPrice,
    shippingReady: Boolean(resolvedShipping),
  };

  const ensureAddressSaved = async (): Promise<Address | null> => {
    if (!resolvedShipping) return null;
    if (!isLoggedIn) return resolvedShipping;
    if (savedAddress && !editShipping) return savedAddress;
    if (!saveAsDefault) return resolvedShipping;

    const saved = await upsertAddress({
      ...resolvedShipping,
      id: savedAddress?.id || "",
      isDefault: true,
    });
    return saved ?? resolvedShipping;
  };

  const shippingDataReady = Boolean(resolvedShipping && resolvedBilling);

  const scrollToShippingSection = () => {
    document
      .getElementById("checkout-shipping")
      ?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleFinishPurchaseClick = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.stopPropagation();
    if (!whatsappReady || items.length === 0 || isPaying) return;

    if (!shippingDataReady) {
      setShippingRequiredModalOpen(true);
      return;
    }

    if (!contactReady) {
      setPaymentError(t("checkoutPage.guestEmailRequired"));
      document
        .getElementById("checkout-contact")
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }

    void handleWhatsAppCoordinar();
  };

  const handleWhatsAppCoordinar = async () => {
    if (items.length === 0) return;
    if (!whatsappReady) {
      setPaymentError(t("checkoutPage.whatsappNotConfigured"));
      return;
    }

    const phone = whatsappNumber;
    if (!phone) {
      setPaymentError(t("checkoutPage.whatsappNotConfigured"));
      return;
    }

    setIsPaying(true);
    setPaymentError(null);

    const shippingAddress = await ensureAddressSaved();
    if (!shippingAddress) {
      setPaymentError(t("checkoutPage.whatsappNeedsAddress"));
      setIsPaying(false);
      return;
    }

    const orderId = `order_${Date.now()}`;
    const email = isLoggedIn ? user?.email || "" : contactEmail.trim();

    try {
      const response = await fetch("/api/orders/whatsapp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          orderId,
          email,
          items: items.map((item) => ({
            id: item.productId,
            title: item.title,
            price: item.price,
            quantity: item.quantity,
          })),
          totalAmount: subtotal,
          currency: "USD",
          shippingAddress,
          billingAddress:
            billingMode === "same" ? null : resolvedBilling,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        setPaymentError(
          typeof data?.error === "string"
            ? data.error
            : t("checkoutPage.paymentFailed")
        );
        setIsPaying(false);
        return;
      }

      if (isLoggedIn) await refreshOrders();

      const totalLabel = formatMoney(subtotal);
      const message = buildWhatsAppOrderMessage({
        template: t("checkoutPage.whatsappPrefillBody"),
        orderId,
        totalLabel,
        email,
        items: items.map((item) => ({
          title: item.title,
          quantity: item.quantity,
          price: item.price,
          priceLabel: formatMoney(item.price),
          variantSummary: formatCartVariantSummary(
            item.variantSelections,
            undefined,
            t
          ),
        })),
        address: shippingAddress,
      });

      const order: Order = {
        id: orderId,
        items,
        subtotal,
        address: shippingAddress,
        date: new Date().toISOString(),
        status: "pending",
        paymentMethod: "whatsapp",
      };

      addOrder(order);
      if (!isLoggedIn) persistGuestOrderSnapshot(order);

      clearCart();
      window.open(buildWhatsAppHref(phone, message), "_blank", "noopener,noreferrer");
      router.push(orderSuccessPath(locale));
    } catch (err) {
      console.error("[Checkout] WhatsApp", err);
      setPaymentError(t("checkoutPage.paymentFailed"));
      setIsPaying(false);
    }
  };

  const handlePayPalSuccess = async (details: { id?: string }) => {
    if (items.length === 0 || !canPay) return;

    setIsPaying(true);
    setPaymentError(null);

    const shippingAddress = await ensureAddressSaved();
    if (!shippingAddress) {
      setPaymentError(t("checkoutPage.paypalNeedsAddress"));
      setIsPaying(false);
      return;
    }

    const orderId = `order_${Date.now()}`;
    const email = isLoggedIn ? user?.email || "" : contactEmail.trim();

    try {
      const payload = {
        orderId,
        email,
        items: items.map((item) => ({
          id: item.productId,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: paypalTotal,
        currency: "USD" as const,
        paypalOrderId: details?.id,
        shippingAddress,
        billingAddress:
          billingMode === "same" ? null : resolvedBilling,
      };

      const response = await fetch("/api/orders/paypal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok || !data?.success) {
        setPaymentError(
          typeof data?.error === "string"
            ? data.error
            : t("checkoutPage.paymentFailed")
        );
        setIsPaying(false);
        return;
      }

      if (isLoggedIn) await refreshOrders();

      trackPurchase({
        transaction_id: orderId,
        value: paypalTotal,
        currency: "USD",
        items: items.map((item) =>
          cartLineToGa4Item(item, item.quantity)
        ),
      });

      const order: Order = {
        id: orderId,
        items,
        subtotal: paypalTotal,
        address: shippingAddress,
        date: new Date().toISOString(),
        status: "paid",
        paymentMethod: "paypal",
        paypalOrderId: details.id,
      };

      addOrder(order);
      if (!isLoggedIn) persistGuestOrderSnapshot(order);

      clearCart();
      router.push(orderSuccessPath(locale));
    } catch (err) {
      console.error("[Checkout] PayPal", err);
      setPaymentError(t("checkoutPage.paymentFailed"));
      setIsPaying(false);
    }
  };

  if (!isSupabaseConfigured()) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center px-4">
        <p className="text-sm text-[#737373]">{t("checkoutPage.supabaseMissing")}</p>
      </main>
    );
  }

  if (authLoading) {
    return (
      <main className="flex min-h-[100dvh] items-center justify-center px-4">
        <p className="text-sm text-[#737373]">{t("checkoutPage.loadingAuth")}</p>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="flex min-h-[100dvh] flex-col items-center justify-center gap-6 px-4 text-center">
        <h1 className="text-2xl font-semibold text-[#111]">
          {t("checkoutPage.emptyTitle")}
        </h1>
        <p className="text-[#737373]">{t("checkoutPage.emptyText")}</p>
        <Link
          href={productsPath(locale)}
          className="rounded-md bg-[#111] px-6 py-3 text-sm font-semibold text-white"
        >
          {t("checkoutPage.emptyCta")}
        </Link>
      </main>
    );
  }

  const left = (
    <div className="space-y-10">
      {/* Contacto */}
      <section id="checkout-contact">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className={checkoutSectionTitleClass}>
            {t("checkoutPage.contactSection")}
          </h2>
          {!isLoggedIn ? (
            <Link
              href={authPath(locale, `/${locale}/checkout`)}
              className="text-sm text-[#111] underline underline-offset-2"
            >
              {t("checkoutPage.signInLink")}
            </Link>
          ) : null}
        </div>
        {isLoggedIn ? (
          <p className="text-sm text-[#737373]">
            {t("checkoutPage.emailNote")}{" "}
            <span className="font-medium text-[#111]">{user?.email}</span>
          </p>
        ) : (
          <input
            type="email"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
            placeholder={t("checkoutPage.form.email")}
            className={checkoutInputClass}
            autoComplete="email"
            required
          />
        )}
      </section>

      {/* Entrega */}
      <section id="checkout-shipping">
        <h2 className={`${checkoutSectionTitleClass} mb-4`}>
          {t("checkoutPage.shippingAddress")}
        </h2>

        {savedAddress && !editShipping ? (
          <div className="space-y-3 text-sm leading-relaxed text-[#737373]">
            <p className="font-medium text-[#111]">{savedAddress.fullName}</p>
            <p>
              {savedAddress.addressLine1}
              {savedAddress.addressLine2
                ? `, ${savedAddress.addressLine2}`
                : ""}
            </p>
            <p>
              {savedAddress.city}, {savedAddress.state}{" "}
              {savedAddress.postalCode}
            </p>
            <p>{savedAddress.country}</p>
            <p>{savedAddress.phone}</p>
            <button
              type="button"
              onClick={() => {
                setEditShipping(true);
                setShippingForm(savedAddress);
              }}
              className="text-sm font-medium text-[#111] underline underline-offset-2"
            >
              {t("checkoutPage.editAddress")}
            </button>
          </div>
        ) : (
          <>
            <CheckoutAddressFields
              value={shippingForm}
              onChange={setShippingForm}
            />
            {isLoggedIn ? (
              <label className="mt-4 flex cursor-pointer items-start gap-2 text-sm text-[#737373]">
                <input
                  type="checkbox"
                  checked={saveAsDefault}
                  onChange={(e) => setSaveAsDefault(e.target.checked)}
                  className="mt-1"
                />
                {t("checkoutPage.saveAsDefault")}
              </label>
            ) : null}
          </>
        )}

        <div className="mt-6 rounded-md border border-[#DEDEDE] bg-[#FAFAFA] px-4 py-4 text-sm">
          <p className="font-medium text-[#111]">
            {t("checkoutPage.shippingMethodsTitle")}
          </p>
          <p className="mt-1 text-[#737373]">
            {resolvedShipping
              ? t("checkoutPage.shippingFree")
              : t("checkoutPage.shippingMethodsPlaceholder")}
          </p>
        </div>

        <button
          type="button"
          className="mt-4 flex w-full items-center justify-between rounded-md border border-[#DEDEDE] px-4 py-3 text-left text-sm font-medium text-[#111]"
          onClick={() => setShippingInfoOpen((v) => !v)}
          aria-expanded={shippingInfoOpen}
        >
          {t("checkoutPage.shippingInfoTitle")}
          <span aria-hidden>{shippingInfoOpen ? "−" : "+"}</span>
        </button>
        {shippingInfoOpen ? (
          <p className="mt-2 text-sm leading-relaxed text-[#737373]">
            {t("checkoutPage.shippingInfoBody")}
          </p>
        ) : null}
      </section>

      {/* Pago */}
      <section>
        <h2 className={`${checkoutSectionTitleClass} mb-2`}>
          {t("checkoutPage.paymentMethod")}
        </h2>
        <p className="mb-4 font-body text-sm text-[#737373]">
          {t("checkoutPage.paymentHintManual")}
        </p>

        <div className="space-y-4">
          {/* Transferencia / Mercado Pago */}
          <div
            className={checkoutPaymentCardClass(paymentMethod === "whatsapp")}
            role="button"
            tabIndex={0}
            onClick={() => setPaymentMethod("whatsapp")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setPaymentMethod("whatsapp");
              }
            }}
          >
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="radio"
                name="payment-method"
                className="mt-1.5"
                checked={paymentMethod === "whatsapp"}
                onChange={() => setPaymentMethod("whatsapp")}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <MercadoPagoMark size="md" />
                  <span className="font-body text-base font-semibold text-[#111]">
                    {t("checkoutPage.paymentOptions.manual.label")}
                  </span>
                </div>
                <p className="mt-2 font-body text-sm leading-relaxed text-[#737373]">
                  {t("checkoutPage.manualPaymentDescription")}
                </p>
              </div>
            </label>
            {paymentMethod === "whatsapp" ? (
              <div className="mt-4 border-t border-accent-gold/25 pt-4">
                {!whatsappReady ? (
                  <p className="text-sm text-red-700" role="alert">
                    {t("checkoutPage.whatsappNotConfigured")}
                  </p>
                ) : (
                  <button
                    type="button"
                    disabled={isPaying}
                    onClick={handleFinishPurchaseClick}
                    className={`${giCartText.cta} disabled:cursor-not-allowed disabled:opacity-60`}
                  >
                    {isPaying
                      ? t("checkoutPage.processingPayment")
                      : t("checkoutPage.manualPaymentCta")}
                  </button>
                )}
              </div>
            ) : null}
          </div>

          {/* PayPal + recargo */}
          <div
            className={checkoutPaymentCardClass(paymentMethod === "paypal")}
            role="button"
            tabIndex={0}
            onClick={() => setPaymentMethod("paypal")}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setPaymentMethod("paypal");
              }
            }}
          >
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="radio"
                name="payment-method"
                className="mt-1.5"
                checked={paymentMethod === "paypal"}
                onChange={() => setPaymentMethod("paypal")}
              />
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <PayPalMark />
                </div>
                <p className="mt-2 font-body text-sm leading-relaxed text-[#737373]">
                  {t("checkoutPage.paypalSurchargeHint")}
                </p>
              </div>
            </label>
            {paymentMethod === "paypal" ? (
              <div className="mt-4 space-y-4 border-t border-accent-gold/25 pt-4">
                <UsdChargeNotice amountUsd={paypalTotal} />
                <div className="rounded-lg border border-[#E5E5E5] bg-white/80 p-4">
                  {canPay ? (
                    <div
                      className={
                        isPaying ? "pointer-events-none opacity-60" : ""
                      }
                    >
                      <PayPalButton
                        amount={paypalTotal}
                        currency="USD"
                        onSuccess={handlePayPalSuccess}
                        onError={() => {
                          setPaymentError(t("checkoutPage.paymentFailed"));
                          setIsPaying(false);
                        }}
                        onCancel={() => setIsPaying(false)}
                      />
                    </div>
                  ) : (
                    <p className="font-body text-sm text-[#737373]">
                      {!contactReady
                        ? t("checkoutPage.guestEmailRequired")
                        : t("checkoutPage.paypalNeedsAddress")}
                    </p>
                  )}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {paymentError ? (
          <p className="mt-3 text-sm text-red-700" role="alert">
            {paymentError}
          </p>
        ) : null}
      </section>

      {/* Facturación */}
      <section>
        <h2 className={`${checkoutSectionTitleClass} mb-4`}>
          {t("checkoutPage.billingTitle")}
        </h2>
        <div className="space-y-0 overflow-hidden rounded-md border border-[#DEDEDE]">
          <label className="flex cursor-pointer items-center gap-3 border-b border-[#DEDEDE] px-4 py-3.5">
            <input
              type="radio"
              name="billing"
              checked={billingMode === "same"}
              onChange={() => setBillingMode("same")}
            />
            <span className="text-sm text-[#111]">
              {t("checkoutPage.billingSameAsShipping")}
            </span>
          </label>
          <label className="flex cursor-pointer items-center gap-3 px-4 py-3.5">
            <input
              type="radio"
              name="billing"
              checked={billingMode === "different"}
              onChange={() => setBillingMode("different")}
            />
            <span className="text-sm text-[#111]">
              {t("checkoutPage.billingDifferent")}
            </span>
          </label>
        </div>
        {billingMode === "different" ? (
          <div className="mt-4">
            <CheckoutAddressFields
              value={billingForm}
              onChange={setBillingForm}
              idPrefix="bill"
            />
          </div>
        ) : null}
      </section>

      {/* Consultas — fuera de métodos de pago */}
      <section className="rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] px-5 py-5">
        <h2 className={`${checkoutSectionTitleClass} mb-2 text-[22px] md:text-[24px]`}>
          {t("checkoutPage.checkoutQuestionsTitle")}
        </h2>
        <p className="font-body text-sm leading-relaxed text-[#737373]">
          {t("checkoutPage.checkoutQuestionsBody")}
        </p>
        {supportWhatsAppHref ? (
          <a
            href={supportWhatsAppHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-2 rounded-full border border-[#25D366]/40 bg-white px-5 py-2.5 font-body text-sm font-semibold text-[#128C7E] transition hover:border-[#25D366] hover:bg-[#25D366]/5"
          >
            <WhatsAppMark size="sm" />
            {t("checkoutPage.checkoutQuestionsCta")}
          </a>
        ) : (
          <p className="mt-3 text-sm text-[#737373]">
            {t("checkoutPage.whatsappNotConfigured")}
          </p>
        )}
      </section>

      <CheckoutLegalFooter />
    </div>
  );

  const right = (
    <>
      <CheckoutMobileSummaryAccordion {...summaryProps} />
      <div className="hidden lg:block">
        <CheckoutOrderSummary {...summaryProps} />
      </div>
    </>
  );

  return (
    <>
      <CheckoutShell left={left} right={right} />
      <CheckoutShippingRequiredModal
        open={shippingRequiredModalOpen}
        title={t("checkoutPage.shippingRequiredModalTitle")}
        body={t("checkoutPage.shippingRequiredModalBody")}
        closeLabel={t("checkoutPage.shippingRequiredModalClose")}
        actionLabel={t("checkoutPage.shippingRequiredModalAction")}
        onClose={() => setShippingRequiredModalOpen(false)}
        onAction={() => {
          setShippingRequiredModalOpen(false);
          scrollToShippingSection();
        }}
      />
    </>
  );
}
