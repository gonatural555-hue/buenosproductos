/**
 * Elimina reseñas < minRating y duplicados (mismo product_id + text) en Supabase.
 * No re-scrapea AliExpress.
 *
 * Uso: node scripts/cleanup-product-reviews.mjs
 *      node scripts/cleanup-product-reviews.mjs --min-rating=4
 */
import { createClient } from "@supabase/supabase-js";
import { loadEnvLocal, requireEnv } from "./reviews/load-env.mjs";
import { textFingerprint } from "./reviews/normalize-reviews.mjs";

function parseArgs(argv) {
  let minRating = 4;
  for (const arg of argv) {
    if (arg.startsWith("--min-rating=")) {
      minRating = Math.max(1, Math.min(5, Number(arg.split("=")[1]) || 4));
    }
  }
  return { minRating };
}

async function main() {
  const { minRating } = parseArgs(process.argv.slice(2));
  loadEnvLocal();

  const supabase = createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  const { data: lowRows, error: lowErr } = await supabase
    .from("product_reviews")
    .delete()
    .lt("rating", minRating)
    .select("id");

  if (lowErr) throw new Error(lowErr.message);
  console.log(`Eliminadas ${lowRows?.length ?? 0} reseñas con rating < ${minRating}★`);

  const { data: all, error: fetchErr } = await supabase
    .from("product_reviews")
    .select("id, product_id, text, rating, created_at")
    .order("created_at", { ascending: false });

  if (fetchErr) throw new Error(fetchErr.message);

  const seen = new Map();
  const toDelete = [];

  for (const row of all ?? []) {
    const fp = `${row.product_id}|${textFingerprint(row.text ?? "")}|${row.rating}`;
    if (seen.has(fp)) {
      toDelete.push(row.id);
    } else {
      seen.set(fp, row.id);
    }
  }

  if (toDelete.length > 0) {
    const { error: dupErr } = await supabase
      .from("product_reviews")
      .delete()
      .in("id", toDelete);
    if (dupErr) throw new Error(dupErr.message);
  }

  console.log(`Eliminados ${toDelete.length} duplicados (mismo texto + rating)`);

  const { data: cleared, error: titleErr } = await supabase
    .from("product_reviews")
    .update({ title: null })
    .not("title", "is", null)
    .select("id");

  if (titleErr) throw new Error(titleErr.message);
  console.log(
    `Títulos limpiados en ${cleared?.length ?? 0} fila(s) (evita EN+ES duplicado en PDP)`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
