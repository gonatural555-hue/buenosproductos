import { notFound } from "next/navigation";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { getMessages } from "@/lib/i18n/messages";
import { locales, type Locale } from "@/lib/i18n/config";
import { CurrencyProvider } from "@/context/CurrencyContext";
import SmoothScroll from "@/components/SmoothScroll";
import AppChrome from "@/components/layout/AppChrome";

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages(locale as Locale);

  return (
    <LocaleProvider locale={locale as Locale} messages={messages}>
      <CurrencyProvider>
        <SmoothScroll />
        <AppChrome>{children}</AppChrome>
      </CurrencyProvider>
    </LocaleProvider>
  );
}
