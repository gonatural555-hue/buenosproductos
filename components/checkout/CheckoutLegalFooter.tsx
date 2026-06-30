"use client";

import Link from "next/link";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { checkoutLegalLinks } from "@/lib/checkout/legal-links";

export default function CheckoutLegalFooter() {
  const locale = useLocale();
  const t = useTranslations();
  const links = checkoutLegalLinks(locale);

  return (
    <footer className="mt-12 border-t border-[#E5E5E5] pt-8">
      <nav className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs text-[#737373]">
        <Link href={links.regret} className="font-medium text-[#2563EB] hover:underline">
          {t("checkoutPage.legalRegret")}
        </Link>
        <Link href={links.returns} className="hover:text-[#111] hover:underline">
          {t("checkoutPage.legalReturns")}
        </Link>
        <Link href={links.privacy} className="hover:text-[#111] hover:underline">
          {t("checkoutPage.legalPrivacy")}
        </Link>
        <Link href={links.terms} className="hover:text-[#111] hover:underline">
          {t("checkoutPage.legalTerms")}
        </Link>
      </nav>
    </footer>
  );
}
