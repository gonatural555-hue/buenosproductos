-- Solicitudes de arrepentimiento (Ley 24.240 / Res. SC 424/2020)
-- Insert solo vía API con service role.

CREATE TABLE IF NOT EXISTS public.withdrawal_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  case_code TEXT NOT NULL UNIQUE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  order_number TEXT NOT NULL,
  product_name TEXT NOT NULL,
  notes TEXT,
  locale TEXT NOT NULL DEFAULT 'es',
  status TEXT NOT NULL DEFAULT 'open',
  order_matched BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT withdrawal_requests_status_check
    CHECK (status IN ('open', 'in_progress', 'resolved', 'rejected')),
  CONSTRAINT withdrawal_requests_locale_check
    CHECK (locale IN ('en', 'es', 'fr', 'it'))
);

CREATE INDEX IF NOT EXISTS withdrawal_requests_email_lower_idx
  ON public.withdrawal_requests (lower(trim(email)));

CREATE INDEX IF NOT EXISTS withdrawal_requests_order_number_idx
  ON public.withdrawal_requests (order_number);

CREATE INDEX IF NOT EXISTS withdrawal_requests_created_at_idx
  ON public.withdrawal_requests (created_at DESC);

COMMENT ON TABLE public.withdrawal_requests IS
  'Trámites de arrepentimiento / revocación — insert vía POST /api/withdrawal (service role).';

ALTER TABLE public.withdrawal_requests ENABLE ROW LEVEL SECURITY;

-- Sin políticas públicas: solo service role accede (bypass RLS).

CREATE OR REPLACE FUNCTION public.touch_withdrawal_requests_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS withdrawal_requests_updated_at ON public.withdrawal_requests;
CREATE TRIGGER withdrawal_requests_updated_at
  BEFORE UPDATE ON public.withdrawal_requests
  FOR EACH ROW EXECUTE PROCEDURE public.touch_withdrawal_requests_updated_at();
