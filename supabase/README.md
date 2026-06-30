# Supabase — Buenos Productos

## Si ya tenés tablas (`profiles`, `orders`, `order_items`, …)

1. **SQL Editor** → ejecutá `verify-checkout-schema.sql`  
2. Si alguna fila dice **FALTA** → ejecutá `apply-checkout-patch.sql`  
3. Si falta `withdrawal_requests` → ejecutá `migrations/005_withdrawal_requests.sql`  
4. Si falta newsletter → ejecutá `migrations/002_newsletter_subscriptions.sql`

## Proyecto nuevo (sin tablas)

Ejecutá en orden en **SQL Editor**:

| Orden | Archivo |
|-------|---------|
| 1 | `migrations/001_init_schema.sql` |
| 2 | `migrations/002_newsletter_subscriptions.sql` |
| 3 | `migrations/003_welcome_free_shipping.sql` |
| 4 | `migrations/004_checkout_guest_and_state.sql` |
| 5 | `migrations/005_withdrawal_requests.sql` |

O, si ya corriste `001` pero no `003`/`004`, alcanza con `apply-checkout-patch.sql`.

## Checkout PayPal — columnas críticas en `orders`

| Columna | Uso |
|---------|-----|
| `guest_email` | Compra sin cuenta |
| `user_id` (nullable) | `NULL` en guest |
| `shipping_waived`, `shipping_amount` | Envío gratis welcome |
| `paypal_order_id` | Anti-duplicado de pagos |
| `shipping_json` | Dirección de envío |

## Auth URLs (manual en Dashboard)

- Site URL: `https://TU-DOMINIO`
- Redirect: `https://TU-DOMINIO/auth/callback`

Guía completa: `docs/CHECKOUT-SETUP.md`
