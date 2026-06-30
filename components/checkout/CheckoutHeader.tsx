"use client";

import Link from "next/link";
import GoodProductsBrandName from "@/components/good-ideas/GoodProductsBrandName";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { cartPath, homePath } from "@/lib/routing/paths";

export default function CheckoutHeader() {
  const locale = useLocale();
  const t = useTranslations();

  return (
    <header className="flex min-h-[104px] shrink-0 items-center justify-between gap-4 border-b border-[#E5E5E5] bg-white px-4 sm:px-6 lg:px-8">
      <Link
        href={homePath(locale)}
        className="flex min-w-0 items-center gap-3 font-display text-lg font-medium tracking-tight text-[#111] sm:text-xl"
      >
        <GoodProductsBrandName locale={locale} />
      </Link>
      <Link
        href={cartPath(locale)}
        className="flex shrink-0 items-center gap-1.5 whitespace-nowrap text-sm font-medium text-[#111] transition hover:text-[#737373]"
      >
        <svg
          className="h-5 w-5 shrink-0"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.75}
            d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
        <span className="hidden sm:inline">{t("checkoutPage.backToCart")}</span>
      </Link>
    </header>
  );
}
