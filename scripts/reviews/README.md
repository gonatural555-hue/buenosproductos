# Import reviews AliExpress → Supabase

Scrapea reviews de los listings en `aliexpress-sources.json` y las inserta en `product_reviews`.

## Requisitos

1. **Playwright** (ya en devDependencies):
   ```bash
   npx playwright install chromium
   ```

2. **`.env.local`** en la raíz del proyecto (guardado en disco):
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJ...   # Settings → API → service_role (secreta)
   ```

3. Tabla `product_reviews` en Supabase + policy SELECT pública para el PDP.

## Uso

```bash
# Piloto (un producto, sin escribir en DB)
npm run import-reviews -- --product=gi-tech-001 --dry-run --debug

# Piloto real
npm run import-reviews -- --product=gi-tech-001

# Import masivo (17 productos en aliexpress-sources.json)
npm run import-reviews

# Si AliExpress muestra CAPTCHA
npm run import-reviews -- --product=gi-tech-001 --no-headless --debug
```

## Opciones

| Flag | Descripción |
|------|-------------|
| `--product=gi-tech-001` | Solo un producto |
| `--dry-run` | Scrape sin insertar en Supabase |
| `--debug` | Log de URLs capturadas + sample JSON |
| `--no-headless` | Browser visible (útil con CAPTCHA) |
| `--max=20` | Máximo de reviews por producto |
| `--min-rating=4` | Solo importar reseñas con esta estrella o más (default **4**) |
| `--delay=3500` | Pausa ms entre productos (anti-bot) |

## Fuentes

Editá `scripts/reviews/aliexpress-sources.json`:

```json
[
  { "productId": "gi-tech-001", "listingUrl": "https://es.aliexpress.com/item/....html" }
]
```

`productId` debe coincidir con el catálogo (`gi-*`).

## Notas

- Reemplaza reviews previas del mismo `product_id` en cada import.
- **Solo 4★ y 5★** por defecto (`--min-rating=4`). Usá `--min-rating=1` si querés todas.
- **Sin duplicados EN/ES:** una sola versión del texto por reseña; dedup por ID AliExpress o fingerprint.
- `verified` no aplica — reviews de AliExpress.
- Si obtenés 0 reviews, probá `--no-headless --debug`.
