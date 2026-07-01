import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { chromium } from "playwright";
import {
  extractItemIdFromUrl,
  normalizeAliExpressPayloads,
} from "./normalize-reviews.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEBUG_DIR = path.join(__dirname, "debug");

const FEEDBACK_URL_RE =
  /mtop\.aliexpress\.(review|itemdetail)|feedback\.aliexpress|searchEvaluation|review\.pc\.list|evaluation|pcTradeReviews|buyerShow/i;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function tryParseJsonResponse(response) {
  const contentType = response.headers()["content-type"] || "";
  if (!/json|javascript|text|html/i.test(contentType)) return null;

  try {
    const text = await response.text();
    if (!text?.trim()) return null;

    if (text.trimStart().startsWith("{") || text.trimStart().startsWith("[")) {
      return JSON.parse(text);
    }

    const jsonp = text.match(/^[^(]+\((.*)\)\s*;?\s*$/s);
    if (jsonp) {
      return JSON.parse(jsonp[1]);
    }

    const embedded = text.match(/"evaViewList"\s*:\s*\[/);
    if (embedded) {
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start >= 0 && end > start) {
        return JSON.parse(text.slice(start, end + 1));
      }
    }
  } catch {
    return null;
  }
  return null;
}

export async function openScraperSession({ headless = true } = {}) {
  const browser = await chromium.launch({
    headless,
    args: headless ? ["--disable-blink-features=AutomationControlled"] : [],
  });
  const context = await browser.newContext({
    locale: "es-AR",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    viewport: { width: 1366, height: 900 },
  });
  await context.addInitScript(() => {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
  });
  return { browser, context };
}

export async function closeScraperSession(session) {
  if (session?.browser) {
    await session.browser.close().catch(() => {});
  }
}

async function tryClickReviewSection(page) {
  const reviewTabSelectors = [
    '[data-pl="product-reviewer"]',
    'text=/reseñas del producto|customer reviews|opiniones|reviews/i',
    'a[href*="review"]',
    '#nav-review',
  ];

  for (const selector of reviewTabSelectors) {
    const el = page.locator(selector).first();
    if (await el.isVisible({ timeout: 1200 }).catch(() => false)) {
      await el.click({ timeout: 3000 }).catch(() => {});
      await sleep(2000);
      return true;
    }
  }
  return false;
}

async function tryClickWithPhotosFilter(page) {
  const photoFilterSelectors = [
    'text=/con foto|con imagen|with photo|with picture|with image|photos only|imágenes/i',
    '[data-filter="image"]',
    '[data-filter="withPhoto"]',
    'button:has-text("photo")',
    'span:has-text("photo")',
  ];

  for (const selector of photoFilterSelectors) {
    const el = page.locator(selector).first();
    if (await el.isVisible({ timeout: 1200 }).catch(() => false)) {
      await el.click({ timeout: 3000 }).catch(() => {});
      await sleep(2500);
      return true;
    }
  }
  return false;
}

async function fetchPcReviewPages(page, productId, maxReviews, debug) {
  const payloads = [];
  const pageSize = 20;
  const maxPages = Math.max(1, Math.ceil(maxReviews / pageSize));
  const filters = ["image", "all"];

  for (const filter of filters) {
    for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
      const apiUrl =
        `https://feedback.aliexpress.com/pc/searchEvaluation.do` +
        `?productId=${productId}` +
        `&lang=es_ES&country=AR&page=${pageNum}&pageSize=${pageSize}` +
        `&filter=${filter}&sort=complex_default`;

      const json = await page
        .evaluate(async (url) => {
          try {
            const res = await fetch(url, {
              credentials: "include",
              headers: { accept: "application/json,text/plain,*/*" },
            });
            const text = await res.text();
            if (!text?.trim()) return null;
            if (text.trimStart().startsWith("{")) return JSON.parse(text);
            const jsonp = text.match(/^[^(]+\((.*)\)\s*;?\s*$/s);
            if (jsonp) return JSON.parse(jsonp[1]);
            const start = text.indexOf("{");
            const end = text.lastIndexOf("}");
            if (start >= 0 && end > start) return JSON.parse(text.slice(start, end + 1));
            return null;
          } catch {
            return null;
          }
        }, apiUrl)
        .catch(() => null);

      if (json) {
        if (debug) {
          console.log(`  [api] filter=${filter} page=${pageNum}`);
        }
        payloads.push(json);
      } else if (debug) {
        console.warn(`  [api] vacío filter=${filter} page=${pageNum}`);
      }

      await sleep(400);
    }
  }

  return payloads;
}

async function scrapeDomReviewImages(page) {
  return page
    .evaluate(() => {
      const urls = new Set();
      const imgs = document.querySelectorAll(
        'img[src*="alicdn.com"], img[data-src*="alicdn.com"]'
      );
      for (const img of imgs) {
        const src = img.getAttribute("src") || img.getAttribute("data-src") || "";
        if (
          src.includes("alicdn.com") &&
          !/_220x220|avatar|profile/i.test(src)
        ) {
          urls.add(src.startsWith("//") ? `https:${src}` : src);
        }
      }
      return Array.from(urls);
    })
    .catch(() => []);
}

async function waitForPending(pendingRef, ms = 8000) {
  const deadline = Date.now() + ms;
  while (pendingRef.pending > 0 && Date.now() < deadline) {
    await sleep(200);
  }
  await sleep(1500);
}

async function scrapeOnPage(page, listingUrl, productId, maxReviews, minRating, debug) {
  const captured = [];
  const pendingRef = { pending: 0 };

  const onResponse = (response) => {
    const url = response.url();
    if (!FEEDBACK_URL_RE.test(url)) return;

    pendingRef.pending += 1;
    void tryParseJsonResponse(response)
      .then((json) => {
        if (json) {
          if (debug) console.log(`  [capture] ${url.slice(0, 140)}`);
          captured.push(json);
        }
      })
      .finally(() => {
        pendingRef.pending -= 1;
      });
  };

  page.on("response", onResponse);

  const cleanUrl = listingUrl.split("#")[0];

  try {
    await page.goto(cleanUrl, {
      waitUntil: "domcontentloaded",
      timeout: 90_000,
    });

    await sleep(3000);

    for (let i = 0; i < 8; i++) {
      await page.mouse.wheel(0, 700);
      await sleep(450);
    }

    await tryClickReviewSection(page);

    for (let i = 0; i < 3; i++) {
      await page.mouse.wheel(0, 500);
      await sleep(350);
    }

    await waitForPending(pendingRef);

    await tryClickWithPhotosFilter(page);

    for (let i = 0; i < 3; i++) {
      await page.mouse.wheel(0, 500);
      await sleep(350);
    }

    await waitForPending(pendingRef);

    const apiPayloads = await fetchPcReviewPages(
      page,
      productId,
      maxReviews,
      debug
    );
    captured.push(...apiPayloads);

    if (debug && captured.length === 0) {
      console.warn("  [debug] Sin JSON de reviews — probá --no-headless");
    }

    let reviews = normalizeAliExpressPayloads(captured, maxReviews, {
      minRating,
      preferWithImages: true,
    });

    if (reviews.every((r) => (r.images?.length ?? 0) === 0)) {
      const domUrls = await scrapeDomReviewImages(page);
      if (debug && domUrls.length > 0) {
        console.log(`  [dom] ${domUrls.length} img alicdn en página (fallback)`);
      }
      if (domUrls.length > 0 && reviews.length > 0) {
        reviews = reviews.map((review, index) => {
          if ((review.images?.length ?? 0) > 0) return review;
          const url = domUrls[index];
          return url ? { ...review, images: [url] } : review;
        });
      }
    }

    return { reviews, captured };
  } finally {
    page.off("response", onResponse);
  }
}

/**
 * @param {string} listingUrl
 * @param {{ maxReviews?: number, minRating?: number, headless?: boolean, debug?: boolean, dumpJson?: string | null, session?: { browser: import('playwright').Browser, context: import('playwright').BrowserContext } }} options
 */
export async function scrapeAliExpressReviews(
  listingUrl,
  {
    maxReviews = 20,
    minRating = 4,
    headless = true,
    debug = false,
    dumpJson = null,
    session = null,
  } = {}
) {
  const itemId = extractItemIdFromUrl(listingUrl);
  if (!itemId) {
    throw new Error(`No se pudo extraer item id de: ${listingUrl}`);
  }

  const ownsSession = !session;
  const activeSession = session ?? (await openScraperSession({ headless }));
  const page = await activeSession.context.newPage();

  try {
    let result = await scrapeOnPage(
      page,
      listingUrl,
      itemId,
      maxReviews,
      minRating,
      debug
    );

    if (result.reviews.length === 0) {
      if (debug) console.log("  [retry] segunda pasada...");
      await sleep(3000);
      result = await scrapeOnPage(
        page,
        listingUrl,
        itemId,
        maxReviews,
        minRating,
        debug
      );
    }

    if (dumpJson && result.captured.length > 0) {
      fs.mkdirSync(DEBUG_DIR, { recursive: true });
      const outPath = path.join(DEBUG_DIR, dumpJson);
      fs.writeFileSync(outPath, JSON.stringify(result.captured, null, 2), "utf8");
      if (debug) console.log(`  [dump] ${outPath}`);
    }

    return result.reviews;
  } finally {
    await page.close().catch(() => {});
    if (ownsSession) {
      await closeScraperSession(activeSession);
    }
  }
}
