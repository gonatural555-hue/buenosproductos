import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { syncNewsletterSubscriberToBrevo } from "@/lib/brevo";
import { sendNewsletterWelcomeEmail } from "@/lib/email/transactional-templates";
import type { GiEmailLocale } from "@/lib/email/layout";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOCALES = new Set(["en", "es", "fr", "it"]);

function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const t = raw.trim().toLowerCase();
  if (t.length < 5 || t.length > 320) return null;
  if (!EMAIL_REGEX.test(t)) return null;
  return t;
}

export async function POST(request: NextRequest) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !anonKey) {
    return NextResponse.json(
      { ok: false, code: "server" as const },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, code: "invalid" as const },
      { status: 400 }
    );
  }

  if (!body || typeof body !== "object") {
    return NextResponse.json(
      { ok: false, code: "invalid" as const },
      { status: 400 }
    );
  }

  const b = body as Record<string, unknown>;
  const email = normalizeEmail(b.email);
  const localeRaw = typeof b.locale === "string" ? b.locale.trim().toLowerCase() : "en";
  const locale = LOCALES.has(localeRaw) ? localeRaw : "en";
  const marketingAccepted = b.marketingAccepted === true;
  const source =
    typeof b.source === "string" && b.source.length <= 120
      ? b.source.slice(0, 120)
      : "registration_cta";

  if (!email) {
    return NextResponse.json(
      { ok: false, code: "invalid_email" as const },
      { status: 400 }
    );
  }

  if (!marketingAccepted) {
    return NextResponse.json(
      { ok: false, code: "marketing_required" as const },
      { status: 400 }
    );
  }

  const supabase = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const { error } = await supabase.from("newsletter_subscriptions").insert({
    email,
    locale,
    marketing_accepted: true,
    source,
  });

  if (error) {
    const msg = error.message?.toLowerCase() ?? "";
    const code = error.code;
    if (
      code === "23505" ||
      msg.includes("duplicate") ||
      msg.includes("unique")
    ) {
      return NextResponse.json(
        { ok: false, code: "duplicate" as const },
        { status: 409 }
      );
    }
    console.error("[newsletter]", error);
    return NextResponse.json(
      { ok: false, code: "server" as const },
      { status: 500 }
    );
  }

  const emailLocale: GiEmailLocale = locale === "en" ? "en" : "es";

  try {
    await syncNewsletterSubscriberToBrevo(email, {
      idioma: emailLocale,
      consentimiento: true,
    });
    await sendNewsletterWelcomeEmail(email, emailLocale);
  } catch (brevoErr) {
    console.error("[newsletter] Brevo sync/welcome email:", brevoErr);
  }

  return NextResponse.json({ ok: true as const }, { status: 201 });
}
