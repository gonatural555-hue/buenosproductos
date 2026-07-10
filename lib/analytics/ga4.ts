/**
 * Google Analytics 4 — helpers mínimos para dataLayer / gtag.
 *
 * Requiere `NEXT_PUBLIC_GA4_ID`
 * Ejemplo: NEXT_PUBLIC_GA4_ID=G-KVF5B1RW41
 *
 * Los eventos siguen los nombres recomendados para comercio electrónico en GA4.
 * @see https://developers.google.com/analytics/devguides/collection/ga4/reference/events
 */

/** Measurement ID leído durante el build. */
export const GA4_MEASUREMENT_ID =
  typeof process !== "undefined"
    ? process.env.NEXT_PUBLIC_GA4_ID?.trim() ?? ""
    : "";

/** Monedas admitidas por el sitio. */
export type Ga4Currency = "USD" | "ARS" | "BRL";

/**
 * Moneda de respaldo.
 * Solo se usa cuando una función no recibe una moneda explícitamente.
 */
export const GA4_DEFAULT_CURRENCY: Ga4Currency = "USD";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/** Indica si GA4 está configurado y disponible en el navegador. */
export function isGa4Ready(): boolean {
  return (
    Boolean(GA4_MEASUREMENT_ID) &&
    typeof window !== "undefined" &&
    typeof window.gtag === "function"
  );
}

/**
 * Parámetros de un producto según el esquema `items` recomendado por GA4.
 */
export type Ga4Item = {
  item_id: string;
  item_name: string;
  price?: number;
  quantity?: number;
  item_category?: string;
  item_variant?: string;
  item_brand?: string;

  /** Nombre legible de la lista: categoría, relacionados, carrusel home, etc. */
  item_list_name?: string;
  item_list_id?: string;

  /** Posición del producto dentro de una lista. */
  index?: number;
};

function pushGtag(...args: unknown[]): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag(...args);
}

/**
 * Envía un evento genérico a GA4.
 * No hace nada durante SSR o cuando gtag todavía no está disponible.
 */
export function sendGa4Event(
  eventName: string,
  params?: Record<string, unknown>
): void {
  if (!isGa4Ready()) return;

  pushGtag("event", eventName, params ?? {});
}

/** Calcula el valor total de una lista de productos. */
function itemsValue(items: Ga4Item[]): number {
  return items.reduce((sum, item) => {
    const quantity = item.quantity ?? 1;
    const price = item.price ?? 0;

    return sum + price * quantity;
  }, 0);
}

/** Garantiza que todos los productos tengan quantity. */
function normalizeItems(items: Ga4Item[]): Ga4Item[] {
  return items.map((item) => ({
    ...item,
    quantity: item.quantity ?? 1,
  }));
}

// -----------------------------------------------------------------------------
// Page view
// -----------------------------------------------------------------------------

/**
 * Envía un `page_view` manual.
 *
 * Usar solamente cuando la configuración inicial de GA4 contiene:
 *
 * send_page_view: false
 *
 * Este helper debe ser llamado por el tracker de rutas del App Router.
 */
export function sendGa4PageView(pagePath: string): void {
  if (!isGa4Ready()) return;

  const pageLocation =
    typeof window !== "undefined" ? window.location.href : undefined;

  const pageTitle =
    typeof document !== "undefined" ? document.title : undefined;

  pushGtag("event", "page_view", {
    page_path: pagePath,
    ...(pageLocation ? { page_location: pageLocation } : {}),
    ...(pageTitle ? { page_title: pageTitle } : {}),
  });
}

// -----------------------------------------------------------------------------
// Ecommerce
// -----------------------------------------------------------------------------

/** El usuario visualiza la ficha de un producto. */
export function trackViewItem(
  item: Ga4Item,
  currency: Ga4Currency = GA4_DEFAULT_CURRENCY
): void {
  const items = normalizeItems([item]);

  sendGa4Event("view_item", {
    currency,
    value: itemsValue(items),
    items,
  });
}

/** El usuario selecciona un producto desde una lista o carrusel. */
export function trackSelectItem(options: {
  item: Ga4Item;
  itemListId?: string;
  itemListName?: string;
}): void {
  const item: Ga4Item = {
    ...options.item,
    ...(options.itemListId
      ? { item_list_id: options.itemListId }
      : {}),
    ...(options.itemListName
      ? { item_list_name: options.itemListName }
      : {}),
  };

  const items = normalizeItems([item]);

  sendGa4Event("select_item", {
    ...(options.itemListId
      ? { item_list_id: options.itemListId }
      : {}),
    ...(options.itemListName
      ? { item_list_name: options.itemListName }
      : {}),
    items,
  });
}

