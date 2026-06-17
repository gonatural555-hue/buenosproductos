import type { UISurface } from "@/lib/ui-surface";

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
};

export default function PdpAvailabilityCards({ copy, surface = "light" }: Props) {
  const L = surface === "light";

  const cardClass = L
    ? "rounded-md border border-neutral-300 bg-white px-4 py-3.5"
    : "rounded-md border border-white/15 bg-dark-surface/40 px-4 py-3.5";

  const titleClass = L
    ? "text-sm font-semibold text-neutral-900"
    : "text-sm font-semibold text-text-primary";

  const statusClass = L
    ? "mt-1 text-sm font-medium text-gn-forest"
    : "mt-1 text-sm font-medium text-accent-moss";

  const detailClass = L
    ? "mt-0.5 text-xs leading-snug text-neutral-600"
    : "mt-0.5 text-xs leading-snug text-text-muted";

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
      <div className={cardClass}>
        <p className={titleClass}>{copy.pickupTitle}</p>
        <p className={statusClass}>{copy.pickupStatus}</p>
        {copy.pickupDetail ? <p className={detailClass}>{copy.pickupDetail}</p> : null}
      </div>
      <div className={cardClass}>
        <p className={titleClass}>{copy.shippingTitle}</p>
        <p className={statusClass}>{copy.shippingStatus}</p>
        {copy.shippingDetail ? <p className={detailClass}>{copy.shippingDetail}</p> : null}
      </div>
    </div>
  );
}
