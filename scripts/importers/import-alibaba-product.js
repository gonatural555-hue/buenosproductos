/**
 * Alibaba → Go Natural catalog importer
 *
 * Compatible with:
 *   - lib/products.ts (PRODUCTS array)
 *   - scripts/products/{id}.json (images)
 *
 * Usage:
 *   node scripts/importers/import-alibaba-product.js <alibaba-product-url>
 *   node scripts/importers/import-alibaba-product.js <url> --dry-run
 *   node scripts/importers/import-alibaba-product.js <url> --category="Outdoor Adventure"
 *
 * Options:
 *   --dry-run          Preview changes without writing files
 *   --category=<name>  Category fallback (default: "Outdoor Adventure")
 *   --price=<number>   Override price if extraction fails
 *   --save-html        Save raw HTML to imports/raw/
 */

import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import axios from "axios";
import * as cheerio from "cheerio";
import slugify from "slugify";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, "../..");
const PRODUCTS_LIB_PATH = path.join(PROJECT_ROOT, "lib", "products.ts");
const PRODUCTS_JSON_DIR = path.join(PROJECT_ROOT, "scripts", "products");
const IMPORTS_RAW_DIR = path.join(PROJECT_ROOT, "imports", "raw");

const PRODUCTS_ARRAY_END_ANCHOR =
  "\n];\n\nexport function getProducts(): Product[]";

const DEFAULT_CATEGORY = "Outdoor Adventure";
const FETCH_TIMEOUT_MS = 30_000;
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const positional = [];
  const flags = {
    dryRun: false,
    saveHtml: false,
    category: DEFAULT_CATEGORY,
    priceOverride: null,
  };

  for (const arg of argv) {
    if (arg === "--dry-run") {
      flags.dryRun = true;
    } else if (arg === "--save-html") {
      flags.saveHtml = true;
    } else if (arg.startsWith("--category=")) {
      flags.category = arg.slice("--category=".length).trim() || DEFAULT_CATEGORY;
    } else if (arg.startsWith("--price=")) {
      const n = Number.parseFloat(arg.slice("--price=".length));
      if (Number.isFinite(n) && n >= 0) flags.priceOverride = n;
    } else if (arg.startsWith("-")) {
      throw new Error(`Unknown flag: ${arg}`);
    } else {
      positional.push(arg);
    }
  }

  const url = positional[0];
  if (!url) {
    throw new Error(
      "Missing Alibaba product URL.\n\nExample:\n  node scripts/importers/import-alibaba-product.js \"https://www.alibaba.com/product-detail/...\""
    );
  }

  return { url, ...flags };
}

function assertAlibabaUrl(url) {
  let parsed;
  try {
    parsed = new URL(url);
  } catch {
    throw new Error(`Invalid URL: ${url}`);
  }

  const host = parsed.hostname.toLowerCase();
  const allowed =
    host.includes("alibaba.com") ||
    host.includes("alibaba.cn") ||
    host.endsWith(".alibaba.com");

  if (!allowed) {
    throw new Error(
      `URL host "${host}" is not recognized as Alibaba. Use a product-detail page on alibaba.com.`
    );
  }
}

// ---------------------------------------------------------------------------
// Catalog reads (no modifications)
// ---------------------------------------------------------------------------

function readProductsLibContent() {
  if (!fs.existsSync(PRODUCTS_LIB_PATH)) {
    throw new Error(`Missing catalog file: ${PRODUCTS_LIB_PATH}`);
  }
  return fs.readFileSync(PRODUCTS_LIB_PATH, "utf-8");
}

function extractExistingIds(content) {
  const ids = new Set();
  const re = /\bid:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    ids.add(m[1]);
  }
  return ids;
}

function extractExistingSlugs(content) {
  const slugs = new Set();
  const re = /\bslug:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    slugs.add(m[1]);
  }
  return slugs;
}

