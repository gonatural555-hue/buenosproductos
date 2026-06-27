"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useTranslations } from "@/components/i18n/LocaleProvider";
import { useHomeNewsletterModal } from "@/context/HomeNewsletterModalContext";
import { headerLocales, locales, type Locale } from "@/lib/i18n/config";
import {
  HEADER_UTILITY_LINKS,
  isUtilityLinkActive,
  resolveUtilityHref,
} from "@/lib/header-utility-links";
import HeaderCurrencySwitcher from "@/components/header/HeaderCurrencySwitcher";

type Props = {
  locale: Locale;
};

export default function HeaderUtilityBar({ locale }: Props) {
  const t = useTranslations();
  const { openModal } = useHomeNewsletterModal();
  const pathname = usePathname() ?? "";
  const searchParams = useSearchParams();

  const buildLocaleHref = (nextLocale: Locale) => {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return `/${nextLocale}`;
    if (locales.includes(segments[0] as Locale)) {
      segments[0] = nextLocale;
    } else {
      segments.unshift(nextLocale);
    }
    const query = searchParams.toString();
    return `/${segments.join("/")}${query ? `?${query}` : ""}`;
  };

  return (
    <div className="gn-rei-utility">
      <div className="gn-rei-header__max">
        <div className="gn-rei-utility__row">
          <nav className="gn-rei-utility__links" aria-label={t("header.utility.aria")}>
            {HEADER_UTILITY_LINKS.map((link) => {
              const href = resolveUtilityHref(link, locale);
              const isActive = isUtilityLinkActive(link, locale, pathname);
              return (
                <Link
                  key={link.id}
                  href={href}
                  className={`gn-rei-utility__link${isActive ? " gn-rei-utility__link--active" : ""}`}
                >
                  {t(`header.utility.${link.labelKey}`, link.labelKey)}
                </Link>
              );
            })}
          </nav>
          <button
            type="button"
            onClick={openModal}
            className="gn-rei-utility__promo"
          >
            {t("header.utility.freeShippingPromo")}
          </button>
          <div className="gn-rei-utility__controls">
            <HeaderCurrencySwitcher variant="utility" />
            <nav
              className="gn-rei-utility__locales"
              aria-label={t("header.localeNavAria")}
            >
              {headerLocales.map((lang) => (
                <Link
                  key={lang}
                  href={buildLocaleHref(lang)}
                  className={`gn-rei-utility__locale${lang === locale ? " gn-rei-utility__locale--active" : ""}`}
                >
                  {lang.toUpperCase()}
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}
