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

/** Gateway Go Natural — 7 montañas en marco vertical (arriba / medio / abajo). */
export const GN_GATEWAY_MOUNTAINS: GatewayMountainSpec[] = [
  {
    id: "left-1",
    src: "/assets/brand/mountains/left-1.png",
    side: "left",
    top: "6%",
    width: "clamp(94px, 15vw, 195px)",
    staggerIndex: 0,
    edgeInset: 0,
    hoverOpacity: 0.5,
    ambientOpacity: 0.1,
  },
  {
    id: "left-2",
    src: "/assets/brand/mountains/left-2.png",
    side: "left",
    top: "38%",
    width: "clamp(85px, 13vw, 165px)",
    staggerIndex: 1,
    edgeInset: 0,
    hoverOpacity: 0.4,
    ambientOpacity: 0.08,
  },
  {
    id: "left-4",
    src: "/assets/brand/mountains/left-4.png",
    side: "left",
    top: "68%",
    width: "clamp(90px, 14vw, 185px)",
    staggerIndex: 2,
    edgeInset: 0,
    hoverOpacity: 0.42,
    ambientOpacity: 0.09,
  },
  {
    id: "left-3",
    src: "/assets/brand/mountains/left-3.png",
    side: "left",
    bottom: "6%",
    width: "clamp(118px, 19vw, 235px)",
    staggerIndex: 3,
    edgeInset: 0,
    hoverOpacity: 0.45,
    ambientOpacity: 0.1,
  },
  {
    id: "right-1",
    src: "/assets/brand/mountains/right-1.png",
    side: "right",
    top: "14%",
    width: "clamp(100px, 15vw, 205px)",
    staggerIndex: 4,
    edgeInset: 0,
    hoverOpacity: 0.48,
    ambientOpacity: 0.1,
  },
  {
    id: "right-3",
    src: "/assets/brand/mountains/right-3.png",
    side: "right",
    top: "52%",
    width: "clamp(92px, 14vw, 190px)",
    staggerIndex: 5,
    edgeInset: 0,
    hoverOpacity: 0.44,
    ambientOpacity: 0.09,
  },
  {
    id: "right-2",
    src: "/assets/brand/mountains/right-2.png",
    side: "right",
    bottom: "12%",
    width: "clamp(88px, 14vw, 175px)",
    staggerIndex: 6,
    edgeInset: 0,
    hoverOpacity: 0.42,
    ambientOpacity: 0.09,
  },
];

export const GN_GATEWAY_MOUNTAIN_EASE = GN_EASE_PREMIUM;
export const GN_GATEWAY_MOUNTAIN_ENTER_S = 1.05;
export const GN_GATEWAY_MOUNTAIN_EXIT_S = 0.45;
export const GN_GATEWAY_MOUNTAIN_STAGGER_S = 0.1;
export const GN_GATEWAY_MOUNTAIN_MOBILE_OPACITY = 0.1;
export const GN_GATEWAY_PARALLAX_MAX_PX = 12;
