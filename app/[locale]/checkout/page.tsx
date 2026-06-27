"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import PayPalButton from "@/components/PayPalButton";
import CheckoutAddressFields from "@/components/checkout/CheckoutAddressFields";
import CheckoutLegalFooter from "@/components/checkout/CheckoutLegalFooter";
import CheckoutOrderSummary, {
  CheckoutMobileSummaryAccordion,
} from "@/components/checkout/CheckoutOrderSummary";
import CheckoutShell from "@/components/checkout/CheckoutShell";
import UsdChargeNotice from "@/components/currency/UsdChargeNotice";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { useCurrency } from "@/context/CurrencyContext";
import { useCart } from "@/context/CartContext";
import { useUser, type Address, type Order } from "@/context/UserContext";
import { createEmptyCheckoutAddress } from "@/lib/checkout/defaults";
import { persistGuestOrderSnapshot } from "@/lib/checkout/guest-order";
import {
  isCheckoutAddressComplete,
  isValidEmail,
  trimCheckoutAddress,
} from "@/lib/checkout/validation";
import { formatCartVariantSummary } from "@/lib/cart-formatting";
import { isSupabaseConfigured } from "@/lib/supabase/browser";
import {
  cartLineToGa4Item,
  trackBeginCheckout,
  trackPurchase,
} from "@/lib/analytics/ga4";
import {
  checkoutInputClass,
  checkoutRadioCardClass,
  checkoutSectionTitleClass,
} from "@/lib/ui/checkout-form";

type BillingMode = "same" | "different";

export default function CheckoutPage() {
  const { items, subtotal, clearCart } = useCart();
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
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [isPaying, setIsPaying] = useState(false);
  const beginCheckoutTracked = useRef(false);

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
      items.map((item) => ({
        id: item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        image: item.image,
        variantSummary: formatCartVariantSummary(
          item.variantSelections,
          item.variantSummary,
          t
        ),
      })),
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
    subtotal,
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
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
        })),
        totalAmount: subtotal,
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
        value: subtotal,
        currency: "USD",
        items: items.map((item) =>
          cartLineToGa4Item(item, item.quantity)
        ),
      });

      const order: Order = {
        id: orderId,
        items,
        subtotal,
        address: shippingAddress,
        date: new Date().toISOString(),
        status: "paid",
        paymentMethod: "paypal",
        paypalOrderId: details.id,
      };

      addOrder(order);
      if (!isLoggedIn) persistGuestOrderSnapshot(order);

      clearCart();
      router.push(`/${locale}/order-success`);
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
          href={`/${locale}/products`}
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
      <section>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className={checkoutSectionTitleClass}>
            {t("checkoutPage.contactSection")}
          </h2>
          {!isLoggedIn ? (
            <Link
              href={`/${locale}/auth?redirect=/${locale}/checkout`}
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
      <section>
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
        <p className="mb-4 text-sm text-[#737373]">
          {t("checkoutPage.paymentSecureNote")}
        </p>

        <UsdChargeNotice amountUsd={subtotal} className="mb-4" />

        <div className={checkoutRadioCardClass(true)}>
          <div className="flex items-center gap-3">
            <span
              className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-[5px] border-[#111]"
              aria-hidden
            />
            <span className="text-sm font-semibold text-[#111]">PayPal</span>
          </div>
          <p className="mt-3 text-xs leading-relaxed text-[#737373]">
            {t("checkoutPage.paymentPayPalHighlight")}{" "}
            {t("checkoutPage.trustPayPalProtection")}
          </p>
          <div className="mt-4 rounded-md bg-[#F5F5F5] p-4">
            {canPay ? (
              <div className={isPaying ? "pointer-events-none opacity-60" : ""}>
                <PayPalButton
                  amount={subtotal}
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
              <p className="text-sm text-[#737373]">
                {!contactReady
                  ? t("checkoutPage.guestEmailRequired")
                  : t("checkoutPage.paypalNeedsAddress")}
              </p>
            )}
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

  return <CheckoutShell left={left} right={right} />;
}
