import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createSupabaseServiceClient,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/admin";
import type { OrderItem } from "@/lib/orders";

type WhatsAppOrderPayload = {
  orderId: string;
  email?: string;
  items: OrderItem[];
  totalAmount: number;
  currency?: string;
  shippingAddress?: Record<string, unknown>;
  billingAddress?: Record<string, unknown> | null;
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function itemsSubtotal(items: OrderItem[]): number {
  return items.reduce((sum, it) => sum + it.price * it.quantity, 0);
}

/**
 * Pedido pendiente de pago — coordinación por WhatsApp (transferencia / MP).
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const body = (await request.json()) as Partial<WhatsAppOrderPayload>;
    const {
      orderId,
      items,
      totalAmount,
      currency,
      shippingAddress,
      billingAddress,
      email: bodyEmail,
    } = body;

    const isGuest = !user;

    if (isGuest) {
      if (!isSupabaseServiceConfigured()) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Checkout guest no configurado (falta SUPABASE_SERVICE_ROLE_KEY).",
          },
          { status: 503 }
        );
      }
      const guestEmail =
        typeof bodyEmail === "string" ? bodyEmail.trim() : "";
      if (!isValidEmail(guestEmail)) {
        return NextResponse.json(
          { success: false, error: "Email válido requerido para compra guest." },
          { status: 400 }
        );
      }
    }

    if (!orderId || !items || !Array.isArray(items) || !items.length) {
      return NextResponse.json(
        {
          success: false,
          error: "Payload inválido. Se requiere orderId e items.",
        },
        { status: 400 }
      );
    }

    if (typeof totalAmount !== "number" || Number.isNaN(totalAmount)) {
      return NextResponse.json(
        { success: false, error: "totalAmount debe ser un número." },
        { status: 400 }
      );
    }

    const expectedSubtotal = itemsSubtotal(items);
    if (Math.abs(totalAmount - expectedSubtotal) > 0.011) {
      return NextResponse.json(
        { success: false, error: "El total no coincide con los ítems." },
        { status: 400 }
      );
    }

    const ship = shippingAddress as Record<string, unknown> | undefined;
    const fullName =
      ship && typeof ship.fullName === "string" ? ship.fullName.trim() : "";
    if (!fullName) {
      return NextResponse.json(
        { success: false, error: "shippingAddress es obligatorio." },
        { status: 400 }
      );
    }

    const db = isGuest ? createSupabaseServiceClient() : supabase;

    const { data: existingOrder } = await db
      .from("orders")
      .select("id, status")
      .eq("id", orderId)
      .maybeSingle();

    if (existingOrder) {
      return NextResponse.json({
        success: true,
        orderId,
        status: existingOrder.status ?? "pending",
        alreadyExists: true,
      });
    }

    const safeEmail = isGuest
      ? (bodyEmail as string).trim()
      : typeof user?.email === "string" && user.email.includes("@")
        ? user.email
        : "";

    const enrichedShippingAddress = {
      ...(ship ?? {}),
      billingAddress: billingAddress ?? null,
      paymentChannel: "whatsapp",
      welcomeFreeShippingApplied: true,
      standardShippingAlwaysFree: true,
    };

    const orderRow: Record<string, unknown> = {
      id: orderId,
      user_id: isGuest ? null : user!.id,
      guest_email: isGuest ? safeEmail : null,
      status: "pending",
      subtotal: totalAmount,
      currency: currency || "USD",
      payment_method: "whatsapp",
      paypal_order_id: null,
      shipping_json: enrichedShippingAddress,
      shipping_waived: true,
      shipping_amount: 0,
    };

    const { error: orderErr } = await db.from("orders").insert(orderRow);

    if (orderErr) {
      console.error("[WhatsApp Order API] orders insert", orderErr);
      return NextResponse.json(
        { success: false, error: "No se pudo guardar el pedido." },
        { status: 500 }
      );
    }

    const itemRows = items.map((it) => ({
      order_id: orderId,
      product_id: (it as { productId?: string }).productId ?? it.id,
      title: it.title,
      price: it.price,
      quantity: it.quantity,
    }));

    const { error: itemsErr } = await db.from("order_items").insert(itemRows);

    if (itemsErr) {
      console.error("[WhatsApp Order API] order_items insert", itemsErr);
      await db.from("orders").delete().eq("id", orderId);
      return NextResponse.json(
        { success: false, error: "No se pudieron guardar las líneas del pedido." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId,
      status: "pending",
    });
  } catch (error) {
    console.error("[WhatsApp Order API] Error:", error);
    return NextResponse.json(
      { success: false, error: "Error interno al registrar el pedido." },
      { status: 500 }
    );
  }
}
