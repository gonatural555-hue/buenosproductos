"use client";

import { useGoodIdeasCart } from "@/context/GoodIdeasCartContext";
import type { AddToCartLinePayload } from "@/lib/cart-line";
import { giType } from "@/lib/ui/gi-typography";

type Props = AddToCartLinePayload & {
  disabled?: boolean;
  label?: string;
  className?: string;
  variant?: "default" | "dtc";
  onAfterAdd?: (item: AddToCartLinePayload) => void;
};

export default function GoodIdeasAddToCartButton({
  id,
  title,
  price,
  image,
  variantSelections,
  disabled,
  label,
  className,
  variant = "default",
  onAfterAdd,
}: Props) {
  const { addItemAndOpenDrawer } = useGoodIdeasCart();

  const variantClasses =
    variant === "dtc"
      ? "w-full rounded-sm bg-[#111111] px-6 py-3 font-body text-sm font-semibold text-white transition-colors hover:bg-[#2a2a2a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#111111]/30 focus-visible:ring-offset-2"
      : `w-full rounded-full bg-[var(--gi-primary)] px-6 py-3 ${giType.btn} text-white transition-all duration-300 ease-out hover:bg-[var(--gi-primary-hover)] hover:shadow-[0_12px_32px_rgba(59,130,246,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0F14]`;

  return (
    <button
      type="button"
      onClick={() => {
        const payload = { id, title, price, image, variantSelections };
        addItemAndOpenDrawer(payload);
        onAfterAdd?.(payload);
      }}
      disabled={disabled}
      className={[
        variantClasses,
        "active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label || "Add to cart"}
    </button>
  );
}
