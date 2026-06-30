/** Ancho útil del PDP Good Products (galería + compra y secciones inferiores). */
export const GI_PDP_CONTENT_WIDTH_PX = 1292;

export const GI_PDP_MAX_WIDTH = "max-w-[1292px]";

/** Contenedor centrado — usar en page y cualquier bloque nuevo del PDP. */
export const GI_PDP_CONTAINER = `mx-auto w-full ${GI_PDP_MAX_WIDTH}`;

/** Padding lateral en móvil/tablet; en desktop el contenido ocupa los 1292px completos. */
export const GI_PDP_SECTION_PAD = "px-5 sm:px-6 lg:px-0";

/** Clase combinada recomendada para envolver contenido PDP. */
export const GI_PDP_INNER = `${GI_PDP_CONTAINER} ${GI_PDP_SECTION_PAD}`;

export const GI_PDP_GRID =
  "hidden lg:grid lg:grid-cols-[minmax(0,1.68fr)_minmax(280px,0.32fr)] lg:items-start lg:gap-x-10 xl:gap-x-12";

export const GI_PDP_GALLERY_STICKY =
  "lg:sticky lg:top-[calc(env(safe-area-inset-top,0px)+4.75rem)] lg:self-start";

export const GI_PDP_CTA_CLASS =
  "w-full min-h-[52px] rounded-full px-8 py-4 text-base font-semibold tracking-normal";

export const GI_HEADER_HIDE_MS = 220;
