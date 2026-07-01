-- Tracking de envío en pedidos (Buenos Productos)
-- status existente: 'paid' por defecto; ampliamos sin romper filas actuales.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS tracking_number TEXT,
  ADD COLUMN IF NOT EXISTS tracking_carrier TEXT,
  ADD COLUMN IF NOT EXISTS tracking_url TEXT,
  ADD COLUMN IF NOT EXISTS shipped_at TIMESTAMPTZ;

COMMENT ON COLUMN public.orders.tracking_number IS 'Número de seguimiento del transportista';
COMMENT ON COLUMN public.orders.tracking_carrier IS 'Nombre del transportista (ej. Andreani, Correo Argentino)';
COMMENT ON COLUMN public.orders.tracking_url IS 'URL pública de seguimiento';
COMMENT ON COLUMN public.orders.shipped_at IS 'Fecha/hora de despacho';

-- Valores de status sugeridos: paid | shipped | delivered | pending
-- No se fuerza CHECK para no invalidar datos legacy; documentar en app.
