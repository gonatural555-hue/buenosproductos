import type { Locale } from "@/lib/i18n/config";
import { getMessages } from "@/lib/i18n/messages";
import LegalPage from "@/components/legal/LegalPage";
import RegretRequestForm from "@/components/legal/RegretRequestForm";
import { buildMetadata, legalPathByLocale, type LegalSlugKey } from "@/lib/seo";

type LegalDocKey =
  | "privacy"
  | "cookies"
  | "terms"
  | "disclaimer"
  | "returns"
  | "shipping"
  | "regret";

export function createLegalMetadata(docKey: LegalDocKey, slugKey: LegalSlugKey) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: Locale }>;
  }) {
    const { locale } = await params;
    const messages = await getMessages(locale);
    const page = messages.legal?.[docKey];

    return buildMetadata({
      locale,
      title: page?.metaTitle,
      description: page?.metaDescription,
      pathByLocale: legalPathByLocale(slugKey),
    });
  };
}

export function createLegalPage(docKey: LegalDocKey, options?: { withRegretForm?: boolean }) {
  return async function LegalDocumentPage({
    params,
  }: {
    params: Promise<{ locale: Locale }>;
  }) {
    const { locale } = await params;
    const messages = await getMessages(locale);
    const page = messages.legal?.[docKey];
    const common = messages.legal?.common;

    if (!page) {
      return null;
    }

    return (
      <LegalPage
        eyebrow={common?.eyebrow}
        title={page.title}
        intro={page.intro}
        updatedAt={page.updatedAt ?? common?.updatedAt}
        sections={page.sections}
        closing={page.closing}
        afterSections={
          options?.withRegretForm ? (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-semibold tracking-[-0.02em] text-[#E8ECF1]">
                {messages.legal?.regretForm?.sectionTitle}
              </h2>
              <RegretRequestForm />
            </div>
          ) : undefined
        }
      />
    );
  };
}
