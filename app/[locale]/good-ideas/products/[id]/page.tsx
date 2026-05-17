import Link from "next/link";
import { notFound } from "next/navigation";
import { getGoodIdeasProductById } from "@/lib/good-ideas-products";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { BRAND_SEGMENTS, goodIdeasProductsPath } from "@/lib/routing/brands";
import { GI_HERO_TOP_PAD } from "@/lib/ui/goodideas-design";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { locale, id } = await params;
  const product = getGoodIdeasProductById(id);
  const messages = await getMessages(locale);

  return buildMetadata({
    locale,
    title: product?.title ?? `Product | Good Ideas`,
    description: createTranslator(messages)("goodIdeas.product.comingSoonBody"),
    pathByLocale: {
      en: `/en/${BRAND_SEGMENTS.goodIdeas}/products/${id}`,
      es: `/es/${BRAND_SEGMENTS.goodIdeas}/products/${id}`,
      fr: `/fr/${BRAND_SEGMENTS.goodIdeas}/products/${id}`,
      it: `/it/${BRAND_SEGMENTS.goodIdeas}/products/${id}`,
    },
  });
}

export default async function GoodIdeasProductPage({
  params,
}: {
  params: Promise<{ locale: Locale; id: string }>;
}) {
  const { locale, id } = await params;
  const product = getGoodIdeasProductById(id);
  const messages = await getMessages(locale);
  const t = createTranslator(messages);

  if (!product) {
    return (
      <main
        className={`min-h-[100dvh] bg-[#0B0F14] px-6 pb-16 text-[#E8ECF1] sm:px-10 ${GI_HERO_TOP_PAD}`}
      >
        <div className="mx-auto max-w-xl text-center">
          <h1 className="font-display text-[clamp(2rem,5vw,3rem)] font-normal tracking-[-0.02em]">
            {t("goodIdeas.product.comingSoonTitle")}
          </h1>
          <p className="mt-6 font-inter text-[16px] leading-relaxed text-[rgba(232,236,241,0.72)]">
            {t("goodIdeas.product.comingSoonBody")}
          </p>
          <Link
            href={goodIdeasProductsPath(locale)}
            className="mt-10 inline-flex min-h-[52px] items-center justify-center rounded-full bg-[#E8ECF1] px-8 font-inter text-[12px] font-semibold uppercase tracking-[0.14em] text-[#0B0F14] transition hover:bg-white"
          >
            {t("goodIdeas.product.backToProducts")}
          </Link>
        </div>
      </main>
    );
  }

  notFound();
}
