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
    <section className="rounded-2xl border border-dashed border-earth-brown/25 bg-warm-sand/70 p-8 text-center md:p-10">
      <p className="mx-auto max-w-2xl text-sm font-medium leading-relaxed text-dark-base md:text-base">
        {t("orderSuccessPage.brandQuote")}
      </p>

      {showSocial ? (
        <div className="mt-10 border-t border-earth-brown/15 pt-10">
          <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-accent-gold/90">
            {t("orderSuccessPage.followUs")}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            {INSTAGRAM_URL ? (
              <a
                href={INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("orderSuccessPage.instagramAria")}
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-earth-brown/20 bg-white text-dark-base transition hover:border-accent-gold/40 hover:bg-accent-gold/10 hover:text-accent-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/50"
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
                className="inline-flex h-12 w-12 items-center justify-center rounded-full border border-earth-brown/20 bg-white text-dark-base transition hover:border-accent-gold/40 hover:bg-accent-gold/10 hover:text-accent-gold focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/50"
              >
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
                </svg>
              </a>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className="mt-10 border-t border-earth-brown/15 pt-10 text-left">
        <h3 className="mb-2 text-center text-sm font-semibold uppercase tracking-wider text-accent-gold/90 md:text-left">
          {t("orderSuccessPage.blogCarouselTitle")}
        </h3>
        <p className="mx-auto mb-6 max-w-2xl text-center text-xs leading-relaxed text-muted-gray md:mx-0 md:text-left">
          {t("orderSuccessPage.blogCarouselSubtitle")}
        </p>
        <HorizontalSwipeHint className="mb-3 md:hidden" />
        <div
          className="-mx-2 overflow-x-auto overflow-y-visible pb-2 scroll-smooth snap-x snap-mandatory scrollbar-rail-premium focus-within:outline-none"
          tabIndex={0}
          role="region"
          aria-label={t("orderSuccessPage.blogCarouselAria")}
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          <div className="flex gap-4 md:gap-5 w-max px-2">
            {blogCards.map((post) => (
              <Link
                key={post.slug}
                href={post.href}
                className="group w-[min(85vw,280px)] shrink-0 snap-start overflow-hidden rounded-2xl border border-earth-brown/15 bg-soft-stone text-left transition duration-300 hover:scale-[1.02] hover:shadow-[0_20px_40px_-12px_rgba(17,23,19,0.15)] motion-reduce:hover:scale-100 motion-reduce:hover:shadow-none focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-gold/50 sm:w-72"
              >
                <div className="relative aspect-[16/10] w-full bg-warm-sand">
                  <Image
                    src={post.image}
                    alt=""
                    fill
                    className="object-cover object-center transition duration-300 group-hover:opacity-95"
                    sizes="(max-width: 640px) 85vw, 288px"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-dark-base transition-colors group-hover:text-accent-gold/95">
                    {post.title}
                  </h4>
                  <p className="line-clamp-3 text-xs leading-relaxed text-muted-gray">
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
