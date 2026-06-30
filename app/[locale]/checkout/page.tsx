import GoodIdeasCheckoutPage from "@/components/good-ideas/GoodIdeasCheckoutPage";
import { resolveWhatsAppCheckoutConfig } from "@/lib/checkout/whatsapp";
import { getMessages } from "@/lib/i18n/messages";
import { createTranslator } from "@/lib/i18n/translate";
import type { Locale } from "@/lib/i18n/config";
import { buildMetadata } from "@/lib/seo";
import { buildPathByLocale, checkoutPath } from "@/lib/routing/paths";
import { getGoodIdeasBrandName } from "@/lib/good-ideas-brand";

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
    title: `${t("goodIdeas.checkout.title")} | ${getGoodIdeasBrandName(locale)}`,
    description: t("checkoutPage.paymentSecureNote"),
    pathByLocale: buildPathByLocale(checkoutPath),
  });
}

export default function CheckoutPage() {
  const whatsapp = resolveWhatsAppCheckoutConfig();

  return (
    <GoodIdeasCheckoutPage
      whatsappNumber={whatsapp.number}
      whatsappConfigured={whatsapp.configured}
    />
  );
}