function extractAlibabaListingId(url) {
  const m = url.match(/_(\d{6,})\.html/i) || url.match(/\/(\d{6,})\.html/i);
  return m ? m[1] : null;
}

function buildUniqueProductId(title, url, existingIds) {
  const listingId = extractAlibabaListingId(url);
  const baseSlug = slugify(title || "product", {
    lower: true,
    strict: true,
    trim: true,
  }).slice(0, 36);

  const candidates = listingId
    ? [`gn-alibaba-${listingId}`, `gn-import-${baseSlug}`]
    : [`gn-import-${baseSlug}`];

  for (const base of candidates) {
    if (!existingIds.has(base)) return base;
    for (let i = 2; i < 1000; i++) {
      const candidate = `${base}-${String(i).padStart(3, "0")}`;
      if (!existingIds.has(candidate)) return candidate;
    }
  }

  throw new Error("Could not generate a unique product id.");
}

function buildUniqueSlug(title, existingSlugs) {
  const base = slugify(title || "product", {
    lower: true,
    strict: true,
    trim: true,
  }).slice(0, 80);

  if (!existingSlugs.has(base)) return base;
  for (let i = 2; i < 1000; i++) {
    const candidate = `${base}-${i}`;
    if (!existingSlugs.has(candidate)) return candidate;
  }
  throw new Error("Could not generate a unique slug.");
}

// ---------------------------------------------------------------------------
// Fetch & parse
// ---------------------------------------------------------------------------

async function fetchPageHtml(url) {
  console.log(`\n🌐 Fetching: ${url}`);
  const response = await axios.get(url, {
    timeout: FETCH_TIMEOUT_MS,
    maxRedirects: 5,
    headers: {
      "User-Agent": USER_AGENT,
      Accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9,es;q=0.8",
    },
    validateStatus: (status) => status >= 200 && status < 400,
  });

  const html = typeof response.data === "string" ? response.data : "";
  if (!html || html.length < 200) {
    throw new Error("Empty or too-short HTML response (page may require login or block bots).");
  }

  console.log(`   ✓ Downloaded ${(html.length / 1024).toFixed(1)} KB`);
  return html;
}

