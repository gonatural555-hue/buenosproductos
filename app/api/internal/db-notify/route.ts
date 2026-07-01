import { NextRequest, NextResponse } from "next/server";
import {
  extractEmailFromRecord,
  sendAdminDbNotifyEmail,
  shouldNotifyTable,
  type SupabaseDbWebhookPayload,
} from "@/lib/email/admin-notify";
import { syncRegisteredUserToBrevo } from "@/lib/brevo";

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.SUPABASE_WEBHOOK_SECRET?.trim();
  if (!secret) {
    console.warn("[db-notify] SUPABASE_WEBHOOK_SECRET not configured");
    return false;
  }
  const header = request.headers.get("x-webhook-secret");
  return header === secret;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  const payload = body as SupabaseDbWebhookPayload;
  const table = payload.table;
  const eventType = (payload.type ?? "INSERT").toUpperCase();

  if (!shouldNotifyTable(table)) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  if (eventType !== "INSERT") {
    return NextResponse.json({ ok: true, skipped: true });
  }

  try {
    await sendAdminDbNotifyEmail(payload);
  } catch (error) {
    console.error("[db-notify] admin email failed:", error);
  }

  if (table === "profiles" && payload.record) {
    const email = extractEmailFromRecord(payload.record);
    if (email) {
      try {
        // TODO: usar consentimiento real del perfil cuando exista el campo
        await syncRegisteredUserToBrevo(email, {
          consentimiento: true,
          idioma:
            typeof payload.record.locale === "string"
              ? payload.record.locale
              : "es",
        });
      } catch (error) {
        console.error("[db-notify] Brevo profile sync failed:", error);
      }
    }
  }

  return NextResponse.json({ ok: true });
}
