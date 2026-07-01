"use client";

import SmartImage from "@/components/SmartImage";
import UsdChargeNotice from "@/components/currency/UsdChargeNotice";
import type { Order } from "@/context/UserContext";
import { formatCartVariantSummary } from "@/lib/cart-formatting";
import { resolveOrderItems } from "@/lib/order-success-helpers";
import { useTranslations } from "@/components/i18n/LocaleProvider";

type Props = {
  order: Order;
  formatPrice: (price: number) => string;
  formattedDate: string;
};

export default function OrderSummaryCard({
  order,
  formatPrice,
  formattedDate,
}: Props) {
  const t = useTranslations();
  const items = resolveOrderItems(order);

  return (
    <article className="gi-os-card rounded-[24px] border border-[#ECECEC] bg-white p-7 shadow-[0_8px_28px_rgba(0,0,0,0.06)] md:p-8">
      <h2 className="font-body text-xl font-bold text-[#111111]">
        {t("orderSuccessPage.orderSummary")}
      </h2>

      <ul className="mt-6 space-y-5">
        {items.map((item) => {
          const variant = formatCartVariantSummary(
            item.variantSelections,
            undefined,
            t
          );
          return (
            <li
              key={item.lineId}
              className="flex gap-4 border-b border-[#E5E7EB] pb-5 last:border-0 last:pb-0"
            >
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-[14px] border border-[#ECECEC] bg-[#FAFAFA]">
                {item.image ? (
                  <SmartImage
                    src={item.image}
                    alt=""
                    fill
                    sizes="80px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center font-body text-xs text-[#9CA3AF]">
                    —
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-body text-[15px] font-semibold leading-snug text-[#111111]">
                  {item.title}
                </p>
                {variant ? (
                  <p className="mt-1 font-body text-sm text-[#6B7280]">
                    {variant}
                  </p>
                ) : null}
                <p className="mt-2 font-body text-sm text-[#6B7280]">
                  {t("checkoutPage.quantity")}: {item.quantity} ×{" "}
                  {formatPrice(item.price)}
                </p>
              </div>
              <p className="shrink-0 font-body text-[15px] font-semibold tabular-nums text-[#111111]">
                {formatPrice(item.price * item.quantity)}
              </p>
            </li>
          );
        })}
      </ul>

      {order.paymentMethod === "paypal" ? (
        <UsdChargeNotice
          amountUsd={order.subtotal}
          variant="compact"
          className="mt-6"
        />
      ) : null}

      <div className="mt-6 space-y-3 border-t border-[#E5E7EB] pt-6">
        <div className="flex items-center justify-between font-body text-sm text-[#6B7280]">
          <span>{t("orderSuccessPage.subtotal")}</span>
          <span className="tabular-nums text-[#111111]">
            {formatPrice(order.subtotal)}
          </span>
        </div>
        <div className="flex items-center justify-between font-body text-sm text-[#6B7280]">
          <span>{t("orderSuccessPage.shippingLine")}</span>
          <span className="font-medium text-[#16A34A]">
            {t("orderSuccessPage.shippingFree")}
          </span>
        </div>
        <div className="flex items-center justify-between pt-1">
          <span className="font-body text-lg font-bold text-[#111111]">
            {t("orderSuccessPage.total")}
          </span>
          <span className="font-body text-[clamp(1.25rem,2.5vw,1.75rem)] font-bold tabular-nums text-[#111111]">
            {formatPrice(order.subtotal)}
          </span>
        </div>
        {formattedDate ? (
          <p className="font-body text-xs text-[#9CA3AF]">
            {t("orderSuccessPage.placedOn").replace("{date}", formattedDate)}
          </p>
        ) : null}
      </div>
    </article>
  );
}
