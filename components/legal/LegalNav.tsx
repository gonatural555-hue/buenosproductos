"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import type { Locale } from "@/lib/i18n/config";
import { LEGAL_SLUGS, type LegalSlugKey } from "@/lib/seo";

const NAV_ITEMS: { key: LegalSlugKey; labelKey: string }[] = [
  { key: "terms", labelKey: "terms" },
  { key: "returns", labelKey: "returns" },
  { key: "shipping", labelKey: "shipping" },
  { key: "regret", labelKey: "regret" },
  { key: "privacy", labelKey: "privacy" },
  { key: "cookies", labelKey: "cookies" },
  { key: "disclaimer", labelKey: "disclaimer" },
];

function legalPath(key: LegalSlugKey, locale: Locale): string {
  return `/${locale}/${LEGAL_SLUGS[key][locale]}`;
}

export default function LegalNav() {
  const locale = useLocale();
  const pathname = usePathname() ?? "";
  const t = useTranslations();

  return (
    <nav
      aria-label={t("legal.nav.ariaLabel")}
      className="mt-8 flex flex-wrap gap-2"
    >
      {NAV_ITEMS.map(({ key, labelKey }) => {
        const href = legalPath(key, locale);
        const active = pathname === href || pathname.endsWith(href);

        return (
          <Link
            key={key}
            href={href}
            className={`rounded-full border px-3.5 py-1.5 font-body text-xs font-medium transition ${
              active
                ? "border-[#3B82F6] bg-[#3B82F6]/15 text-[#93C5FD]"
                : "border-white/[0.12] bg-white/[0.04] text-[#A8B0BC] hover:border-white/20 hover:text-[#E8ECF1]"
            }`}
          >
            {t(`legal.nav.${labelKey}`)}
          </Link>
        );
      })}
    </nav>
  );
}
