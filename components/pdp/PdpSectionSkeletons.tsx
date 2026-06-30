type Props = {
  className?: string;
};

export function PdpSectionSkeleton({ className = "" }: Props) {
  return (
    <div
      className={`animate-pulse space-y-4 ${className}`.trim()}
      aria-hidden
    >
      <div className="h-7 w-48 rounded-md bg-white/[0.08]" />
      <div className="h-4 w-full max-w-xl rounded-md bg-white/[0.06]" />
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="aspect-video rounded-xl bg-white/[0.06]" />
        <div className="aspect-video rounded-xl bg-white/[0.06]" />
      </div>
    </div>
  );
}

export function PdpReviewsSkeleton() {
  return (
    <div className="animate-pulse space-y-6" aria-hidden>
      <div className="h-7 w-40 rounded-md bg-white/[0.08]" />
      <div className="grid gap-8 lg:grid-cols-[220px_1fr]">
        <div className="space-y-3">
          <div className="h-12 w-24 rounded-md bg-white/[0.08]" />
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-3">
              <div className="h-3 w-8 rounded bg-white/[0.06]" />
              <div className="h-2 flex-1 rounded-full bg-white/[0.06]" />
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <div className="h-28 rounded-xl bg-white/[0.06]" />
          <div className="h-28 rounded-xl bg-white/[0.06]" />
        </div>
      </div>
    </div>
  );
}

export function PdpCarouselSkeleton() {
  return (
    <div className="animate-pulse space-y-5" aria-hidden>
      <div className="h-7 w-56 rounded-md bg-white/[0.08]" />
      <div className="flex gap-4 overflow-hidden">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="h-[320px] w-[240px] shrink-0 rounded-xl bg-white/[0.06]"
          />
        ))}
      </div>
    </div>
  );
}
