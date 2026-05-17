import GoNaturalHomePage from "@/components/go-natural/GoNaturalHomePage";
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
  const seo = messages.seo?.home;

  return buildMetadata({
    locale,
    title: seo?.title,
    description: seo?.description,
    pathByLocale: {
      en: `/en/${BRAND_SEGMENTS.goNatural}`,
      es: `/es/${BRAND_SEGMENTS.goNatural}`,
      fr: `/fr/${BRAND_SEGMENTS.goNatural}`,
      it: `/it/${BRAND_SEGMENTS.goNatural}`,
    },
  });
}

export default async function GoNaturalPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  return <GoNaturalHomePage locale={locale} />;
}
