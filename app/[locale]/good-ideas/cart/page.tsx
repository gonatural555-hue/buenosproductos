import GoodIdeasCartPage from "@/components/good-ideas/GoodIdeasCartPage";
import { getMessages } from "@/lib/i18n/messages";
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
  const seo = messages.seo?.goodIdeas?.cart;

  return buildMetadata({
    locale,
    title: seo?.title,
    description: seo?.description,
    pathByLocale: {
      en: `/en/${BRAND_SEGMENTS.goodIdeas}/cart`,
      es: `/es/${BRAND_SEGMENTS.goodIdeas}/cart`,
      fr: `/fr/${BRAND_SEGMENTS.goodIdeas}/cart`,
      it: `/it/${BRAND_SEGMENTS.goodIdeas}/cart`,
    },
  });
}

export default function GoodIdeasCartRoute() {
  return <GoodIdeasCartPage />;
}
