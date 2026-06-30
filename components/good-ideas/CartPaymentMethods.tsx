"use client";

import SmartImage from "@/components/SmartImage";
import {
  MercadoPagoMark,
  PayPalMark,
} from "@/components/payment/PaymentBrandMarks";
import { useTranslations } from "@/components/i18n/LocaleProvider";

const CARDS_LOGO_SRC = "/assets/images/payment/cards.png";

type Props = {
  id?: string;
  className?: string;
};

function CardsMark() {
  return (
    <SmartImage
      src={CARDS_LOGO_SRC}
      alt="Visa, Mastercard, American Express"
      width={200}
      height={36}
      className="h-9 w-auto object-contain sm:h-10"
    />
  );
}

export default function CartPaymentMethods({
  id = "cart-payment-methods",
  className = "",
}: Props) {
  const t = useTranslations();

  return (
    <div id={id} className={className}>
      <p className="font-body text-sm font-semibold text-[#111111]">
        {t("goodIdeas.cart.paymentMethodsTitle")}
      </p>
      <div
        className="mt-3 flex flex-wrap items-center gap-3 sm:gap-4"
        aria-label={t("goodIdeas.cart.paymentMethodsTitle")}
      >
        <MercadoPagoMark size="lg" />
        <PayPalMark />
        <CardsMark />
      </div>
    </div>
  );
}
