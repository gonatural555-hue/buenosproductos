import { Product, getProducts } from "@/lib/products";

export interface Category {
  slug: string;
  name: string;
  description: string;
  parentSlug?: string;
}

export const CATEGORIES: Category[] = [
  // ===== CATEGORÍAS PRINCIPALES (PADRE) =====
  {
    slug: "fishing",
    name: "Fishing",
    description: "Todo lo necesario para la pesca deportiva y recreativa.",
  },
  {
    slug: "mountain-snow",
    name: "Mountain & Snow",
    description: "Equipamiento para montaña y deportes de nieve.",
  },
  {
    slug: "water-sports",
    name: "Water Sports",
    description: "Equipamiento para deportes acuáticos y actividades en el agua.",
  },
  {
    slug: "outdoor-adventure",
    name: "Outdoor & Adventure",
    description: "Equipamiento para aventuras al aire libre y exploración.",
  },
  {
    slug: "active-sports",
    name: "Active Sports",
    description: "Equipamiento para deportes activos y entrenamiento.",
  },
  {
    slug: "men",
    name: "Men",
    description: "Equipamiento outdoor para hombre.",
  },
  {
    slug: "women",
    name: "Women",
    description: "Equipamiento outdoor para mujer.",
  },
  {
    slug: "kids",
    name: "Kids",
    description: "Equipamiento outdoor para niños.",
  },
  // ===== SUBCATEGORÍAS (HIJO) =====
  // Fishing subcategorías
  {
    slug: "fishing-equipment",
    name: "Fishing Equipment",
    description: "Equipamiento esencial para pescadores (cañas, carretes, combos).",
    parentSlug: "fishing",
  },
  {
    slug: "fishing-gadgets",
    name: "Fishing Gadgets",
    description: "Gadgets, herramientas y accesorios innovadores para pesca.",
    parentSlug: "fishing",
  },
  // Mountain & Snow subcategorías
  {
    slug: "ski-snowboard",
    name: "Ski / Snowboard",
    description: "Equipamiento y accesorios para esquí y snowboard.",
    parentSlug: "mountain-snow",
  },
  // Water Sports subcategorías
  {
    slug: "surfing",
    name: "Surfing",
    description: "Accesorios y equipamiento para surf.",
    parentSlug: "water-sports",
  },
  {
    slug: "diving-swimming-equipment",
    name: "Diving & Swimming Equipment",
    description: "Equipamiento profesional para buceo y natación.",
    parentSlug: "water-sports",
  },
  // Outdoor & Adventure subcategorías
  {
    slug: "trekking",
    name: "Trekking",
    description: "Equipamiento esencial para trekking y senderismo.",
    parentSlug: "outdoor-adventure",
  },
  {
    slug: "camping-survival-gear",
    name: "Camping & Survival Gear",
    description: "Equipamiento de camping y supervivencia.",
    parentSlug: "outdoor-adventure",
  },
  {
    slug: "outdoor-lighting",
    name: "Outdoor Lighting",
    description: "Iluminación para camping y actividades outdoor.",
    parentSlug: "outdoor-adventure",
  },
  // Active Sports subcategorías
  {
    slug: "cycling-running",
    name: "Cycling / Running",
    description: "Equipamiento para ciclismo y running.",
    parentSlug: "active-sports",
  },
];

