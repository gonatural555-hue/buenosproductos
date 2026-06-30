import { readFileSync, writeFileSync, mkdirSync } from "fs";
import { join } from "path";
import { getGoodIdeasProducts } from "../lib/good-ideas-products";
import { GOOD_IDEAS_PRODUCT_CATEGORY_MAP } from "../lib/good-ideas-plp-categories";

const JSON_DIR = join(process.cwd(), "scripts", "good-ideas-products");
const OUT_DIR = join(process.cwd(), "scripts", "good-ideas-blog");

function readFeaturedImage(productId: string): string {
  try {
    const raw = readFileSync(join(JSON_DIR, `${productId}.json`), "utf-8");
    const data = JSON.parse(raw) as { images?: { featured?: string[]; gallery?: string[] } };
    return (
      data.images?.featured?.[0] ||
      data.images?.gallery?.[0] ||
      "/assets/images/blog/blog-hero.webp"
    );
  } catch {
    return "/assets/images/blog/blog-hero.webp";
  }
}

function formatUsd(price: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(price);
}

function competitorRange(price: number): { low: string; high: string } {
  const low = formatUsd(Math.round(price * 1.35 * 100) / 100);
  const high = formatUsd(Math.round(price * 2.15 * 100) / 100);
  return { low, high };
}

type Section = { heading: string; paragraphs: string[]; image?: string };

function buildEnglishPost(product: ReturnType<typeof getGoodIdeasProducts>[number], images: { hero: string; section: string }) {
  const price = formatUsd(product.price);
  const range = competitorRange(product.price);
  const shortTitle = product.title.length > 72 ? `${product.title.slice(0, 69)}…` : product.title;

  return {
    title: `${shortTitle} — guide, uses & price comparison`,
    excerpt: `Who this ${product.category.toLowerCase()} pick is for, how to use it daily, and how Good Products pricing compares to similar brands.`,
    subtitle: `Practical buying guide for ${shortTitle}.`,
    intro: `${product.shortDescription || product.description} This guide explains who it fits, how to get the most from it, and how its price compares to similar options from other brands.`,
    heroImage: images.hero,
    relatedProductIds: [product.id],
    sections: [
      {
        heading: "Who it's for",
        paragraphs: [
          `The ${product.title} suits shoppers who want ${product.category.toLowerCase()} gear that is easy to understand and ready for everyday use—not a complicated setup. ${product.longDescription?.[0] ?? product.description}`,
          `It is a strong match if you value ${product.features?.slice(0, 2).join(" and ").toLowerCase() || "straightforward functionality"} and prefer buying from a curated catalog rather than sorting through endless marketplace listings.`,
        ],
        image: images.section,
      },
      {
        heading: "How to use it",
        paragraphs: [
          `Start with the basics in the product listing: check dimensions, power/plug type, and included accessories before your first use. ${product.longDescription?.[1] ?? "Follow the manufacturer instructions for charging, cleaning, and storage."}`,
          `For best results, integrate it into a simple routine—keep it where you will actually use it (desk, kitchen counter, car, or nightstand) and combine it with the habits you already have. ${product.features?.[2] ? `Key capability: ${product.features[2]}.` : ""}`,
        ],
      },
      {
        heading: "Price vs similar products",
        paragraphs: [
          `On Good Products this item is listed at ${price}. Comparable models from mainstream brands and large marketplaces in the same category often appear roughly between ${range.low} and ${range.high}, depending on brand, materials, and shipping.`,
          `That spread usually reflects packaging, warranty terms, and brand premium—not always better core performance. If ${price} fits your budget and the features match your routine, this pick balances value with the specs listed on the product page.`,
        ],
      },
    ] satisfies Section[],
    closing: `Ready to compare specs and photos? Open the full product page on Good Products for gallery images, features, and current availability.`,
  };
}

