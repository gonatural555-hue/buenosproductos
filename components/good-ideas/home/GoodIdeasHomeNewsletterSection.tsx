"use client";

import Link from "next/link";
import { useState } from "react";
import HomeContainer from "@/components/good-ideas/home/HomeContainer";
import SectionTitle from "@/components/good-ideas/home/SectionTitle";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { submitNewsletterSubscription } from "@/lib/newsletter-client";
import { LEGAL_SLUGS } from "@/lib/seo";

type Props = {
  title: string;
  subtitle: string;
  emailPlaceholder: string;
  ctaLabel: string;
  marketingLabel: string;
  privacyLinkLabel: string;
  sectionAriaLabel: string;
  successMessage: string;
  submitLoadingLabel: string;
};

type SubmitState = "idle" | "loading" | "success" | "error";

export default function GoodIdeasHomeNewsletterSection({
  title,
  subtitle,
  emailPlaceholder,
  ctaLabel,
  marketingLabel,
  privacyLinkLabel,
  sectionAriaLabel,
  successMessage,
  submitLoadingLabel,
}: Props) {
  const locale = useLocale();
  const t = useTranslations();
  const [email, setEmail] = useState("");
  const [marketingAccepted, setMarketingAccepted] = useState(false);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [errorCode, setErrorCode] = useState<string | null>(null);

  const privacyHref = `/${locale}/${LEGAL_SLUGS.privacy[locale]}`;

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

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!marketingAccepted || submitState === "loading") return;

    setSubmitState("loading");
    setErrorCode(null);

    const result = await submitNewsletterSubscription({
      email,
      locale,
      marketingAccepted: true,
      source: "home_newsletter",
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
    <section
      className="border-t border-white/[0.08] bg-[#0B0F14] py-16 md:py-20 lg:py-24"
      aria-label={sectionAriaLabel}
    >
      <HomeContainer innerClassName="max-w-[1320px]">
        <div className="rounded-[24px] border border-white/[0.08] bg-[#151B24] p-6 sm:p-8 md:p-10 lg:p-12">
          <div className="mx-auto max-w-2xl text-center lg:max-w-3xl">
            <SectionTitle align="center">{title}</SectionTitle>
            <p className="mx-auto mt-4 max-w-xl font-body text-sm leading-relaxed text-[rgba(232,236,241,0.72)] sm:text-base">
              {subtitle}
            </p>
          </div>

          {submitState === "success" ? (
            <p
              className="mx-auto mt-8 max-w-xl text-center font-body text-sm font-medium leading-relaxed text-[#E8ECF1] sm:text-base"
              role="status"
            >
              {successMessage}
            </p>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mx-auto mt-8 max-w-xl space-y-4 lg:max-w-2xl"
              noValidate
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                <label htmlFor="gi-home-newsletter-email" className="sr-only">
                  {emailPlaceholder}
                </label>
                <input
                  id="gi-home-newsletter-email"
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
                  placeholder={emailPlaceholder}
                  required
                  className="min-h-[52px] w-full flex-1 rounded-full border border-white/[0.08] bg-[#0B0F14] px-5 font-body text-sm text-[#E8ECF1] outline-none transition placeholder:text-[rgba(232,236,241,0.45)] focus:border-[rgba(59,130,246,0.45)] focus:ring-2 focus:ring-[#3B82F6]/25 sm:text-[15px]"
                />
                <button
                  type="submit"
                  disabled={
                    !marketingAccepted ||
                    submitState === "loading" ||
                    !email.trim()
                  }
                  className="inline-flex min-h-[52px] w-full shrink-0 items-center justify-center gap-2 rounded-full bg-[#3B82F6] px-6 font-body text-sm font-semibold text-white shadow-[0_12px_32px_rgba(59,130,246,0.28)] transition hover:bg-[#2563EB] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#3B82F6]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#151B24] disabled:cursor-not-allowed disabled:opacity-55 sm:w-auto sm:min-w-[168px]"
                  aria-label={ctaLabel}
                >
                  <span>{submitState === "loading" ? submitLoadingLabel : ctaLabel}</span>
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

              <label className="flex cursor-pointer items-start gap-3 text-left font-body text-xs leading-relaxed text-[rgba(232,236,241,0.72)] sm:text-[13px]">
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
                  className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/30 bg-[#0B0F14] text-[#3B82F6] focus:ring-[#3B82F6]/30"
                />
                <span>
                  {marketingLabel}{" "}
                  <Link
                    href={privacyHref}
                    className="font-medium text-[#3B82F6] underline decoration-[rgba(59,130,246,0.35)] underline-offset-2 hover:decoration-[#3B82F6]"
                  >
                    {privacyLinkLabel}
                  </Link>
                </span>
              </label>

              {errorMessage ? (
                <p className="text-center font-body text-sm text-[#FCA5A5]" role="alert">
                  {errorMessage}
                </p>
              ) : null}
            </form>
          )}
        </div>
      </HomeContainer>
    </section>
  );
}
