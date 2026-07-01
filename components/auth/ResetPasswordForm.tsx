"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import GiAuthExperienceShell from "@/components/auth/GiAuthExperienceShell";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { useUser } from "@/context/UserContext";
import { accountPath, authPath, homePath } from "@/lib/routing/paths";
import {
  giAuthInputClass,
  giAuthLabelClass,
  giAuthSubmitClass,
  giAuthToggleBtnClass,
} from "@/lib/ui/gi-auth";

const passwordFieldClass = `${giAuthInputClass} pr-11`;

function EyeIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.358 5 12 5c4.642 0 8.477 2.511 9.964 6.678.07.202.07.424 0 .639C20.577 16.49 16.642 19 12 19c-4.642 0-8.477-2.511-9.964-6.678z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function EyeSlashIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.75}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19 12 19c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 5c4.638 0 8.573 2.511 9.963 6.678.07.202.07.424 0 .639M12 12v.01M17 17l2 2M3 3l18 18"
      />
    </svg>
  );
}

export default function ResetPasswordForm() {
  const { authLoading, sessionUser, updatePassword } = useUser();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (authLoading) return;
    if (!sessionUser) {
      router.replace(
        `${authPath(locale)}?error=reset&tab=login`
      );
    }
  }, [authLoading, sessionUser, router, locale]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(t("authForm.passwordMismatch"));
      return;
    }

    setSubmitting(true);
    try {
      const { error: updateError } = await updatePassword(password);
      if (updateError) {
        setError(updateError);
        return;
      }
      router.replace(`${accountPath(locale)}?passwordUpdated=1`);
      router.refresh();
    } finally {
      setSubmitting(false);
    }
  };

  if (authLoading || !sessionUser) {
    return (
      <GiAuthExperienceShell mode="page" backHref={homePath(locale)}>
        <p className="font-body text-sm text-[rgba(232,236,241,0.65)]">
          {t("checkoutPage.loadingAuth")}
        </p>
      </GiAuthExperienceShell>
    );
  }

  return (
    <GiAuthExperienceShell mode="page" backHref={accountPath(locale)}>
      <div className="w-full">
        <div className="space-y-2">
          <h1 className="font-body text-2xl font-semibold tracking-tight text-[#E8ECF1]">
            {t("authForm.resetPasswordTitle")}
          </h1>
          <p className="font-body text-sm leading-relaxed text-[rgba(232,236,241,0.65)]">
            {t("authForm.resetPasswordDescription")}
          </p>
        </div>

        {error ? (
          <p className="mt-4 font-body text-sm text-[#F87171]" role="alert">
            {error}
          </p>
        ) : null}

        <form className="mt-6 space-y-4" onSubmit={(e) => void handleSubmit(e)}>
          <div className="space-y-2">
            <label className={giAuthLabelClass}>
              {t("authForm.newPassword")}
            </label>
            <div className="relative">
              <input
                ref={passwordInputRef}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className={passwordFieldClass}
                placeholder="••••••••"
                required
                minLength={6}
              />
              <button
                type="button"
                className={giAuthToggleBtnClass}
                aria-pressed={showPassword}
                aria-label={
                  showPassword
                    ? t("authForm.hidePassword")
                    : t("authForm.showPassword")
                }
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className={giAuthLabelClass}>
              {t("authForm.confirmPassword")}
            </label>
            <input
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              className={giAuthInputClass}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className={giAuthSubmitClass}
          >
            {submitting ? "…" : t("authForm.resetPasswordSubmit")}
          </button>
        </form>
      </div>
    </GiAuthExperienceShell>
  );
}