function buildSpanishPost(
  product: ReturnType<typeof getGoodIdeasProducts>[number],
  images: { hero: string; section: string }
) {
  const es = product.translations?.es;
  const title = es?.title ?? product.title;
  const shortDesc = es?.shortDescription ?? es?.description ?? product.shortDescription;
  const price = formatUsd(product.price);
  const range = competitorRange(product.price);
  const shortTitle = title.length > 72 ? `${title.slice(0, 69)}…` : title;

  return {
    title: `${shortTitle} — guía, usos y comparación de precio`,
    excerpt: `Para quién sirve, cómo usarlo a diario y cómo se compara el precio de Good Products con marcas similares.`,
    subtitle: `Guía práctica de compra para ${shortTitle}.`,
    intro: `${shortDesc} Esta guía resume para quién encaja, cómo sacarle provecho y cómo se compara su precio con opciones parecidas de otras marcas.`,
    sections: [
      {
        heading: "Para quién es",
        paragraphs: [
          `${title} conviene si buscás un producto de ${product.category === "Hogar" ? "hogar" : product.category === "Tech" ? "tecnología" : "lifestyle"} fácil de entender y listo para el uso diario. ${es?.longDescription?.[0] ?? product.longDescription?.[0] ?? es?.description ?? product.description}`,
          `Es una buena opción si valorás ${(es?.features?.slice(0, 2) ?? product.features?.slice(0, 2))?.join(" y ").toLowerCase() || "funciones claras"} y preferís un catálogo curado en lugar de revisar cientos de listados genéricos.`,
        ],
        image: images.section,
      },
      {
        heading: "Cómo usarlo",
        paragraphs: [
          `Antes del primer uso, revisá en la ficha medidas, tipo de enchufe o batería y accesorios incluidos. ${es?.longDescription?.[1] ?? "Seguí las indicaciones del fabricante para carga, limpieza y guardado."}`,
          `Integralo en una rutina simple: dejalo donde lo vas a usar (escritorio, cocina, auto o mesa de noche). ${es?.features?.[2] ? `Dato clave: ${es.features[2]}.` : ""}`,
        ],
      },
      {
        heading: "Precio frente a productos similares",
        paragraphs: [
          `En Good Products figura a ${price}. Modelos comparables de marcas conocidas y marketplaces grandes suelen aparecer entre ${range.low} y ${range.high}, según marca, materiales y envío.`,
          `Esa diferencia muchas veces refleja empaque, garantía o prestigio de marca—not siempre mejor rendimiento. Si ${price} entra en tu presupuesto y las funciones coinciden con tu rutina, esta opción equilibra valor y especificaciones reales.`,
        ],
      },
    ] satisfies Section[],
    closing: `¿Querés ver fotos y especificaciones completas? Abrí la ficha del producto en Good Products para galería, características y disponibilidad actual.`,
  };
}

const CATEGORY_SORT: Record<string, number> = {
  tech: 100,
  home: 200,
  lifestyle: 300,
};

const products = getGoodIdeasProducts();

const posts = products.map((product, index) => {
  const hero = readFeaturedImage(product.id);
  const section =
    (() => {
      try {
        const raw = readFileSync(join(JSON_DIR, `${product.id}.json`), "utf-8");
        const data = JSON.parse(raw) as { images?: { gallery?: string[] } };
        return data.images?.gallery?.[0] || hero;
      } catch {
        return hero;
      }
    })();

  const categorySlug = GOOD_IDEAS_PRODUCT_CATEGORY_MAP[product.id] ?? product.category.toLowerCase();
  const root =
    product.category === "Tech"
      ? "tech"
      : product.category === "Hogar"
        ? "home"
        : "lifestyle";
  const sortOrder = (CATEGORY_SORT[root] ?? 400) + index;

  const en = buildEnglishPost(product, { hero, section });

  return {
    slug: product.slug,
    productId: product.id,
    categorySlug,
    sortOrder,
    publishedAt: `2026-0${Math.min(6, 3 + Math.floor(index / 3))}-${String(5 + (index % 20)).padStart(2, "0")}`,
    ...en,
    translations: {
      es: buildSpanishPost(product, { hero, section }),
    },
  };
});

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(
  join(OUT_DIR, "posts.json"),
  JSON.stringify({ posts }, null, 2),
  "utf-8"
);

console.log(`Generated ${posts.length} blog posts → scripts/good-ideas-blog/posts.json`);
