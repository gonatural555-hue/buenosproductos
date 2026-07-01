import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

import { resolveSafeInternalPath } from "@/lib/auth/safe-internal-path";

/**
 * OAuth / magic link / confirmación de email / reset password (Supabase).
 * URL Configuration en Supabase Dashboard → Authentication:
 * - https://shopbuenosproductos.com/auth/callback
 * - http://localhost:3000/auth/callback
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const authError = searchParams.get("error");
  const next = resolveSafeInternalPath(
    searchParams.get("next"),
    "/es/account"
  );

  if (authError) {
    const localeMatch = next.match(/^\/([a-z]{2})\//);
    const locale = localeMatch?.[1] ?? "es";
    return NextResponse.redirect(
      new URL(`/${locale}/auth?error=auth`, request.url)
    );
  }

  if (code) {
    const supabase = await createSupabaseServerClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("[auth/callback]", error);
      const localeMatch = next.match(/^\/([a-z]{2})\//);
      const locale = localeMatch?.[1] ?? "es";
      return NextResponse.redirect(
        new URL(`/${locale}/auth?error=auth`, request.url)
      );
    }
  }

  return NextResponse.redirect(new URL(next, request.url));
}
