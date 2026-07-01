"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import {
  giAuthInputClass,
  giAuthLabelClass,
  giAuthSubmitClass,
  giAuthTabClass,
  giAuthToggleBtnClass,
} from "@/lib/ui/gi-auth";

type Tab = "login" | "register";
type FormView = "auth" | "forgot-password";

type Props = {
  initialTab?: Tab;
  onSuccess?: () => void;
  isPage?: boolean;
  /** Ruta interna (ej. /es/checkout) tras login correcto */
  redirectTo?: string;
};

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

const passwordFieldClass = `${giAuthInputClass} pr-11`;

function AuthTabButton({
  tab,
  activeTab,
  onSelect,
  children,
}: {
  tab: Tab;
  activeTab: Tab;
  onSelect: (tab: Tab) => void;
  children: React.ReactNode;
}) {
  const isActive = activeTab === tab;
  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => onSelect(tab)}
      className={giAuthTabClass(isActive)}
    >
      {children}
    </button>
  );
}

export default function AuthForm({
  initialTab = "login",
  onSuccess,
  isPage = false,
  redirectTo,
}: Props) {
  const { login, register, requestPasswordReset } = useUser();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const [activeTab, setActiveTab] = useState<Tab>(initialTab);
  const [formView, setFormView] = useState<FormView>("auth");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [awaitingEmailConfirmation, setAwaitingEmailConfirmation] =
    useState(false);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [emailAlreadyRegistered, setEmailAlreadyRegistered] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const emailInputRef = useRef<HTMLInputElement>(null);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);
  const nameInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setError(null);
    setAwaitingEmailConfirmation(false);
    setResetEmailSent(false);
    setEmailAlreadyRegistered(false);
    setFormView("auth");
    setPendingEmail("");
    setActiveTab(initialTab);
  }, [initialTab]);

  const subtitle = useMemo(() => {
    if (formView === "forgot-password") {
      return resetEmailSent
        ? ""
        : t("authForm.forgotPasswordDescription");
    }
    if (activeTab === "login") {
      return t("goodIdeas.auth.loginSubtitle");
    }
    return t("goodIdeas.auth.registerSubtitle");
  }, [activeTab, formView, resetEmailSent, t]);

  const heading = useMemo(() => {
    if (formView === "forgot-password") {
      return resetEmailSent
        ? t("authForm.resetEmailSentTitle")
        : t("authForm.forgotPasswordTitle");
    }
    if (awaitingEmailConfirmation && activeTab === "register") {
      return t("authForm.confirmEmailTitle");
    }
    if (emailAlreadyRegistered && activeTab === "register") {
      return t("authForm.emailAlreadyRegisteredTitle");
    }
    return activeTab === "login"
      ? t("goodIdeas.auth.loginTitle")
      : t("goodIdeas.auth.registerTitle");
  }, [
    activeTab,
    awaitingEmailConfirmation,
    emailAlreadyRegistered,
    formView,
    resetEmailSent,
    t,
  ]);

  const handleTabSelect = (tab: Tab) => {
    setActiveTab(tab);
    setFormView("auth");
    setEmailAlreadyRegistered(false);
    if (tab === "login") {
      setAwaitingEmailConfirmation(false);
      setResetEmailSent(false);
      setConfirmPassword("");
      setShowPassword(false);
    }
  };

  const goToLogin = () => {
    setActiveTab("login");
    setFormView("auth");
    setAwaitingEmailConfirmation(false);
    setResetEmailSent(false);
    setEmailAlreadyRegistered(false);
    setError(null);
  };

  const openForgotPassword = () => {
    setFormView("forgot-password");
    setError(null);
    setResetEmailSent(false);
    setEmailAlreadyRegistered(false);
  };

  const handleInputFocus = (inputRef: React.RefObject<HTMLInputElement | null>) => {
    if (inputRef.current && isPage) {
      requestAnimationFrame(() => {
        setTimeout(() => {
          if (inputRef.current) {
            inputRef.current.scrollIntoView({
              behavior: "smooth",
              block: "center",
              inline: "nearest",
            });
          }
        }, 300);
      });
    }
  };

  const afterAuthSuccess = () => {
    const target =
      redirectTo && redirectTo.startsWith("/") ? redirectTo : `/${locale}/account`;
    if (isPage) {
      router.push(target);
      router.refresh();
    } else if (onSuccess) {
      onSuccess();
    }
  };

  const handleForgotPasswordSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      const { error: resetError } = await requestPasswordReset(email, locale);
      if (resetError) {
        setError(resetError);
        return;
      }
      setResetEmailSent(true);
      setPendingEmail(email);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      if (activeTab === "login") {
        const { error: err } = await login({ email, password });
        if (err) {
          setError(err);
          return;
        }
      } else {
        if (password !== confirmPassword) {
          setError(
            t("authForm.passwordMismatch", "Passwords do not match.")
          );
          return;
        }
        const {
          error: err,
          needsEmailConfirmation,
          pendingEmail: registeredEmail,
          emailAlreadyRegistered: duplicateEmail,
        } = await register({ name, email, password });
        if (err) {
          setError(err);
          return;
        }
        if (duplicateEmail) {
          setEmailAlreadyRegistered(true);
          return;
        }
        if (needsEmailConfirmation) {
          setAwaitingEmailConfirmation(true);
          setPendingEmail(registeredEmail ?? email);
          return;
        }
      }
      afterAuthSuccess();
    } finally {
      setSubmitting(false);
    }
  };


  return (
    <div className="w-full">
      {formView === "auth" ? (
        <nav
          className="flex gap-8 border-b border-white/[0.08]"
          role="tablist"
          aria-label={t("goodIdeas.auth.tablistAria")}
        >
          <AuthTabButton tab="login" activeTab={activeTab} onSelect={handleTabSelect}>
            {t("goodIdeas.auth.loginTab")}
          </AuthTabButton>
          <AuthTabButton tab="register" activeTab={activeTab} onSelect={handleTabSelect}>
            {t("goodIdeas.auth.registerTab")}
          </AuthTabButton>
        </nav>
      ) : null}

      <div className="mt-6 space-y-2">
        <h2 className="font-body text-2xl font-semibold tracking-tight text-[#E8ECF1]">
          {heading}
        </h2>
        {subtitle ? (
          <p className="font-body text-sm leading-relaxed text-[rgba(232,236,241,0.65)]">
            {subtitle}
          </p>
        ) : null}
      </div>

      {error ? (
        <p className="mt-4 font-body text-sm text-[#F87171]" role="alert">
          {error}
        </p>
      ) : null}

      {formView === "forgot-password" && resetEmailSent ? (
        <div
          className="mt-6 rounded-2xl border border-white/[0.08] bg-[#0B0F14]/80 p-5 sm:p-6"
          role="status"
          aria-live="polite"
        >
          <p className="font-body text-sm leading-relaxed text-[rgba(232,236,241,0.72)]">
            {t("authForm.resetEmailSentDescription").replace(
              "{email}",
              pendingEmail
            )}
          </p>
          <button
            type="button"
            onClick={goToLogin}
            className="mt-4 font-body text-sm font-semibold text-[#3B82F6] underline-offset-4 transition-colors hover:text-[#60A5FA] hover:underline"
          >
            {t("authForm.backToLogin")}
          </button>
        </div>
      ) : null}

      {emailAlreadyRegistered && activeTab === "register" && formView === "auth" ? (
        <div
          className="mt-6 rounded-2xl border border-amber-400/30 bg-amber-400/10 p-5 sm:p-6"
          role="alert"
        >
          <p className="font-body text-sm leading-relaxed text-[rgba(232,236,241,0.85)]">
            {t("authForm.emailAlreadyRegisteredDescription")}
          </p>
          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
            <button
              type="button"
              onClick={goToLogin}
              className="font-body text-sm font-semibold text-[#3B82F6] underline-offset-4 transition-colors hover:text-[#60A5FA] hover:underline"
            >
              {t("authForm.emailAlreadyRegisteredLogin")}
            </button>
            <button
              type="button"
              onClick={openForgotPassword}
              className="font-body text-sm font-semibold text-[#3B82F6] underline-offset-4 transition-colors hover:text-[#60A5FA] hover:underline"
            >
              {t("authForm.emailAlreadyRegisteredForgot")}
            </button>
          </div>
        </div>
      ) : null}

      {awaitingEmailConfirmation && activeTab === "register" && formView === "auth" ? (
        <div
          className="mt-6 rounded-2xl border border-white/[0.08] bg-[#0B0F14]/80 p-5 sm:p-6"
          role="status"
          aria-live="polite"
        >
          <div className="flex gap-4">
            <div
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#3B82F6]/30 bg-[#3B82F6]/10 text-[#3B82F6]"
              aria-hidden
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.75}
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                />
              </svg>
            </div>
            <div className="min-w-0 flex-1 space-y-3">
              <p className="font-body text-sm leading-relaxed text-[rgba(232,236,241,0.72)]">
                {t("authForm.confirmEmailDescription").replace(
                  "{email}",
                  pendingEmail
                )}
              </p>
              <button
                type="button"
                onClick={goToLogin}
                className="font-body text-sm font-semibold text-[#3B82F6] underline-offset-4 transition-colors hover:text-[#60A5FA] hover:underline"
              >
                {t("authForm.goToLogin")}
              </button>
            </div>
          </div>
        </div>
      ) : formView === "forgot-password" && !resetEmailSent ? (
        <form
          className="mt-6 space-y-4"
          onSubmit={(e) => void handleForgotPasswordSubmit(e)}
        >
          <div className="space-y-2">
            <label className={giAuthLabelClass}>{t("goodIdeas.auth.emailLabel")}</label>
            <input
              ref={emailInputRef}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onFocus={() => handleInputFocus(emailInputRef)}
              type="email"
              className={giAuthInputClass}
              placeholder={t("goodIdeas.auth.emailPlaceholder")}
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className={giAuthSubmitClass}
          >
            {submitting ? "…" : t("authForm.sendResetLink")}
          </button>
          <button
            type="button"
            onClick={goToLogin}
            className="w-full font-body text-sm font-semibold text-[#3B82F6] underline-offset-4 transition-colors hover:text-[#60A5FA] hover:underline"
          >
            {t("authForm.backToLogin")}
          </button>
        </form>
      ) : emailAlreadyRegistered && activeTab === "register" ? null : (
        <form className="mt-6 space-y-4" onSubmit={(e) => void handleSubmit(e)}>
          {activeTab === "register" && (
            <div className="space-y-2">
              <label className={giAuthLabelClass}>{t("goodIdeas.auth.nameLabel")}</label>
              <input
                ref={nameInputRef}
                value={name}
                onChange={(event) => setName(event.target.value)}
                onFocus={() => handleInputFocus(nameInputRef)}
                type="text"
                className={giAuthInputClass}
                placeholder={t("goodIdeas.auth.namePlaceholder")}
                required
              />
            </div>
          )}

          <div className="space-y-2">
            <label className={giAuthLabelClass}>{t("goodIdeas.auth.emailLabel")}</label>
            <input
              ref={emailInputRef}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onFocus={() => handleInputFocus(emailInputRef)}
              type="email"
              className={giAuthInputClass}
              placeholder={t("goodIdeas.auth.emailPlaceholder")}
              required
            />
          </div>

          <div className="space-y-2">
            <label className={giAuthLabelClass}>{t("goodIdeas.auth.passwordLabel")}</label>
            <div className="relative">
              <input
                ref={passwordInputRef}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onFocus={() => handleInputFocus(passwordInputRef)}
                type={showPassword ? "text" : "password"}
                autoComplete={
                  activeTab === "login" ? "current-password" : "new-password"
                }
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
            {activeTab === "login" ? (
              <button
                type="button"
                onClick={openForgotPassword}
                className="font-body text-sm font-medium text-[#3B82F6] underline-offset-4 transition-colors hover:text-[#60A5FA] hover:underline"
              >
                {t("authForm.forgotPasswordLink")}
              </button>
            ) : null}
          </div>

          {activeTab === "register" && (
            <div className="space-y-2">
              <label className={giAuthLabelClass}>
                {t("authForm.confirmPassword")}
              </label>
              <div className="relative">
                <input
                  ref={confirmPasswordInputRef}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  onFocus={() => handleInputFocus(confirmPasswordInputRef)}
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
          )}

          <button
            type="submit"
            disabled={submitting}
            className={giAuthSubmitClass}
          >
            {submitting
              ? "…"
              : activeTab === "login"
                ? t("goodIdeas.auth.loginTab")
                : t("goodIdeas.auth.registerTab")}
          </button>
        </form>
      )}
    </div>
  );
}
