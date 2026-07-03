import type { GoodIdeasProductManual } from "@/lib/good-ideas-product-manual";
import { GI_DTC } from "@/lib/ui/gi-pdp-dtc";

type Props = {
  manual: GoodIdeasProductManual;
  title: string;
  description: string;
  downloadLabel: string;
  openLabel: string;
};

/** Manual de usuario en buy box DTC — misma tarjeta que el bloque UPDATE. */
export default function PdpBuyBoxManualCard({
  manual,
  title,
  description,
  downloadLabel,
  openLabel,
}: Props) {
  return (
    <div className={GI_DTC.buyBoxInfoCard} aria-labelledby="pdp-buybox-manual-label">
      <p id="pdp-buybox-manual-label" className={GI_DTC.buyBoxInfoLabel}>
        {title}
      </p>
      <p className={GI_DTC.buyBoxInfoBody}>{description}</p>
      <div className={GI_DTC.buyBoxInfoActions}>
        <a
          href={manual.url}
          download={manual.filename}
          className={GI_DTC.buyBoxInfoLink}
        >
          {downloadLabel}
        </a>
        <span aria-hidden className="text-[#D1D5DB]">
          ·
        </span>
        <a
          href={manual.url}
          target="_blank"
          rel="noopener noreferrer"
          className={GI_DTC.buyBoxInfoLink}
        >
          {openLabel}
        </a>
      </div>
    </div>
  );
}
