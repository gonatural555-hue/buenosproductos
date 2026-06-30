"use client";

import type { ReactNode } from "react";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";
import { GI_CART_INNER, GI_CART_OUTER } from "@/lib/ui/gi-cart-light";

type Props = {
  left: ReactNode;
  right: ReactNode;
};

export default function CheckoutShell({ left, right }: Props) {
  return (
    <div className="min-h-[100dvh] bg-white" data-route="checkout">
      <CheckoutHeader />
      <div className={`${GI_CART_OUTER} pb-12`}>
        <div className={`${GI_CART_INNER} flex flex-col lg:flex-row lg:gap-12`}>
          <div className="order-2 min-w-0 flex-1 lg:order-1">
            <div className="py-8 lg:max-w-[855px] lg:py-12">{left}</div>
          </div>
          <aside className="order-1 shrink-0 border-b border-[#E5E5E5] bg-[#FAFAFA] lg:order-2 lg:w-[460px] lg:shrink-0 lg:border-b-0 lg:border-l lg:bg-white lg:pl-0">
            <div className="px-0 py-6 lg:sticky lg:top-8 lg:py-12">{right}</div>
          </aside>
        </div>
      </div>
    </div>
  );
}
