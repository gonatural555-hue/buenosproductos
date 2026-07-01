import { SITE_OPERATOR } from "@/lib/legal/operator";

export type BrevoEmailRecipient = {
  email: string;
  name?: string;
};

/**
 * Envío transaccional único vía Brevo REST API.
 * Si falta BREVO_API_KEY: warn + return false (no throw).
 */
export async function sendBrevoTransactionalEmail(params: {
  to: BrevoEmailRecipient | BrevoEmailRecipient[];
  subject: string;
  html: string;
  replyTo?: BrevoEmailRecipient;
}): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY?.trim();
  if (!apiKey) {
    console.warn(
      "[Brevo] BREVO_API_KEY missing — skipping send:",
      params.subject
    );
    return false;
  }

  const senderEmail =
    process.env.BREVO_SENDER_EMAIL?.trim() || SITE_OPERATOR.email;
  const senderName =
    process.env.BREVO_SENDER_NAME?.trim() || SITE_OPERATOR.tradeName;

  const toList = Array.isArray(params.to) ? params.to : [params.to];

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: { email: senderEmail, name: senderName },
        to: toList.map((r) => ({
          email: r.email,
          ...(r.name ? { name: r.name } : {}),
        })),
        subject: params.subject,
        htmlContent: params.html,
        ...(params.replyTo ? { replyTo: params.replyTo } : {}),
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[Brevo] Send failed:", {
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
    console.error("[Brevo] Exception sending email:", {
      subject: params.subject,
      error: error instanceof Error ? error.message : "Unknown",
    });
    return false;
  }
}
