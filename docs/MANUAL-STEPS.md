# Plan manual — Buenos Productos (GitHub + Vercel)

El agente ya preparó el código local. **Vos completás estos pasos** en orden.

---

## Fase 1 — GitHub (≈10 min)

### Paso 1: Crear el repositorio nuevo

1. Entrá a https://github.com/new  
2. **Owner:** `gonatural555-hue` (tu cuenta)  
3. **Repository name:** `buenosproductos`  
4. **Público** o privado (como prefieras)  
5. **No** marques “Add a README”, .gitignore ni license  
6. Click **Create repository**

### Paso 2: Subir el código (terminal en la carpeta del proyecto)

```powershell
cd "c:\Users\inzaf\OneDrive\Desktop\buenos-productos-v2`"

# Ver remotos (debe existir legacy-go-natural + origin → buenos-productos)
git remote -v

# Si origin aún no apunta al repo nuevo:
git remote set-url origin https://github.com/gonatural555-hue/buenosproductos.git

# Primer push
git push -u origin main
```

Si GitHub pide login, usá **Personal Access Token** como contraseña o GitHub Desktop.

### Paso 3 (opcional) — Recuperar Go Natural en `ecommerce-headless`

Solo si todavía necesitás el sitio Go Natural en ese repo:

1. Abrí https://github.com/gonatural555-hue/ecommerce-headless/commits/main  
2. Buscá el último commit **antes** de subir Buenos Productos  
3. **Revert** o creá rama `go-natural` desde ese commit  
4. O cloná de nuevo Go Natural desde un backup local si lo tenés  

Si ya no usás Go Natural en producción, podés ignorar este paso.

---

## Fase 2 — Vercel (≈15 min)

### Paso 4: Nuevo proyecto en Vercel

1. https://vercel.com → **Add New → Project**  
2. Importá **`gonatural555-hue/buenos-productos`** (no `ecommerce-headless`)  
3. Framework: **Next.js** (detectado solo)  
4. **Deploy** (puede fallar sin env vars — normal en el primer intento)

### Paso 5: Variables de entorno

En Vercel → Project → **Settings → Environment Variables** → **Production** (y Preview si querés):

Copiá desde tu `.env.local` estas variables **mínimas**:

| Variable | Obligatoria |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Sí |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Sí |
| `SUPABASE_SERVICE_ROLE_KEY` | Sí |
| `NEXT_PUBLIC_PAYPAL_CLIENT_ID` | Sí |
| `PAYPAL_CLIENT_SECRET` | Sí |
| `PAYPAL_ENV` | Sí (`sandbox` o `live`) |
| `BREVO_API_KEY` | Sí (emails + arrepentimiento) |
| `BREVO_SENDER_EMAIL` | Sí |
| `BREVO_SENDER_NAME` | Sí |
| `NEXT_PUBLIC_BASE_URL` | Sí — `https://TU-PROYECTO.vercel.app` |
| `NEXT_PUBLIC_GA4_ID` | Opcional |
| `NEXT_PUBLIC_CLARITY_ID` | Opcional |

Lista completa: `.env.example`

### Paso 6: Redeploy

**Deployments → … → Redeploy** (o push nuevo a `main`).

Anotá la URL final, ej. `https://buenos-productos.vercel.app`

---

## Fase 3 — Supabase (≈10 min)

### Paso 7: Migraciones SQL

1. Supabase Dashboard → **SQL Editor**  
2. Ejecutá en orden los archivos en `supabase/migrations/` (si no lo hiciste antes), especialmente:  
   - `005_withdrawal_requests.sql`

### Paso 8: Auth URLs

**Authentication → URL Configuration:**

| Campo | Valor |
|-------|--------|
| Site URL | `https://TU-PROYECTO.vercel.app` |
| Redirect URLs | `https://TU-PROYECTO.vercel.app/auth/callback` |

Si tenés dominio propio después, actualizá ambos.

---

## Fase 4 — PayPal (≈5 min)

### Paso 9: Dominio en PayPal

1. https://developer.paypal.com → tu app **Live**  
2. Agregá la URL de Vercel en **App settings** / return URLs permitidas  
3. Confirmá que `PAYPAL_ENV=live` en Vercel solo cuando quieras cobros reales  

---

## Fase 5 — Verificación (≈10 min)

### Paso 10: Checklist en producción

- [ ] Home carga: `/es`  
- [ ] PLP productos: `/es/products`  
- [ ] PDP y agregar al carrito  
- [ ] Checkout PayPal (prueba con monto chico si es live)  
- [ ] Login / registro  
- [ ] Botón arrepentimiento: `/es/boton-de-arrepentimiento` (formulario + email)  
- [ ] Legales: `/es/terminos-y-condiciones`, `/es/returns`  

---

## Fase 6 — Dominio propio (opcional, después)

### Paso 11: Dominio custom en Vercel

1. Vercel → Project → **Domains** → agregar tu dominio  
2. Configurar DNS según indique Vercel  
3. Actualizar `NEXT_PUBLIC_BASE_URL`, Supabase Auth URLs y PayPal  

---

## Resumen de remotos Git (referencia)

Después de la preparación del agente:

```
origin              → buenos-productos.git      (push acá siempre)
legacy-go-natural   → ecommerce-headless.git    (solo referencia Go Natural)
```

Comando útil:

```powershell
git remote -v
```

---

## Si algo falla

| Problema | Qué revisar |
|----------|-------------|
| `push` rechazado | ¿Creaste el repo `buenos-productos` en GitHub? |
| Build falla en Vercel | Logs del deploy; corré `npm run build` local |
| Checkout no carga PayPal | `NEXT_PUBLIC_PAYPAL_CLIENT_ID` en Vercel |
| Arrepentimiento error 503 | `SUPABASE_SERVICE_ROLE_KEY` + migración 005 |
| Emails no llegan | `BREVO_API_KEY` + sender verificado en Brevo |

---

**Cuando termines la Fase 1 paso 2**, cada `git push origin main` desplegará automáticamente en Vercel (si conectaste el repo en Fase 2).
