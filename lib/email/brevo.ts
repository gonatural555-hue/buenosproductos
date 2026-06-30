/**
 * Brevo Email Service - Transactional Emails
 * 
 * Servicio para envío de emails transaccionales usando Brevo API REST.
 * NO rompe el flujo de compra si el email falla.
 */

import { SITE_OPERATOR } from "@/lib/legal/operator";

type OrderItem = {
  id: string;
  title: string;
  price: number;
  quantity: number;
};

type SendOrderCreatedEmailParams = {
  email: string;
  orderId: string;
  total: number;
  currency: string;
  items: OrderItem[];
};

function brevoSender() {
  return {
    email:
      process.env.BREVO_SENDER_EMAIL?.trim() || SITE_OPERATOR.email,
    name: process.env.BREVO_SENDER_NAME?.trim() || SITE_OPERATOR.tradeName,
  };
}

/**
 * Formatea el monto con la moneda
 */
function formatAmount(amount: number, currency: string): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: currency.toUpperCase(),
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Genera el HTML del email de confirmación de pedido
 */
function generateOrderCreatedEmailHTML(params: SendOrderCreatedEmailParams): string {
  const { orderId, total, currency, items } = params;

  const itemsList = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb;">
          ${item.title}
        </td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; text-align: center;">
          ${item.quantity}
        </td>
        <td style="padding: 8px 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          ${formatAmount(item.price * item.quantity, currency)}
        </td>
      </tr>
    `
    )
    .join("");

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="background-color: #122220; padding: 32px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 24px; font-weight: 600;">
                Pedido recibido
              </h1>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 32px;">
              <p style="margin: 0 0 16px 0; color: #374151; font-size: 16px; line-height: 1.5;">
                Hola,
              </p>
              <p style="margin: 0 0 24px 0; color: #374151; font-size: 16px; line-height: 1.5;">
                Gracias por tu pedido. Hemos recibido tu solicitud y la estamos procesando.
              </p>
              
              <!-- Order Info -->
              <div style="background-color: #f9fafb; border-radius: 6px; padding: 20px; margin-bottom: 24px;">
                <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px; font-weight: 500;">
                  Número de pedido
                </p>
                <p style="margin: 0; color: #111827; font-size: 18px; font-weight: 600;">
                  ${orderId}
                </p>
              </div>
              
              <!-- Items Table -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f9fafb;">
                    <th style="padding: 12px; text-align: left; font-size: 14px; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">
                      Producto
                    </th>
                    <th style="padding: 12px; text-align: center; font-size: 14px; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">
                      Cantidad
                    </th>
                    <th style="padding: 12px; text-align: right; font-size: 14px; font-weight: 600; color: #374151; border-bottom: 2px solid #e5e7eb;">
                      Subtotal
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                </tbody>
              </table>
              
              <!-- Total -->
              <div style="text-align: right; margin-bottom: 24px; padding-top: 16px; border-top: 2px solid #e5e7eb;">
                <p style="margin: 0; color: #111827; font-size: 20px; font-weight: 600;">
                  Total: ${formatAmount(total, currency)}
                </p>
              </div>
              
              <!-- Message -->
              <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 16px; margin-bottom: 24px; border-radius: 4px;">
                <p style="margin: 0; color: #92400e; font-size: 14px; line-height: 1.5;">
                  Te avisaremos cuando el pago esté confirmado.
                </p>
              </div>
              
              <!-- Footer -->
              <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.5;">
                Si tenés alguna pregunta, podés escribirnos a 
                <a href="mailto:${SITE_OPERATOR.email}" style="color: #3B82F6; text-decoration: none;">
                  ${SITE_OPERATOR.email}
                </a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

/**
 * Envía email de confirmación de pedido usando Brevo API REST
 * 
 * @param params - Parámetros del email
 * @returns true si se envió correctamente, false si falló
 */
export async function sendOrderCreatedEmail(
  params: SendOrderCreatedEmailParams
): Promise<boolean> {
  const apiKey = process.env.BREVO_API_KEY;

  if (!apiKey) {
    console.warn(
      "[Brevo Email] BREVO_API_KEY not configured. Email would be sent to:",
      params.email,
      "Order:",
      params.orderId
    );
    return false;
  }

  try {
    const htmlContent = generateOrderCreatedEmailHTML(params);

    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "api-key": apiKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: brevoSender(),
        to: [
          {
            email: params.email,
          },
        ],
        subject: `Pedido recibido – ${SITE_OPERATOR.tradeName}`,
        htmlContent: htmlContent,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[Brevo Email] Error sending email:", {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        orderId: params.orderId,
      });
      return false;
    }

    const result = await response.json().catch(() => ({}));
    
    // Brevo retorna messageId si fue exitoso
    if (result.messageId) {
      return true;
    }

    return false;
  } catch (error) {
    // Log seguro sin exponer información sensible
    console.error("[Brevo Email] Failed to send order confirmation email:", {
      email: params.email.substring(0, 3) + "***",
      orderId: params.orderId,
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return false;
  }
}

