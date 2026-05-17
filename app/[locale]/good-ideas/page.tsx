import GoodIdeasHomePage from "@/components/good-ideas/GoodIdeasHomePage";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { BRAND_SEGMENTS } from "@/lib/routing/brands";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const seo = messages.seo?.goodIdeas;

  return buildMetadata({
    locale,
    title: seo?.title,
    description: seo?.description,
    pathByLocale: {
      en: `/en/${BRAND_SEGMENTS.goodIdeas}`,
      es: `/es/${BRAND_SEGMENTS.goodIdeas}`,
      fr: `/fr/${BRAND_SEGMENTS.goodIdeas}`,
      it: `/it/${BRAND_SEGMENTS.goodIdeas}`,
    },
  });
}

export default async function GoodIdeasPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const messages = await getMessages(locale);
  const t = createTranslator(messages);

  return (
    <GoodIdeasHomePage
      locale={locale}
      title={t("goodIdeas.hero.title")}
      subtitle={t("goodIdeas.hero.subtitle")}
      cta={t("goodIdeas.hero.cta")}
      comingSoon={t("goodIdeas.hero.comingSoon")}
    />
  );
}
