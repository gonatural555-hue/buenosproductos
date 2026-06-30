import type { UISurface } from "@/lib/ui-surface";
import {
  getPdpBuyBoxTheme,
  type PdpBrandTheme,
} from "@/lib/ui/pdp-theme";

export type AvailabilityCopy = {
  shippingTitle: string;
  shippingStatus: string;
  shippingDetail?: string;
};

type Props = {
  copy: AvailabilityCopy;
  surface?: UISurface;
  pdpBrand?: PdpBrandTheme;
};

export default function PdpAvailabilityCards({
  copy,
  surface = "light",
  pdpBrand = "go-natural",
}: Props) {
  const theme = getPdpBuyBoxTheme(pdpBrand, surface);

  return (
    <div className="grid gap-3">
      <div className={theme.availCard}>
        <p className={theme.availTitle}>{copy.shippingTitle}</p>
        <p className={theme.availStatus}>{copy.shippingStatus}</p>
        {copy.shippingDetail ? (
          <p className={theme.availDetail}>{copy.shippingDetail}</p>
        ) : null}
      </div>
    </div>
  );
}
