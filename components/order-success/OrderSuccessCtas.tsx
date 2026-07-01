"use client";

import Link from "next/link";
import { giCartText } from "@/lib/ui/gi-cart-light";

type Props = {
  viewOrderHref: string;
  viewOrderLabel: string;
  continueShoppingHref: string;
  continueShoppingLabel: string;
  whatsappHref: string | null;
  whatsappLabel: string;
  contactHref: string | null;
  contactLabel: string;
};

const secondaryBtn =
  "inline-flex h-[52px] w-full items-center justify-center rounded-[12px] border border-[#E5E5E5] bg-white px-6 font-body text-sm font-semibold text-[#111111] transition-colors duration-200 hover:bg-[#FAFAFA] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]/15";

export default function OrderSuccessCtas({
  viewOrderHref,
  viewOrderLabel,
  continueShoppingHref,
  continueShoppingLabel,
  whatsappHref,
  whatsappLabel,
  contactHref,
  contactLabel,
}: Props) {
  return (
    <section className="border-t border-[#E5E7EB] py-10 md:py-12">
      <div className="mx-auto flex max-w-[480px] flex-col gap-3">
        <Link href={viewOrderHref} className={giCartText.cta}>
          {viewOrderLabel}
        </Link>
        <Link href={continueShoppingHref} className={secondaryBtn}>
          {continueShoppingLabel}
        </Link>
        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-[52px] w-full items-center justify-center rounded-[12px] bg-[#22C55E] px-6 font-body text-sm font-semibold text-white transition-colors duration-200 hover:bg-[#16A34A] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22C55E]/40"
          >
            {whatsappLabel}
          </a>
        ) : contactHref ? (
          <Link href={contactHref} className={secondaryBtn}>
            {contactLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
