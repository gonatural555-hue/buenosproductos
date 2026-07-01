import { SITE_OPERATOR } from "@/lib/legal/operator";
import { getSiteUrl } from "@/lib/seo";

export type GiEmailLocale = "es" | "en";

const LAYOUT_COPY: Record<
  GiEmailLocale,
  { help: string; visitStore: string; rights: string }
> = {
  es: {
    help: "¿Necesitás ayuda?",
    visitStore: "Visitar tienda",
    rights: "Todos los derechos reservados.",
  },
  en: {
    help: "Need help?",
    visitStore: "Visit store",
    rights: "All rights reserved.",
  },
};

export type RenderGiEmailLayoutParams = {
  title: string;
  preheader?: string;
  bodyHtml: string;
  locale?: GiEmailLocale;
};

/**
 * Layout transaccional GI — solo CSS inline, tablas, max-width 600px.
 */
export function renderGiEmailLayout({
  title,
  preheader,
  bodyHtml,
  locale = "es",
}: RenderGiEmailLayoutParams): string {
  const loc = locale === "en" ? "en" : "es";
  const copy = LAYOUT_COPY[loc];
  const siteUrl = getSiteUrl();
  const preheaderText = preheader ?? title;

  return `<!DOCTYPE html>
<html lang="${loc}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
</head>
<body style="margin:0;padding:0;background-color:#0B0F14;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheaderText)}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0B0F14;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#151B24;border-radius:16px;overflow:hidden;border:1px solid rgba(232,236,241,0.08);">
          <tr>
            <td style="padding:28px 32px 20px;border-bottom:1px solid rgba(232,236,241,0.08);">
              <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.14em;text-transform:uppercase;color:#3B82F6;">${escapeHtml(SITE_OPERATOR.tradeName)}</p>
              <h1 style="margin:0;font-size:22px;font-weight:600;line-height:1.3;color:#E8ECF1;">${escapeHtml(title)}</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px;font-size:15px;line-height:1.6;color:#E8ECF1;">
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 28px;border-top:1px solid rgba(232,236,241,0.08);background-color:#0B0F14;">
              <p style="margin:0 0 12px;font-size:13px;color:rgba(232,236,241,0.72);">${copy.help}
                <a href="mailto:${escapeHtml(SITE_OPERATOR.email)}" style="color:#3B82F6;text-decoration:none;">${escapeHtml(SITE_OPERATOR.email)}</a>
              </p>
              <p style="margin:0 0 16px;">
                <a href="${escapeHtml(siteUrl)}" style="display:inline-block;font-size:13px;font-weight:600;color:#3B82F6;text-decoration:none;">${copy.visitStore} →</a>
              </p>
              <p style="margin:0;font-size:11px;line-height:1.5;color:rgba(232,236,241,0.45);">
                ${escapeHtml(SITE_OPERATOR.tradeName)} · ${escapeHtml(SITE_OPERATOR.operatorName)}<br>
                © ${new Date().getFullYear()} ${copy.rights}
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`.trim();
}

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function giEmailButton(href: string, label: string): string {
  return `<p style="margin:24px 0 0;text-align:center;">
    <a href="${escapeHtml(href)}" style="display:inline-block;padding:12px 28px;background-color:#3B82F6;color:#ffffff;font-size:14px;font-weight:600;text-decoration:none;border-radius:999px;">${escapeHtml(label)}</a>
  </p>`;
}

export function giEmailInfoBox(html: string): string {
  return `<div style="margin:20px 0;padding:16px 18px;background-color:rgba(59,130,246,0.1);border-left:3px solid #3B82F6;border-radius:8px;">${html}</div>`;
}
