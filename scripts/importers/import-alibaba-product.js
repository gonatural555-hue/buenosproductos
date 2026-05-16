/**
 * =============================================================================
 * Go Natural — Alibaba Product Importer (Puppeteer)
 * =============================================================================
 *
 * WHY PUPPETEER?
 * Alibaba product pages load most data with JavaScript. A simple HTTP request
 * (axios) only gets an empty shell. Puppeteer opens a real Chrome browser so
 * the page can render before we read title, price, description, and images.
 *
 * WHERE DATA GOES (your architecture):
 *   • lib/products.ts          → catalog entry (PRODUCTS array)
 *   • scripts/products/{id}.json → PDP image galleries (featured + gallery)
 *
 * USAGE:
 *   npm run import:alibaba -- "https://www.alibaba.com/product-detail/..."
 *   npm run import:alibaba -- "<url>" --dry-run
 *   npm run import:alibaba -- "<url>" --debug
 *   npm run import:alibaba -- "<url>" --price=29.99 --category="Fishing"
 *
 * FLAGS:
 *   --dry-run     Show what would be written; do not change catalog files
 *   --debug       Slower actions + extra logs (browser is always visible)
 *   --category=   Category string (default: "Outdoor Adventure")
 *   --price=      Manual price if automatic extraction fails
 *
 * DEBUG ARTIFACTS (always saved after page load):
 *   imports/raw/alibaba-page.html
 *   imports/raw/alibaba-page-full.png
 *   imports/raw/alibaba-page-viewport.png
 * =============================================================================
 */

import fs from "fs-extra";
import path from "path";
import { fileURLToPath } from "url";
import puppeteer from "puppeteer";
import slugify from "slugify";

// ---------------------------------------------------------------------------
// Paths (relative to project root)
// ---------------------------------------------------------------------------

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROJECT_ROOT = path.resolve(__dirname, "../..");
const PRODUCTS_LIB_PATH = path.join(PROJECT_ROOT, "lib", "products.ts");
const PRODUCTS_JSON_DIR = path.join(PROJECT_ROOT, "scripts", "products");
const IMPORTS_RAW_DIR = path.join(PROJECT_ROOT, "imports", "raw");

/** Fixed paths for debugging — open these files if import fails */
const RAW_HTML_PATH = path.join(IMPORTS_RAW_DIR, "alibaba-page.html");
const RAW_SCREENSHOT_FULL_PATH = path.join(IMPORTS_RAW_DIR, "alibaba-page-full.png");
const RAW_SCREENSHOT_VIEWPORT_PATH = path.join(
  IMPORTS_RAW_DIR,
  "alibaba-page-viewport.png"
);

/** Anchor used to append new products without breaking the file structure */
const PRODUCTS_ARRAY_END_ANCHOR =
  "\n];\n\nexport function getProducts(): Product[]";

const DEFAULT_CATEGORY = "Outdoor Adventure";
const PAGE_TIMEOUT_MS = 90_000;

/** Random human-like pause before scraping (ms) */
const RANDOM_DELAY_MIN_MS = 2_500;
const RANDOM_DELAY_MAX_MS = 6_500;

/** Desktop viewport — typical Windows Chrome user */
const VIEWPORT = {
  width: 1366,
  height: 768,
  deviceScaleFactor: 1,
  isMobile: false,
  hasTouch: false,
  isLandscape: true,
};

/** Recent Chrome on Windows — keep in sync with Sec-CH-UA below */
const CHROME_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36";

/**
 * HTTP headers a real browser sends on navigation.
 * Helps avoid “empty shell” responses from bot-sensitive CDNs.
 */
function getRealisticHeaders() {
  return {
    Accept:
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Language": "en-US,en;q=0.9,es;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Cache-Control": "no-cache",
    Pragma: "no-cache",
    "Sec-CH-UA": '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
    "Sec-CH-UA-Mobile": "?0",
    "Sec-CH-UA-Platform": '"Windows"',
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "none",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
  };
}