function normalizeImageUrl(raw) {
  if (!raw || typeof raw !== "string") return null;
  let url = raw.trim().replace(/\\u002F/g, "/").replace(/\\\//g, "/");
  if (url.startsWith("//")) url = `https:${url}`;
  if (!/^https?:\/\//i.test(url)) return null;
  try {
    const u = new URL(url);
    const isImagePath = /\.(jpg|jpeg|png|webp|gif)(\?|$)/i.test(u.pathname);
    const isKnownCdn = /alicdn\.com|alibaba\.com|tbcdn\.cn/i.test(u.hostname);
    if (!isImagePath && !isKnownCdn) return null;
    return u.href;
  } catch {
    return null;
  }
}

function uniqueImages(urls) {
  const seen = new Set();
  const out = [];
  for (const raw of urls) {
    const url = normalizeImageUrl(raw);
    if (!url) continue;
    const key = url.replace(/_\d+x\d+\./, ".").replace(/\.(\d+)x(\d+)\./, ".");
    if (seen.has(key) || seen.has(url)) continue;
    seen.add(url);
    seen.add(key);
    if (/sprite|icon|logo|badge|flag|avatar|1x1|pixel/i.test(url)) continue;
    out.push(url);
  }
  return out;
}

function tryParseJsonLoose(text) {
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function collectStringsDeep(value, keyHint, bucket) {
  if (value == null) return;
  if (typeof value === "string") {
    if (/image|img|photo|pic|url/i.test(keyHint) || /\.(jpg|jpeg|png|webp)/i.test(value)) {
      bucket.push(value);
    }
    return;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStringsDeep(item, keyHint, bucket);
    return;
  }
  if (typeof value === "object") {
    for (const [k, v] of Object.entries(value)) {
      collectStringsDeep(v, k, bucket);
    }
  }
}

function extractFromEmbeddedScripts(html) {
  const data = { title: null, price: null, description: null, images: [] };

  const subjectMatch = html.match(/"subject"\s*:\s*"((?:\\.|[^"\\])*)"/);
  if (subjectMatch) {
    data.title = subjectMatch[1].replace(/\\"/g, '"').replace(/\\n/g, " ").trim();
  }

  const priceMatches = [
    ...html.matchAll(/"price(?:Min|Max)?"\s*:\s*"?([\d.]+)"?/g),
    ...html.matchAll(/"formatPrice"\s*:\s*"([^"]+)"/g),
    ...html.matchAll(/"unitPrice"\s*:\s*"?([\d.]+)"?/g),
  ];
  for (const m of priceMatches) {
    const n = parsePrice(m[1]);
    if (n != null) {
      data.price = n;
      break;
    }
  }

  const descMatch = html.match(/"description"\s*:\s*"((?:\\.|[^"\\])*)"/);
  if (descMatch) {
    data.description = descMatch[1]
      .replace(/\\"/g, '"')
      .replace(/\\n/g, "\n")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  const imageListMatch = html.match(/"imagePathList"\s*:\s*(\[[^\]]+\])/);
  if (imageListMatch) {
    const parsed = tryParseJsonLoose(imageListMatch[1]);
    if (Array.isArray(parsed)) data.images.push(...parsed);
  }

  const imageUrlListMatch = html.match(/"imageUrlList"\s*:\s*(\[[^\]]+\])/);
  if (imageUrlListMatch) {
    const parsed = tryParseJsonLoose(imageUrlListMatch[1]);
    if (Array.isArray(parsed)) data.images.push(...parsed);
  }

  const runParamsMatch = html.match(/window\.runParams\s*=\s*(\{[\s\S]*?\})\s*;/);
  if (runParamsMatch) {
    const parsed = tryParseJsonLoose(runParamsMatch[1]);
    if (parsed && typeof parsed === "object") {
      const bucket = [];
      collectStringsDeep(parsed, "", bucket);
      data.images.push(...bucket);
      if (!data.title && parsed.subject) data.title = String(parsed.subject);
    }
  }

  return data;
}

function parsePrice(raw) {
  if (raw == null) return null;
  const cleaned = String(raw)
    .replace(/[^\d.,]/g, "")
    .replace(/,/g, "");
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : null;
}

function extractProductData(html, url) {
  const $ = cheerio.load(html);
  const embedded = extractFromEmbeddedScripts(html);

  const title =
    embedded.title ||
    $('meta[property="og:title"]').attr("content") ||
    $("h1").first().text().trim() ||
    $("title").text().replace(/\s*[-|].*Alibaba.*$/i, "").trim();

  const description =
    embedded.description ||
    $('meta[property="og:description"]').attr("content") ||
    $('meta[name="description"]').attr("content") ||
    "";

  let price = embedded.price;
  if (price == null) {
    const ogPrice = $('meta[property="product:price:amount"]').attr("content");
    price = parsePrice(ogPrice);
  }
  if (price == null) {
    const priceText = $('[class*="price"], [data-testid*="price"]').first().text();
    price = parsePrice(priceText);
  }

  const images = uniqueImages([
    ...embedded.images,
    $('meta[property="og:image"]').attr("content"),
    ...$("img")
      .map((_, el) => $(el).attr("src") || $(el).attr("data-src"))
      .get(),
  ]);

  if (!title) {
    throw new Error("Could not extract product title from the page.");
  }

  if (images.length === 0) {
    console.warn("⚠️  No images found — product will use an empty images array.");
  }

  if (price == null) {
    console.warn("⚠️  Could not extract price — use --price= or update manually in lib/products.ts");
  }

  const cleanDescription =
    description ||
    `Imported from Alibaba. Source: ${url}\n\n${title}`;

  return {
    title: title.replace(/\s+/g, " ").trim(),
    price,
    description: cleanDescription.replace(/\s+/g, " ").trim().slice(0, 4000),
    images,
    sourceUrl: url,
  };
}

