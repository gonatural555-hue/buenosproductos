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

export function PdpReviewsSkeleton({ light = false }: { light?: boolean }) {
  const bar = light ? "bg-[#E5E7EB]" : "bg-white/[0.06]";
  const block = light ? "bg-[#F3F4F6]" : "bg-white/[0.08]";
  const card = light
    ? "rounded-[20px] border border-[#ECECEC] bg-white shadow-[0_4px_18px_rgba(0,0,0,0.05)]"
    : "rounded-xl bg-white/[0.06]";

  return (
    <div className="animate-pulse space-y-8 md:space-y-10" aria-hidden>
      <div className="space-y-3">
        <div className={`h-9 w-64 max-w-full rounded-md ${block}`} />
        <div className={`h-4 w-full max-w-xl rounded-md ${bar}`} />
      </div>
      <div className="grid gap-8 lg:grid-cols-[minmax(0,28%)_minmax(0,72%)] lg:gap-12">
        <div className={`space-y-4 p-7 ${card}`}>
          <div className={`h-12 w-20 rounded-md ${block}`} />
          <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className={`h-5 w-5 rounded-sm ${bar}`} />
            ))}
          </div>
          <div className={`h-4 w-36 rounded-md ${bar}`} />
          {[5, 4, 3, 2, 1].map((star) => (
            <div key={star} className="flex items-center gap-3">
              <div className={`h-3 w-8 rounded ${bar}`} />
              <div className={`h-2 flex-1 rounded-full ${bar}`} />
            </div>
          ))}
        </div>
        <div className="space-y-5">
          <div className={`h-36 ${card}`} />
          <div className={`h-36 ${card}`} />
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
