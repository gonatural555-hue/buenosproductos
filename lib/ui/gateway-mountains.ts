import { GN_EASE_PREMIUM } from "@/lib/ui/gonatural-design";

export type GatewayMountainSpec = {
  id: string;
  src: string;
  side: "left" | "right";
  width: string;
  staggerIndex: number;
  top?: string;
  bottom?: string;
  /** Opacidad máxima en hover desktop (zona periférica). */
  hoverOpacity: number;
};

/** Gateway Go Natural — montañas en bordes; evitan franja central del bloque editorial. */
export const GN_GATEWAY_MOUNTAINS: GatewayMountainSpec[] = [
  {
    id: "left-1",
    src: "/assets/brand/mountains/left-1.png",
    side: "left",
    top: "10%",
    width: "clamp(88px, 14vw, 180px)",
    staggerIndex: 0,
    hoverOpacity: 0.5,
  },
  {
    id: "left-2",
    src: "/assets/brand/mountains/left-2.png",
    side: "left",
    top: "22%",
    width: "clamp(100px, 16vw, 200px)",
    staggerIndex: 1,
    hoverOpacity: 0.38,
  },
  {
    id: "left-3",
    src: "/assets/brand/mountains/left-3.png",
    side: "left",
    bottom: "10%",
    width: "clamp(110px, 18vw, 220px)",
    staggerIndex: 2,
    hoverOpacity: 0.45,
  },
  {
    id: "right-1",
    src: "/assets/brand/mountains/right-1.png",
    side: "right",
    top: "16%",
    width: "clamp(95px, 15vw, 190px)",
    staggerIndex: 3,
    hoverOpacity: 0.48,
  },
  {
    id: "right-2",
    src: "/assets/brand/mountains/right-2.png",
    side: "right",
    bottom: "14%",
    width: "clamp(80px, 13vw, 160px)",
    staggerIndex: 4,
    hoverOpacity: 0.4,
  },
];

export const GN_GATEWAY_MOUNTAIN_EASE = GN_EASE_PREMIUM;
export const GN_GATEWAY_MOUNTAIN_ENTER_S = 1.05;
export const GN_GATEWAY_MOUNTAIN_EXIT_S = 0.45;
export const GN_GATEWAY_MOUNTAIN_STAGGER_S = 0.1;
export const GN_GATEWAY_MOUNTAIN_MOBILE_OPACITY = 0.1;
export const GN_GATEWAY_PARALLAX_MAX_PX = 12;

/** IDs mostrados en móvil (periferia, menos ruido). */
export const GN_GATEWAY_MOUNTAINS_MOBILE_IDS = ["left-1", "right-1", "right-2"] as const;
