"use client";

import type { Order } from "@/context/UserContext";
import { useTranslations } from "@/components/i18n/LocaleProvider";

type Props = {
  order: Order;
};

export default function OrderPaymentAlert({ order }: Props) {
  const t = useTranslations();

  if (order.paymentMethod === "paypal" && order.status === "paid") {
    return (
      <div className="gi-os-card rounded-[20px] border border-[rgba(34,197,94,0.25)] bg-[rgba(34,197,94,0.08)] p-5 md:p-6">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(34,197,94,0.15)] text-[#16A34A]">
            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                clipRule="evenodd"
              />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="font-body text-base font-semibold text-[#111111]">
              {t("orderSuccessPage.paymentBanner.paidTitle")}
            </p>
            <p className="mt-1 font-body text-sm leading-relaxed text-[#6B7280]">
              {t("orderSuccessPage.paymentBanner.paidBody")}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="gi-os-card rounded-[20px] border border-[rgba(59,130,246,0.22)] bg-[rgba(59,130,246,0.08)] p-5 md:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex min-w-0 items-start gap-3">
          <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(59,130,246,0.14)] text-[#3B82F6]">
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.75}
                d="M12 6v6h4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </span>
          <div className="min-w-0">
            <p className="font-body text-base font-semibold text-[#111111]">
              {t("orderSuccessPage.paymentCoordinateTitle")}
            </p>
            <p className="mt-1 font-body text-sm leading-relaxed text-[#6B7280]">
              {t("orderSuccessPage.paymentCoordinateBody")}
            </p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center rounded-full bg-[rgba(59,130,246,0.14)] px-3 py-1 font-body text-xs font-semibold text-[#3B82F6]">
          {t("orderSuccessPage.paymentPendingBadge")}
        </span>
      </div>
    </div>
  );
}
