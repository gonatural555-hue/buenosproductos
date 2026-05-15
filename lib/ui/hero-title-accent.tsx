import type { ReactNode } from "react";

const HERO_ACCENT_HEX = "text-[#6E1F28]";

/**
 * Resalta una subcadena dentro de una línea del hero (color acento fijo).
 * Si `accent` no aparece en `line`, devuelve la línea completa con `lineToneClass`.
 */
export function splitHeroLineWithAccent(
  line: string,
  accent: string | undefined,
  lineToneClass: string
): ReactNode {
  const a = accent?.trim();
  if (!line) return null;
  if (!a || !line.includes(a)) {
    return <span className={`${lineToneClass} text-balance`}>{line}</span>;
  }
  const i = line.indexOf(a);
  const before = line.slice(0, i);
  const after = line.slice(i + a.length);
  return (
    <span className={`${lineToneClass} text-balance`}>
      {before}
      <span className={HERO_ACCENT_HEX}>{a}</span>
      {after}
    </span>
  );
}
