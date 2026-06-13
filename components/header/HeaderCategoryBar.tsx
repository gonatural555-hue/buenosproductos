"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import type { Locale } from "@/lib/i18n/config";
import {
  getActiveHeaderNavTabId,
  getHeaderNavTabs,
  parseCategorySlugFromPathname,
  type HeaderNavTab,
  type HeaderNavTabId,
} from "@/lib/header-nav-categories";
import {
  distributeDropdownColumns,
  HEADER_CATEGORY_DROPDOWN_WIDTH_PX,
} from "@/lib/header-utility-links";
import { useTranslations } from "@/components/i18n/LocaleProvider";
import { usePathname } from "next/navigation";

type Props = {
  locale: Locale;
};

type OpenId = HeaderNavTabId | null;

function CategoryDropdown({
  locale,
  tab,
  onClose,
}: {
  locale: Locale;
  tab: HeaderNavTab;
  onClose: () => void;
}) {
  const t = useTranslations();
  const columns = distributeDropdownColumns(tab.items, 3);

  const itemLabel = (labelKey: string | undefined, slug: string) => {
    if (labelKey) {
      return t(`header.tabs.subs.${labelKey}`, t(`categories.names.${slug}`, slug));
    }
    return t(`categories.names.${slug}`, slug);
  };

  return (
    <div
      className="gn-rei-dropdown"
      style={{
        width: HEADER_CATEGORY_DROPDOWN_WIDTH_PX,
        minWidth: HEADER_CATEGORY_DROPDOWN_WIDTH_PX,
      }}
      role="region"
    >
      <Link
        href={`/${locale}/category/${tab.parentSlug}`}
        className="gn-rei-dropdown__all"
        onClick={onClose}
      >
        {t("header.tabs.allPrefix", "All")} {t(`header.tabs.${tab.labelKey}`, tab.labelKey)} ›
      </Link>
      <div className="gn-rei-dropdown__columns">
        {columns.map((col, colIdx) => (
          <div key={colIdx} className="gn-rei-dropdown__col">
            {col.map((item, idx) => (
              <Link
                key={`${item.categorySlug}-${item.labelKey ?? idx}`}
                href={`/${locale}/category/${item.categorySlug}`}
                className="gn-rei-dropdown__link"
                onClick={onClose}
              >
                {itemLabel(item.labelKey, item.categorySlug)}
              </Link>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HeaderCategoryBar({ locale }: Props) {
  const t = useTranslations();
  const pathname = usePathname() ?? "";
  const tabs = getHeaderNavTabs();
  const navId = useId();
  const barRef = useRef<HTMLDivElement>(null);

  const categorySlug = parseCategorySlugFromPathname(pathname);
  const routeActiveTabId = getActiveHeaderNavTabId(categorySlug);
  const [openId, setOpenId] = useState<OpenId>(null);

  const close = useCallback(() => setOpenId(null), []);

  useEffect(() => {
    close();
  }, [pathname, close]);

  useEffect(() => {
    if (openId == null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const onPointer = (e: MouseEvent | TouchEvent) => {
      const el = barRef.current;
      if (el && !el.contains(e.target as Node)) close();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("touchstart", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("touchstart", onPointer);
    };
  }, [openId, close]);

  const toggle = (id: HeaderNavTabId) => {
    setOpenId((prev) => (prev === id ? null : id));
  };

  return (
    <div className="gn-rei-categories" ref={barRef}>
      <div className="gn-rei-categories__center">
        <nav
          id={navId}
          className="gn-rei-categories__row"
          aria-label={t("header.nav.categories")}
        >
          {tabs.map((tab) => {
            const isOpen = openId === tab.id;
            const isRouteActive = routeActiveTabId === tab.id;
            const hasItems = tab.items.length > 0;
            const tabLabel = t(`header.tabs.${tab.labelKey}`, tab.labelKey);

            return (
              <div key={tab.id} className="gn-rei-categories__item">
                {hasItems ? (
                  <button
                    type="button"
                    id={`${navId}-${tab.id}`}
                    className={[
                      "gn-rei-categories__tab",
                      isOpen ? "gn-rei-categories__tab--open" : "",
                      isRouteActive && !isOpen
                        ? "gn-rei-categories__tab--route-active"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-expanded={isOpen}
                    aria-haspopup="true"
                    onClick={() => toggle(tab.id)}
                  >
                    {tabLabel}
                  </button>
                ) : (
                  <Link
                    href={`/${locale}/category/${tab.parentSlug}`}
                    className={[
                      "gn-rei-categories__tab",
                      isRouteActive ? "gn-rei-categories__tab--route-active" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    {tabLabel}
                  </Link>
                )}

                {isOpen && hasItems ? (
                  <CategoryDropdown locale={locale} tab={tab} onClose={close} />
                ) : null}
              </div>
            );
          })}

          <div className="gn-rei-categories__item">
            <Link
              href={`/${locale}/products?deals=1`}
              className="gn-rei-categories__tab gn-rei-categories__tab--deals"
            >
              {t("header.tabs.deals")}
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
