"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import ScrollReveal from "@/components/blog/ScrollReveal";
import { useTranslations } from "@/components/i18n/LocaleProvider";
import type { Locale } from "@/lib/i18n/config";
import { homePrimaryCtaClass } from "@/lib/ui/premium-cta-classes";
import MembershipPromoBadge from "@/components/products/MembershipPromoBadge";
import {
  DEFAULT_MEMBERSHIP_PROMO_LAYOUT,
  isProductsDirectorMode,
  membershipPromoBlockStyle,
  membershipPromoImageStyle,
  resolveMembershipPromoLayout,
  type MembershipPromoLayout,
} from "@/lib/products-membership-promo-layout";
import MembershipPromoDirectorPanel from "@/components/products/MembershipPromoDirectorPanel";

type Props = {
  locale: Locale;
};

export default function MembershipPromotionBanner({ locale }: Props) {
  const t = useTranslations();
  const searchParams = useSearchParams();
  const directorMode = isProductsDirectorMode(searchParams);
  const [layout, setLayout] = useState<MembershipPromoLayout>(
    DEFAULT_MEMBERSHIP_PROMO_LAYOUT
  );

  useEffect(() => {
    setLayout(resolveMembershipPromoLayout(directorMode));
  }, [directorMode]);

  const handleLayoutChange = useCallback((next: MembershipPromoLayout) => {
    setLayout(next);
  }, []);

  return (
    <>
      <section
        className="w-full px-[18px] pb-10 pt-2 md:px-8 md:pb-14 md:pt-4 lg:px-12"
        aria-labelledby="membership-promo-heading"
      >
        <ScrollReveal>
          <div
            className="gn-membership-promo-block overflow-hidden rounded-[24px] bg-[#F5F0E6] p-8 md:p-16"
            style={membershipPromoBlockStyle(layout)}
          >
            <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[45fr_55fr] md:gap-12 lg:gap-16">
              <div className="flex items-center justify-center">
                <div
                  className="gn-membership-promo-image-wrap flex items-center justify-center"
                  style={membershipPromoImageStyle(layout)}
                >
                  <MembershipPromoBadge />
                </div>
              </div>

              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <h2
                  id="membership-promo-heading"
                  className="section-display text-balance text-[clamp(1.65rem,3.6vw,2.35rem)] font-semibold leading-[1.12] tracking-tight text-gn-burgundy"
                >
                  {t("productsPage.membershipPromo.title")}
                </h2>

                <p className="font-inter mt-5 max-w-xl text-base leading-relaxed text-[#171717] md:mt-6 md:text-lg">
                  <span className="font-semibold text-gn-mustard">
                    {t("productsPage.membershipPromo.descriptionHighlight")}
                  </span>
                  {t("productsPage.membershipPromo.descriptionSuffix")}
                </p>

                <p className="font-inter mt-3 max-w-xl text-sm leading-relaxed text-[#171717] md:text-base">
                  {t("productsPage.membershipPromo.descriptionSecondary")}
                </p>

                <Link
                  href={`/${locale}/auth`}
                  className={`${homePrimaryCtaClass} mt-8 md:mt-10`}
                >
                  {t("productsPage.membershipPromo.cta")}
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {directorMode ? (
        <MembershipPromoDirectorPanel layout={layout} onChange={handleLayoutChange} />
      ) : null}
    </>
  );
}
