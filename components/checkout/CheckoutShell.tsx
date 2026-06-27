"use client";

import type { ReactNode } from "react";
import CheckoutHeader from "@/components/checkout/CheckoutHeader";

type Props = {
  left: ReactNode;
  right: ReactNode;
};

export default function CheckoutShell({ left, right }: Props) {
  return (
    <div className="min-h-[100dvh] bg-white" data-route="checkout">
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[1000px] flex-col">
        <CheckoutHeader />
        <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
          <div className="order-2 min-h-0 flex-1 overflow-y-auto lg:order-1">
            <div className="px-4 py-8 sm:px-6 lg:px-8 lg:py-12">{left}</div>
          </div>
          <aside className="order-1 shrink-0 border-b border-[#E5E5E5] bg-[#F5F5F5] lg:order-2 lg:w-[380px] lg:border-b-0 lg:border-l lg:sticky lg:top-0 lg:max-h-screen lg:self-start lg:overflow-y-auto">
            <div className="px-4 py-6 sm:px-6 lg:px-8 lg:py-12">{right}</div>
          </aside>
        </div>
      </div>
    </div>
  );
}
