import type { OrderItem } from "@/lib/orders";
import { sendBrevoTransactionalEmail } from "@/lib/email/brevo-client";
import {
  escapeHtml,
  giEmailInfoBox,
  renderGiEmailLayout,
  type GiEmailLocale,
} from "@/lib/email/layout";

export type SendOrderConfirmationEmailParams = {
  email: string;
  orderId: string;
  total: number;
  currency: string;
  items: OrderItem[];
  locale?: GiEmailLocale;
};

function formatAmount(amount: number, currency: string, locale: GiEmailLocale): string {
  const intlLocale = locale === "en" ? "en-US" : "es-AR";
  return new Intl.NumberFormat(intlLocale, {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount);
}

function buildOrderConfirmationBody(
  params: SendOrderConfirmationEmailParams,
  locale: GiEmailLocale
): string {
  const { orderId, total, currency, items } = params;
  const es = locale === "es";

  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid rgba(232,236,241,0.1);color:#E8ECF1;">${escapeHtml(item.title)}</td>
        <td style="padding:10px 12px;border-bottom:1px solid rgba(232,236,241,0.1);text-align:center;color:rgba(232,236,241,0.85);">${item.quantity}</td>
        <td style="padding:10px 12px;border-bottom:1px solid rgba(232,236,241,0.1);text-align:right;color:#E8ECF1;">${formatAmount(item.price * item.quantity, currency, locale)}</td>
      </tr>`
    )
    .join("");

  const productCol = es ? "Producto" : "Product";
  const qtyCol = es ? "Cant." : "Qty";
  const subtotalCol = es ? "Subtotal" : "Subtotal";

  return `
    <p style="margin:0 0 16px;color:rgba(232,236,241,0.85);">
      ${es ? "Gracias por tu compra. Tu pago fue confirmado y estamos preparando tu pedido." : "Thank you for your purchase. Your payment is confirmed and we're preparing your order."}
    </p>
    ${giEmailInfoBox(`<p style="margin:0;font-size:14px;color:rgba(232,236,241,0.72);">${es ? "Número de pedido" : "Order number"}</p><p style="margin:6px 0 0;font-size:18px;font-weight:600;color:#E8ECF1;">${escapeHtml(orderId)}</p>`)}
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;border-collapse:collapse;">
      <thead>
        <tr style="background-color:rgba(232,236,241,0.06);">
          <th style="padding:10px 12px;text-align:left;font-size:12px;font-weight:600;color:rgba(232,236,241,0.65);">${productCol}</th>
          <th style="padding:10px 12px;text-align:center;font-size:12px;font-weight:600;color:rgba(232,236,241,0.65);">${qtyCol}</th>
          <th style="padding:10px 12px;text-align:right;font-size:12px;font-weight:600;color:rgba(232,236,241,0.65);">${subtotalCol}</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <p style="margin:16px 0 0;text-align:right;font-size:18px;font-weight:600;color:#E8ECF1;">
      ${es ? "Total" : "Total"}: ${formatAmount(total, currency, locale)}
    </p>
    <p style="margin:20px 0 0;font-size:14px;color:rgba(232,236,241,0.65);">
      ${es ? "Te avisaremos cuando tu pedido sea despachado." : "We'll notify you when your order ships."}
    </p>
  `.trim();
}

/** @deprecated Usar sendOrderConfirmationEmail */
export async function sendOrderCreatedEmail(
  params: SendOrderConfirmationEmailParams
): Promise<boolean> {
  return sendOrderConfirmationEmail(params);
}

export async function sendOrderConfirmationEmail(
  params: SendOrderConfirmationEmailParams
): Promise<boolean> {
  const locale: GiEmailLocale = params.locale === "en" ? "en" : "es";
  const es = locale === "es";
  const subject = es
    ? `Pedido confirmado — ${params.orderId}`
    : `Order confirmed — ${params.orderId}`;
  const title = es ? "Pedido confirmado" : "Order confirmed";

  const html = renderGiEmailLayout({
    title,
    preheader: subject,
    locale,
    bodyHtml: buildOrderConfirmationBody(params, locale),
  });

  return sendBrevoTransactionalEmail({
    to: { email: params.email },
    subject,
    html,
  });
}
