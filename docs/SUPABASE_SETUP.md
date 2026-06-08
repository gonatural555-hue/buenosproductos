# Configuración Supabase (Go Natural)

## 1. Crear proyecto

1. [supabase.com](https://supabase.com) → New project.
2. **Settings → API**: copiar `Project URL` y `anon` `public` key a `.env.local` como `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.

## 2. Esquema y RLS

1. **SQL Editor** → nueva query.
2. Pegar el contenido de `supabase/migrations/001_init_schema.sql` y ejecutar (**Run**).
3. Ejecutar también `supabase/migrations/002_newsletter_subscriptions.sql` para crear la tabla `newsletter_subscriptions` (altas del CTA flotante de newsletter) y su política RLS de **solo inserción** para `anon`/`authenticated` cuando `marketing_accepted = true`.
4. Ejecutar `supabase/migrations/003_welcome_free_shipping.sql` para añadir `shipping_waived` y `shipping_amount` en `orders` (envío gratis welcome en los 3 primeros pedidos pagados).
5. Comprueba en **Table Editor** que existan `profiles`, `addresses`, `orders`, `order_items` y `newsletter_subscriptions`.

Las políticas **RLS** permiten a cada usuario leer/escribir solo sus filas. Los pedidos PayPal se insertan con el JWT del usuario en la ruta `/api/orders/paypal`.

### Newsletter (CTA flotante)

- **Variables de entorno** (mismas que el resto del cliente Supabase): `NEXT_PUBLIC_SUPABASE_URL` y `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- **Inserción:** `POST /api/newsletter` usa el cliente con la **anon key** en el servidor; no hace falta `SUPABASE_SERVICE_ROLE_KEY` si la migración `002` está aplicada (RLS permite insert con consentimiento explícito).
- **Sin tabla o sin migración:** la ruta responde 500/503; revisa logs del servidor y el SQL Editor.

## 3. Autenticación

1. **Authentication → URL configuration**:
   - **Site URL**: `http://localhost:3000` (producción: tu dominio).
   - **Redirect URLs**: incluye `http://localhost:3000/auth/callback` y el equivalente en producción.
2. Email: en desarrollo puedes desactivar “Confirm email” en **Authentication → Providers → Email** para probar sin bandeja.

## 4. Trigger `profiles`

El trigger `on_auth_user_created` crea una fila en `profiles` al registrarse un usuario. Si el SQL falla por sintaxis del trigger, revisa la versión de Postgres (Supabase suele usar PG 15): alterna `EXECUTE PROCEDURE` / `EXECUTE FUNCTION` según el mensaje de error.

## 5. Orden de operaciones en pagos

1. Cliente autenticado completa PayPal.
2. `POST /api/orders/paypal` valida sesión, inserta en `orders` + `order_items`, luego ejecuta `lib/orders` (p. ej. Google Sheets).

La base Supabase es la **fuente de verdad** del pedido; Sheets es secundario.

## 6. Envío gratis welcome (3 primeros pedidos)

- Elegibilidad: usuario autenticado con menos de **3** pedidos `status = 'paid'` en `orders`.
- Se calcula en servidor en `POST /api/orders/paypal` y se persiste `shipping_waived = true` cuando aplica.
- Requiere migración `003_welcome_free_shipping.sql`.
