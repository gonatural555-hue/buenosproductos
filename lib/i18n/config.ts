export const locales = ["es", "en", "fr", "it"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "es";

/** Locales visibles en el selector del header (el sitio sigue soportando todos). */
export const headerLocales = ["es", "en"] as const satisfies readonly Locale[];
