import type { Locale } from "@/lib/i18n/config";
import type { Product } from "@/lib/product-types";

/** Días desde hoy hasta el inicio de la ventana de entrega (LATAM). */
export const GOOD_IDEAS_DELIVERY_START_OFFSET_DAYS = 13;

/** Días desde hoy hasta el fin de la ventana (~Jul 11 – Ago 4 desde fin de junio). */
export const GOOD_IDEAS_DELIVERY_END_OFFSET_DAYS = 37;

const DELIVERY_LINE_PATTERN =
  /estimated delivery|entrega estimada|free standard shipping on this listing|envío estándar gratis en este producto|free shipping —|envío gratis —/i;

export function getGoodIdeasDeliveryDates(refDate: Date = new Date()) {
  const start = new Date(refDate);
  start.setHours(12, 0, 0, 0);
  start.setDate(start.getDate() + GOOD_IDEAS_DELIVERY_START_OFFSET_DAYS);

  const end = new Date(refDate);
  end.setHours(12, 0, 0, 0);
  end.setDate(end.getDate() + GOOD_IDEAS_DELIVERY_END_OFFSET_DAYS);

  return { start, end };
}

function formatLongDate(date: Date, locale: Locale): string {
  const tag = locale === "es" ? "es-AR" : "en-US";
  return new Intl.DateTimeFormat(tag, {
    month: "long",
    day: "numeric",
  }).format(date);
}

function formatShortDate(date: Date, locale: Locale): string {
  if (locale === "es") {
    const parts = new Intl.DateTimeFormat("es-AR", {
      day: "numeric",
      month: "short",
    }).formatToParts(date);
    const day = parts.find((p) => p.type === "day")?.value ?? "";
    const month = (
      parts.find((p) => p.type === "month")?.value ?? ""
    ).replace(/\.$/, "");
    return `${day} ${month.toLowerCase()}`;
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(date);
}

export function formatGoodIdeasDeliveryShortDate(
  date: Date,
  locale: Locale
): string {
  return formatShortDate(date, locale);
}

export function formatGoodIdeasDeliveryLongLine(
  locale: Locale,
  refDate: Date = new Date()
): string {
  const { start, end } = getGoodIdeasDeliveryDates(refDate);

  if (locale === "es") {
    return `Envío estándar gratis en este producto. Entrega estimada entre el ${formatLongDate(start, locale)} y el ${formatLongDate(end, locale)}.`;
  }

  return `Free standard shipping on this listing. Estimated delivery between ${formatLongDate(start, locale)} and ${formatLongDate(end, locale)}.`;
}

export function formatGoodIdeasDeliveryFeatureLine(
  locale: Locale,
  refDate: Date = new Date()
): string {
  const { start, end } = getGoodIdeasDeliveryDates(refDate);

  if (locale === "es") {
    return `Envío gratis — entrega estimada ${formatShortDate(start, locale)} – ${formatShortDate(end, locale)}`;
  }

  return `Free shipping — estimated delivery ${formatShortDate(start, locale)} – ${formatShortDate(end, locale)}`;
}

function stripDeliveryLines(lines: string[] | undefined): string[] {
  return (lines ?? []).filter((line) => !DELIVERY_LINE_PATTERN.test(line));
}

/**
 * Sustituye copy estático de envío por fechas calculadas (~1 mes desde hoy).
 * Solo aplica si `freeShipping === true`.
 */
export function applyGoodIdeasDeliveryCopy(
  product: Product,
  locale: Locale,
  refDate: Date = new Date()
): Product {
  const longDescription = stripDeliveryLines(product.longDescription);
  const features = stripDeliveryLines(product.features);

  if (!product.freeShipping) {
    return { ...product, longDescription, features };
  }

  return {
    ...product,
    longDescription: [
      ...longDescription,
      formatGoodIdeasDeliveryLongLine(locale, refDate),
    ],
    features: [
      ...features,
      formatGoodIdeasDeliveryFeatureLine(locale, refDate),
    ],
  };
}
