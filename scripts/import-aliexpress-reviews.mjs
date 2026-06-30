/**
 * Import masivo de reviews AliExpress → Supabase product_reviews
 *
 * Uso:
 *   npm run import-reviews
 *   npm run import-reviews -- --product=gi-tech-001
 *   npm run import-reviews -- --product=gi-tech-001 --dry-run
 *   npm run import-reviews -- --no-headless --debug
 *   npm run import-reviews -- --min-rating=3   # incluir 3★ (default: 4)
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";
import { loadEnvLocal, requireEnv } from "./reviews/load-env.mjs";
import { scrapeAliExpressReviews, openScraperSession, closeScraperSession } from "./reviews/scrape-aliexpress-reviews.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SOURCES_PATH = path.join(__dirname, "reviews", "aliexpress-sources.json");

function parseArgs(argv) {
  const args = {
    product: null,
    dryRun: false,
    headless: true,
    debug: false,
    maxReviews: 20,
    minRating: 4,
    delayMs: 6000,
    retries: 2,
  };

  for (const arg of argv) {
    if (arg.startsWith("--product=")) {
      args.product = arg.split("=")[1]?.trim() || null;
    } else if (arg === "--dry-run") {
      args.dryRun = true;
    } else if (arg === "--no-headless") {
      args.headless = false;
    } else if (arg === "--debug") {
      args.debug = true;
    } else if (arg.startsWith("--max=")) {
      args.maxReviews = Math.max(1, Number(arg.split("=")[1]) || 20);
    } else if (arg.startsWith("--delay=")) {
      args.delayMs = Math.max(0, Number(arg.split("=")[1]) || 3500);
    } else if (arg.startsWith("--min-rating=")) {
      args.minRating = Math.max(1, Math.min(5, Number(arg.split("=")[1]) || 4));
    }
  }

  return args;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function loadSources() {
  if (!fs.existsSync(SOURCES_PATH)) {
    throw new Error(`Missing sources file: ${SOURCES_PATH}`);
  }
  const raw = JSON.parse(fs.readFileSync(SOURCES_PATH, "utf8"));
  if (!Array.isArray(raw)) {
    throw new Error("aliexpress-sources.json must be an array");
  }
  return raw.filter((e) => e?.productId && e?.listingUrl);
}

async function upsertReviews(supabase, productId, reviews) {
  const { error: delError } = await supabase
    .from("product_reviews")
    .delete()
    .eq("product_id", productId);

  if (delError) {
    throw new Error(`Delete failed for ${productId}: ${delError.message}`);
  }

  const rows = reviews.map((r) => ({
    product_id: productId,
    rating: r.rating,
    title: null,
    text: r.body,
    author: r.author_name,
    country: r.country ?? null,
    images: r.images ?? [],
    created_at: r.created_at,
  }));

  const { error } = await supabase.from("product_reviews").insert(rows);
  if (error) {
    throw new Error(`Insert failed for ${productId}: ${error.message}`);
  }

  return rows.length;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  loadEnvLocal();

  let supabase = null;
  if (!args.dryRun) {
    const supabaseUrl = requireEnv("NEXT_PUBLIC_SUPABASE_URL");
    const serviceKey = requireEnv("SUPABASE_SERVICE_ROLE_KEY");
    supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  let sources = loadSources();
  if (args.product) {
    sources = sources.filter((s) => s.productId === args.product);
    if (sources.length === 0) {
      throw new Error(`Product not found in sources: ${args.product}`);
    }
  }

  console.log(
    `Import AliExpress reviews → Supabase (${sources.length} product(s), max ${args.maxReviews}/product, min ${args.minRating}★)`
  );
  if (args.dryRun) console.log("DRY RUN — no se escribirá en Supabase\n");

  const summary = { ok: 0, empty: 0, failed: 0 };

  const session = await openScraperSession({ headless: args.headless });

  try {
  for (let i = 0; i < sources.length; i++) {
    const { productId, listingUrl } = sources[i];
    console.log(`\n[${i + 1}/${sources.length}] ${productId}`);

    try {
      let reviews = [];

      for (let attempt = 1; attempt <= args.retries; attempt++) {
        reviews = await scrapeAliExpressReviews(listingUrl, {
          maxReviews: args.maxReviews,
          minRating: args.minRating,
          headless: args.headless,
          debug: args.debug,
          session,
        });
        if (reviews.length > 0) break;
        if (attempt < args.retries) {
          console.warn(`  ⚠ Intento ${attempt} vacío — reintento en 8s...`);
          await sleep(8000);
        }
      }

      console.log(`  Parsed: ${reviews.length} review(s)`);

      if (reviews.length === 0) {
        summary.empty += 1;
        console.warn("  ⚠ Sin reviews — probá --no-headless --debug");
        continue;
      }

      if (args.debug) {
        console.log("  Sample:", JSON.stringify(reviews[0], null, 2));
      }

      if (args.dryRun) {
        summary.ok += 1;
        continue;
      }

      const inserted = await upsertReviews(supabase, productId, reviews);
      console.log(`  ✓ Inserted ${inserted} row(s) in product_reviews`);
      summary.ok += 1;
    } catch (err) {
      summary.failed += 1;
      console.error(`  ✗ Error: ${err instanceof Error ? err.message : err}`);
    }

    if (i < sources.length - 1 && args.delayMs > 0) {
      await sleep(args.delayMs);
    }
  }
  } finally {
    await closeScraperSession(session);
  }

  console.log("\n--- Resumen ---");
  console.log(`OK: ${summary.ok} | Vacíos: ${summary.empty} | Error: ${summary.failed}`);

  if (summary.failed > 0) process.exitCode = 1;
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
