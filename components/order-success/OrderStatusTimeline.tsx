"use client";

import type { Order } from "@/context/UserContext";
import { resolveOrderTimelineState } from "@/lib/order-success-helpers";

type Step = { id: string; label: string };

type Props = {
  order: Order;
  steps: Step[];
};

function StepDot({ state }: { state: "completed" | "active" | "pending" }) {
  if (state === "completed") {
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[rgba(34,197,94,0.15)] text-[#22C55E]">
        <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path
            fillRule="evenodd"
            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
            clipRule="evenodd"
          />
        </svg>
      </span>
    );
  }
  if (state === "active") {
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2 border-[#3B82F6] bg-[rgba(59,130,246,0.14)]">
        <span className="h-2.5 w-2.5 rounded-full bg-[#3B82F6]" />
      </span>
    );
  }
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[rgba(232,236,241,0.25)] bg-transparent">
      <span className="h-2 w-2 rounded-full bg-[rgba(232,236,241,0.25)]" />
    </span>
  );
}

export default function OrderStatusTimeline({ order, steps }: Props) {
  const states = resolveOrderTimelineState(order);
  const stateList = [
    states.received,
    states.payment,
    states.preparing,
    states.shipped,
    states.delivered,
  ];

  return (
    <section className="gi-os-animate-in gi-os-delay-2 rounded-[24px] border border-[rgba(255,255,255,0.08)] bg-[#151B24] p-7 md:p-8">
      <ol className="hidden gap-2 md:flex md:items-start md:justify-between">
        {steps.map((step, index) => {
          const state = stateList[index] ?? "pending";
          const isLast = index === steps.length - 1;
          return (
            <li
              key={step.id}
              className={`relative flex min-w-0 flex-1 flex-col items-center text-center ${
                !isLast ? "pr-2" : ""
              }`}
            >
              {!isLast ? (
                <span
                  className="absolute left-[calc(50%+18px)] top-[18px] h-px w-[calc(100%-36px)] bg-[rgba(232,236,241,0.12)]"
                  aria-hidden
                />
              ) : null}
              <StepDot state={state} />
              <p className="mt-3 font-body text-xs font-semibold leading-snug text-[#E8ECF1] sm:text-sm">
                {step.label}
              </p>
            </li>
          );
        })}
      </ol>

      <ol className="space-y-0 md:hidden">
        {steps.map((step, index) => {
          const state = stateList[index] ?? "pending";
          const isLast = index === steps.length - 1;
          return (
            <li key={step.id} className="relative flex gap-4">
              <div className="flex flex-col items-center">
                <StepDot state={state} />
                {!isLast ? (
                  <span
                    className="my-1 w-px flex-1 min-h-[28px] bg-[rgba(232,236,241,0.12)]"
                    aria-hidden
                  />
                ) : null}
              </div>
              <div className={`min-w-0 pb-6 ${isLast ? "pb-0" : ""}`}>
                <p className="font-body text-sm font-semibold text-[#E8ECF1]">
                  {step.label}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
