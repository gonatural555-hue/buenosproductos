import { NextRequest, NextResponse } from "next/server";
import {
  createSupabaseServiceClient,
  isSupabaseServiceConfigured,
} from "@/lib/supabase/admin";
import { sendWithdrawalEmails } from "@/lib/email/withdrawal-emails";
import { generateWithdrawalCaseCode } from "@/lib/withdrawal/case-code";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LOCALES = new Set(["en", "es", "fr", "it"]);
const MAX_NAME = 160;
const MAX_ORDER = 80;
const MAX_PRODUCT = 200;
const MAX_NOTES = 2000;

type WithdrawalPayload = {
  fullName: string;
  email: string;
  orderNumber: string;
  productName: string;
  notes?: string | null;
  locale: string;
};

function normalizeEmail(raw: unknown): string | null {
  if (typeof raw !== "string") return null;
  const t = raw.trim().toLowerCase();
  if (t.length < 5 || t.length > 320) return null;
  if (!EMAIL_REGEX.test(t)) return null;
  return t;
}

function normalizeText(raw: unknown, max: number): string | null {
  if (typeof raw !== "string") return null;
  const t = raw.trim();
  if (!t.length) return null;
  return t.slice(0, max);
}

function parseBody(body: unknown): WithdrawalPayload | null {
  if (!body || typeof body !== "object") return null;
  const b = body as Record<string, unknown>;

  const fullName = normalizeText(b.fullName, MAX_NAME);
  const email = normalizeEmail(b.email);
  const orderNumber = normalizeText(b.orderNumber, MAX_ORDER);
  const productName = normalizeText(b.productName, MAX_PRODUCT);
  const localeRaw =
    typeof b.locale === "string" ? b.locale.trim().toLowerCase() : "es";
  const locale = LOCALES.has(localeRaw) ? localeRaw : "es";
  const notesRaw =
    typeof b.notes === "string" ? b.notes.trim().slice(0, MAX_NOTES) : "";
  const notes = notesRaw.length ? notesRaw : null;

  if (!fullName || !email || !orderNumber || !productName) return null;

  return {
    fullName,
    email,
    orderNumber,
    productName,
    notes,
    locale,
  };
}

async function orderExists(
  supabase: ReturnType<typeof createSupabaseServiceClient>,
  orderNumber: string,
  email: string
): Promise<boolean> {
  const { data: order } = await supabase
    .from("orders")
    .select("id, guest_email, user_id")
    .eq("id", orderNumber)
    .maybeSingle();

  if (!order) return false;

  const normalizedEmail = email.trim().toLowerCase();

  if (
    typeof order.guest_email === "string" &&
    order.guest_email.trim().toLowerCase() === normalizedEmail
  ) {
    return true;
  }

  if (order.user_id) {
    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", order.user_id)
      .maybeSingle();

    if (
      profile?.email &&
      profile.email.trim().toLowerCase() === normalizedEmail
    ) {
      return true;
    }
  }

  return false;
}

async function insertWithUniqueCode(
  supabase: ReturnType<typeof createSupabaseServiceClient>,
  payload: WithdrawalPayload,
  orderMatched: boolean
): Promise<string | null> {
  for (let attempt = 0; attempt < 5; attempt++) {
    const caseCode = generateWithdrawalCaseCode();
    const { error } = await supabase.from("withdrawal_requests").insert({
      case_code: caseCode,
      full_name: payload.fullName,
      email: payload.email,
      order_number: payload.orderNumber,
      product_name: payload.productName,
      notes: payload.notes,
      locale: payload.locale,
      order_matched: orderMatched,
    });

    if (!error) return caseCode;

    const msg = error.message?.toLowerCase() ?? "";
    if (error.code === "23505" || msg.includes("unique")) continue;

    console.error("[withdrawal] insert error:", error);
    return null;
  }
  return null;
}

export async function POST(request: NextRequest) {
  if (!isSupabaseServiceConfigured()) {
    return NextResponse.json(
      { ok: false, code: "server" as const },
      { status: 503 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, code: "invalid" as const },
      { status: 400 }
    );
  }

  const payload = parseBody(body);
  if (!payload) {
    return NextResponse.json(
      { ok: false, code: "invalid" as const },
      { status: 400 }
    );
  }

  const supabase = createSupabaseServiceClient();

  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count, error: rateError } = await supabase
    .from("withdrawal_requests")
    .select("id", { count: "exact", head: true })
    .eq("email", payload.email)
    .gte("created_at", oneHourAgo);

  if (rateError) {
    console.error("[withdrawal] rate check:", rateError);
  } else if (count !== null && count >= 5) {
    return NextResponse.json(
      { ok: false, code: "rate_limit" as const },
      { status: 429 }
    );
  }

  let orderMatched = false;
  try {
    orderMatched = await orderExists(supabase, payload.orderNumber, payload.email);
  } catch (error) {
    console.warn("[withdrawal] order lookup skipped:", error);
  }

  const caseCode = await insertWithUniqueCode(supabase, payload, orderMatched);
  if (!caseCode) {
    return NextResponse.json(
      { ok: false, code: "server" as const },
      { status: 500 }
    );
  }

  void sendWithdrawalEmails({
    caseCode,
    fullName: payload.fullName,
    email: payload.email,
    orderNumber: payload.orderNumber,
    productName: payload.productName,
    notes: payload.notes,
    locale: payload.locale,
  }).catch((err) => console.error("[withdrawal] email error:", err));

  return NextResponse.json(
    { ok: true as const, caseCode, orderMatched },
    { status: 201 }
  );
}
