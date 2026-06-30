-- PDP Fase 3 — datos de prueba (DEV)
-- Ejecutar en Supabase SQL Editor. Las tablas ya deben existir.
-- product_id debe coincidir con IDs del catálogo (ej. gi-tech-001).

-- Reviews
insert into product_reviews (id, product_id, rating, title, text, author, country, created_at)
values
  (gen_random_uuid(), 'gi-tech-001', 5, 'Great robot', 'My kids love it.', 'María G.', null, now() - interval '3 days'),
  (gen_random_uuid(), 'gi-tech-001', 4, 'Fun and educational', 'Voice recognition works well.', 'John D.', 'US', now() - interval '7 days');

-- Videos
insert into product_videos (id, product_id, url, thumbnail_url, title, platform, created_at)
values
  (gen_random_uuid(), 'gi-tech-001', 'https://www.tiktok.com/@example/video/7123456789012345678', null, 'ZOCO robot demo', 'tiktok', now());

-- Relations (IDs de otros productos del catálogo)
insert into product_relations (id, product_id, related_product_id, sort_order)
values
  (gen_random_uuid(), 'gi-tech-001', 'gi-lifestyle-001', 1),
  (gen_random_uuid(), 'gi-tech-001', 'gi-hogar-001', 2);

-- Si RLS bloquea lectura anónima, añadir políticas de solo lectura:
-- create policy "allow public read" on product_reviews for select using (true);
-- create policy "allow public read" on product_videos for select using (true);
-- create policy "allow public read" on product_relations for select using (true);
