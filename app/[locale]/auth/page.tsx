"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import AuthExperienceShell from "@/components/auth/AuthExperienceShell";
import { useLocale } from "@/components/i18n/LocaleProvider";
import { goNaturalHomePath } from "@/lib/routing/brands";
import { useUser } from "@/context/UserContext";

function AuthPageContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const locale = useLocale();
  const { isLoggedIn, authLoading } = useUser();
  const [mounted, setMounted] = useState(false);

  const tab = (searchParams.get("tab") as "login" | "register" | null) || "login";
  const redirectParam = searchParams.get("redirect");
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
      <AuthExperienceShell mode="page" backHref={goNaturalHomePath(locale)}>
        <p className="font-inter text-sm text-[#666666]">Cargando...</p>
      </AuthExperienceShell>
    );
  }

  if (isLoggedIn) {
    return null;
  }

  return (
    <AuthExperienceShell mode="page" backHref={goNaturalHomePath(locale)}>
      <AuthForm
        initialTab={tab}
        isPage={true}
        redirectTo={redirectTo}
      />
    </AuthExperienceShell>
  );
}

export default function AuthPage() {
  return (
    <Suspense
      fallback={
        <AuthExperienceShell mode="page">
          <p className="font-inter text-sm text-[#666666]">Cargando...</p>
        </AuthExperienceShell>
      }
    >
      <AuthPageContent />
    </Suspense>
  );
}
