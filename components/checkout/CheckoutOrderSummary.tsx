"use client";

import { useState } from "react";
import SmartImage from "@/components/SmartImage";
import CartPaymentMethods from "@/components/good-ideas/CartPaymentMethods";
import UsdChargeNotice from "@/components/currency/UsdChargeNotice";
import { useTranslations } from "@/components/i18n/LocaleProvider";

type CartLine = {
  id: string;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  variantSummary?: string;
};

type Props = {
  items: CartLine[];
  subtotal: number;
  formatPrice: (n: number) => string;
  shippingReady: boolean;
};

export default function CheckoutOrderSummary({
  items,
  subtotal,
  formatPrice,
  shippingReady,
}: Props) {
  const t = useTranslations();

  return (
    <div>
      <ul className="space-y-4">
        {items.map((item) => (
          <li key={item.id} className="flex gap-4">
            <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-white">
              {item.image ? (
                <SmartImage
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover object-center"
                  sizes="64px"
                />
              ) : null}
              <span className="absolute -right-1.5 -top-1.5 flex h-5 min-w-[1.25rem] items-center justify-center rounded-full bg-[#111] px-1 text-[10px] font-semibold text-white">
                {item.quantity}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="line-clamp-2 text-sm font-medium leading-snug text-[#111]">
                {item.title}
              </p>
              {item.variantSummary ? (
                <p className="mt-0.5 text-xs text-[#737373]">{item.variantSummary}</p>
              ) : null}
            </div>
            <p className="shrink-0 text-sm font-medium tabular-nums text-[#111]">
              {formatPrice(item.price * item.quantity)}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-6 space-y-3 border-t border-[#E5E5E5] pt-6 text-sm">
        <div className="flex justify-between gap-4 text-[#737373]">
          <span>{t("checkoutPage.subtotal")}</span>
          <span className="tabular-nums text-[#111]">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex justify-between gap-4 text-[#737373]">
          <span>{t("checkoutPage.shipping")}</span>
          <span className="text-[#111]">
            {shippingReady
              ? t("checkoutPage.shippingFree")
              : t("checkoutPage.shippingEnterAddress")}
          </span>
        </div>
      </div>

      <UsdChargeNotice amountUsd={subtotal} variant="compact" className="mt-4" />

      <div className="mt-6 flex items-baseline justify-between gap-4 border-t border-[#E5E5E5] pt-6">
        <span className="text-base font-semibold text-[#111]">
          {t("checkoutPage.total")}
        </span>
        <span className="text-xl font-semibold tabular-nums text-[#111]">
          {formatPrice(subtotal)}
        </span>
      </div>

      <CartPaymentMethods id="checkout-payment-methods" className="mt-8" />
    </div>
  );
}

export function CheckoutMobileSummaryAccordion({
  items,
  subtotal,
  formatPrice,
  shippingReady,
}: Props) {
  const t = useTranslations();
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-3 py-1 text-left"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        <span className="text-sm font-medium text-[#111]">
          {t("checkoutPage.mobileSummaryToggle")}
        </span>
        <span className="flex items-center gap-2 text-sm font-semibold tabular-nums text-[#111]">
          {formatPrice(subtotal)}
          <svg
            className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m19 9-7 7-7-7" />
          </svg>
        </span>
      </button>
      {open ? (
        <div className="mt-4 border-t border-[#E5E5E5] pt-4">
          <CheckoutOrderSummary
            items={items}
            subtotal={subtotal}
            formatPrice={formatPrice}
            shippingReady={shippingReady}
          />
        </div>
      ) : null}
    </div>
  );
}