/** Random integer delay — mimics a user reading the page */
function randomDelay(minMs = RANDOM_DELAY_MIN_MS, maxMs = RANDOM_DELAY_MAX_MS) {
  const ms = Math.floor(minMs + Math.random() * (maxMs - minMs + 1));
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomDelayMs(minMs = RANDOM_DELAY_MIN_MS, maxMs = RANDOM_DELAY_MAX_MS) {
  return Math.floor(minMs + Math.random() * (maxMs - minMs + 1));
}

// ---------------------------------------------------------------------------
// STEP 1 — Parse command-line arguments
// ---------------------------------------------------------------------------

function parseArgs(argv) {
  const positional = [];
  const flags = {
    dryRun: false,
    debug: false,
    category: DEFAULT_CATEGORY,
    priceOverride: null,
  };

  for (const arg of argv) {
    if (arg === "--dry-run") flags.dryRun = true;
    else if (arg === "--debug") flags.debug = true;
    else if (arg.startsWith("--category=")) {
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
      [
        "Missing Alibaba product URL.",
        "",
        "Example:",
        '  npm run import:alibaba -- "https://www.alibaba.com/product-detail/..."',
        "",
        "Add --dry-run to preview, or --debug to see the browser window.",
      ].join("\n")
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
  if (!host.includes("alibaba.com") && !host.includes("alibaba.cn")) {
    throw new Error(`"${host}" is not an Alibaba domain.`);
  }
}

// ---------------------------------------------------------------------------
// STEP 2 — Read existing catalog (duplicate prevention)
// ---------------------------------------------------------------------------

function readProductsLibContent() {
  if (!fs.existsSync(PRODUCTS_LIB_PATH)) {
    throw new Error(`Catalog not found: ${PRODUCTS_LIB_PATH}`);
  }
  return fs.readFileSync(PRODUCTS_LIB_PATH, "utf-8");
}

function extractExistingIds(content) {
  const ids = new Set();
  const re = /\bid:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(content)) !== null) ids.add(m[1]);
  return ids;
}

function extractExistingSlugs(content) {
  const slugs = new Set();
  const re = /\bslug:\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(content)) !== null) slugs.add(m[1]);
  return slugs;
}

function extractAlibabaListingId(url) {
  const m = url.match(/_(\d{6,})\.html/i) || url.match(/\/(\d{6,})\.html/i);
  return m ? m[1] : null;
}

function buildUniqueProductId(title, url, existingIds) {
  const listingId = extractAlibabaListingId(url);
  const baseSlug = slugify(title || "product", { lower: true, strict: true }).slice(
    0,
    36
  );

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
  const base = slugify(title || "product", { lower: true, strict: true }).slice(0, 80);
  if (!existingSlugs.has(base)) return base;
  for (let i = 2; i < 1000; i++) {
    const candidate = `${base}-${i}`;
    if (!existingSlugs.has(candidate)) return candidate;
  }
  throw new Error("Could not generate a unique slug.");
}

// ---------------------------------------------------------------------------
// STEP 3 — Puppeteer: stealthy Chrome session
// ---------------------------------------------------------------------------

/**
 * Patches common automation signals before any page script runs.
 * Not bulletproof, but reduces obvious `navigator.webdriver` detection.
 */
async function applyStealthMeasures(page) {
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", {
      get: () => undefined,
    });

    Object.defineProperty(navigator, "languages", {
      get: () => ["en-US", "en", "es"],
    });

    Object.defineProperty(navigator, "plugins", {
      get: () => [1, 2, 3, 4, 5],
    });

    const originalQuery = window.navigator.permissions.query;
    window.navigator.permissions.query = (parameters) =>
      parameters.name === "notifications"
        ? Promise.resolve({ state: Notification.permission })
        : originalQuery(parameters);

    window.chrome = { runtime: {} };
  });
}

