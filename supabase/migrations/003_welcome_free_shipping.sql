-- Envío gratis welcome: flags auditables en pedidos.
-- Ejecutar tras 002_newsletter_subscriptions.sql.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS shipping_waived boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS shipping_amount numeric NOT NULL DEFAULT 0;

COMMENT ON COLUMN public.orders.shipping_waived IS
  'true cuando se aplicó envío estándar gratis (welcome offer o promoción).';
COMMENT ON COLUMN public.orders.shipping_amount IS
  'Importe de envío cobrado en USD; 0 cuando shipping_waived es true.';
