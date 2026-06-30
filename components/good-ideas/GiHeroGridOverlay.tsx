import { GI_HERO_GRID_OVERLAY } from "@/lib/ui/goodideas-design";

type Props = {
  className?: string;
};

/** Capas de fondo hero: radial azul + grilla cuadrada 56px. */
export default function GiHeroGridOverlay({ className = "" }: Props) {
  return (
    <div
      className={`pointer-events-none absolute inset-0 z-0 ${className}`.trim()}
      aria-hidden
    >
      <div className={`absolute inset-0 ${GI_HERO_GRID_OVERLAY.radial}`} />
      <div className={`absolute inset-0 ${GI_HERO_GRID_OVERLAY.grid}`} />
    </div>
  );
}
