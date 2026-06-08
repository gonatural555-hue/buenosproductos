import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createOrder, markOrderAsPaid, type OrderItem } from "@/lib/orders";
import {
  getPaidOrderCountForUser,
  getWelcomeFreeShippingRemaining,
  getWelcomeFreeShippingStateForUser,
} from "@/lib/shipping/welcome-free-shipping-server";

type PayPalOrderPayload = {
  orderId: string;
  email?: string;
  items: OrderItem[];
  totalAmount: number;
  currency?: string;
  paypalOrderId?: string;
  /** Snapshot de dirección (JSON alineado con Address en cliente) */
  shippingAddress?: Record<string, unknown>;
};

/**
 * Orden de operaciones: 1) Supabase (fuente de verdad) 2) lib/orders (Sheets / eventos).
 * Requiere sesión Supabase válida (cookie).
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = (await request.json()) as Partial<PayPalOrderPayload>;

    const {
      orderId,
      items,
      totalAmount,
      currency,
      paypalOrderId,
      shippingAddress,
    } = body;

    if (!orderId || !items || !Array.isArray(items) || !items.length) {
      console.error("[PayPal Order API] Payload inválido", { body });
      return NextResponse.json(
        {
          success: false,
          error:
            "Payload inválido. Se requiere orderId, items (no vacío) y totalAmount.",
        },
        { status: 400 }
      );
    }

    if (typeof totalAmount !== "number" || Number.isNaN(totalAmount)) {
      console.error("[PayPal Order API] totalAmount inválido", {
        orderId,
        totalAmount,
      });
      return NextResponse.json(
        {
          success: false,
          error: "totalAmount debe ser un número.",
        },
        { status: 400 }
      );
    }

    const ship = shippingAddress as Record<string, unknown> | undefined;
    const fullName =
      ship && typeof ship.fullName === "string" ? ship.fullName.trim() : "";
    if (!fullName) {
      return NextResponse.json(
        {
          success: false,
          error: "shippingAddress es obligatorio.",
        },
        { status: 400 }
      );
    }

    const { data: existingOrder } = await supabase
      .from("orders")
      .select("id, shipping_waived, status")
      .eq("id", orderId)
      .maybeSingle();

    if (existingOrder) {
      const paidOrderCount = await getPaidOrderCountForUser(supabase, user.id);
      const shippingWaived = Boolean(existingOrder.shipping_waived);
      return NextResponse.json({
        success: true,
        orderId,
        status: existingOrder.status ?? "paid",
        alreadyExists: true,
        welcomeFreeShippingApplied: shippingWaived,
        welcomeFreeShippingRemainingAfter:
          getWelcomeFreeShippingRemaining(paidOrderCount),
      });
    }

    const welcomeState = await getWelcomeFreeShippingStateForUser(
      supabase,
      user.id
    );
    const welcomeFreeShippingApplied = welcomeState.eligible;

    const enrichedShippingAddress = {
      ...(ship ?? {}),
      welcomeFreeShippingApplied,
    };

    const safeEmail =
      typeof user.email === "string" && user.email.includes("@")
        ? user.email
        : "";

    console.log("[PayPal Order API] Persistiendo en Supabase + eventos", {
      orderId,
      paypalOrderId,
      userId: user.id,
      totalAmount,
      currency: currency || "USD",
      itemsCount: items.length,
      welcomeFreeShippingApplied,
    });

    const orderRow: Record<string, unknown> = {
      id: orderId,
      user_id: user.id,
      status: "paid",
      subtotal: totalAmount,
      currency: currency || "USD",
      payment_method: "paypal",
      paypal_order_id: paypalOrderId ?? null,
      shipping_json: enrichedShippingAddress,
      shipping_waived: welcomeFreeShippingApplied,
      shipping_amount: 0,
    };

    const { error: orderErr } = await supabase.from("orders").insert(orderRow);

    if (orderErr) {
      console.error("[PayPal Order API] orders insert", orderErr);
      return NextResponse.json(
        { success: false, error: "No se pudo guardar el pedido." },
        { status: 500 }
      );
    }

    const itemRows = items.map((it) => ({
      order_id: orderId,
      product_id: it.id,
      title: it.title,
      price: it.price,
      quantity: it.quantity,
    }));

    const { error: itemsErr } = await supabase
      .from("order_items")
      .insert(itemRows);

    if (itemsErr) {
      console.error("[PayPal Order API] order_items insert", itemsErr);
      await supabase.from("orders").delete().eq("id", orderId);
      return NextResponse.json(
        { success: false, error: "No se pudieron guardar las líneas del pedido." },
        { status: 500 }
      );
    }

    try {
      const createdOrder = await createOrder({
        id: orderId,
        email: safeEmail,
        items,
        totalAmount,
        currency: currency || "USD",
        paymentMethod: "paypal",
      });
      await markOrderAsPaid(createdOrder);
    } catch (sheetErr) {
      console.error(
        "[PayPal Order API] Sheets/eventos tras guardar en DB:",
        sheetErr
      );
    }

    const paidOrderCountAfter = welcomeState.paidOrderCount + 1;

    return NextResponse.json({
      success: true,
      orderId,
      status: "paid",
      welcomeFreeShippingApplied,
      welcomeFreeShippingRemainingAfter:
        getWelcomeFreeShippingRemaining(paidOrderCountAfter),
    });
  } catch (error) {
    console.error("[PayPal Order API] Error procesando orden PayPal:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error interno al procesar la orden de PayPal",
      },
      { status: 500 }
    );
  }
}