// Mapeo de productos existentes a categorías por slug
// Los productos se asignan a subcategorías (hijo) cuando corresponde
// Si no hay subcategoría específica, se asigna a la categoría principal (padre)
const PRODUCT_CATEGORY_MAP: Record<string, string[]> = {
  // Productos genéricos - asignados a categorías principales
  "1": ["cycling-running", "active-sports"], // Gafas deportivas
  "2": ["trekking", "camping-survival-gear", "outdoor-adventure"], // Mochila táctica
  "3": ["cycling-running", "active-sports"], // Smartwatch
  // Fishing - asignados a subcategorías
  "gn-fishing-001": ["fishing-equipment"], // Caña de Pescar Telescópica de Carbono Ultraligera
  "gn-fishing-002": ["fishing-equipment"], // PHISHGER Caña de Pescar de Viaje en Carbono
  "gn-fishing-003": ["fishing-equipment"], // Kit Completo de Pesca Telescópico con Carrete
  "gn-fishing-004": ["fishing-equipment"], // Caña UL/L para Trucha en Carbono Sólido
  "gn-fishing-005": ["fishing-equipment"], // MAXIMUS Traveller Caña de Señuelo con Anillas FUJI
  "gn-fishing-eq-006": ["fishing-gadgets"], // Alicates de Pesca Multifunción con Cortador de Línea
  "gn-fishing-eq-007": ["fishing-equipment"], // KastKing Sharky III Carrete Giratorio Spinning
  "gn-fishing-eq-008": ["fishing-equipment"], // BEARKING BKT Carrete Giratorio Spinning
  // Mountain & Snow - asignados a subcategorías
  "gn-ski-snow-001-sk7a1": ["ski-snowboard"], // KAPVOE SK7-A1 Glacier
  "gn-ski-snow-001-sk7b2": ["ski-snowboard"], // KAPVOE SK7-B2 Solar Gold
  "gn-ski-snow-001-sk7c3": ["ski-snowboard"], // KAPVOE SK7-C3 Storm Chrome
  "gn-ski-snow-001-sk7d4": ["ski-snowboard"], // KAPVOE SK7-D4 Midnight IR
  "gn-ski-snow-001-sk7e5": ["ski-snowboard"], // KAPVOE SK7-E5 Aurora Rose
  "gn-ski-snow-001-sk7f6": ["ski-snowboard"], // KAPVOE SK7-F6 Volt Amber
  "gn-ski-snow-001-sk7g7": ["ski-snowboard"], // KAPVOE SK7-G7 Carbon Edge
  "gn-ski-snow-002": ["ski-snowboard"], // Parka Técnica de Invierno con Capucha – Outdoor Military Anorak
  "gn-ski-snow-003": ["ski-snowboard"], // Chaqueta Impermeable Unisex JNLN – Cortaviento Térmica
  "gn-ski-snow-004": ["ski-snowboard"], // Chaqueta Polar con Capucha – Lana Sintética
  "gn-ski-snow-005": ["ski-snowboard"], // Chaqueta Softshell de Invierno – Resistente al Viento
  "gn-ski-snow-006": ["ski-snowboard"], // Chaqueta Calefactable USB – 21 Zonas de Calor
  "gn-ski-snow-jacket-001": ["ski-snowboard"], // Alpine Shell Jacket — Quiet Winter Layer
  "gn-ski-snow-pants-001": ["ski-snowboard"], // Alpine Snow Pants — Quiet Winter Protection
  // Ciclismo & Running (subcategoría unificada)
  "gn-cycling-010": ["cycling-running"], // Gafas de Ciclismo KAPVOE UV400 – Lente Polarizada Deportiva (Unisex)
  "gn-cycling-011": ["cycling-running"], // Gafas de Ciclismo KAPVOE Fotocromáticas UV400 – Lente Adaptativa (Unisex)
  "gn-cycling-012": ["cycling-running"], // Pasamontañas / Balaclava Térmica ROCKBROS – Cortaviento y Transpirable
  "gn-cycling-013": ["cycling-running"], // Cuello / Braga Polar ROCKBROS – Protección Térmica Multifunción
  "gn-cycling-014": ["cycling-running"], // Guantes de Ciclismo ROCKBROS Medio Dedo – Antideslizantes (Verano)
  "gn-cycling-015": ["cycling-running"], // Luz Trasera de Bicicleta ROCKBROS USB – IPX6 / IPX7
  "gn-cycling-016": ["cycling-running"], // Luz Trasera ROCKBROS con Sensor de Freno Inteligente (USB-C)
  "gn-cycling-training-001": ["cycling-running"], // ThinkRider X2 Max — rodillo inteligente indoor
  "gn-cycling-eq-002": ["cycling-running"], // ThinkRider 16g CO2 — pack 10/20/30 cartuchos roscados
  "gn-cycling-eq-003": ["cycling-running"], // ThinkRider cámara TPU 28 g 700C Presta — válvula 45/65/85 mm
  "gn-cycling-clothes-001": ["cycling-running"], // Thermal Cycling Jacket – All-Season Performance Layer
  "gn-cycling-clothes-002": ["cycling-running"], // Thermal Cycling Jacket – Long-Ride Weather Layer
  // Water Sports - Diving & Swimming Equipment
  "gn-water-001": ["diving-swimming-equipment"], // Máscara de Snorkel Full Face con Soporte para Cámara
  "gn-water-002": ["diving-swimming-equipment"], // Calcetines de Agua de Neopreno 3 mm
  "gn-water-003": ["diving-swimming-equipment"], // Guantes de Buceo de Neopreno 3 mm
  "gn-water-004": ["diving-swimming-equipment"], // Aletas de Snorkel Ajustables de Viaje
  "gn-water-005": ["diving-swimming-equipment"], // Boya de Natación Inflable con Bolsa Estanca
  "gn-water-006": ["diving-swimming-equipment"], // Mochila / Bolsa Seca Impermeable PVC
  "gn-water-007": ["diving-swimming-equipment"], // Mini Tanque de Buceo TRIMIX 0.5L con Máscara – Snorkel y Buceo Recreativo
  // Outdoor & Adventure
  "gn-outdoor-001": ["camping-survival-gear"], // Tienda de Campaña Ultraligera 1–2 Personas (Económica)
  "gn-outdoor-002": ["camping-survival-gear"], // Tienda Naturehike Cloud Up (Premium)
  "gn-outdoor-003": ["outdoor-lighting"], // Linterna LED Táctica Recargable 2000 LM
  "gn-outdoor-004": ["outdoor-lighting"], // Linterna LED Compacta Mini
  "gn-outdoor-005": ["camping-survival-gear"], // Cama Plegable de Camping 300 lb
  "gn-outdoor-006": ["camping-survival-gear"], // Cuna Plegable Ultraligera WESTTUNE
  "gn-outdoor-007": ["camping-survival-gear"], // Saco de Dormir PACOONE (4 Estaciones)
  "gn-outdoor-008": ["camping-survival-gear"], // Colchoneta / Colchón Inflable TARKA – Autoinflable
  "gn-outdoor-009": ["camping-survival-gear"], // Nevera Portátil Rígida (22–25 L)
  "gn-outdoor-010": ["camping-survival-gear"], // Caja de Hielo Portátil – Cooler Outdoor (Variable)
  "gn-outdoor-shoes-001": ["trekking"], // Trekking Shoes — Quiet Terrain Stability
  "gn-outdoor-shoes-002": ["trekking"], // Trekking Shoes — Steady Long-Distance Comfort
};

