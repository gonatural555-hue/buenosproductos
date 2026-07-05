# Imágenes Good Products — gi-hogar-010

Plancha a vapor portátil 5 en 1 (`gi-hogar-010`).

## Archivos

| Archivo | Rol |
|---------|-----|
| `scripts/good-ideas-products/gi-hogar-010.images.json` | **Manifiesto** — pegar URLs o definir nombres de archivo |
| `scripts/good-ideas-products/gi-hogar-010.json` | JSON del producto (generado/actualizado por sync) |
| `public/assets/images/good-ideas-products/gi-hogar-010/` | Archivos locales `.webp` / `.png` |

## Flujo

### Opción A — URLs externas (AliExpress, etc.)

1. Editar `gi-hogar-010.images.json` y pegar URLs en cada `"url"`.
2. Ejecutar:

```bash
node scripts/sync-good-ideas-product-images.mjs gi-hogar-010
```

3. Verificar `gi-hogar-010.json` y commitear ambos JSON.

### Opción B — Archivos locales

1. Subir imágenes a `public/assets/images/good-ideas-products/gi-hogar-010/` con los nombres del manifiesto.
2. Dejar `"url": ""` en el manifiesto (usa rutas `/assets/...`).
3. Ejecutar el mismo comando de sync.

## Slots obligatorios

- **PLP card:** `featured` → `plancha-vapor-portatil.webp`
- **Galería PDP:** `gallery` → `plancha-vapor-portatil-01.webp` … `-05.webp`

## Por kit (opcional)

Al completar `kits.{value}` en el manifiesto, el PDP puede cambiar imagen al elegir kit:

- `steamer-cup-mat`
- `steamer-cup-mat-board`
- `steamer-cup-mat-board-bag`

## Sync masivo

```bash
node scripts/sync-good-ideas-product-images.mjs --all
```
