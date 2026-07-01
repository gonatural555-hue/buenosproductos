import { SITE_OPERATOR } from "@/lib/legal/operator";
import { sendBrevoTransactionalEmail } from "@/lib/email/brevo-client";
import {
  escapeHtml,
  renderGiEmailLayout,
  type GiEmailLocale,
} from "@/lib/email/layout";

export type WithdrawalEmailPayload = {
  caseCode: string;
  fullName: string;
  email: string;
  orderNumber: string;
  productName: string;
  notes?: string | null;
  locale: string;
};

function withdrawalCustomerBody(
  payload: WithdrawalEmailPayload,
  locale: GiEmailLocale
): string {
  const es = locale === "es";
  const notesBlock = payload.notes
    ? `<p style="margin:16px 0 0;color:rgba(232,236,241,0.72);"><strong>${es ? "Notas" : "Notes"}:</strong> ${escapeHtml(payload.notes)}</p>`
    : "";

  if (es) {
    return `
      <p style="margin:0 0 16px;color:rgba(232,236,241,0.85);">Hola ${escapeHtml(payload.fullName)},</p>
      <p style="margin:0 0 16px;color:rgba(232,236,241,0.85);">Recibimos tu solicitud de <strong>arrepentimiento</strong> conforme la Ley 24.240.</p>
      <p style="margin:0 0 8px;color:rgba(232,236,241,0.85);"><strong>Código de trámite:</strong> ${escapeHtml(payload.caseCode)}</p>
      <p style="margin:0 0 8px;color:rgba(232,236,241,0.85);"><strong>Pedido:</strong> ${escapeHtml(payload.orderNumber)}</p>
      <p style="margin:0;color:rgba(232,236,241,0.85);"><strong>Producto:</strong> ${escapeHtml(payload.productName)}</p>
      ${notesBlock}
      <p style="margin:20px 0 0;color:rgba(232,236,241,0.72);">Te responderemos dentro de las <strong>24 horas</strong> con los pasos para completar la revocación.</p>
    `.trim();
  }

  return `
    <p style="margin:0 0 16px;color:rgba(232,236,241,0.85);">Hi ${escapeHtml(payload.fullName)},</p>
    <p style="margin:0 0 16px;color:rgba(232,236,241,0.85);">We received your <strong>right of withdrawal</strong> request.</p>
    <p style="margin:0 0 8px;color:rgba(232,236,241,0.85);"><strong>Case ID:</strong> ${escapeHtml(payload.caseCode)}</p>
    <p style="margin:0 0 8px;color:rgba(232,236,241,0.85);"><strong>Order:</strong> ${escapeHtml(payload.orderNumber)}</p>
    <p style="margin:0;color:rgba(232,236,241,0.85);"><strong>Product:</strong> ${escapeHtml(payload.productName)}</p>
    ${notesBlock}
    <p style="margin:20px 0 0;color:rgba(232,236,241,0.72);">We will reply within <strong>24 hours</strong> with next steps.</p>
  `.trim();
}

function withdrawalOperatorBody(payload: WithdrawalEmailPayload): string {
  const notesBlock = payload.notes
    ? `<p style="margin:12px 0 0;color:rgba(232,236,241,0.85);"><strong>Notas:</strong> ${escapeHtml(payload.notes)}</p>`
    : "";
  return `
    <p style="margin:0 0 16px;color:rgba(232,236,241,0.85);">Nueva solicitud de arrepentimiento en ${escapeHtml(SITE_OPERATOR.tradeName)}.</p>
    <p style="margin:0;color:rgba(232,236,241,0.85);">
      <strong>Código:</strong> ${escapeHtml(payload.caseCode)}<br>
      <strong>Nombre:</strong> ${escapeHtml(payload.fullName)}<br>
      <strong>Email:</strong> ${escapeHtml(payload.email)}<br>
      <strong>Pedido:</strong> ${escapeHtml(payload.orderNumber)}<br>
      <strong>Producto:</strong> ${escapeHtml(payload.productName)}<br>
      <strong>Idioma:</strong> ${escapeHtml(payload.locale)}
    </p>
    ${notesBlock}
  `.trim();
}

export async function sendWithdrawalEmails(
  payload: WithdrawalEmailPayload
): Promise<{ customer: boolean; operator: boolean }> {
  const locale: GiEmailLocale = payload.locale === "en" ? "en" : "es";
  const es = locale === "es";
  const customerSubject = es
    ? `Arrepentimiento recibido — ${payload.caseCode}`
    : `Withdrawal request received — ${payload.caseCode}`;
  const operatorSubject = `[Arrepentimiento] ${payload.caseCode} — pedido ${payload.orderNumber}`;
  const customerTitle = es ? "Solicitud recibida" : "Request received";
  const operatorTitle = "Arrepentimiento — operador";

  const [customer, operator] = await Promise.all([
    sendBrevoTransactionalEmail({
      to: [{ email: payload.email, name: payload.fullName }],
      subject: customerSubject,
      html: renderGiEmailLayout({
        title: customerTitle,
        preheader: customerSubject,
        locale,
        bodyHtml: withdrawalCustomerBody(payload, locale),
      }),
      replyTo: { email: SITE_OPERATOR.email, name: SITE_OPERATOR.operatorName },
    }),
    sendBrevoTransactionalEmail({
      to: [{ email: SITE_OPERATOR.email, name: SITE_OPERATOR.operatorName }],
      subject: operatorSubject,
      html: renderGiEmailLayout({
        title: operatorTitle,
        preheader: operatorSubject,
        locale: "es",
        bodyHtml: withdrawalOperatorBody(payload),
      }),
      replyTo: { email: payload.email, name: payload.fullName },
    }),
  ]);

  return { customer, operator };
}
