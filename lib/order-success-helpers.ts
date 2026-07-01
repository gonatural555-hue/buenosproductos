import type { Order } from "@/context/UserContext";
import type { CartItem } from "@/context/GoodIdeasCartContext";
import { getGoodIdeasProductById } from "@/lib/good-ideas-products";

export type ResolvedOrderItem = {
  lineId: string;
  productId: string;
  title: string;
  price: number;
  quantity: number;
  image: string | null;
  variantSelections?: CartItem["variantSelections"];
};

export function resolveOrderItems(order: Order): ResolvedOrderItem[] {
  return order.items.map((item) => {
    const extended = item as CartItem;
    const productId = extended.productId ?? item.id;
    const image =
      extended.image ??
      getGoodIdeasProductById(productId)?.images?.[0] ??
      null;

    return {
      lineId: item.id,
      productId,
      title: item.title,
      price: item.price,
      quantity: item.quantity,
      image,
      variantSelections: extended.variantSelections,
    };
  });
}

export type TimelineStepState = "completed" | "active" | "pending";

export type OrderTimelineState = {
  received: TimelineStepState;
  payment: TimelineStepState;
  preparing: TimelineStepState;
  shipped: TimelineStepState;
  delivered: TimelineStepState;
};

export function resolveOrderTimelineState(order: Order): OrderTimelineState {
  const isPaid =
    order.paymentMethod === "paypal" && order.status === "paid";

  if (isPaid) {
    return {
      received: "completed",
      payment: "completed",
      preparing: "active",
      shipped: "pending",
      delivered: "pending",
    };
  }

  return {
    received: "completed",
    payment: "active",
    preparing: "pending",
    shipped: "pending",
    delivered: "pending",
  };
}
