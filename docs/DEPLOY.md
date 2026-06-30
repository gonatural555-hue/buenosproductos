# Deploy — Buenos Productos

## Repositorio

| Repo | Uso |
|------|-----|
| **`buenosproductos`** | Este proyecto — Good Products / Buenos Productos |
| **`ecommerce-headless`** (legacy) | Go Natural — remoto: `legacy-go-natural` |

**URL:** `https://github.com/gonatural555-hue/buenosproductos`

## Comandos habituales

```powershell
git status
git add .
git commit -m "mensaje"
git push origin main
```

Antes de deploy:

```powershell
npm run build
npm run verify-checkout-env
```

## Desarrollo local

```powershell
npm run dev
```

- Usa **webpack** (más estable que Turbopack en Windows/OneDrive).
- Si ves 404 raros o el servidor crashea: **cerrá** otros `npm run dev`, luego:

```powershell
npm run dev:clean
```

- Turbopack (opcional): `npm run dev:turbo`
- Tras cambiar `.env.local`: reiniciá el servidor (`NEXT_PUBLIC_*` se cargan al arrancar).

## Checkout y cobros

1. **Supabase:** `supabase/verify-checkout-schema.sql` → si falta algo, `apply-checkout-patch.sql`  
2. **Vercel:** variables de `.env.example` (mínimo Supabase + PayPal + `NEXT_PUBLIC_BASE_URL`)  
3. **Guía paso a paso:** [`docs/CHECKOUT-SETUP.md`](./CHECKOUT-SETUP.md)  
4. **Deploy general:** [`docs/MANUAL-STEPS.md`](./MANUAL-STEPS.md)

Variables: `.env.example`
