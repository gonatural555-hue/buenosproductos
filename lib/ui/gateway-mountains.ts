import { GN_EASE_PREMIUM } from "@/lib/ui/gonatural-design";

export type GatewayMountainSpec = {
  id: string;
  src: string;
  side: "left" | "right";
  width: string;
  staggerIndex: number;
  top?: string;
  bottom?: string;
  /** Offset horizontal extra hacia el borde (px). */
  edgeInset?: number;
  /** Opacidad en hover desktop. */
  hoverOpacity: number;
  /** Opacidad ambient (móvil / reduced-motion). */
  ambientOpacity: number;
};

/** Gateway Go Natural — 5 montañas en esquinas; franja central libre para bloque editorial centrado. */
export const GN_GATEWAY_MOUNTAINS: GatewayMountainSpec[] = [
  {
    id: "left-1",
    src: "/assets/brand/mountains/left-1.png",
    side: "left",
    top: "8%",
    width: "clamp(80px, 13vw, 165px)",
    staggerIndex: 0,
    edgeInset: 0,
    hoverOpacity: 0.48,
    ambientOpacity: 0.1,
  },
  {
    id: "left-2",
    src: "/assets/brand/mountains/left-2.png",
    side: "left",
    top: "12%",
    width: "clamp(72px, 11vw, 140px)",
    staggerIndex: 1,
    edgeInset: -8,
    hoverOpacity: 0.28,
    ambientOpacity: 0.06,
  },
  {
    id: "left-3",
    src: "/assets/brand/mountains/left-3.png",
    side: "left",
    bottom: "8%",
    width: "clamp(100px, 16vw, 200px)",
    staggerIndex: 2,
    edgeInset: 0,
    hoverOpacity: 0.42,
    ambientOpacity: 0.1,
  },
  {
    id: "right-1",
    src: "/assets/brand/mountains/right-1.png",
    side: "right",
    top: "10%",
    width: "clamp(85px, 13vw, 175px)",
    staggerIndex: 3,
    edgeInset: 0,
    hoverOpacity: 0.46,
    ambientOpacity: 0.1,
  },
  {
    id: "right-2",
    src: "/assets/brand/mountains/right-2.png",
    side: "right",
    bottom: "10%",
    width: "clamp(75px, 12vw, 150px)",
    staggerIndex: 4,
    edgeInset: 0,
    hoverOpacity: 0.38,
    ambientOpacity: 0.09,
  },
];

export const GN_GATEWAY_MOUNTAIN_EASE = GN_EASE_PREMIUM;
export const GN_GATEWAY_MOUNTAIN_ENTER_S = 1.05;
export const GN_GATEWAY_MOUNTAIN_EXIT_S = 0.45;
export const GN_GATEWAY_MOUNTAIN_STAGGER_S = 0.1;
export const GN_GATEWAY_MOUNTAIN_MOBILE_OPACITY = 0.1;
export const GN_GATEWAY_PARALLAX_MAX_PX = 12;
