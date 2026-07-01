import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  createSupabaseServiceClient,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/admin";
import { createOrder, markOrderAsPaid, type OrderItem } from "@/lib/orders";
import { verifyPayPalCapture } from "@/lib/paypal/verify-capture";
import {
  computePayPalSurcharge,
  paypalTotalsMatch,
} from "@/lib/checkout/payment-methods";
import { sendOrderConfirmationEmail } from "@/lib/email/order-confirmation";
import {
  inferCountryFromShipping,
  inferOrderEmailLocale,
} from "@/lib/email/infer-locale";
import { syncBuyerToBrevo } from "@/lib/brevo";
import {
  getPaidOrderCountForUser,
  getWelcomeFreeShippingRemaining,
} from "@/lib/shipping/welcome-free-shipping-server";

type PayPalOrderPayload = {
  orderId: string;
  email?: string;
  items: OrderItem[];
  totalAmount: number;
  currency?: string;
  paypalOrderId?: string;
  shippingAddress?: Record<string, unknown>;
  billingAddress?: Record<string, unknown> | null;
};

function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

/**
 * Orden: 1) Supabase 2) lib/orders (Sheets).
 * Usuario logueado: JWT + RLS. Guest: service role + guest_email.
 */
export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const body = (await request.json()) as Partial<PayPalOrderPayload>;

    const {
      orderId,
      items,
      totalAmount,
      currency,
      paypalOrderId,
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
      return NextResponse.json(
        { success: false, error: "totalAmount debe ser un número." },
        { status: 400 }
      );
    }

    const cartSubtotalUsd = items.reduce(
      (sum, it) => sum + Number(it.price) * Number(it.quantity),
      0
    );
    if (!paypalTotalsMatch(cartSubtotalUsd, totalAmount)) {
      return NextResponse.json(
        {
          success: false,
          error: "El total PayPal no coincide con el subtotal + recargo.",
        },
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

    if (!paypalOrderId?.trim()) {
      return NextResponse.json(
        { success: false, error: "paypalOrderId es obligatorio." },
        { status: 400 }
      );
    }

    const db = isGuest ? createSupabaseServiceClient() : supabase;

    const { data: existingPaypalOrder } = await db
      .from("orders")
      .select("id, status")
      .eq("paypal_order_id", paypalOrderId)
      .maybeSingle();

    if (existingPaypalOrder && existingPaypalOrder.id !== orderId) {
      return NextResponse.json(
        {
          success: false,
          error: "Este pago PayPal ya fue utilizado en otro pedido.",
        },
        { status: 409 }
      );
    }

    const verification = await verifyPayPalCapture(
      paypalOrderId,
      totalAmount
    );

    if (!verification.ok) {
      console.error("[PayPal Order API] Verificación fallida", {
        orderId,
        paypalOrderId,
        error: verification.error,
      });
      return NextResponse.json(
        { success: false, error: verification.error },
        { status: 402 }
      );
    }

    const { data: existingOrder } = await db
      .from("orders")
      .select("id, shipping_waived, status")
      .eq("id", orderId)
      .maybeSingle();

    if (existingOrder) {
      if (!isGuest && user) {
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
      return NextResponse.json({
        success: true,
        orderId,
        status: existingOrder.status ?? "paid",
        alreadyExists: true,
      });
    }

    const welcomeFreeShippingApplied = true;

    const enrichedShippingAddress = {
      ...(ship ?? {}),
      billingAddress: billingAddress ?? null,
      welcomeFreeShippingApplied,
      standardShippingAlwaysFree: true,
      paymentChannel: "paypal",
      cartSubtotalUsd,
      paypalSurchargeUsd: computePayPalSurcharge(cartSubtotalUsd),
      paypalSurchargeRate: 0.3,
    };

    const safeEmail = isGuest
      ? (bodyEmail as string).trim()
      : typeof user?.email === "string" && user.email.includes("@")
        ? user.email
        : "";

    const orderRow: Record<string, unknown> = {
      id: orderId,
      user_id: isGuest ? null : user!.id,
      guest_email: isGuest ? safeEmail : null,
      status: "paid",
      subtotal: totalAmount,
      currency: currency || "USD",
      payment_method: "paypal",
      paypal_order_id: paypalOrderId ?? null,
      shipping_json: enrichedShippingAddress,
      shipping_waived: true,
      shipping_amount: 0,
    };

    const { error: orderErr } = await db.from("orders").insert(orderRow);

    if (orderErr) {
      console.error("[PayPal Order API] orders insert", orderErr);
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
      console.error("[PayPal Order API] order_items insert", itemsErr);
      await db.from("orders").delete().eq("id", orderId);
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

    const emailLocale = inferOrderEmailLocale(enrichedShippingAddress);

    try {
      await sendOrderConfirmationEmail({
        email: safeEmail,
        orderId,
        total: totalAmount,
        currency: currency || "USD",
        items,
        locale: emailLocale,
      });
    } catch (emailErr) {
      console.error("[PayPal Order API] Order confirmation email:", emailErr);
    }

    try {
      await syncBuyerToBrevo(safeEmail, {
        fechaPrimeraCompra: new Date(),
        totalGastado: totalAmount,
        idioma: emailLocale,
        pais: inferCountryFromShipping(enrichedShippingAddress),
        consentimiento: true,
      });
    } catch (brevoErr) {
      console.error("[PayPal Order API] Brevo buyer sync:", brevoErr);
    }

    return NextResponse.json({
      success: true,
      orderId,
      status: "paid",
      welcomeFreeShippingApplied: true,
      welcomeFreeShippingRemainingAfter: isGuest
        ? 0
        : user
          ? getWelcomeFreeShippingRemaining(
              await getPaidOrderCountForUser(supabase, user.id)
            )
          : 0,
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
