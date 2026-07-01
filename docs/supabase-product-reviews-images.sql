-- Columna de fotos en reseñas (AliExpress → PDP)
-- Ejecutar en Supabase → SQL Editor si aún no existe `images`.

alter table product_reviews
  add column if not exists images text[] default '{}';

-- Verificación:
-- select product_id, rating, array_length(images, 1) as photo_count
-- from product_reviews
-- where coalesce(array_length(images, 1), 0) > 0
-- limit 20;
