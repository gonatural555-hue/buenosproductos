/**
 * Normaliza variantImages en JSON de producto al formato:
 *   variantImages.color.{colorValue}.{featured,gallery,lifestyle,extras}
 *
 * Solo aplica a productos con variante type "color" en variants del JSON
 * o con mapa plano de colores existente (sin claves model-/series).
 *
 * Uso: node scripts/sync-color-variant-images.mjs
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PRODUCTS_DIR = path.join(__dirname, "products");

function emptyImageSet() {
  return {
    featured: [],
    gallery: [],
    lifestyle: [],
    extras: [],
  };
}

function isImageSet(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return (
    "featured" in value ||
    "gallery" in value ||
    "lifestyle" in value ||
    "extras" in value
  );
}

function normalizeImageSet(value) {
  if (Array.isArray(value)) {
    return {
      featured: value.length > 0 ? [value[0]] : [],
      gallery: [...value],
      lifestyle: [],
      extras: [],
    };
  }
  if (isImageSet(value)) {
    return {
      featured: Array.isArray(value.featured) ? [...value.featured] : [],
      gallery: Array.isArray(value.gallery) ? [...value.gallery] : [],
      lifestyle: Array.isArray(value.lifestyle) ? [...value.lifestyle] : [],
      extras: Array.isArray(value.extras) ? [...value.extras] : [],
    };
  }
  return emptyImageSet();
}

function getColorVariant(json) {
  const variants = json.variants;
  const arr = Array.isArray(variants) ? variants : variants ? [variants] : [];
  return arr.find((v) => v && v.type === "color");
}

function isNonColorFlatKey(key) {
  return (
    key.startsWith("model-") ||
    key === "series" ||
    /^\d+$/.test(key) ||
    key.includes("valve") ||
    key.includes("mm")
  );
}

function migrateJson(json) {
  const colorVariant = getColorVariant(json);
  const vi = json.variantImages;
  const colorValuesFromVariant =
    colorVariant?.options?.map((o) => o.value).filter(Boolean) ?? [];

  const existingColorMap = {};
  const preserveTopLevel = {};

  if (vi && typeof vi === "object") {
    if (vi.color && typeof vi.color === "object" && !Array.isArray(vi.color)) {
      for (const [key, value] of Object.entries(vi.color)) {
        existingColorMap[key] = normalizeImageSet(value);
      }
    }

    for (const [key, value] of Object.entries(vi)) {
      if (key === "color") continue;
      if (isNonColorFlatKey(key)) {
        preserveTopLevel[key] = value;
        continue;
      }
      if (isImageSet(value) || Array.isArray(value)) {
        existingColorMap[key] = normalizeImageSet(value);
      }
    }
  }

  const colorValues = [
    ...new Set([
      ...colorValuesFromVariant,
      ...Object.keys(existingColorMap),
    ]),
  ];

  if (colorValues.length === 0) {
    return { changed: false, id: json.id };
  }

  const colorMap = {};
  for (const value of colorValues) {
    colorMap[value] = existingColorMap[value] ?? emptyImageSet();
  }

  const nextVariantImages = { ...preserveTopLevel, color: colorMap };

  const before = JSON.stringify(vi ?? null);
  const after = JSON.stringify(nextVariantImages);
  if (before === after) {
    return { changed: false, id: json.id };
  }

  json.variantImages = nextVariantImages;
  return { changed: true, id: json.id };
}

const files = fs.readdirSync(PRODUCTS_DIR).filter((f) => f.endsWith(".json"));
const updated = [];

for (const file of files) {
  const filePath = path.join(PRODUCTS_DIR, file);
  const json = JSON.parse(fs.readFileSync(filePath, "utf8"));
  const result = migrateJson(json);
  if (result.changed) {
    fs.writeFileSync(filePath, `${JSON.stringify(json, null, 2)}\n`, "utf8");
    updated.push(result.id);
  }
}

console.log(`Updated ${updated.length} product JSON files:`);
updated.forEach((id) => console.log(`  - ${id}`));
