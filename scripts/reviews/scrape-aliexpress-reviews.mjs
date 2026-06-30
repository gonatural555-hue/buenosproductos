import { chromium } from "playwright";
import {
  extractItemIdFromUrl,
  normalizeAliExpressPayloads,
} from "./normalize-reviews.mjs";

const FEEDBACK_URL_RE =
  /mtop\.aliexpress\.review\.pc\.list|feedback|review\.pc\.list|evaluation|mtop\.aliexpress\.(itemdetail\.feedback|review)/i;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function tryParseJsonResponse(response) {
  const contentType = response.headers()["content-type"] || "";
  if (!/json|javascript|text/i.test(contentType)) return null;

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
  } catch {
    return null;
  }
  return null;
}

export async function openScraperSession({ headless = true } = {}) {
  const browser = await chromium.launch({ headless });
  const context = await browser.newContext({
    locale: "es-AR",
    userAgent:
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
    viewport: { width: 1366, height: 900 },
  });
  return { browser, context };
}

export async function closeScraperSession(session) {
  if (session?.browser) {
    await session.browser.close().catch(() => {});
  }
}

async function scrapeOnPage(page, listingUrl, maxReviews, minRating, debug) {
  const captured = [];
  let pending = 0;

  const onResponse = (response) => {
    const url = response.url();
    if (!FEEDBACK_URL_RE.test(url)) return;

    pending += 1;
    void tryParseJsonResponse(response)
      .then((json) => {
        if (json) {
          if (debug) console.log(`  [capture] ${url.slice(0, 120)}`);
          captured.push(json);
        }
      })
      .finally(() => {
        pending -= 1;
      });
  };

  page.on("response", onResponse);

  const cleanUrl = listingUrl.split("#")[0];

  try {
    await page.goto(cleanUrl, {
      waitUntil: "domcontentloaded",
      timeout: 90_000,
    });

    await sleep(2500);

    for (let i = 0; i < 10; i++) {
      await page.mouse.wheel(0, 750);
      await sleep(500);
    }

    const reviewTabSelectors = [
      '[data-pl="product-reviewer"]',
      'text=/reseñas del producto|customer reviews|opiniones/i',
      'a[href*="review"]',
    ];

    for (const selector of reviewTabSelectors) {
      const el = page.locator(selector).first();
      if (await el.isVisible({ timeout: 1000 }).catch(() => false)) {
        await el.click({ timeout: 3000 }).catch(() => {});
        await sleep(2000);
        break;
      }
    }

    for (let i = 0; i < 4; i++) {
      await page.mouse.wheel(0, 600);
      await sleep(400);
    }

    // Esperar respuestas async del listener
    const deadline = Date.now() + 8000;
    while (pending > 0 && Date.now() < deadline) {
      await sleep(200);
    }
    await sleep(1500);
  } finally {
    page.off("response", onResponse);
  }

  if (debug && captured.length === 0) {
    console.warn("  [debug] Sin JSON de reviews — probá --no-headless");
  }

  return normalizeAliExpressPayloads(captured, maxReviews, { minRating });
}

/**
 * @param {string} listingUrl
 * @param {{ maxReviews?: number, minRating?: number, headless?: boolean, debug?: boolean, session?: { browser: import('playwright').Browser, context: import('playwright').BrowserContext } }} options
 */
export async function scrapeAliExpressReviews(
  listingUrl,
  {
    maxReviews = 20,
    minRating = 4,
    headless = true,
    debug = false,
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
    let reviews = await scrapeOnPage(
      page,
      listingUrl,
      maxReviews,
      minRating,
      debug
    );

    if (reviews.length === 0) {
      if (debug) console.log("  [retry] segunda pasada en la misma pestaña...");
      await sleep(3000);
      reviews = await scrapeOnPage(
        page,
        listingUrl,
        maxReviews,
        minRating,
        debug
      );
    }

    return reviews;
  } finally {
    await page.close().catch(() => {});
    if (ownsSession) {
      await closeScraperSession(activeSession);
    }
  }
}
