"use client";

import SmartImage from "@/components/SmartImage";
import { useTranslations } from "@/components/i18n/LocaleProvider";

const CARDS_LOGO_SRC = "/assets/images/payment/cards.png";

type Props = {
  id?: string;
  className?: string;
};

function PayPalMark() {
  return (
    <span
      className="inline-flex h-7 items-center rounded border border-[#E5E5E5] bg-white px-2 font-body text-[11px] font-bold tracking-tight text-[#003087]"
      aria-hidden
    >
      Pay<span className="text-[#009CDE]">Pal</span>
    </span>
  );
}

function CardsMark() {
  return (
    <SmartImage
      src={CARDS_LOGO_SRC}
      alt="Visa, Mastercard, American Express"
      width={160}
      height={28}
      className="h-7 w-auto object-contain"
    />
  );
}

export default function CartPaymentMethods({ id = "cart-payment-methods", className = "" }: Props) {
  const t = useTranslations();

  return (
    <div id={id} className={className}>
      <p className="font-body text-sm font-semibold text-[#111111]">
        {t("goodIdeas.cart.paymentMethodsTitle")}
      </p>
      <div
        className="mt-3 flex flex-wrap items-center gap-3"
        aria-label={t("goodIdeas.cart.paymentMethodsTitle")}
      >
        <PayPalMark />
        <CardsMark />
      </div>
    </div>
  );
}
