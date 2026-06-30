-- Buenos Productos — verificar esquema mínimo para checkout PayPal
-- Supabase Dashboard → SQL Editor → Run.
-- Todas las filas deben mostrar ok = true.

WITH checks AS (
  SELECT 'tabla orders' AS check_name,
    EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'orders'
    ) AS ok
  UNION ALL
  SELECT 'tabla order_items',
    EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'order_items'
    )
  UNION ALL
  SELECT 'tabla profiles',
    EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'profiles'
    )
  UNION ALL
  SELECT 'orders.guest_email',
    EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'guest_email'
    )
  UNION ALL
  SELECT 'orders.shipping_waived',
    EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'shipping_waived'
    )
  UNION ALL
  SELECT 'orders.shipping_amount',
    EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'shipping_amount'
    )
  UNION ALL
  SELECT 'orders.paypal_order_id',
    EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'paypal_order_id'
    )
  UNION ALL
  SELECT 'orders.user_id nullable (guest)',
    COALESCE(
      (
        SELECT is_nullable = 'YES'
        FROM information_schema.columns
        WHERE table_schema = 'public' AND table_name = 'orders' AND column_name = 'user_id'
        LIMIT 1
      ),
      false
    )
  UNION ALL
  SELECT 'trigger on_auth_user_created',
    EXISTS (
      SELECT 1 FROM pg_trigger t
      JOIN pg_class c ON c.oid = t.tgrelid
      JOIN pg_namespace n ON n.oid = c.relnamespace
      WHERE n.nspname = 'auth' AND c.relname = 'users' AND t.tgname = 'on_auth_user_created'
    )
  UNION ALL
  SELECT 'RLS orders habilitado',
    EXISTS (
      SELECT 1 FROM pg_tables
      WHERE schemaname = 'public' AND tablename = 'orders' AND rowsecurity = true
    )
)
SELECT
  check_name,
  ok,
  CASE WHEN ok THEN 'OK' ELSE 'FALTA — ejecutá apply-checkout-patch.sql o migraciones 003–004' END AS status
FROM checks
ORDER BY ok ASC, check_name;