/** Light mouse movement — some sites gate content on first interaction */
async function simulateHumanInteraction(page) {
  const { width, height } = VIEWPORT;
  const moves = [
    { x: 120 + Math.random() * 80, y: 200 + Math.random() * 60 },
    { x: width / 2 + Math.random() * 40, y: height / 2 },
    { x: width - 180, y: 320 + Math.random() * 40 },
  ];

  for (const point of moves) {
    await page.mouse.move(point.x, point.y, { steps: 12 + Math.floor(Math.random() * 8) });
    await randomDelay(120, 380);
  }

  await page.evaluate(() => {
    window.scrollBy({ top: 280 + Math.random() * 220, behavior: "smooth" });
  });
  await randomDelay(400, 900);
  await page.evaluate(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/**
 * Launches visible Chrome, sets realistic headers/viewport, waits for
 * networkidle2, then a random delay before returning the page for extraction.
 */
async function openAlibabaPage(url, { debug }) {
  console.log("\n🚀 STEP 3 — Launching browser (Puppeteer)…");
  console.log("   Mode: visible Chrome (headless: false)");
  if (debug) console.log("   Debug: slower actions enabled");

  const browser = await puppeteer.launch({
    headless: false,
    slowMo: debug ? 60 : 25,
    ignoreDefaultArgs: ["--enable-automation"],
    defaultViewport: null,
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-blink-features=AutomationControlled",
      `--window-size=${VIEWPORT.width},${VIEWPORT.height}`,
      "--lang=en-US,en",
      "--disable-infobars",
      "--start-maximized",
    ],
  });

  const page = await browser.newPage();
  await applyStealthMeasures(page);

  await page.setUserAgent(CHROME_USER_AGENT);
  await page.setExtraHTTPHeaders(getRealisticHeaders());
  await page.setViewport(VIEWPORT);

  console.log(`   ✓ Viewport: ${VIEWPORT.width}×${VIEWPORT.height}`);
  console.log(`   ✓ User-Agent: Chrome 131 (Windows)`);

  console.log(`\n🌐 STEP 4 — Navigating (waitUntil: networkidle2)…\n   ${url}`);

  await page.goto(url, {
    waitUntil: "networkidle2",
    timeout: PAGE_TIMEOUT_MS,
  });
  console.log("   ✓ networkidle2 reached");

  const waitSelectors = [
    "h1",
    '[class*="product-title"]',
    '[data-testid*="title"]',
    ".module-pdp-title",
  ];

  for (const sel of waitSelectors) {
    try {
      await page.waitForSelector(sel, { timeout: 12_000 });
      console.log(`   ✓ Found element: ${sel}`);
      break;
    } catch {
      console.log(`   ○ Selector not found (ok): ${sel}`);
    }
  }

  console.log("   🖱️  Simulating scroll / mouse (anti-bot)…");
  await simulateHumanInteraction(page);

  const delayMs = randomDelayMs();
  console.log(`   ⏳ Random pre-extraction delay: ${(delayMs / 1000).toFixed(1)}s…`);
  await new Promise((r) => setTimeout(r, delayMs));

  return { browser, page };
}

// ---------------------------------------------------------------------------
// STEP 5 — Save debug artifacts (HTML + screenshots)
// ---------------------------------------------------------------------------

async function saveDebugArtifacts(page) {
  console.log("\n💾 STEP 5 — Saving debug artifacts to imports/raw/…");
  await fs.ensureDir(IMPORTS_RAW_DIR);

  const html = await page.content();
  await fs.writeFile(RAW_HTML_PATH, html, "utf-8");
  console.log(`   ✓ HTML → ${path.relative(PROJECT_ROOT, RAW_HTML_PATH)}`);

  await page.screenshot({ path: RAW_SCREENSHOT_FULL_PATH, fullPage: true });
  console.log(
    `   ✓ Full-page screenshot → ${path.relative(PROJECT_ROOT, RAW_SCREENSHOT_FULL_PATH)}`
  );

  await page.screenshot({ path: RAW_SCREENSHOT_VIEWPORT_PATH, fullPage: false });
  console.log(
    `   ✓ Viewport screenshot → ${path.relative(PROJECT_ROOT, RAW_SCREENSHOT_VIEWPORT_PATH)}`
  );

  return html;
}

// ---------------------------------------------------------------------------
// STEP 6 — Extract data in the browser (with fallback selectors)
// ---------------------------------------------------------------------------

/**
 * Runs inside the page context. Tries multiple selectors per field and
 * returns which selectors failed (for beginner-friendly error messages).
 */
const EXTRACT_IN_PAGE = () => {
  const failures = { title: [], price: [], description: [], images: [] };

  function textFrom(el) {
    if (!el) return "";
    return (el.textContent || el.getAttribute("content") || "").trim();
  }

  function trySelectors(fieldName, selectors, reader) {
    for (const sel of selectors) {
      try {
        const el = document.querySelector(sel);
        const value = reader(el, sel);
        if (value) return { value, selector: sel };
        failures[fieldName].push(`${sel} (empty)`);
      } catch {
        failures[fieldName].push(`${sel} (error)`);
      }
    }
    return { value: null, selector: null };
  }

  // --- Title (fallback chain) ---
  const titleSelectors = [
    "h1",
    '[data-testid="product-title"]',
    ".product-title",
    ".module-pdp-title h1",
    '[class*="ProductTitle"]',
    'meta[property="og:title"]',
  ];

  let titleResult = trySelectors("title", titleSelectors, (el, sel) => {
    if (sel.startsWith("meta")) return el?.getAttribute("content")?.trim();
    return textFrom(el);
  });

  // --- Price (fallback chain) ---
  const priceSelectors = [
    '[class*="price"]',
    '[data-testid*="price"]',
    ".price",
    ".module-pdp-price",
    'meta[property="product:price:amount"]',
  ];

  let priceResult = trySelectors("price", priceSelectors, (el, sel) => {
    if (sel.startsWith("meta")) return el?.getAttribute("content")?.trim();
    return textFrom(el);
  });

  // --- Description (fallback chain) ---
  const descriptionSelectors = [
    '[class*="description"]',
    "#detail-decorate-root",
    ".module-pdp-description",
    'meta[property="og:description"]',
    'meta[name="description"]',
  ];

  let descriptionResult = trySelectors("description", descriptionSelectors, (el, sel) => {
    if (sel.startsWith("meta")) return el?.getAttribute("content")?.trim();
    return textFrom(el);
  });

  // --- Images: DOM + embedded JSON in scripts ---
  const imageUrls = [];

  function pushImage(raw) {
    if (!raw || typeof raw !== "string") return;
    let url = raw.trim().replace(/\\u002F/g, "/");
    if (url.startsWith("//")) url = `https:${url}`;
    if (!/^https?:\/\//i.test(url)) return;
    if (/sprite|icon|logo|badge|1x1|pixel|avatar/i.test(url)) return;
    imageUrls.push(url);
  }

  document.querySelectorAll("img").forEach((img) => {
    pushImage(img.src);
    pushImage(img.getAttribute("data-src"));
    pushImage(img.getAttribute("data-lazy-src"));
    pushImage(img.getAttribute("data-zoom-image"));
  });

  const ogImage = document.querySelector('meta[property="og:image"]');
  if (ogImage) pushImage(ogImage.getAttribute("content"));

  // Parse image lists from inline scripts (Alibaba often embeds JSON here)
  const html = document.documentElement.innerHTML;
  const listPatterns = [
    /"imagePathList"\s*:\s*(\[[^\]]+\])/,
    /"imageUrlList"\s*:\s*(\[[^\]]+\])/,
    /"imageList"\s*:\s*(\[[^\]]+\])/,
  ];

  for (const pattern of listPatterns) {
    const m = html.match(pattern);
    if (!m) continue;
    try {
      const arr = JSON.parse(m[1]);
      if (Array.isArray(arr)) arr.forEach(pushImage);
    } catch {
      /* ignore invalid JSON */
    }
  }

  const subjectMatch = html.match(/"subject"\s*:\s*"((?:\\.|[^"\\])*)"/);
  if (!titleResult.value && subjectMatch) {
    titleResult = {
      value: subjectMatch[1].replace(/\\"/g, '"').trim(),
      selector: "embedded JSON: subject",
    };
  }

  const descJson = html.match(/"description"\s*:\s*"((?:\\.|[^"\\])*)"/);
  if (!descriptionResult.value && descJson) {
    descriptionResult = {
      value: descJson[1]
        .replace(/\\"/g, '"')
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim(),
      selector: "embedded JSON: description",
    };
  }

  const priceJson = html.match(/"price(?:Min)?"\s*:\s*"?([\d.]+)"?/);
  if (!priceResult.value && priceJson) {
    priceResult = { value: priceJson[1], selector: "embedded JSON: price" };
  }

  // Deduplicate images
  const uniqueImages = [...new Set(imageUrls)];

  if (uniqueImages.length === 0) {
    failures.images.push(
      "img[src], img[data-src], og:image, embedded imagePathList/imageUrlList"
    );
  }

  return {
    title: titleResult.value,
    titleSelector: titleResult.selector,
    price: priceResult.value,
    priceSelector: priceResult.selector,
    description: descriptionResult.value,
    descriptionSelector: descriptionResult.selector,
    images: uniqueImages,
    failures,
  };
};

