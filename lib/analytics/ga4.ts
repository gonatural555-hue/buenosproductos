/**
 * Google Analytics 4 — helpers mínimos para el dataLayer / gtag.
 *
 * Requiere `NEXT_PUBLIC_GA4_ID` (Measurement ID tipo G-XXXXXXXXXX).
 * Los eventos siguen los nombres recomendados para comercio electrónico en GA4.
 * @see https://developers.google.com/analytics/devguides/collection/ga4/reference/events
 */

/** Measurement ID leído en build; solo se usa en cliente tras comprobar `window.gtag`. */
export const GA4_MEASUREMENT_ID =
  typeof process !== "undefined"
    ? process.env.NEXT_PUBLIC_GA4_ID?.trim() ?? ""
    : "";

export const GA4_DEFAULT_CURRENCY = "USD";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Indica si hay ID configurado (el script de GA4 debe haber definido `window.gtag`). */
export function isGa4Ready(): boolean {
  return (
    Boolean(GA4_MEASUREMENT_ID) &&
    typeof window !== "undefined" &&
    typeof window.gtag === "function"
  );
}

/**
 * Parámetros de ítem alineados con el esquema `items` de GA4 (campos opcionales omitidos si no aplican).
 */
export type Ga4Item = {
  item_id: string;
  item_name: string;
  price?: number;
  quantity?: number;
  item_category?: string;
  /** Nombre legible de la lista (p. ej. categoría, “related”, carrusel home). */
  item_list_name?: string;
  item_list_id?: string;
  index?: number;
};

function pushGtag(...args: unknown[]): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }
  window.gtag(...args);
}

/**
 * Envía un evento GA4 genérico. No hace nada si gtag no está disponible (p. ej. sin ID o SSR).
 */
export function sendGa4Event(
  eventName: string,
  params?: Record<string, unknown>
): void {
  if (!isGa4Ready()) return;
  pushGtag("event", eventName, params ?? {});
}

function itemsValue(items: Ga4Item[]): number {
  return items.reduce((sum, it) => {
    const q = it.quantity ?? 1;
    const p = it.price ?? 0;
    return sum + p * q;
  }, 0);
}

function normalizeItems(items: Ga4Item[]): Ga4Item[] {
  return items.map((it) => ({
    ...it,
    quantity: it.quantity ?? 1,
  }));
}

// --- Page ---

/**
 * `page_view` manual. Usar solo cuando el `config` inicial lleva `send_page_view: false`
 * y este helper se invoca desde el tracker de rutas (evita doble conteo con la carga automática).
 */
export function sendGa4PageView(pagePath: string): void {
  if (!isGa4Ready()) return;
  const pageLocation =
    typeof window !== "undefined" ? window.location.href : undefined;
  pushGtag("event", "page_view", {
    page_path: pagePath,
    ...(pageLocation ? { page_location: pageLocation } : {}),
  });
}

// --- Ecommerce (recommended events) ---

export function trackViewItem(item: Ga4Item, currency = GA4_DEFAULT_CURRENCY) {
  const items = normalizeItems([item]);
  sendGa4Event("view_item", {
    currency,
    value: itemsValue(items),
    items,
  });
}

/**
 * El usuario elige un producto en un listado (antes de la ficha).
 * `item_list_*` identifica el origen (categoría, destacados, sugerencias en carrito, etc.).
 */
export function trackSelectItem(options: {
  item: Ga4Item;
  itemListId?: string;
  itemListName?: string;
}) {
  const item: Ga4Item = {
    ...options.item,
    ...(options.itemListId != null ? { item_list_id: options.itemListId } : {}),
    ...(options.itemListName != null
      ? { item_list_name: options.itemListName }
      : {}),
  };
  const items = normalizeItems([item]);
  sendGa4Event("select_item", {
    item_list_id: options.itemListId,
    item_list_name: options.itemListName,
    items,
  });
}

export function trackAddToCart(
  items: Ga4Item[],
  currency = GA4_DEFAULT_CURRENCY
) {
  if (items.length === 0) return;
  const normalized = normalizeItems(items);
  sendGa4Event("add_to_cart", {
    currency,
    value: itemsValue(normalized),
    items: normalized,
  });
}

export function trackRemoveFromCart(
  items: Ga4Item[],
  currency = GA4_DEFAULT_CURRENCY
) {
  if (items.length === 0) return;
  const normalized = normalizeItems(items);
  sendGa4Event("remove_from_cart", {
    currency,
    value: itemsValue(normalized),
    items: normalized,
  });
}

export function trackViewCart(
  items: Ga4Item[],
  currency = GA4_DEFAULT_CURRENCY
) {
  if (items.length === 0) return;
  const normalized = normalizeItems(items);
  sendGa4Event("view_cart", {
    currency,
    value: itemsValue(normalized),
    items: normalized,
  });
}

export function trackBeginCheckout(
  items: Ga4Item[],
  currency = GA4_DEFAULT_CURRENCY
) {
  if (items.length === 0) return;
  const normalized = normalizeItems(items);
  sendGa4Event("begin_checkout", {
    currency,
    value: itemsValue(normalized),
    items: normalized,
  });
}

/**
 * Compra completada. Llamar una sola vez por transacción con el mismo `transaction_id`.
 */
export function trackPurchase(options: {
  transaction_id: string;
  value: number;
  currency?: string;
  items: Ga4Item[];
  tax?: number;
  shipping?: number;
}) {
  const { transaction_id, value, items } = options;
  if (!transaction_id || items.length === 0) return;
  const normalized = normalizeItems(items);
  sendGa4Event("purchase", {
    transaction_id,
    value,
    currency: options.currency ?? GA4_DEFAULT_CURRENCY,
    items: normalized,
    ...(options.tax != null ? { tax: options.tax } : {}),
    ...(options.shipping != null ? { shipping: options.shipping } : {}),
  });
}

/** Construye un ítem GA4 a partir de una línea del carrito local. */
export function cartLineToGa4Item(
  line: {
    id: string;
    productId?: string;
    title: string;
    price: number;
  },
  quantity: number
): Ga4Item {
  return {
    item_id: line.productId ?? line.id,
    item_name: line.title,
    price: line.price,
    quantity: Math.max(1, quantity),
  };
}
