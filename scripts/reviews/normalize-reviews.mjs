const REVIEW_ARRAY_KEYS = new Set([
  "evaViewList",
  "evaluations",
  "evaluationList",
  "feedbacks",
  "feedbackList",
  "reviewList",
  "reviews",
  "pcTradeReviews",
  "tradeReviewList",
  "buyerReviewList",
  "buyerShowReviewList",
  "items",
  "list",
  "result",
  "data",
]);

const BODY_KEYS = [
  "buyerFeedback",
  "buyerAddFbFeedback",
  "feedback",
  "content",
  "reviewContent",
  "text",
  "comment",
  "body",
];

const TRANSLATION_KEYS = ["buyerTranslationFeedback", "translationFeedback"];

const NAME_KEYS = [
  "buyerName",
  "buyerLoginId",
  "anonymousName",
  "displayName",
  "author",
  "userName",
];

const COUNTRY_KEYS = ["buyerCountry", "country", "buyerCountryName"];

const DATE_KEYS = [
  "evalDate",
  "gmtCreate",
  "gmtEvaluated",
  "buyerAddFbTime",
  "feedbackDate",
  "reviewDate",
  "createTime",
  "created_at",
  "date",
];

const RATING_KEYS = [
  "buyerEval",
  "buyerStar",
  "star",
  "starLevel",
  "rating",
  "score",
  "evalStar",
  "evaluationRating",
];

const EXTERNAL_ID_KEYS = [
  "feedbackId",
  "reviewId",
  "id",
  "evaluationId",
  "buyerFeedbackId",
];

const IMAGE_FIELD_KEYS = [
  "images",
  "buyerAddFbPhotos",
  "buyerPhotos",
  "reviewPhotos",
  "photos",
  "imageList",
  "feedbackImages",
  "imgUrlList",
  "thumbnailList",
  "buyerAddFbPhotoDTOList",
  "aeFeedbackImgs",
  "reviewImgList",
  "picList",
  "mediaList",
  "buyerShowPhotoList",
  "evaluationImages",
  "reviewImages",
  "review_images",
  "image_urls",
  "thumbnails",
  "thumbnailUrls",
  "buyerShowPhoto",
  "imgPaths",
  "imagePathList",
  "photoList",
  "reviewImageList",
  "feedbackImgs",
  "buyerReviewImages",
];

const IMAGE_URL_KEYS = [
  "imgUrl",
  "imageUrl",
  "url",
  "photoUrl",
  "src",
  "thumbnail",
  "thumbnailUrl",
  "picUrl",
  "image",
  "photo",
  "cover",
];

const MAX_IMAGES_PER_REVIEW = 6;

