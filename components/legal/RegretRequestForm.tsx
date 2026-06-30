"use client";

import { useState } from "react";
import { useLocale, useTranslations } from "@/components/i18n/LocaleProvider";
import { giType } from "@/lib/ui/gi-typography";

type FormState = {
  fullName: string;
  email: string;
  orderNumber: string;
  product: string;
  notes: string;
};

type ApiErrorCode = "invalid" | "server" | "rate_limit";

export default function RegretRequestForm() {
  const locale = useLocale();
  const t = useTranslations();
  const [submittedCode, setSubmittedCode] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorCode, setErrorCode] = useState<ApiErrorCode | null>(null);
  const [form, setForm] = useState<FormState>({
    fullName: "",
    email: "",
    orderNumber: "",
    product: "",
    notes: "",
  });

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setErrorCode(null);

    try {
      const response = await fetch("/api/withdrawal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: form.fullName,
          email: form.email,
          orderNumber: form.orderNumber,
          productName: form.product,
          notes: form.notes || null,
          locale,
        }),
      });

      const data = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        caseCode?: string;
        code?: ApiErrorCode;
      };

      if (response.ok && data.ok && data.caseCode) {
        setSubmittedCode(data.caseCode);
        return;
      }

      if (data.code === "invalid" || data.code === "rate_limit" || data.code === "server") {
        setErrorCode(data.code);
      } else {
        setErrorCode("server");
      }
    } catch {
      setErrorCode("server");
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedCode) {
    return (
      <div
        className="rounded-2xl border border-[#3B82F6]/30 bg-[#3B82F6]/10 p-6 md:p-8"
        role="status"
      >
        <p className="font-body text-sm font-semibold text-[#93C5FD]">
          {t("legal.regretForm.successTitle")}
        </p>
        <p className="mt-3 font-body text-sm leading-relaxed text-[#C5CAD3]">
          {t("legal.regretForm.successBody")}
        </p>
        <p className="mt-4 font-mono text-lg font-semibold tracking-wide text-[#E8ECF1]">
          {submittedCode}
        </p>
        <p className="mt-4 font-body text-xs leading-relaxed text-[#737373]">
          {t("legal.regretForm.successFinePrint")}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl border border-white/[0.1] bg-white/[0.03] p-6 md:p-8"
    >
      <p className="font-body text-sm leading-relaxed text-[#A8B0BC]">
        {t("legal.regretForm.intro")}
      </p>

      {errorCode ? (
        <p
          className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 font-body text-sm text-red-200"
          role="alert"
        >
          {t(`legal.regretForm.errors.${errorCode}`)}
        </p>
      ) : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-1">
          <span className={giType.label}>{t("legal.regretForm.fullName")}</span>
          <input
            required
            type="text"
            autoComplete="name"
            disabled={submitting}
            value={form.fullName}
            onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))}
            className="mt-1.5 w-full rounded-lg border border-white/[0.12] bg-[#0B0F14] px-3 py-2.5 font-body text-sm text-[#E8ECF1] outline-none transition focus:border-[#3B82F6]/60 disabled:opacity-60"
          />
        </label>

        <label className="block sm:col-span-1">
          <span className={giType.label}>{t("legal.regretForm.email")}</span>
          <input
            required
            type="email"
            autoComplete="email"
            disabled={submitting}
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            className="mt-1.5 w-full rounded-lg border border-white/[0.12] bg-[#0B0F14] px-3 py-2.5 font-body text-sm text-[#E8ECF1] outline-none transition focus:border-[#3B82F6]/60 disabled:opacity-60"
          />
        </label>

        <label className="block sm:col-span-1">
          <span className={giType.label}>{t("legal.regretForm.orderNumber")}</span>
          <input
            required
            type="text"
            disabled={submitting}
            value={form.orderNumber}
            onChange={(e) =>
              setForm((f) => ({ ...f, orderNumber: e.target.value }))
            }
            className="mt-1.5 w-full rounded-lg border border-white/[0.12] bg-[#0B0F14] px-3 py-2.5 font-body text-sm text-[#E8ECF1] outline-none transition focus:border-[#3B82F6]/60 disabled:opacity-60"
          />
        </label>

        <label className="block sm:col-span-1">
          <span className={giType.label}>{t("legal.regretForm.product")}</span>
          <input
            required
            type="text"
            disabled={submitting}
            value={form.product}
            onChange={(e) => setForm((f) => ({ ...f, product: e.target.value }))}
            className="mt-1.5 w-full rounded-lg border border-white/[0.12] bg-[#0B0F14] px-3 py-2.5 font-body text-sm text-[#E8ECF1] outline-none transition focus:border-[#3B82F6]/60 disabled:opacity-60"
          />
        </label>

        <label className="block sm:col-span-2">
          <span className={giType.label}>{t("legal.regretForm.notes")}</span>
          <textarea
            rows={3}
            disabled={submitting}
            value={form.notes}
            onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
            className="mt-1.5 w-full resize-y rounded-lg border border-white/[0.12] bg-[#0B0F14] px-3 py-2.5 font-body text-sm text-[#E8ECF1] outline-none transition focus:border-[#3B82F6]/60 disabled:opacity-60"
          />
        </label>
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="mt-6 w-full rounded-lg bg-[#3B82F6] px-4 py-3 font-body text-sm font-semibold text-white transition hover:bg-[#2563EB] disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
      >
        {submitting ? t("legal.regretForm.submitting") : t("legal.regretForm.submit")}
      </button>

      <p className="mt-4 font-body text-xs leading-relaxed text-[#737373]">
        {t("legal.regretForm.finePrint")}
      </p>
    </form>
  );
}
