"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { getOrderSuccessBlogCards } from "@/lib/good-ideas-blog-order-success";
import { INSTAGRAM_URL, TIKTOK_URL } from "@/lib/social-links";
import HorizontalSwipeHint from "@/components/HorizontalSwipeHint";

export default function OrderSuccessEngagementBlock() {
  const locale = useLocale();
  const t = useTranslations();

  const blogCards = useMemo(
    () => getOrderSuccessBlogCards(locale),
    [locale]
  );

  const showSocial = Boolean(INSTAGRAM_URL || TIKTOK_URL);

  return (
    <section className="py-10 md:py-12">
      <p className="mx-auto max-w-2xl text-center font-body text-sm font-medium leading-relaxed text-[#6B7280] md:text-base">
        {t("orderSuccessPage.brandQuote")}
      </p>

      {showSocial ? (
        <div className="mt-10 border-t border-[#ECECEC] pt-10">
          <p className="mb-4 text-center font-body text-xs font-semibold uppercase tracking-[0.14em] text-[#3B82F6]">
            {t("orderSuccessPage.followUs")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {INSTAGRAM_URL ? (
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("orderSuccessPage.instagramAria")}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#ECECEC] bg-white text-[#111111] transition duration-200 hover:border-[#3B82F6]/35 hover:bg-[rgba(59,130,246,0.08)] hover:text-[#3B82F6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/40"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M7 2C4.243 2 2 4.243 2 7v10c0 2.757 2.243 5 5 5h10c2.757 0 5-2.243 5-5V7c0-2.757-2.243-5-5-5H7zm0 2h10c1.654 0 3 1.346 3 3v10c0 1.654-1.346 3-3 3H7c-1.654 0-3-1.346-3-3V7c0-1.654 1.346-3 3-3zm10.5 1.5a1.25 1.25 0 100 2.5 1.25 1.25 0 000-2.5zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z" />
                </svg>
              </a>
            ) : null}
            {TIKTOK_URL ? (
              <a
                href={TIKTOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("orderSuccessPage.tiktokAria")}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-[#ECECEC] bg-white text-[#111111] transition duration-200 hover:border-[#3B82F6]/35 hover:bg-[rgba(59,130,246,0.08)] hover:text-[#3B82F6] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/40"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="mt-10 border-t border-[#ECECEC] pt-10 text-left">
        <h3 className="mb-2 text-center font-body text-sm font-semibold uppercase tracking-[0.14em] text-[#111111] md:text-left">
          {t("orderSuccessPage.blogCarouselTitle")}
        </h3>
        <p className="mx-auto mb-6 max-w-2xl text-center font-body text-xs leading-relaxed text-[#6B7280] md:mx-0 md:text-left">
          {t("orderSuccessPage.blogCarouselSubtitle")}
        </p>
        <HorizontalSwipeHint className="mb-3 md:hidden" />
        <div
          className="-mx-2 overflow-x-auto overflow-y-visible pb-2 scroll-smooth snap-x snap-mandatory scrollbar-hidden focus-within:outline-none"
          tabIndex={0}
          role="region"
          aria-label={t("orderSuccessPage.blogCarouselAria")}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="flex w-max gap-4 px-2 md:gap-5">
            {blogCards.map((post) => (
              <Link
                key={post.slug}
                href={post.href}
                className="group w-[min(85vw,280px)] shrink-0 snap-start overflow-hidden rounded-[20px] border border-[#ECECEC] bg-white text-left shadow-[0_4px_18px_rgba(0,0,0,0.05)] transition duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] motion-reduce:hover:translate-y-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/40 sm:w-72"
              >
                <div className="relative aspect-[16/10] w-full bg-[#FAFAFA]">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    className="object-cover object-center transition duration-300 group-hover:opacity-95"
                    sizes="(max-width: 640px) 85vw, 288px"
                  />
                </div>
                <div className="space-y-2 p-4">
                  <h4 className="line-clamp-2 font-body text-sm font-semibold leading-snug text-[#111111] transition-colors group-hover:text-[#3B82F6]">
                    {post.title}
                  </h4>
                  <p className="line-clamp-3 font-body text-xs leading-relaxed text-[#6B7280]">
                    {post.excerpt}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