function parsePrice(raw) {
  if (raw == null) return null;
  const cleaned = String(raw).replace(/[^\d.,]/g, "").replace(/,/g, "");
  const n = Number.parseFloat(cleaned);
  return Number.isFinite(n) && n > 0 ? Math.round(n * 100) / 100 : null;
}

function uniqueImages(urls) {
  const seen = new Set();
  const out = [];
  for (const url of urls) {
    const key = url.split("?")[0];
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(url);
  }
  return out;
}

function normalizeExtraction(raw, sourceUrl) {
  const title = (raw.title || "").replace(/\s+/g, " ").trim();
  const price = parsePrice(raw.price);
  const description =
    (raw.description || "").replace(/\s+/g, " ").trim() ||
    `Imported from Alibaba. Source: ${sourceUrl}`;
  const images = uniqueImages(raw.images || []);

  return {
    title,
    price,
    description: description.slice(0, 4000),
    images,
    meta: {
      titleSelector: raw.titleSelector,
      priceSelector: raw.priceSelector,
      descriptionSelector: raw.descriptionSelector,
      failures: raw.failures,
    },
  };
}

function printExtractionReport(extracted, meta) {
  console.log("\n📦 STEP 6 — Extraction report");
  console.log("   title:        ", extracted.title || "(missing)");
  console.log("   title from:   ", meta.titleSelector || "—");
  console.log("   price:        ", extracted.price ?? "(missing)");
  console.log("   price from:   ", meta.priceSelector || "—");
  console.log("   description:  ", extracted.description.slice(0, 80) + "…");
  console.log("   desc from:    ", meta.descriptionSelector || "—");
  console.log("   images:       ", extracted.images.length);
  extracted.images.slice(0, 5).forEach((u, i) => console.log(`     [${i}] ${u}`));
  if (extracted.images.length > 5) {
    console.log(`     … +${extracted.images.length - 5} more`);
  }
}

