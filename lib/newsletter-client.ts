const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type NewsletterSubmitCode =
  | "invalid_email"
  | "duplicate"
  | "marketing_required"
  | "generic";

export type NewsletterSubmitResult =
  | { ok: true }
  | { ok: false; code: NewsletterSubmitCode };

export function isValidNewsletterEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

export async function submitNewsletterSubscription(params: {
  email: string;
  locale: string;
  marketingAccepted: boolean;
  source: string;
}): Promise<NewsletterSubmitResult> {
  const trimmed = params.email.trim();
  if (!isValidNewsletterEmail(trimmed)) {
    return { ok: false, code: "invalid_email" };
  }
  if (!params.marketingAccepted) {
    return { ok: false, code: "marketing_required" };
  }

  try {
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: trimmed,
        locale: params.locale,
        marketingAccepted: true,
        source: params.source,
      }),
    });

    const data = (await res.json().catch(() => ({}))) as {
      ok?: boolean;
      code?: string;
    };

    if (res.ok && data.ok) {
      return { ok: true };
    }

    if (data.code === "duplicate") return { ok: false, code: "duplicate" };
    if (data.code === "invalid_email")
      return { ok: false, code: "invalid_email" };
    if (data.code === "marketing_required")
      return { ok: false, code: "marketing_required" };
    return { ok: false, code: "generic" };
  } catch {
    return { ok: false, code: "generic" };
  }
}
