-- Guest checkout + provincia en direcciones

ALTER TABLE public.addresses
  ADD COLUMN IF NOT EXISTS state TEXT;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS guest_email TEXT;

ALTER TABLE public.orders
  ALTER COLUMN user_id DROP NOT NULL;

COMMENT ON COLUMN public.orders.guest_email IS
  'Email del comprador cuando user_id es NULL (checkout guest).';
