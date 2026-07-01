import { SITE_OPERATOR } from "@/lib/legal/operator";
import { sendBrevoTransactionalEmail } from "@/lib/email/brevo-client";
import {
  escapeHtml,
  renderGiEmailLayout,
  type GiEmailLocale,
} from "@/lib/email/layout";

const NOTIFY_TABLES = new Set([
  "orders",
  "profiles",
  "newsletter_subscriptions",
]);

export type SupabaseDbWebhookPayload = {
  type?: string;
  table?: string;
  record?: Record<string, unknown>;
  schema?: string;
};

function adminRecipient(): string | null {
  return (
    process.env.ADMIN_NOTIFY_EMAIL?.trim() ||
    SITE_OPERATOR.email ||
    null
  );
}

function tableLabel(table: string, locale: GiEmailLocale): string {
  const labels: Record<string, { es: string; en: string }> = {
    orders: { es: "Pedido nuevo", en: "New order" },
    profiles: { es: "Usuario nuevo", en: "New user" },
    newsletter_subscriptions: { es: "Newsletter", en: "Newsletter" },
  };
  return labels[table]?.[locale] ?? table;
}

function formatRecordJson(record: Record<string, unknown>): string {
  const safe = { ...record };
  if (typeof safe.password === "string") safe.password = "[redacted]";
  return JSON.stringify(safe, null, 2);
}

export async function sendAdminDbNotifyEmail(
  payload: SupabaseDbWebhookPayload
): Promise<boolean> {
  const to = adminRecipient();
  if (!to) {
    console.warn("[db-notify] ADMIN_NOTIFY_EMAIL missing — skipping");
    return false;
  }

  const table = payload.table ?? "unknown";
  const eventType = payload.type ?? "INSERT";
  const record = payload.record ?? {};
  const locale: GiEmailLocale = "es";
  const title = `${tableLabel(table, locale)} — ${eventType}`;
  const subject = `[${SITE_OPERATOR.tradeName}] ${title}`;

  const bodyHtml = `
    <p style="margin:0 0 12px;color:rgba(232,236,241,0.85);">
      <strong>Tabla:</strong> ${escapeHtml(table)}<br>
      <strong>Evento:</strong> ${escapeHtml(eventType)}<br>
      <strong>Fecha:</strong> ${escapeHtml(new Date().toISOString())}
    </p>
    <pre style="margin:16px 0 0;padding:14px;background-color:#0B0F14;border-radius:8px;font-size:12px;line-height:1.5;color:rgba(232,236,241,0.8);white-space:pre-wrap;word-break:break-word;">${escapeHtml(formatRecordJson(record))}</pre>
  `.trim();

  const html = renderGiEmailLayout({
    title,
    preheader: subject,
    locale,
    bodyHtml,
  });

  return sendBrevoTransactionalEmail({
    to: { email: to, name: SITE_OPERATOR.operatorName },
    subject,
    html,
    replyTo: { email: SITE_OPERATOR.email, name: SITE_OPERATOR.tradeName },
  });
}

export function shouldNotifyTable(table: string | undefined): boolean {
  return Boolean(table && NOTIFY_TABLES.has(table));
}

export function extractEmailFromRecord(
  record: Record<string, unknown>
): string | null {
  const candidates = [record.email, record.guest_email];
  for (const value of candidates) {
    if (typeof value === "string" && value.includes("@")) {
      return value.trim().toLowerCase();
    }
  }
  return null;
}