export function getAllCategories(): Category[] {
  return CATEGORIES;
}

export function getCategoryBySlug(slug: string): Category | undefined {
  return CATEGORIES.find((cat) => cat.slug === slug);
}

/** Alias cortos en `?category=` → slug real (p. ej. home → productos) */
const PRODUCTS_CATEGORY_QUERY_ALIASES: Record<string, string> = {
  outdoor: "outdoor-adventure",
};

/**
 * Valida y resuelve `?category=` de /products a un slug de categoría existente.
 * Devuelve null si el valor no corresponde a ninguna categoría.
 */
export function resolveProductsCategoryParam(raw: string | undefined): string | null {
  if (!raw?.trim()) return null;
  const key = raw.trim().toLowerCase();
  const slug = PRODUCTS_CATEGORY_QUERY_ALIASES[key] ?? key;
  return getCategoryBySlug(slug) ? slug : null;
}

export function getCategorySlugs(): string[] {
  return CATEGORIES.map((cat) => cat.slug);
}

export function getMainCategories(): Category[] {
  return CATEGORIES.filter((cat) => !cat.parentSlug);
}

export function getSubcategories(parentSlug: string): Category[] {
  return CATEGORIES.filter((cat) => cat.parentSlug === parentSlug);
}

export function getCategoryWithChildren(slug: string): {
  category: Category;
  subcategories: Category[];
} | null {
  const category = getCategoryBySlug(slug);
  if (!category) return null;

  const subcategories = getSubcategories(slug);
  return { category, subcategories };
}

export function getProductsByCategorySlug(slug: string): Product[] {
  const allProducts = getProducts();
  const category = getCategoryBySlug(slug);
  
  // Si es categoría principal, incluir productos de sus subcategorías
  const slugsToMatch = category && !category.parentSlug
    ? [slug, ...getSubcategories(slug).map((sub) => sub.slug)]
    : [slug];
  
  return allProducts.filter((product) => {
    const categorySlugs = PRODUCT_CATEGORY_MAP[product.id] || [];
    return categorySlugs.some((productSlug) => slugsToMatch.includes(productSlug));
  });
}

/**
 * Sugerencias de carrito (solo servidor / API): usa PRODUCT_CATEGORY_MAP por ítem,
 * une candidatos por slug de categoría, excluye el carrito, deduplica y rellena
 * con categorías padre y luego orden del catálogo si hace falta llegar a targetMin.
 */
export function getCartSuggestedProducts(
  cartProductIds: string[],
  options: { targetMin?: number; max?: number } = {}
): Product[] {
  const targetMin = options.targetMin ?? 8;
  const max = options.max ?? 12;
  const exclude = new Set(cartProductIds);
  const allProducts = getProducts();

  if (cartProductIds.length === 0) {
    return [];
  }

  const slugSet = new Set<string>();
  for (const id of cartProductIds) {
    const slugs = PRODUCT_CATEGORY_MAP[id] || [];
    slugs.forEach((s) => slugSet.add(s));
  }

  const seen = new Set<string>();
  const result: Product[] = [];

  const tryAdd = (p: Product) => {
    if (result.length >= max) return;
    if (exclude.has(p.id) || seen.has(p.id)) return;
    seen.add(p.id);
    result.push(p);
  };

  for (const slug of slugSet) {
    for (const p of getProductsByCategorySlug(slug)) {
      tryAdd(p);
      if (result.length >= max) break;
    }
    if (result.length >= max) break;
  }

  if (result.length < targetMin) {
    const parentSlugs = new Set<string>();
    for (const slug of slugSet) {
      const cat = CATEGORIES.find((c) => c.slug === slug);
      if (cat?.parentSlug) parentSlugs.add(cat.parentSlug);
      else if (cat && !cat.parentSlug) parentSlugs.add(slug);
    }
    for (const parent of parentSlugs) {
      for (const p of getProductsByCategorySlug(parent)) {
        tryAdd(p);
        if (result.length >= max) break;
      }
      if (result.length >= max) break;
    }
  }

  if (result.length < targetMin) {
    for (const p of allProducts) {
      tryAdd(p);
      if (result.length >= max) break;
    }
  }

  return result.slice(0, max);
}

