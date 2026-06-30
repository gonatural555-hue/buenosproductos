import { SITE_OPERATOR } from "@/lib/legal/operator";

type EmailRecipient = {
  email: string;
  name?: string;
};

function brevoSender() {
  return {
    email:
      process.env.BREVO_SENDER_EMAIL?.trim() || SITE_OPERATOR.email,
    name: process.env.BREVO_SENDER_NAME?.trim() || SITE_OPERATOR.tradeName,
  };
}

async function sendTransactionalEmail(params: {
  to: EmailRecipient[];
  subject: string;
  htmlContent: string;
  replyTo?: EmailRecipient;
}): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    console.warn("[Brevo Email] BREVO_API_KEY missing — skipping send:", params.subject);
    return false;
  }

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: brevoSender(),
        to: params.to,
        subject: params.subject,
        htmlContent: params.htmlContent,
        replyTo: params.replyTo,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[Brevo Email] Send failed:", {
        status: response.status,
        error: errorData,
        subject: params.subject,
      });
      return false;
    }

    const result = (await response.json().catch(() => ({}))) as {
      messageId?: string;
    };
    return Boolean(result.messageId);
  } catch (error) {
    console.error("[Brevo Email] Exception:", error);
    return false;
  }
}

export type WithdrawalEmailPayload = {
  caseCode: string;
  fullName: string;
  email: string;
  orderNumber: string;
  productName: string;
  notes?: string | null;
  locale: string;
};

function withdrawalCustomerHtml(payload: WithdrawalEmailPayload, es: boolean): string {
  const { caseCode, fullName, orderNumber, productName } = payload;
  if (es) {
    return `
      <p>Hola ${fullName},</p>
      <p>Recibimos tu solicitud de <strong>arrepentimiento</strong> conforme la Ley 24.240.</p>
      <p><strong>Código de trámite:</strong> ${caseCode}</p>
      <p><strong>Pedido:</strong> ${orderNumber}<br><strong>Producto:</strong> ${productName}</p>
      <p>Te responderemos dentro de las <strong>24 horas</strong> con los pasos para completar la revocación.</p>
      <p>— ${SITE_OPERATOR.tradeName}</p>
    `.trim();
  }
  return `
    <p>Hi ${fullName},</p>
    <p>We received your <strong>right of withdrawal</strong> request.</p>
    <p><strong>Case ID:</strong> ${caseCode}</p>
    <p><strong>Order:</strong> ${orderNumber}<br><strong>Product:</strong> ${productName}</p>
    <p>We will reply within <strong>24 hours</strong> with next steps.</p>
    <p>— ${SITE_OPERATOR.tradeName}</p>
  `.trim();
}

function withdrawalOperatorHtml(payload: WithdrawalEmailPayload): string {
  const notesBlock = payload.notes
    ? `<p><strong>Notas:</strong> ${payload.notes}</p>`
    : "";
  return `
    <p>Nueva solicitud de arrepentimiento en ${SITE_OPERATOR.tradeName}.</p>
    <p><strong>Código:</strong> ${payload.caseCode}</p>
    <p><strong>Nombre:</strong> ${payload.fullName}<br>
    <strong>Email:</strong> ${payload.email}<br>
    <strong>Pedido:</strong> ${payload.orderNumber}<br>
    <strong>Producto:</strong> ${payload.productName}<br>
    <strong>Idioma:</strong> ${payload.locale}</p>
    ${notesBlock}
  `.trim();
}

export async function sendWithdrawalEmails(
  payload: WithdrawalEmailPayload
): Promise<{ customer: boolean; operator: boolean }> {
  const es = payload.locale === "es";
  const customerSubject = es
    ? `Arrepentimiento recibido — ${payload.caseCode}`
    : `Withdrawal request received — ${payload.caseCode}`;
  const operatorSubject = `[Arrepentimiento] ${payload.caseCode} — pedido ${payload.orderNumber}`;

  const [customer, operator] = await Promise.all([
    sendTransactionalEmail({
      to: [{ email: payload.email, name: payload.fullName }],
      subject: customerSubject,
      htmlContent: withdrawalCustomerHtml(payload, es),
      replyTo: { email: SITE_OPERATOR.email, name: SITE_OPERATOR.operatorName },
    }),
    sendTransactionalEmail({
      to: [{ email: SITE_OPERATOR.email, name: SITE_OPERATOR.operatorName }],
      subject: operatorSubject,
      htmlContent: withdrawalOperatorHtml(payload),
      replyTo: { email: payload.email, name: payload.fullName },
    }),
  ]);

  return { customer, operator };
}