const ALICDN_URL_RE =
  /https?:\/\/[^"'\\s]+?alicdn\.com[^"'\\s]*/gi;
const ALICDN_PROTOCOL_REL_RE =
  /\/\/[^"'\\s]+?alicdn\.com[^"'\\s]*/gi;

const SKIP_DEEP_SCAN_KEYS = new Set([
  "buyerFeedback",
  "buyerAddFbFeedback",
  "buyerTranslationFeedback",
  "translationFeedback",
  "feedback",
  "content",
  "reviewContent",
  "text",
  "comment",
  "body",
  "buyerName",
  "buyerLoginId",
  "skuInfo",
]);

function normalizeImageUrl(raw) {
  if (typeof raw !== "string") return null;
  let url = raw.trim().replace(/\\u002F/g, "/");
  if (!url) return null;
  if (url.startsWith("//")) url = `https:${url}`;
  if (!/^https?:\/\//i.test(url)) return null;
  if (/\.(svg|ico)(\?|$)/i.test(url)) return null;
  if (/profile_picture|avatar|UT8[A-Z0-9]{2,}/i.test(url) && /_220x220|avatar/i.test(url)) {
    return null;
  }
  return url;
}

function collectImageUrlsFromValue(value, out, seen) {
  if (value == null) return;

  if (typeof value === "string") {
    const parts =
      value.includes(",") || value.includes(";") ? value.split(/[,;]/) : [value];
    for (const part of parts) {
      const url = normalizeImageUrl(part);
      if (url && !seen.has(url)) {
        seen.add(url);
        out.push(url);
      }
    }
    extractAlicdnUrlsFromString(value, out, seen);
    return;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      collectImageUrlsFromValue(item, out, seen);
    }
    return;
  }

  if (typeof value === "object") {
    for (const key of IMAGE_URL_KEYS) {
      if (key in value) {
        collectImageUrlsFromValue(value[key], out, seen);
      }
    }
  }
}

function extractAlicdnUrlsFromString(text, out, seen) {
  if (typeof text !== "string" || !text.includes("alicdn")) return;
  const matches = [
    ...(text.match(ALICDN_URL_RE) ?? []),
    ...(text.match(ALICDN_PROTOCOL_REL_RE) ?? []),
  ];
  for (const match of matches) {
    const url = normalizeImageUrl(match);
    if (url && !seen.has(url)) {
      seen.add(url);
      out.push(url);
    }
  }
}

function deepScanReviewImages(obj, out, seen, depth = 0) {
  if (obj == null || depth > 6) return;

  if (typeof obj === "string") {
    extractAlicdnUrlsFromString(obj, out, seen);
    return;
  }

  if (Array.isArray(obj)) {
    for (const item of obj) deepScanReviewImages(item, out, seen, depth + 1);
    return;
  }

  if (typeof obj !== "object") return;

  for (const [key, value] of Object.entries(obj)) {
    if (SKIP_DEEP_SCAN_KEYS.has(key)) continue;
    if (IMAGE_FIELD_KEYS.includes(key)) {
      collectImageUrlsFromValue(value, out, seen);
      continue;
    }
    deepScanReviewImages(value, out, seen, depth + 1);
  }
}

function dedupeThumbnailVariants(urls) {
  const byBase = new Map();
  for (const url of urls) {
    const base = url.replace(/_\d+x\d+(\.[a-z]+)(\?.*)?$/i, "$1$2");
    const existing = byBase.get(base);
    const isThumb = /_\d+x\d+\.[a-z]+(\?.*)?$/i.test(url);
    if (!existing) {
      byBase.set(base, url);
      continue;
    }
    const existingIsThumb = /_\d+x\d+\.[a-z]+(\?.*)?$/i.test(existing);
    if (existingIsThumb && !isThumb) {
      byBase.set(base, url);
    }
  }
  return Array.from(byBase.values());
}

function pickReviewImages(obj) {
  const out = [];
  const seen = new Set();

  for (const key of IMAGE_FIELD_KEYS) {
    if (key in obj) {
      collectImageUrlsFromValue(obj[key], out, seen);
    }
  }

  deepScanReviewImages(obj, out, seen);

  return dedupeThumbnailVariants(out).slice(0, MAX_IMAGES_PER_REVIEW);
}

function mergeImageLists(...lists) {
  const out = [];
  const seen = new Set();
  for (const list of lists) {
    for (const raw of list ?? []) {
      const url = normalizeImageUrl(raw);
      if (url && !seen.has(url)) {
        seen.add(url);
        out.push(url);
      }
    }
  }
  return out.slice(0, MAX_IMAGES_PER_REVIEW);
}

function pickString(obj, keys) {
  for (const key of keys) {
    const v = obj?.[key];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return null;
}

function pickNumber(obj, keys) {
  for (const key of keys) {
    const v = obj?.[key];
    if (typeof v === "number" && Number.isFinite(v)) return v;
    if (typeof v === "string" && v.trim() && !Number.isNaN(Number(v))) {
      return Number(v);
    }
  }
  return null;
}

function pickExternalId(obj) {
  for (const key of EXTERNAL_ID_KEYS) {
    const v = obj?.[key];
    if (v == null || v === "") continue;
    if (typeof v === "string" || typeof v === "number") {
      const s = String(v).trim();
      if (s && s !== "0") return s;
    }
  }
  return null;
}

/** AliExpress usa 20–100 (×20) o 1–5 según endpoint. */
export function normalizeRating(raw) {
  if (raw == null || Number.isNaN(Number(raw))) return null;
  const n = Number(raw);
  if (n >= 1 && n <= 5) return Math.round(n);
  if (n > 5 && n <= 10) return Math.min(5, Math.max(1, Math.round(n / 2)));
  if (n > 10 && n <= 100) return Math.min(5, Math.max(1, Math.round(n / 20)));
  return null;
}

function parseDate(raw) {
  if (raw == null) return null;
  if (typeof raw === "number") {
    const ms = raw < 1e12 ? raw * 1000 : raw;
    const d = new Date(ms);
    return Number.isNaN(d.getTime()) ? null : d.toISOString();
  }
  const s = String(raw).trim();
  if (!s) return null;
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

/** Fingerprint para dedup (ignora mayúsculas / espacios). */
export function textFingerprint(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .replace(/[^\p{L}\p{N}]+/gu, " ")
    .trim()
    .slice(0, 240);
}

function wordOverlapRatio(a, b) {
  const wordsA = textFingerprint(a).split(/\s+/).filter((w) => w.length > 2);
  const wordsB = textFingerprint(b).split(/\s+/).filter((w) => w.length > 2);
  if (wordsA.length === 0 || wordsB.length === 0) return 0;
  const setB = new Set(wordsB);
  let overlap = 0;
  for (const w of wordsA) {
    if (setB.has(w)) overlap += 1;
  }
  return overlap / Math.min(wordsA.length, wordsB.length);
}

/** Una sola versión del texto — evita EN en body + ES en title. */
function pickReviewBody(obj) {
  const original = pickString(obj, BODY_KEYS);
  const translation = pickString(obj, TRANSLATION_KEYS);

  if (original && translation) {
    if (wordOverlapRatio(original, translation) >= 0.45) {
      return original;
    }
    return original.length >= translation.length ? original : translation;
  }

  return original || translation;
}

function dedupKey(mapped) {
  if (mapped.external_id) {
    return `id:${mapped.external_id}`;
  }
  return `fp:${textFingerprint(mapped.body)}|${mapped.rating}`;
}

function looksLikeReview(obj) {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) return false;
  const rating = normalizeRating(pickNumber(obj, RATING_KEYS));
  const body = pickReviewBody(obj);
  return Boolean(rating && body && body.length >= 3);
}

function mapReview(obj) {
  const rating = normalizeRating(pickNumber(obj, RATING_KEYS));
  const body = pickReviewBody(obj);
  if (!rating || !body) return null;

  const author =
    pickString(obj, NAME_KEYS) ||
    (obj.anonymous === true || obj.buyerAnonymous === true
      ? "AliExpress buyer"
      : "AliExpress buyer");
  const country = pickString(obj, COUNTRY_KEYS);
  const created_at =
    parseDate(pickNumber(obj, DATE_KEYS) ?? pickString(obj, DATE_KEYS)) ??
    new Date().toISOString();
  const external_id = pickExternalId(obj);
  const images = pickReviewImages(obj);

  return {
    rating,
    title: null,
    body: body.slice(0, 4000),
    author_name: author.slice(0, 120),
    country: country?.slice(0, 80) ?? null,
    external_id,
    created_at,
    images,
  };
}

function tryAddReview(mapped, out, seen, indexByKey) {
  if (!mapped) return;
  const key = dedupKey(mapped);
  if (seen.has(key)) {
    const idx = indexByKey.get(key);
    if (idx != null) {
      out[idx] = {
        ...out[idx],
        images: mergeImageLists(out[idx].images, mapped.images),
      };
    }
    return;
  }
  seen.add(key);
  indexByKey.set(key, out.length);
  out.push(mapped);
}

function collectReviewsFromNode(node, out, seen, indexByKey) {
  if (node == null) return;

  if (Array.isArray(node)) {
    for (const item of node) {
      if (looksLikeReview(item)) {
        tryAddReview(mapReview(item), out, seen, indexByKey);
      }
      collectReviewsFromNode(item, out, seen, indexByKey);
    }
    return;
  }

  if (typeof node !== "object") return;

  for (const [key, value] of Object.entries(node)) {
    if (REVIEW_ARRAY_KEYS.has(key) && Array.isArray(value)) {
      collectReviewsFromNode(value, out, seen, indexByKey);
    }
  }

  if (looksLikeReview(node)) {
    tryAddReview(mapReview(node), out, seen, indexByKey);
  }

  for (const value of Object.values(node)) {
    if (value && typeof value === "object") {
      collectReviewsFromNode(value, out, seen, indexByKey);
    }
  }
}

/**
 * @param {unknown[]} payloads
 * @param {number} maxReviews
 * @param {{ minRating?: number, preferWithImages?: boolean }} options
 */
export function normalizeAliExpressPayloads(
  payloads,
  maxReviews = 20,
  { minRating = 4, preferWithImages = false } = {}
) {
  const out = [];
  const seen = new Set();
  const indexByKey = new Map();

  for (const payload of payloads) {
    collectReviewsFromNode(payload, out, seen, indexByKey);
  }

  const min = Math.max(1, Math.min(5, minRating));

  const filtered = out
    .filter((r) => r.rating >= min)
    .sort((a, b) => {
      if (preferWithImages) {
        const aImg = (a.images?.length ?? 0) > 0 ? 1 : 0;
        const bImg = (b.images?.length ?? 0) > 0 ? 1 : 0;
        if (aImg !== bImg) return bImg - aImg;
      }
      return new Date(b.created_at) - new Date(a.created_at);
    });

  return filtered.slice(0, maxReviews);
}

export function extractItemIdFromUrl(listingUrl) {
  const match = String(listingUrl).match(/\/item\/(\d+)\.html/i);
  return match?.[1] ?? null;
}