/** El usuario agrega uno o más productos al carrito. */
export function trackAddToCart(
  items: Ga4Item[],
  currency: Ga4Currency = GA4_DEFAULT_CURRENCY
): void {
  if (items.length === 0) return;

  const normalized = normalizeItems(items);

  sendGa4Event("add_to_cart", {
    currency,
    value: itemsValue(normalized),
    items: normalized,
  });
}

/** El usuario elimina uno o más productos del carrito. */
export function trackRemoveFromCart(
  items: Ga4Item[],
  currency: Ga4Currency = GA4_DEFAULT_CURRENCY
): void {
  if (items.length === 0) return;

  const normalized = normalizeItems(items);

  sendGa4Event("remove_from_cart", {
    currency,
    value: itemsValue(normalized),
    items: normalized,
  });
}

/** El usuario visualiza el carrito. */
export function trackViewCart(
  items: Ga4Item[],
  currency: Ga4Currency = GA4_DEFAULT_CURRENCY
): void {
  if (items.length === 0) return;

  const normalized = normalizeItems(items);

  sendGa4Event("view_cart", {
    currency,
    value: itemsValue(normalized),
    items: normalized,
  });
}

/** El usuario inicia el checkout. */
export function trackBeginCheckout(
  items: Ga4Item[],
  currency: Ga4Currency = GA4_DEFAULT_CURRENCY
): void {
  if (items.length === 0) return;

  const normalized = normalizeItems(items);

  sendGa4Event("begin_checkout", {
    currency,
    value: itemsValue(normalized),
    items: normalized,
  });
}

/** El usuario agrega información de envío. */
export function trackAddShippingInfo(options: {
  items: Ga4Item[];
  currency: Ga4Currency;
  shippingTier?: string;
}): void {
  if (options.items.length === 0) return;

  const normalized = normalizeItems(options.items);

  sendGa4Event("add_shipping_info", {
    currency: options.currency,
    value: itemsValue(normalized),
    items: normalized,
    ...(options.shippingTier
      ? { shipping_tier: options.shippingTier }
      : {}),
  });
}

/** El usuario agrega o selecciona el método de pago. */
export function trackAddPaymentInfo(options: {
  items: Ga4Item[];
  currency: Ga4Currency;
  paymentType?: string;
}): void {
  if (options.items.length === 0) return;

  const normalized = normalizeItems(options.items);

  sendGa4Event("add_payment_info", {
    currency: options.currency,
    value: itemsValue(normalized),
    items: normalized,
    ...(options.paymentType
      ? { payment_type: options.paymentType }
      : {}),
  });
}

/**
 * Compra completada.
 *
 * Debe llamarse una sola vez por transacción.
 * `transaction_id` debe ser único.
 */
export function trackPurchase(options: {
  transaction_id: string;
  value: number;
  currency: Ga4Currency;
  items: Ga4Item[];
  tax?: number;
  shipping?: number;
  coupon?: string;
}): void {
  const {
    transaction_id,
    value,
    currency,
    items,
    tax,
    shipping,
    coupon,
  } = options;

  if (!transaction_id || items.length === 0) return;

  const normalized = normalizeItems(items);

  sendGa4Event("purchase", {
    transaction_id,
    value,
    currency,
    items: normalized,
    ...(tax != null ? { tax } : {}),
    ...(shipping != null ? { shipping } : {}),
    ...(coupon ? { coupon } : {}),
  });
}

// -----------------------------------------------------------------------------
// Helpers
// -----------------------------------------------------------------------------

/**
 * Construye un ítem GA4 a partir de una línea del carrito local.
 *
 * El precio debe estar expresado en la misma moneda enviada al evento.
 */
export function cartLineToGa4Item(
  line: {
    id: string;
    productId?: string;
    title: string;
    price: number;
    category?: string;
    variant?: string;
    brand?: string;
  },
  quantity: number
): Ga4Item {
  return {
    item_id: line.productId ?? line.id,
    item_name: line.title,
    price: line.price,
    quantity: Math.max(1, quantity),
    ...(line.category ? { item_category: line.category } : {}),
    ...(line.variant ? { item_variant: line.variant } : {}),
    ...(line.brand ? { item_brand: line.brand } : {}),
  };
}