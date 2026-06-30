#!/usr/bin/env node
/**
 * Verifica variables de entorno necesarias para checkout (local o referencia Vercel).
 * No imprime valores secretos.
 *
 * Uso: node scripts/verify-checkout-env.mjs
 *      npm run verify-checkout-env
 */
import { loadEnvLocal } from "./reviews/load-env.mjs";

const REQUIRED = [
  { key: "NEXT_PUBLIC_SUPABASE_URL", hint: "Supabase → Settings → API → Project URL" },
  { key: "NEXT_PUBLIC_SUPABASE_ANON_KEY", hint: "Supabase → anon public" },
  { key: "SUPABASE_SERVICE_ROLE_KEY", hint: "Supabase → service_role (solo servidor)" },
  { key: "NEXT_PUBLIC_PAYPAL_CLIENT_ID", hint: "PayPal Developer → Live app" },
  { key: "PAYPAL_CLIENT_SECRET", hint: "PayPal Developer → Live secret" },
  { key: "PAYPAL_ENV", hint: "sandbox o live" },
  { key: "NEXT_PUBLIC_BASE_URL", hint: "https://tu-proyecto.vercel.app o dominio custom" },
];

const RECOMMENDED = [
  { key: "NEXT_PUBLIC_WHATSAPP_NUMBER", hint: "Coordinación transferencia / MP" },
  { key: "BREVO_API_KEY", hint: "Emails post-compra y arrepentimiento" },
  { key: "BREVO_SENDER_EMAIL", hint: "Sender verificado en Brevo" },
  { key: "BREVO_SENDER_NAME", hint: "Ej. Buenos Productos" },
];

function isSet(key) {
  const v = process.env[key];
  return typeof v === "string" && v.trim().length > 0;
}

function warnPayPalEnv() {
  const env = process.env.PAYPAL_ENV?.trim().toLowerCase();
  if (env !== "sandbox" && env !== "live") {
    console.log("  ⚠ PAYPAL_ENV debe ser sandbox o live");
    return false;
  }
  return true;
}

function warnBaseUrl() {
  const url = process.env.NEXT_PUBLIC_BASE_URL?.trim();
  if (!url) return false;
  if (!url.startsWith("https://") && !url.startsWith("http://localhost")) {
    console.log("  ⚠ NEXT_PUBLIC_BASE_URL debería ser https:// en producción");
  }
  return true;
}

try {
  loadEnvLocal();
} catch {
  console.log("ℹ Sin .env.local — revisando process.env (útil en CI/Vercel build)\n");
}

let failed = 0;

console.log("Checkout — variables obligatorias:\n");
for (const { key, hint } of REQUIRED) {
  const ok = isSet(key);
  if (!ok) failed++;
  console.log(`  ${ok ? "✓" : "✗"} ${key}`);
  if (!ok) console.log(`      → ${hint}`);
}

if (!warnPayPalEnv()) failed++;
warnBaseUrl();

console.log("\nRecomendadas (no bloquean el cobro):\n");
for (const { key, hint } of RECOMMENDED) {
  const ok = isSet(key);
  console.log(`  ${ok ? "✓" : "○"} ${key}${ok ? "" : ` — ${hint}`}`);
}

console.log("\nSupabase (manual): ejecutá supabase/verify-checkout-schema.sql en SQL Editor.\n");

if (failed > 0) {
  console.log(`Resultado: ${failed} variable(s) obligatoria(s) faltante(s).\n`);
  process.exit(1);
}

console.log("Resultado: variables de checkout OK en este entorno.\n");
