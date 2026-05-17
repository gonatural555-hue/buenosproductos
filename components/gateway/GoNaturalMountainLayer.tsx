"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  GN_GATEWAY_MOUNTAIN_EASE,
  GN_GATEWAY_MOUNTAIN_ENTER_S,
  GN_GATEWAY_MOUNTAIN_EXIT_S,
  GN_GATEWAY_MOUNTAIN_MOBILE_OPACITY,
  GN_GATEWAY_MOUNTAIN_STAGGER_S,
  GN_GATEWAY_MOUNTAINS,
  GN_GATEWAY_MOUNTAINS_MOBILE_IDS,
  type GatewayMountainSpec,
} from "@/lib/ui/gateway-mountains";

type GoNaturalMountainLayerProps = {
  revealed: boolean;
  parallax: { x: number; y: number };
};

function useIsDesktopHover() {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isDesktop;
}

function mountainPositionStyle(mountain: GatewayMountainSpec): React.CSSProperties {
  if (mountain.bottom != null) {
    return { bottom: mountain.bottom, top: "auto", width: mountain.width };
  }
  return { top: mountain.top, width: mountain.width };
}

/**
 * prefers-reduced-motion: sin slide/parallax en desktop; montañas estáticas suaves como en móvil.
 */
export default function GoNaturalMountainLayer({
  revealed,
  parallax,
}: GoNaturalMountainLayerProps) {
  const reduceMotion = useReducedMotion() ?? false;
  const isDesktop = useIsDesktopHover();

  const staticAmbient = !isDesktop || reduceMotion;
  const showRevealed = !staticAmbient && revealed;

  const visibleMountains = useMemo(() => {
    if (isDesktop) return GN_GATEWAY_MOUNTAINS;
    return GN_GATEWAY_MOUNTAINS.filter((m) =>
      (GN_GATEWAY_MOUNTAINS_MOBILE_IDS as readonly string[]).includes(m.id)
    );
  }, [isDesktop]);

  return (
    <motion.div className="pointer-events-none absolute inset-0 z-[1] overflow-hidden" aria-hidden>
      {visibleMountains.map((mountain) => {
        const fromLeft = mountain.side === "left";
        const hiddenX = fromLeft ? "-115%" : "115%";
        const sideClass = fromLeft ? "left-0" : "right-0";
        const parallaxFactor = fromLeft ? 1 : -1;
        const anchoredBottom = mountain.bottom != null;

        return (
          <motion.div
            key={mountain.id}
            className={`absolute ${sideClass} ${anchoredBottom ? "" : "-translate-y-1/2"}`}
            style={mountainPositionStyle(mountain)}
            initial={false}
            animate={{
              x: staticAmbient
                ? 0
                : showRevealed
                  ? parallax.x * parallaxFactor
                  : hiddenX,
              y: staticAmbient ? 0 : showRevealed ? parallax.y : 0,
              opacity: staticAmbient
                ? GN_GATEWAY_MOUNTAIN_MOBILE_OPACITY
                : showRevealed
                  ? mountain.hoverOpacity
                  : 0,
            }}
            transition={{
              x: {
                duration: showRevealed
                  ? GN_GATEWAY_MOUNTAIN_ENTER_S
                  : GN_GATEWAY_MOUNTAIN_EXIT_S,
                delay: showRevealed
                  ? mountain.staggerIndex * GN_GATEWAY_MOUNTAIN_STAGGER_S
                  : 0,
                ease: GN_GATEWAY_MOUNTAIN_EASE,
              },
              y: {
                duration: showRevealed
                  ? GN_GATEWAY_MOUNTAIN_ENTER_S
                  : GN_GATEWAY_MOUNTAIN_EXIT_S,
                ease: GN_GATEWAY_MOUNTAIN_EASE,
              },
              opacity: {
                duration: showRevealed
                  ? GN_GATEWAY_MOUNTAIN_ENTER_S * 0.85
                  : GN_GATEWAY_MOUNTAIN_EXIT_S,
                delay: showRevealed
                  ? mountain.staggerIndex * GN_GATEWAY_MOUNTAIN_STAGGER_S
                  : 0,
                ease: GN_GATEWAY_MOUNTAIN_EASE,
              },
            }}
          >
            <Image
              src={mountain.src}
              alt=""
              width={400}
              height={300}
              className="h-auto w-full select-none object-contain object-bottom"
              draggable={false}
            />
          </motion.div>
        );
      })}
    </motion.div>
  );
}
