import type { UISurface } from "@/lib/ui-surface";
import {
  getPdpBuyBoxTheme,
  type PdpBrandTheme,
} from "@/lib/ui/pdp-theme";

export type AvailabilityCopy = {
  pickupTitle: string;
  pickupStatus: string;
  pickupDetail?: string;
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
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      <div className={theme.availCard}>
        <p className={theme.availTitle}>{copy.pickupTitle}</p>
        <p className={theme.availStatus}>{copy.pickupStatus}</p>
        {copy.pickupDetail ? (
          <p className={theme.availDetail}>{copy.pickupDetail}</p>
        ) : null}
      </div>
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
