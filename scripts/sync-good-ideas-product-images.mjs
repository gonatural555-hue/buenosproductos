#!/usr/bin/env node
/**
 * Sincroniza `scripts/good-ideas-products/{id}.images.json` → `{id}.json`
 *
 * Uso:
 *   node scripts/sync-good-ideas-product-images.mjs gi-hogar-010
 *   node scripts/sync-good-ideas-product-images.mjs --all
 *
 * Reglas:
 * - Si un slot tiene `url` no vacía, se usa la URL en el JSON del producto.
 * - Si `url` está vacía y hay `file`, se usa `{localBasePath}/{file}`.
 * - Los kits se escriben en images.variantImages.{kitValue}.
 */

import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const GI_DIR = path.join(ROOT, "scripts", "good-ideas-products");

function resolveSlot(slot, localBasePath) {
  if (!slot) return null;
  const url = typeof slot.url === "string" ? slot.url.trim() : "";
  if (url) return url;
  const file = typeof slot.file === "string" ? slot.file.trim() : "";
  if (!file) return null;
  const base = (localBasePath || "").replace(/\/$/, "");
  return `${base}/${file}`;
}

function resolveSlotList(items, localBasePath) {
  if (!Array.isArray(items)) return [];
  return items.map((item) => resolveSlot(item, localBasePath)).filter(Boolean);
}

function buildKitVariantImages(kits, localBasePath) {
  if (!kits || typeof kits !== "object") return undefined;

  const variantImages = {};

  for (const [value, kit] of Object.entries(kits)) {
    const featured = resolveSlot(kit.featured, localBasePath);
    const gallery = resolveSlotList(kit.gallery, localBasePath);

    if (!featured && gallery.length === 0) {
      variantImages[value] = {
        featured: [],
        gallery: [],
        lifestyle: [],
        extras: [],
      };
      continue;
    }

    variantImages[value] = {
      featured: featured ? [featured] : [],
      gallery,
      lifestyle: [],
      extras: [],
    };
  }

  return Object.keys(variantImages).length > 0 ? variantImages : undefined;
}

function syncProductImages(productId) {
  const imagesPath = path.join(GI_DIR, `${productId}.images.json`);
  const productPath = path.join(GI_DIR, `${productId}.json`);

  if (!fs.existsSync(imagesPath)) {
    console.error(`❌ No existe: ${imagesPath}`);
    return false;
  }
  if (!fs.existsSync(productPath)) {
    console.error(`❌ No existe: ${productPath}`);
    return false;
  }

  const imagesManifest = JSON.parse(fs.readFileSync(imagesPath, "utf-8"));
  const productJson = JSON.parse(fs.readFileSync(productPath, "utf-8"));

  if (imagesManifest.productId && imagesManifest.productId !== productId) {
    console.warn(
      `⚠️  productId en manifest (${imagesManifest.productId}) ≠ argumento (${productId})`
    );
  }

  const localBasePath =
    imagesManifest.localBasePath ||
    `/assets/images/good-ideas-products/${productId}`;

  const featured = resolveSlot(imagesManifest.featured, localBasePath);
  const gallery = resolveSlotList(imagesManifest.gallery, localBasePath);
  const lifestyle = Array.isArray(imagesManifest.lifestyle)
    ? imagesManifest.lifestyle.filter((u) => typeof u === "string" && u.trim())
    : [];
  const extras = Array.isArray(imagesManifest.extras)
    ? imagesManifest.extras.filter((u) => typeof u === "string" && u.trim())
    : [];

  productJson.images = productJson.images || {};
  productJson.images.featured = featured ? [featured] : productJson.images.featured || [];
  productJson.images.gallery = gallery.length > 0 ? gallery : productJson.images.gallery || [];
  productJson.images.lifestyle = lifestyle;
  productJson.images.extras = extras;

  const kitVariantImages = buildKitVariantImages(
    imagesManifest.kits,
    localBasePath
  );
  if (kitVariantImages) {
    productJson.images.variantImages = kitVariantImages;
  }

  fs.writeFileSync(productPath, `${JSON.stringify(productJson, null, 2)}\n`, "utf-8");
  console.log(`✅ Sincronizado → scripts/good-ideas-products/${productId}.json`);
  return true;
}

function listImageManifests() {
  return fs
    .readdirSync(GI_DIR)
    .filter((name) => name.endsWith(".images.json"))
    .map((name) => name.replace(/\.images\.json$/, ""));
}

const arg = process.argv[2];

if (!arg) {
  console.log("Uso: node scripts/sync-good-ideas-product-images.mjs <productId|--all>");
  console.log("Manifiestos:", listImageManifests().join(", ") || "(ninguno)");
  process.exit(1);
}

if (arg === "--all") {
  const ids = listImageManifests();
  let ok = 0;
  for (const id of ids) {
    if (syncProductImages(id)) ok += 1;
  }
  console.log(`\n${ok}/${ids.length} productos sincronizados.`);
  process.exit(ok === ids.length ? 0 : 1);
}

const success = syncProductImages(arg);
process.exit(success ? 0 : 1);
