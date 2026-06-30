# Checkout PayPal — configuración producción

Guía para que el checkout cobre con PayPal y guarde pedidos en Supabase.

**En el repo ya está listo:** API `/api/orders/paypal`, UI checkout, migraciones SQL, parche idempotente.

---

## Resumen rápido

| Dónde | Qué hacés vos |
|-------|----------------|
| **Supabase** | Parche SQL si faltan columnas + Auth URLs |
| **Vercel** | Variables de entorno + redeploy |
| **PayPal** | App Live + dominio |
| **Brevo** | Sender verificado (emails; no bloquea cobros) |

Verificación local: `npm run verify-checkout-env`

**WhatsApp local:** `NEXT_PUBLIC_WHATSAPP_NUMBER` en `.env.local` — reiniciá `npm run dev` después de cambiarla (Next embebe variables `NEXT_PUBLIC_*` al arrancar).

---

## Paso 1 — Supabase (base de datos)

### 1.1 Verificar esquema

1. [Supabase Dashboard](https://supabase.com/dashboard) → tu proyecto  
2. **SQL Editor** → **New query**  
3. Pegá el contenido de `supabase/verify-checkout-schema.sql` → **Run**  
4. Todas las filas deben decir **OK**

### 1.2 Parche si algo falta

Si `guest_email`, `shipping_waived` o `user_id nullable` fallan:

1. SQL Editor → pegá `supabase/apply-checkout-patch.sql` → **Run**  
2. Volvé a ejecutar `verify-checkout-schema.sql`

### 1.3 Tablas que deberías tener

| Tabla | Checkout |
|-------|----------|
| `orders` | **Sí** — guarda cada pedido pagado |
| `order_items` | **Sí** — líneas del carrito |
| `profiles` | **Sí** — usuarios registrados |
| `addresses` | Opcional en checkout (dirección va en `shipping_json`) |
| `withdrawal_requests` | No bloquea checkout (arrepentimiento) |
| `newsletter_subscriptions` | No bloquea checkout |

### 1.4 Credenciales para Vercel

**Settings → API:**

| Variable Vercel | Campo Supabase |
|-----------------|----------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `anon` `public` |
| `SUPABASE_SERVICE_ROLE_KEY` | `service_role` **secreta** |

Sin `SUPABASE_SERVICE_ROLE_KEY`, las compras **sin cuenta** fallan con error 503.

### 1.5 Auth URLs (login / registro)

**Authentication → URL Configuration:**

| Campo | Valor |
|-------|--------|
| **Site URL** | `https://TU-URL.vercel.app` (o dominio propio) |
| **Redirect URLs** | `https://TU-URL.vercel.app/auth/callback` |
| | `http://localhost:3000/auth/callback` |

El checkout **guest** funciona sin esto; login/registro no.

---

## Paso 2 — Vercel (variables + deploy)

### 2.1 Variables obligatorias

**Project → Settings → Environment Variables → Production** (marcá Preview si querés):

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

NEXT_PUBLIC_PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_ENV=live

NEXT_PUBLIC_BASE_URL=https://TU-URL.vercel.app
```

Lista completa: `.env.example`

### 2.2 Emails (recomendado)

```
BREVO_API_KEY=
BREVO_SENDER_EMAIL=
BREVO_SENDER_NAME=Buenos Productos
ADMIN_NOTIFY_EMAIL=tu@email.com
```

Sin Brevo el pago se procesa igual; pueden no enviarse confirmaciones.

### 2.3 Redeploy

**Deployments → … → Redeploy** después de guardar variables.

---

## Paso 3 — PayPal (cobros)

1. [developer.paypal.com](https://developer.paypal.com) → **Apps & Credentials** → **Live**  
2. Copiá **Client ID** → `NEXT_PUBLIC_PAYPAL_CLIENT_ID`  
3. Copiá **Secret** → `PAYPAL_CLIENT_SECRET`  
4. `PAYPAL_ENV=live` en Vercel (solo con credenciales Live)  
5. Si la app pide dominios permitidos, agregá tu URL de Vercel/dominio  

El servidor verifica cada pago en `lib/paypal/verify-capture.ts` antes de insertar en Supabase.

---

## Paso 4 — Probar en producción

1. `/es/products` → agregar al carrito → checkout  
2. No debe aparecer *“Supabase no configurado”*  
3. Debe verse el botón **PayPal**  
4. Completá una compra (monto bajo si es Live)  
5. **Supabase → Table Editor → `orders`** → fila nueva, `status: paid`  
6. **`order_items`** → líneas del pedido  

Logs si falla: Vercel → **Functions** → `/api/orders/paypal`

---

## Errores frecuentes

| Síntoma | Solución |
|---------|----------|
| “Supabase no configurado” en checkout | `NEXT_PUBLIC_SUPABASE_URL` + `ANON_KEY` en Vercel + redeploy |
| Botón PayPal no aparece | `NEXT_PUBLIC_PAYPAL_CLIENT_ID` |
| Pago OK, error al finalizar | `SUPABASE_SERVICE_ROLE_KEY` + `apply-checkout-patch.sql` |
| Error 402 / verificación PayPal | `PAYPAL_CLIENT_SECRET` correcto; `PAYPAL_ENV` coincide con credenciales |
| Insert orders falla | Columnas `guest_email`, `shipping_waived`; `user_id` nullable |
| Login no redirige | Auth URLs en Supabase con `/auth/callback` |

---

## Dominio propio (después)

1. Vercel → **Domains** → agregar dominio → DNS  
2. Actualizar en los tres lados:  
   - Vercel: `NEXT_PUBLIC_BASE_URL`  
   - Supabase: Site URL + redirect  
   - PayPal: dominio permitido  

---

## Archivos de referencia en el repo

| Archivo | Uso |
|---------|-----|
| `supabase/verify-checkout-schema.sql` | Diagnóstico en Supabase |
| `supabase/apply-checkout-patch.sql` | Parche columnas guest/envío |
| `supabase/migrations/*.sql` | Instalación completa desde cero |
| `scripts/verify-checkout-env.mjs` | Chequeo de `.env.local` / Vercel |
| `app/api/orders/paypal/route.ts` | API que guarda el pedido |
