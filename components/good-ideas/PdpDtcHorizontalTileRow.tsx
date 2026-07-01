import type { ReactNode } from "react";
import { GI_DTC, giDtcHorizontalTileItemStyle } from "@/lib/ui/gi-pdp-dtc";

type RowProps = {
  children: ReactNode;
  "aria-label"?: string;
};

type TileProps = {
  children: ReactNode;
  className?: string;
  heightPx?: number;
};

export function PdpDtcHorizontalTileRow({
  children,
  "aria-label": ariaLabel,
}: RowProps) {
  return (
    <ul
      className={GI_DTC.horizontalTileRow}
      style={{ scrollSnapType: "x mandatory" }}
      aria-label={ariaLabel}
    >
      {children}
    </ul>
  );
}

export function PdpDtcHorizontalTile({
  children,
  className = "",
  heightPx,
}: TileProps) {
  return (
    <li
      className={`${GI_DTC.horizontalTileItem} ${className}`.trim()}
      style={giDtcHorizontalTileItemStyle(heightPx)}
    >
      {children}
    </li>
  );
}
