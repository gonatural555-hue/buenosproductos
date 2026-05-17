import Link from "next/link";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { BRAND_SEGMENTS, goodIdeasCartPath } from "@/lib/routing/brands";
import { GI_HERO_TOP_PAD } from "@/lib/ui/goodideas-design";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const t = createTranslator(messages);

  return buildMetadata({
    locale,
    title: `${t("goodIdeas.checkout.title")} | Good Ideas`,
    description: t("goodIdeas.checkout.comingSoonBody"),
    pathByLocale: {
      en: `/en/${BRAND_SEGMENTS.goodIdeas}/checkout`,
      es: `/es/${BRAND_SEGMENTS.goodIdeas}/checkout`,
      fr: `/fr/${BRAND_SEGMENTS.goodIdeas}/checkout`,
      it: `/it/${BRAND_SEGMENTS.goodIdeas}/checkout`,
    },
  });
}

export default async function GoodIdeasCheckoutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const t = createTranslator(messages);

  return (
    <main
      className={`min-h-[100dvh] bg-[#0B0F14] px-6 pb-16 text-[#E8ECF1] sm:px-10 ${GI_HERO_TOP_PAD}`}
    >
      <div className="mx-auto max-w-xl text-center">
        <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-normal tracking-[-0.02em]">
          {t("goodIdeas.checkout.title")}
        </h1>
        <p className="mt-3 font-inter text-[11px] font-semibold uppercase tracking-[0.22em] text-[#3B82F6]">
          {t("goodIdeas.checkout.comingSoonTitle")}
        </p>
        <p className="mt-6 font-inter text-[16px] leading-relaxed text-[rgba(232,236,241,0.72)]">
          {t("goodIdeas.checkout.comingSoonBody")}
        </p>
        <Link
          href={goodIdeasCartPath(locale)}
          className="mt-10 inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#E8ECF1] px-8 font-inter text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0B0F14] transition hover:bg-white"
        >
          {t("goodIdeas.checkout.backToCart")}
        </Link>
      </div>
    </main>
  );
}
