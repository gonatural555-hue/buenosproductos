import GoodIdeasHomePage from "@/components/good-ideas/GoodIdeasHomePage";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { buildPathByLocale, homePath } from "@/lib/routing/paths";

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
    pathByLocale: buildPathByLocale(homePath),
  });
}

export default async function HomePage({
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
      eyebrow={t("goodIdeas.hero.eyebrow")}
      cta={t("goodIdeas.hero.cta")}
      sectionAriaLabel={t("goodIdeas.hero.sectionAria")}
    />
  );
}
