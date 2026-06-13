"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { useTranslations } from "@/components/i18n/LocaleProvider";
import { goNaturalHomePath } from "@/lib/routing/brands";

type Props = {
  locale: Locale;
  totalItems: number;
  isLoggedIn: boolean;
  userName?: string;
  onSignIn: () => void;
};

export default function HeaderMainRow({
  locale,
  totalItems,
  isLoggedIn,
  userName,
  onSignIn,
}: Props) {
  const t = useTranslations();
  const router = useRouter();
  const [query, setQuery] = useState("");

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const q = query.trim();
    router.push(
      q
        ? `/${locale}/products?q=${encodeURIComponent(q)}`
        : `/${locale}/products`
    );
  };

  return (
    <div className="gn-rei-main">
        <div className="gn-rei-main__brand">
          <Link href={goNaturalHomePath(locale)} aria-label={t("header.logoAlt")}>
            <Image
              src="/assets/images/logo/LOGO-GONATURAL.png"
              alt={t("header.logoAlt")}
              width={420}
              height={168}
              priority
              className="gn-rei-main__logo"
            />
          </Link>
          <Link href={`/${locale}/products`} className="gn-rei-main__shop">
            {t("header.shop")}
          </Link>
        </div>

        <div className="gn-rei-main__search-wrap">
          <form className="gn-rei-main__search" onSubmit={onSearch} role="search">
            <input
              type="search"
              name="q"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("header.searchPlaceholder")}
              className="gn-rei-main__search-input"
              aria-label={t("header.searchPlaceholder")}
            />
            <button type="submit" className="gn-rei-main__search-btn" aria-label={t("header.searchSubmit")}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
              </svg>
            </button>
          </form>
        </div>

        <div className="gn-rei-main__utils">
          {isLoggedIn && userName ? (
            <Link href={`/${locale}/account`} className="gn-rei-main__util-link">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.65} stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <span>{userName}</span>
            </Link>
          ) : (
            <button type="button" className="gn-rei-main__util-link" onClick={onSignIn}>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.65} stroke="currentColor" aria-hidden>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
              </svg>
              <span>{t("header.signIn")}</span>
            </button>
          )}

          <Link href={`/${locale}/cart`} className="gn-rei-main__util-link relative">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor" aria-hidden>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.5 3.5h3l2.2 10.4a2 2 0 0 0 2 1.6h7.1a2 2 0 0 0 2-1.6l1.7-8.4H6.1" />
              <circle cx="9" cy="20" r="1.25" />
              <circle cx="18" cy="20" r="1.25" />
            </svg>
            <span>{t("header.nav.cart")}</span>
            {totalItems > 0 ? (
              <span className="gn-rei-main__cart-badge">{totalItems > 99 ? "99+" : totalItems}</span>
            ) : null}
          </Link>
        </div>
    </div>
  );
}
