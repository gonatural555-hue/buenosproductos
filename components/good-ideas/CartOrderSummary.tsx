"use client";

import Link from "next/link";
import CartPaymentMethods from "@/components/good-ideas/CartPaymentMethods";
import CurrencyDisclaimer from "@/components/currency/CurrencyDisclaimer";
import { useTranslations } from "@/components/i18n/LocaleProvider";
import { giCartText } from "@/lib/ui/gi-cart-light";

type Props = {
  subtotal: number;
  formatPrice: (n: number) => string;
  checkoutHref: string;
  sticky?: boolean;
  paymentMethodsId?: string;
};

export default function CartOrderSummary({
  subtotal,
  formatPrice,
  checkoutHref,
  sticky = true,
  paymentMethodsId = "cart-payment-methods",
}: Props) {
  const t = useTranslations();

  return (
    <aside
      className={
        sticky
          ? "lg:sticky lg:top-[calc(env(safe-area-inset-top,0px)+5.5rem)] lg:self-start"
          : undefined
      }
    >
      <h2 className={giCartText.summaryTitle}>{t("goodIdeas.cart.summaryTitle")}</h2>

      <div className="mt-6 space-y-3 border-t border-[#E5E5E5] pt-6">
        <div className={giCartText.summaryRow}>
          <span>{t("goodIdeas.cart.subtotal")}</span>
          <span className="tabular-nums text-[#111111]">{formatPrice(subtotal)}</span>
        </div>
        <div className={giCartText.summaryRow}>
          <span>{t("goodIdeas.cart.shippingStandard")}</span>
          <span className="text-[#111111]">{t("goodIdeas.cart.shippingFree")}</span>
        </div>
      </div>

      <div className={`mt-6 border-t border-[#E5E5E5] pt-6 ${giCartText.summaryTotal}`}>
        <span>{t("goodIdeas.cart.estimatedTotal")}</span>
        <span className="tabular-nums">{formatPrice(subtotal)}</span>
      </div>

      <Link href={checkoutHref} className={`mt-6 ${giCartText.cta}`}>
        {t("goodIdeas.cart.checkout")}
      </Link>

      <CurrencyDisclaimer className="mt-4 font-body text-xs text-[#737373]" />

      <CartPaymentMethods id={paymentMethodsId} className="mt-8" />
    </aside>
  );
}
