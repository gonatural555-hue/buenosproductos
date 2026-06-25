import { NextResponse } from "next/server";
import { EXCHANGE_RATES_FROM_USD } from "@/lib/currency/config";

/** Devuelve las tasas de display configuradas en `lib/currency/config.ts`. */
export async function GET() {
  return NextResponse.json({
    base: "USD",
    date: null,
    rates: EXCHANGE_RATES_FROM_USD,
    source: "fixed",
  });
}
