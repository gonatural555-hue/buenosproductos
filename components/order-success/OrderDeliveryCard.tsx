"use client";

import type { Order } from "@/context/UserContext";
import { useTranslations } from "@/components/i18n/LocaleProvider";

type Props = {
  order: Order;
  customerEmail?: string | null;
};

export default function OrderDeliveryCard({ order, customerEmail }: Props) {
  const t = useTranslations();
  const { address } = order;

  return (
    <article className="gi-os-card rounded-[24px] border border-[#ECECEC] bg-white p-7 shadow-[0_8px_28px_rgba(0,0,0,0.06)] md:p-8">
      <h2 className="font-body text-xl font-bold text-[#111111]">
        {t("orderSuccessPage.deliveryTitle")}
      </h2>
      <div className="mt-6 space-y-3 font-body text-sm leading-relaxed text-[#6B7280]">
        <p className="text-base font-semibold text-[#111111]">
          {address.fullName}
        </p>
        <p>{address.phone}</p>
        {customerEmail ? (
          <p className="break-all text-[#111111]">{customerEmail}</p>
        ) : null}
        <p>
          {address.addressLine1}
          {address.addressLine2 ? `, ${address.addressLine2}` : ""}
        </p>
        <p>
          {[address.city, address.state, address.postalCode]
            .filter(Boolean)
            .join(", ")}
        </p>
        <p>{address.country}</p>
        <p className="pt-2 text-[#6B7280]">
          {t("orderSuccessPage.shippingMethod")}
        </p>
      </div>
    </article>
  );
}
