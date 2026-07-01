import { sendBrevoTransactionalEmail } from "@/lib/email/brevo-client";
import {
  escapeHtml,
  renderGiEmailLayout,
  type GiEmailLocale,
} from "@/lib/email/layout";

export async function sendNewsletterWelcomeEmail(
  email: string,
  locale: GiEmailLocale = "es"
): Promise<boolean> {
  const es = locale === "es";
  const subject = es
    ? "¡Bienvenido a Buenos Productos!"
    : "Welcome to Buenos Productos!";
  const title = es ? "¡Gracias por suscribirte!" : "Thanks for subscribing!";

  const bodyHtml = es
    ? `<p style="margin:0 0 16px;color:rgba(232,236,241,0.85);">Recibimos tu suscripción al newsletter de <strong>Buenos Productos</strong>.</p>
       <p style="margin:0;color:rgba(232,236,241,0.72);">Pronto vas a recibir novedades sobre hogar, tecnología y productos útiles para el día a día.</p>`
    : `<p style="margin:0 0 16px;color:rgba(232,236,241,0.85);">You're subscribed to the <strong>Buenos Productos</strong> newsletter.</p>
       <p style="margin:0;color:rgba(232,236,241,0.72);">You'll hear from us with home, tech and everyday essentials updates.</p>`;

  const html = renderGiEmailLayout({
    title,
    preheader: subject,
    locale,
    bodyHtml,
  });

  return sendBrevoTransactionalEmail({
    to: { email },
    subject,
    html,
  });
}

export async function sendPasswordUpdatedEmail(
  email: string,
  locale: GiEmailLocale = "es"
): Promise<boolean> {
  const es = locale === "es";
  const subject = es
    ? "Tu contraseña fue actualizada"
    : "Your password was updated";
  const title = es ? "Contraseña actualizada" : "Password updated";

  const bodyHtml = es
    ? `<p style="margin:0 0 16px;color:rgba(232,236,241,0.85);">Confirmamos que la contraseña de tu cuenta <strong>${escapeHtml(email)}</strong> se actualizó correctamente.</p>
       <p style="margin:0;color:rgba(232,236,241,0.72);">Si no fuiste vos, contactanos de inmediato.</p>`
    : `<p style="margin:0 0 16px;color:rgba(232,236,241,0.85);">Your account password for <strong>${escapeHtml(email)}</strong> was updated successfully.</p>
       <p style="margin:0;color:rgba(232,236,241,0.72);">If this wasn't you, contact us immediately.</p>`;

  const html = renderGiEmailLayout({
    title,
    preheader: subject,
    locale,
    bodyHtml,
  });

  return sendBrevoTransactionalEmail({
    to: { email },
    subject,
    html,
  });
}
