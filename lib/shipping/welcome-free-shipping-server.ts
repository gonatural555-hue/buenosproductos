import type { SupabaseClient } from "@supabase/supabase-js";
import {
  WELCOME_FREE_SHIPPING_ORDERS,
  getWelcomeFreeShippingRemaining,
  isWelcomeFreeShippingEligible,
} from "@/lib/shipping/welcome-free-shipping";

export async function getPaidOrderCountForUser(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const { count, error } = await supabase
    .from("orders")
    .select("id", { count: "exact", head: true })
    .eq("user_id", userId)
    .eq("status", "paid");

  if (error) {
    console.error("[welcome-free-shipping] count paid orders", error);
    return WELCOME_FREE_SHIPPING_ORDERS;
  }

  return count ?? 0;
}

export async function getWelcomeFreeShippingStateForUser(
  supabase: SupabaseClient,
  userId: string
) {
  const paidOrderCount = await getPaidOrderCountForUser(supabase, userId);
  return {
    paidOrderCount,
    remaining: getWelcomeFreeShippingRemaining(paidOrderCount),
    eligible: isWelcomeFreeShippingEligible(paidOrderCount),
  };
}

// Re-export for server convenience
export {
  WELCOME_FREE_SHIPPING_ORDERS,
  getWelcomeFreeShippingRemaining,
  isWelcomeFreeShippingEligible,
} from "@/lib/shipping/welcome-free-shipping";
