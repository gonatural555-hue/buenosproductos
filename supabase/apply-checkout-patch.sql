-- Buenos Productos — parche idempotente para checkout PayPal
-- Usá esto si YA tenés las tablas base (001) y solo faltan columnas de guest/envío.
-- Supabase Dashboard → SQL Editor → pegar → Run.
-- Seguro ejecutar varias veces (IF NOT EXISTS / ADD COLUMN IF NOT EXISTS).

-- ── Envío en pedidos (003) ──
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS shipping_waived boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS shipping_amount numeric NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.orders.shipping_waived IS
  'true cuando se aplicó envío estándar gratis (welcome offer o promoción).';
COMMENT ON COLUMN public.orders.shipping_amount IS
  'Importe de envío cobrado en USD; 0 cuando shipping_waived es true.';

-- ── Guest checkout + provincia (004) ──
ALTER TABLE public.addresses
  ADD COLUMN IF NOT EXISTS state TEXT;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS guest_email TEXT;

-- user_id nullable para compras sin cuenta
DO $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'orders'
      AND column_name = 'user_id'
      AND is_nullable = 'NO'
  ) THEN
    ALTER TABLE public.orders ALTER COLUMN user_id DROP NOT NULL;
  END IF;
END $$;

COMMENT ON COLUMN public.orders.guest_email IS
  'Email del comprador cuando user_id es NULL (checkout guest).';

-- ── Evitar reutilizar el mismo pago PayPal en dos pedidos ──
CREATE UNIQUE INDEX IF NOT EXISTS orders_paypal_order_id_unique_idx
  ON public.orders (paypal_order_id)
  WHERE paypal_order_id IS NOT NULL;