function throwExtractionError(extracted, meta) {
  const problems = [];
  if (!extracted.title) problems.push("title");
  if (extracted.images.length === 0) problems.push("images");

  console.error("\n❌ Extraction failed for required field(s):", problems.join(", "));
  console.error("\n   Selectors tried (all failed or empty):");

  for (const field of problems) {
    const list = meta.failures[field] || [];
    console.error(`\n   [${field}]`);
    if (list.length === 0) console.error("     (no selectors matched)");
    else list.forEach((s) => console.error(`     • ${s}`));
  }

  console.error("\n   Debug files saved:");
  console.error(`     • ${RAW_HTML_PATH}`);
  console.error(`     • ${RAW_SCREENSHOT_FULL_PATH}`);
  console.error(`     • ${RAW_SCREENSHOT_VIEWPORT_PATH}`);
  console.error("\n   Open the HTML/screenshots in imports/raw/ and adjust selectors if needed.");
  console.error("   You can pass --price=29.99 and re-run after fixing title manually.\n");

  throw new Error(`Extraction failed: missing ${problems.join(", ")}`);
}

// ---------------------------------------------------------------------------
// STEP 7 — Generate TypeScript + JSON (same format as your catalog)
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
  if (images.length === 0) return `[]`;
  const lines = images.map((url) => `          "${escapeTsString(url)}"`);
  return `[\n${lines.join(",\n")}\n    ]`;
}

function formatFeaturesTsArray(features) {
  const lines = features.map((f) => `      "${escapeTsString(f)}",`);
  return `[\n${lines.join("\n")}\n    ]`;
}

function formatProductTsBlock(product) {
  const { id, slug, title, price, category, description, images, features } = product;
  const priceStr = (price ?? 0).toFixed(2);

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
  return {
    id,
    images: {
      featured: images[0] ? [images[0]] : [],
      gallery: images.length > 1 ? images.slice(1) : [],
      lifestyle: [],
      extras: [],
    },
  };
}

function appendProductToLib(content, productBlock) {
  const anchorIndex = content.indexOf(PRODUCTS_ARRAY_END_ANCHOR);
  if (anchorIndex === -1) {
    throw new Error(
      `Could not find PRODUCTS array end in lib/products.ts (anchor missing).`
    );
  }
  return content.slice(0, anchorIndex) + ",\n" + productBlock + content.slice(anchorIndex);
}

// ---------------------------------------------------------------------------
// MAIN
// ---------------------------------------------------------------------------

