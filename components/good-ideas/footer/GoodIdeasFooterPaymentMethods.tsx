"use client";

import SmartImage from "@/components/SmartImage";
import { MercadoPagoMark } from "@/components/payment/PaymentBrandMarks";
import { useTranslations } from "@/components/i18n/LocaleProvider";

const CARDS_LOGO_SRC = "/assets/images/payment/cards.png";

type Props = {
  id?: string;
  className?: string;
  variant?: "dark" | "light";
};

function CardsMark({ variant }: { variant: "dark" | "light" }) {
  return (
    <span
      className={`inline-flex h-8 items-center rounded-lg border px-2.5 sm:h-9 sm:px-3 ${
        variant === "light"
          ? "border-[#E5E5E5] bg-white"
          : "border-white/[0.08] bg-white/[0.04]"
      }`}
    >
      <SmartImage
        src={CARDS_LOGO_SRC}
        alt="Visa, Mastercard, American Express"
        width={160}
        height={28}
        className="h-5 w-auto object-contain sm:h-6"
      />
    </span>
  );
}

function MercadoPagoBadge({ variant }: { variant: "dark" | "light" }) {
  return (
    <span
      className={`inline-flex h-8 items-center justify-center rounded-lg border px-2 sm:h-9 ${
        variant === "light"
          ? "border-[#E5E5E5] bg-white"
          : "border-white/[0.08] bg-white/[0.04]"
      }`}
    >
      <MercadoPagoMark size="sm" />
    </span>
  );
}

export default function GoodIdeasFooterPaymentMethods({
  id = "gi-footer-payment-methods",
  className = "",
  variant = "dark",
}: Props) {
  const t = useTranslations();
  const titleClass =
    variant === "light"
      ? "font-body text-xs font-semibold text-[#737373]"
      : "font-body text-xs font-semibold text-[rgba(232,236,241,0.55)]";

  return (
    <div id={id} className={className}>
      <p className={titleClass}>{t("goodIdeas.cart.paymentMethodsTitle")}</p>
      <div
        className="mt-2.5 flex flex-wrap items-center gap-2 sm:gap-2.5"
        aria-label={t("goodIdeas.cart.paymentMethodsTitle")}
      >
        <CardsMark variant={variant} />
        <MercadoPagoBadge variant={variant} />
      </div>
    </div>
  );
}