// ---------------------------------------------------------------------------
// Code generation (matches lib/products.ts style)
// ---------------------------------------------------------------------------

function escapeTsString(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/"/g, '\\"')
    .replace(/\r?\n/g, " ");
}

function buildFeatures(description, title) {
  const fromDesc = description
    .split(/[.•\n;]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 12 && s.length < 160);

  const features = fromDesc.slice(0, 6);
  if (features.length === 0) {
    features.push(
      `Imported listing: ${title.slice(0, 80)}`,
      "Verify specifications on supplier page before publishing",
      "Images sourced from Alibaba product gallery"
    );
  }
  return features;
}

function formatImagesTsArray(images) {
  if (images.length === 0) {
    return `[]`;
  }
  const lines = images.map((url) => `          "${escapeTsString(url)}"`);
  return `[\n${lines.join(",\n")}\n    ]`;
}

function formatFeaturesTsArray(features) {
  const lines = features.map((f) => `      "${escapeTsString(f)}",`);
  return `[\n${lines.join("\n")}\n    ]`;
}

function formatProductTsBlock(product) {
  const { id, slug, title, price, category, description, images, features } = product;
  const priceStr = price != null ? price.toFixed(2) : "0.00";

  return `  // ===== ALIBABA IMPORT: ${escapeTsString(id)} =====
  {
    id: "${escapeTsString(id)}",
    slug: "${escapeTsString(slug)}",
    title: "${escapeTsString(title)}",
    price: ${priceStr},
    category: "${escapeTsString(category)}",
    images: ${formatImagesTsArray(images)},
    description:
      "${escapeTsString(description)}",
    features: ${formatFeaturesTsArray(features)},
    translations: {
      en: {
        title: "${escapeTsString(title)}",
        description:
          "${escapeTsString(description)}",
        features: ${formatFeaturesTsArray(features)},
      },
    },
  }`;
}

function buildProductJsonFile({ id, images }) {
  const featured = images[0] ? [images[0]] : [];
  const gallery = images.length > 1 ? images.slice(1) : [];

  return {
    id,
    images: {
      featured,
      gallery,
      lifestyle: [],
      extras: [],
    },
  };
}

