import { sendBrevoTransactionalEmail } from "@/lib/email/brevo-client";
import {
  escapeHtml,
  giEmailButton,
  giEmailInfoBox,
  renderGiEmailLayout,
  type GiEmailLocale,
} from "@/lib/email/layout";
import { getSiteUrl } from "@/lib/seo";

export type ShippingTrackingEmailParams = {
  email: string;
  orderId: string;
  trackingNumber: string;
  trackingCarrier?: string | null;
  trackingUrl?: string | null;
  locale?: GiEmailLocale;
};

export async function sendShippingTrackingEmail(
  params: ShippingTrackingEmailParams
): Promise<boolean> {
  const locale: GiEmailLocale = params.locale === "en" ? "en" : "es";
  const es = locale === "es";
  const subject = es
    ? `Tu pedido ${params.orderId} fue despachado`
    : `Your order ${params.orderId} has shipped`;
  const title = es ? "Pedido en camino" : "Order shipped";

  const carrierLine = params.trackingCarrier
    ? `<p style="margin:0 0 8px;color:rgba(232,236,241,0.85);"><strong>${es ? "Transportista" : "Carrier"}:</strong> ${escapeHtml(params.trackingCarrier)}</p>`
    : "";

  const trackingBox = giEmailInfoBox(
    `${carrierLine}<p style="margin:0;font-size:14px;color:rgba(232,236,241,0.72);">${es ? "Número de seguimiento" : "Tracking number"}</p><p style="margin:6px 0 0;font-size:18px;font-weight:600;color:#E8ECF1;">${escapeHtml(params.trackingNumber)}</p>`
  );

  const trackButton =
    params.trackingUrl && params.trackingUrl.startsWith("http")
      ? giEmailButton(
          params.trackingUrl,
          es ? "Seguir envío" : "Track shipment"
        )
      : "";

  const bodyHtml = `
    <p style="margin:0 0 16px;color:rgba(232,236,241,0.85);">
      ${es ? `Tu pedido <strong>${escapeHtml(params.orderId)}</strong> ya fue despachado.` : `Your order <strong>${escapeHtml(params.orderId)}</strong> is on its way.`}
    </p>
    ${trackingBox}
    ${trackButton}
  `.trim();

  const html = renderGiEmailLayout({
    title,
    preheader: subject,
    locale,
    bodyHtml,
  });

  return sendBrevoTransactionalEmail({
    to: { email: params.email },
    subject,
    html,
  });
}

export function buildShippingTrackingPreviewUrl(orderId: string): string {
  return `${getSiteUrl()}/es/account?section=orders`;
}