async function main() {
  const args = parseArgs(process.argv.slice(2));
  assertAlibabaUrl(args.url);

  console.log("═══════════════════════════════════════════════════");
  console.log("  Go Natural — Alibaba Importer (Puppeteer)");
  console.log("═══════════════════════════════════════════════════");
  if (args.dryRun) console.log("\n🔍 DRY RUN — catalog files will NOT be modified\n");
  if (args.debug) console.log("\n🐛 DEBUG — slowMo enabled for easier inspection\n");

  // STEP 2 — duplicate checks before we scrape
  console.log("\n📂 STEP 2 — Reading existing catalog…");
  const libContent = readProductsLibContent();
  const existingIds = extractExistingIds(libContent);
  const existingSlugs = extractExistingSlugs(libContent);
  console.log(`   ✓ Found ${existingIds.size} existing product ids`);

  const listingId = extractAlibabaListingId(args.url);
  if (listingId && existingIds.has(`gn-alibaba-${listingId}`)) {
    throw new Error(
      `Duplicate: gn-alibaba-${listingId} already exists in lib/products.ts`
    );
  }

  let browser = null;

  try {
    const session = await openAlibabaPage(args.url, { debug: args.debug });
    browser = session.browser;
    const { page } = session;

    await saveDebugArtifacts(page);

    const extractDelayMs = randomDelayMs(800, 2_200);
    console.log(
      `\n🔎 STEP 6 — Extracting product data (after ${(extractDelayMs / 1000).toFixed(1)}s pause)…`
    );
    await new Promise((r) => setTimeout(r, extractDelayMs));
    const raw = await page.evaluate(EXTRACT_IN_PAGE);
    const extracted = normalizeExtraction(raw, args.url);
    printExtractionReport(extracted, extracted.meta);

    if (!extracted.title || extracted.images.length === 0) {
      throwExtractionError(extracted, extracted.meta);
    }

    if (extracted.price == null) {
      console.warn(
        "\n⚠️  Price not found — use --price=29.99 or edit lib/products.ts after import."
      );
      if (metaFailures(extracted.meta, "price")) {
        console.warn("   Failed price selectors:");
        (extracted.meta.failures.price || []).forEach((s) =>
          console.warn(`     • ${s}`)
        );
      }
    }

    const price =
      args.priceOverride != null ? args.priceOverride : extracted.price ?? 0;

    const id = buildUniqueProductId(extracted.title, args.url, existingIds);
    const slug = buildUniqueSlug(extracted.title, existingSlugs);

    if (existingIds.has(id)) throw new Error(`Duplicate product id: ${id}`);

    const jsonPath = path.join(PRODUCTS_JSON_DIR, `${id}.json`);
    if (fs.existsSync(jsonPath)) {
      throw new Error(`Duplicate JSON already exists: ${jsonPath}`);
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
    const jsonPayload = buildProductJsonFile({ id, images: extracted.images });

    console.log("\n📝 STEP 7 — Generated catalog block (preview)");
    console.log("─".repeat(52));
    console.log(productBlock);
    console.log("─".repeat(52));
    console.log("\n📝 scripts/products/" + id + ".json");
    console.log(JSON.stringify(jsonPayload, null, 2));

    if (args.dryRun) {
      console.log("\n✅ Dry run complete. Remove --dry-run to write files.\n");
      return;
    }

    console.log("\n💾 STEP 8 — Writing files (with backup)…");
    const libBackupPath = `${PRODUCTS_LIB_PATH}.bak-${Date.now()}`;
    await fs.copy(PRODUCTS_LIB_PATH, libBackupPath);
    console.log(`   ✓ Backup → ${path.relative(PROJECT_ROOT, libBackupPath)}`);

    try {
      await fs.writeFile(PRODUCTS_LIB_PATH, updatedLib, "utf-8");
      console.log("   ✓ Updated lib/products.ts");

      await fs.ensureDir(PRODUCTS_JSON_DIR);
      await fs.writeFile(jsonPath, `${JSON.stringify(jsonPayload, null, 2)}\n`, "utf-8");
      console.log(`   ✓ Created scripts/products/${id}.json`);
    } catch (writeErr) {
      console.error("   ↩ Restoring backup…");
      await fs.copy(libBackupPath, PRODUCTS_LIB_PATH);
      throw writeErr;
    }

    console.log("\n✅ Import complete!");
    console.log(`   PDP: /es/products/${id}`);
    console.log("   Next: verify price, category, translations, and image URLs.\n");
  } finally {
    // STEP 9 — Always close the browser (even if an error occurred)
    if (browser) {
      console.log("🔒 Closing browser…");
      try {
        await browser.close();
        console.log("   ✓ Browser closed.\n");
      } catch (closeErr) {
        console.warn("   ⚠ Could not close browser cleanly:", closeErr.message);
      }
    }
  }
}

function metaFailures(meta, field) {
  return meta?.failures?.[field]?.length > 0;
}

main().catch((err) => {
  console.error("\n❌ Import failed:");
  console.error(err instanceof Error ? err.message : err);
  if (process.env.DEBUG && err?.stack) console.error(err.stack);
  process.exitCode = 1;
});
