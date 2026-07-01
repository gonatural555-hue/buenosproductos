# Plantillas de email — Buenos Productos

Referencias HTML para copiar en **Supabase Auth** (confirmación / reset) o revisar diseño GI.

## Tokens de marca

| Token | Valor |
|-------|--------|
| Fondo | `#0B0F14` |
| Card | `#151B24` |
| Texto | `#E8ECF1` |
| Acento | `#3B82F6` |

Layout en código: `lib/email/layout.ts` → `renderGiEmailLayout()`.

## Envío transaccional (app)

| Plantilla | Módulo |
|-----------|--------|
| Confirmación de compra | `lib/email/order-confirmation.ts` |
| Bienvenida newsletter | `lib/email/transactional-templates.ts` |
| Contraseña actualizada | `lib/email/transactional-templates.ts` |
| Arrepentimiento | `lib/email/withdrawal-emails.ts` |
| Tracking de envío | `lib/email/shipping-tracking.ts` |
| Notificación admin (webhook) | `lib/email/admin-notify.ts` |

Cliente único: `lib/email/brevo-client.ts` → `sendBrevoTransactionalEmail()`.

## Supabase Auth (manual en Dashboard)

Pegar HTML con el mismo estilo en **Authentication → Email templates**:

- `confirm-signup.html` — confirmación de registro
- `reset-password.html` — enlace de recuperación

## Redirect URLs (obligatorio)

- `https://shopbuenosproductos.com/auth/callback`
- `http://localhost:3000/auth/callback`

## Webhook admin

`POST /api/internal/db-notify` con header `x-webhook-secret`.

Verificar deploy en navegador: `GET /api/internal/db-notify` → JSON `{ ok: true, service: "supabase-db-notify" }`.
