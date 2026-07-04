"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { submitNewsletterSubscription } from "@/lib/newsletter-client";

type Props = {
  variant?: "dark" | "light";
};

type SubmitState = "idle" | "loading" | "success" | "error";

export default function GoodIdeasFooterNewsletter({ variant = "dark" }: Props) {
  const locale = useLocale();
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorCode, setErrorCode] = useState<string | null>(null);
  const isLight = variant === "light";

  const errorMessage =
    errorCode === "duplicate"
      ? t("registrationCTA.errorDuplicate")
      : errorCode === "invalid_email"
        ? t("registrationCTA.errorInvalidEmail")
        : errorCode === "marketing_required"
          ? t("registrationCTA.errorMarketingRequired")
          : errorCode === "generic"
            ? t("registrationCTA.errorGeneric")
            : null;

  const cardClass = isLight
    ? "rounded-[20px] border border-[#E5E5E5] bg-[#FAFAFA] p-5 sm:p-6"
    : "rounded-[20px] border border-white/[0.08] bg-white/[0.04] p-5 sm:p-6";

  const titleClass = isLight
    ? "font-body text-[15px] font-bold leading-snug text-[#111111] sm:text-base"
    : "font-body text-[15px] font-bold leading-snug text-[#E8ECF1] sm:text-base";

  const subtitleClass = isLight
    ? "mt-2 font-body text-[13px] leading-relaxed text-[#737373] sm:text-sm"
    : "mt-2 font-body text-[13px] leading-relaxed text-[rgba(232,236,241,0.72)] sm:text-sm";

  const inputClass = isLight
    ? "min-h-[46px] w-full flex-1 rounded-full border border-[#E5E5E5] bg-white px-4 font-body text-sm text-[#111111] outline-none transition placeholder:text-[#9CA3AF] focus:border-[rgba(59,130,246,0.45)] focus:ring-2 focus:ring-[#3B82F6]/20 sm:min-h-[48px] sm:px-5"
    : "min-h-[46px] w-full flex-1 rounded-full border border-white/[0.12] bg-[#0B0F14] px-4 font-body text-sm text-[#E8ECF1] outline-none transition placeholder:text-[rgba(232,236,241,0.45)] focus:border-[rgba(59,130,246,0.45)] focus:ring-2 focus:ring-[#3B82F6]/25 sm:min-h-[48px] sm:px-5";

  const buttonClass =
    "inline-flex min-h-[46px] w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#3B82F6] px-5 font-body text-sm font-semibold text-white transition duration-160 hover:bg-[#2563EB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50 disabled:cursor-not-allowed disabled:opacity-55 sm:min-h-[48px] sm:w-auto sm:min-w-[120px]";

  const legalClass = isLight
    ? "flex cursor-pointer items-start gap-2.5 text-left font-body text-xs leading-relaxed text-[#737373]"
    : "flex cursor-pointer items-start gap-2.5 text-left font-body text-xs leading-relaxed text-[rgba(232,236,241,0.72)]";

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!marketingAccepted || submitState === "loading") return;

    setSubmitState("loading");
    setErrorCode(null);

    const result = await submitNewsletterSubscription({
      email,
      locale,
      marketingAccepted: true,
      source: "footer_newsletter",
    });

    if (result.ok) {
      setSubmitState("success");
      setEmail("");
      return;
    }

    setSubmitState("error");
    setErrorCode(result.code);
  };

  return (
    <div className={cardClass}>
      <h3 className={titleClass}>{t("goodIdeas.footer.newsletter.title")}</h3>
      <p className={subtitleClass}>{t("goodIdeas.footer.newsletter.subtitle")}</p>

      {submitState === "success" ? (
        <p
          className={`mt-4 font-body text-sm leading-relaxed ${
            isLight ? "text-[#111111]" : "text-[#E8ECF1]"
          }`}
          role="status"
        >
          {t("goodIdeas.footer.newsletter.successMessage")}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-4 space-y-3" noValidate>
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-stretch">
            <label htmlFor="gi-footer-newsletter-email" className="sr-only">
              {t("goodIdeas.footer.newsletter.emailPlaceholder")}
            </label>
            <input
              id="gi-footer-newsletter-email"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                if (submitState === "error") {
                  setSubmitState("idle");
                  setErrorCode(null);
                }
              }}
              placeholder={t("goodIdeas.footer.newsletter.emailPlaceholder")}
              required
              className={inputClass}
            />
            <button
              type="submit"
              disabled={
                !marketingAccepted || submitState === "loading" || !email.trim()
              }
              className={buttonClass}
              aria-label={t("goodIdeas.footer.newsletter.cta")}
            >
              <span>
                {submitState === "loading"
                  ? t("registrationCTA.submitLoading")
                  : t("goodIdeas.footer.newsletter.cta")}
              </span>
              {submitState !== "loading" ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="h-4 w-4"
                  aria-hidden
                >
                  <path
                    fillRule="evenodd"
                    d="M3 10a.75.75 0 0 1 .75-.75h10.638L10.23 5.29a.75.75 0 1 1 1.04-1.08l5.5 5.25a.75.75 0 0 1 0 1.08l-5.5 5.25a.75.75 0 1 1-1.04-1.08l4.158-3.96H3.75A.75.75 0 0 1 3 10Z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : null}
            </button>
          </div>

          <label className={legalClass}>
            <input
              type="checkbox"
              checked={marketingAccepted}
              onChange={(event) => {
                setMarketingAccepted(event.target.checked);
                if (submitState === "error") {
                  setSubmitState("idle");
                  setErrorCode(null);
                }
              }}
              className={`mt-0.5 h-4 w-4 shrink-0 rounded text-[#3B82F6] focus:ring-[#3B82F6]/30 ${
                isLight
                  ? "border-[#D1D5DB] bg-white"
                  : "border-white/30 bg-[#0B0F14]"
              }`}
            />
            <span>{t("goodIdeas.footer.newsletter.marketingLabel")}</span>
          </label>

          {errorMessage ? (
            <p className="font-body text-sm text-[#FCA5A5]" role="alert">
              {errorMessage}
            </p>
          ) : null}
        </form>
      )}
    </div>
  );
}
