"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import GiAuthExperienceShell from "@/components/auth/GiAuthExperienceShell";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { homePath } from "@/lib/routing/paths";
import { useUser } from "@/context/UserContext";

function AuthPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const { isLoggedIn, authLoading } = useUser();
  const [mounted, setMounted] = useState(false);

  const tab = (searchParams.get("tab") as "login" | "register" | null) || "login";
  const redirectParam = searchParams.get("redirect");
  const authError = searchParams.get("error");
  const redirectTo =
    redirectParam && redirectParam.startsWith("/") ? redirectParam : undefined;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !authLoading && isLoggedIn) {
      router.push(redirectTo || `/${locale}/account`);
    }
  }, [mounted, authLoading, isLoggedIn, router, locale, redirectTo]);

  if (!mounted || authLoading) {
    return (
      <GiAuthExperienceShell mode="page" backHref={homePath(locale)}>
        <p className="font-body text-sm text-[rgba(232,236,241,0.65)]">
          {t("checkoutPage.loadingAuth")}
        </p>
      </GiAuthExperienceShell>
    );
  }

  if (isLoggedIn) {
    return null;
  }

  return (
    <GiAuthExperienceShell mode="page" backHref={homePath(locale)}>
      {authError === "auth" ? (
        <p className="mb-4 font-body text-sm text-[#F87171]" role="alert">
          {t("authForm.authCallbackError")}
        </p>
      ) : null}
      {authError === "reset" ? (
        <p className="mb-4 font-body text-sm text-[#F87171]" role="alert">
          {t("authForm.resetPasswordInvalidSession")}
        </p>
      ) : null}
      <AuthForm initialTab={tab} isPage redirectTo={redirectTo} />
    </GiAuthExperienceShell>
  );
}

export default function AuthPage() {
  const t = useTranslations();

  return (
    <Suspense
      fallback={
        <GiAuthExperienceShell mode="page">
          <p className="font-body text-sm text-[rgba(232,236,241,0.65)]">
            {t("checkoutPage.loadingAuth")}
          </p>
        </GiAuthExperienceShell>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}
