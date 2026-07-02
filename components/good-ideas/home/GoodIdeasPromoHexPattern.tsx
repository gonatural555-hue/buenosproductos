type Props = {
  patternId?: string;
};

/** Patrón hex estático — misma familia visual que `HexGridInteractiveBackground`. */
export default function GoodIdeasPromoHexPattern({
  patternId = "gi-promo-hex-pattern",
}: Props) {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.16]"
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <pattern
          id={patternId}
          width="48"
          height="56"
          patternUnits="userSpaceOnUse"
          patternTransform="scale(1.15)"
        >
          <path
            d="M24 2 42 12.5v21L24 44 6 33.5v-21L24 2Z"
            fill="none"
            stroke="rgba(59,130,246,0.28)"
            strokeWidth="0.85"
          />
          <path
            d="M0 28 18 38.5v21L0 70v-42Zm48 0 18 10.5v21L48 70V28Z"
            fill="none"
            stroke="rgba(59,130,246,0.18)"
            strokeWidth="0.75"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
}
