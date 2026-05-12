/**
 * Efecto de relieve: filete claro superior, sombra interior inferior,
 * contorno mínimo y difuminado ambiental (superficies claras).
 */
export const LUMINOUS_EDGE_LIGHT =
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.94),inset_0_-1px_0_rgba(0,0,0,0.028),0_0_0_1px_rgba(0,0,0,0.045),0_24px_52px_-28px_rgba(17,23,19,0.11),0_12px_28px_-16px_rgba(0,0,0,0.07)]";

/** Carruseles / tarjetas claras: mismo lenguaje con énfasis en el borde superior. */
export const LUMINOUS_EDGE_CARD =
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.88),inset_0_0_0_1px_rgba(0,0,0,0.05),0_20px_48px_-26px_rgba(17,23,19,0.14),0_10px_24px_-14px_rgba(0,0,0,0.08)]";

/** Barra u oscuros: ribete luminoso + hundimiento. */
export const LUMINOUS_EDGE_DARK =
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.11),inset_0_-2px_0_rgba(0,0,0,0.42),0_0_0_1px_rgba(0,0,0,0.22),0_28px_56px_-22px_rgba(0,0,0,0.5)]";

/** Controles blancos sobre barra oscura. */
export const LUMINOUS_INNER_CHROME =
  "shadow-[inset_0_1px_0_rgba(255,255,255,0.92),0_1px_4px_rgba(0,0,0,0.1),0_0_0_1px_rgba(0,0,0,0.07)]";