function appendProductToLib(content, productBlock) {
  const anchorIndex = content.indexOf(PRODUCTS_ARRAY_END_ANCHOR);
  if (anchorIndex === -1) {
    throw new Error(
      `Could not find PRODUCTS array end anchor in lib/products.ts.\nExpected:${PRODUCTS_ARRAY_END_ANCHOR}`
    );
  }

  return (
    content.slice(0, anchorIndex) +
    ",\n" +
    productBlock +
    content.slice(anchorIndex)
  );
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv.slice(2));
  assertAlibabaUrl(args.url);

  console.log("═══════════════════════════════════════════════════");
  console.log("  Go Natural — Alibaba Product Importer");
  console.log("═══════════════════════════════════════════════════");
  if (args.dryRun) console.log("\n🔍 DRY RUN — no files will be modified\n");

  const libContent = readProductsLibContent();
  const existingIds = extractExistingIds(libContent);
  const existingSlugs = extractExistingSlugs(libContent);

  const listingId = extractAlibabaListingId(args.url);
  if (listingId) {
    const listingProductId = `gn-alibaba-${listingId}`;
    if (existingIds.has(listingProductId)) {
      throw new Error(
        `Duplicate: product id "${listingProductId}" already exists in lib/products.ts`
      );
    }
  }

  const html = await fetchPageHtml(args.url);

  if (args.saveHtml) {
    await fs.ensureDir(IMPORTS_RAW_DIR);
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    const rawPath = path.join(IMPORTS_RAW_DIR, `alibaba-${stamp}.html`);
    await fs.writeFile(rawPath, html, "utf-8");
    console.log(`   ✓ Saved raw HTML: ${path.relative(PROJECT_ROOT, rawPath)}`);
  }

  const extracted = extractProductData(html, args.url);
  const price =
    args.priceOverride != null ? args.priceOverride : extracted.price ?? 0;

  const id = buildUniqueProductId(extracted.title, args.url, existingIds);
  const slug = buildUniqueSlug(extracted.title, existingSlugs);

  if (existingIds.has(id)) {
    throw new Error(`Duplicate product id: ${id}`);
  }

  const jsonPath = path.join(PRODUCTS_JSON_DIR, `${id}.json`);
  if (fs.existsSync(jsonPath)) {
    throw new Error(`Duplicate JSON file already exists: ${jsonPath}`);
  }

  const features = buildFeatures(extracted.description, extracted.title);
  const catalogProduct = {
    id,
    slug,
    title: extracted.title,
    price,
    category: args.category,
    description: extracted.description,
    images: extracted.images,
    features,
  };

  const productBlock = formatProductTsBlock(catalogProduct);
  const updatedLib = appendProductToLib(libContent, productBlock);
  const jsonPayload = buildProductJsonFile({
    id,
    images: extracted.images,
  });

  // ── Preview ──────────────────────────────────────────────────────────────
  console.log("\n📦 Extracted data");
  console.log("   title:       ", extracted.title);
  console.log("   price:       ", price);
  console.log("   category:    ", args.category);
  console.log("   id:          ", id);
  console.log("   slug:        ", slug);
  console.log("   images:      ", extracted.images.length);
  extracted.images.slice(0, 5).forEach((img, i) => console.log(`     [${i}] ${img}`));
  if (extracted.images.length > 5) {
    console.log(`     … +${extracted.images.length - 5} more`);
  }

  console.log("\n📝 lib/products.ts — block to append");
  console.log("─".repeat(52));
  console.log(productBlock);
  console.log("─".repeat(52));

  console.log("\n📝 scripts/products/" + id + ".json");
  console.log("─".repeat(52));
  console.log(JSON.stringify(jsonPayload, null, 2));
  console.log("─".repeat(52));

  if (args.dryRun) {
    console.log("\n✅ Dry run complete. Re-run without --dry-run to apply.\n");
    return;
  }

  // ── Apply ──────────────────────────────────────────────────────────────
  console.log("\n💾 Writing files…");

  const libBackupPath = `${PRODUCTS_LIB_PATH}.bak-${Date.now()}`;
  await fs.copy(PRODUCTS_LIB_PATH, libBackupPath);
  console.log(`   ✓ Backup: ${path.relative(PROJECT_ROOT, libBackupPath)}`);

  try {
    await fs.writeFile(PRODUCTS_LIB_PATH, updatedLib, "utf-8");
    console.log(`   ✓ Updated: lib/products.ts`);

    await fs.ensureDir(PRODUCTS_JSON_DIR);
    await fs.writeFile(jsonPath, `${JSON.stringify(jsonPayload, null, 2)}\n`, "utf-8");
    console.log(`   ✓ Created: scripts/products/${id}.json`);
  } catch (writeErr) {
    console.error("\n❌ Write failed — restoring backup…");
    await fs.copy(libBackupPath, PRODUCTS_LIB_PATH);
    throw writeErr;
  }

  console.log("\n✅ Import complete.");
  console.log(`   PDP: /es/products/${id} (adjust locale as needed)`);
  console.log(`   Review price, category, translations, and download images to public/ if needed.\n`);
}

main().catch((err) => {
  console.error("\n❌ Import failed:");
  console.error(err instanceof Error ? err.message : err);
  if (process.env.DEBUG && err instanceof Error && err.stack) {
    console.error(err.stack);
  }
  console.error("\nTips:");
  console.error("  • Use --dry-run to preview without writing");
  console.error("  • Use --price=29.99 if price extraction fails");
  console.error("  • Use --category=\"Fishing\" to set category");
  console.error("  • Alibaba may block bots — try --save-html and inspect imports/raw/\n");
  process.exitCode = 1;
});
