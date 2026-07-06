import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { defaultLocale, locales, type Locale } from "@/lib/i18n/config";

const PUBLIC_FILE = /\.(.*)$/;

function isCheckoutPath(pathname: string): boolean {
  const parts = pathname.split("/").filter(Boolean);
  if (parts.length < 2) return false;
  if (!locales.includes(parts[0] as Locale)) return false;
  return parts[1] === "checkout";
}

async function withSupabaseSession(
  request: NextRequest,
  options: { setLocaleHeader: boolean }
): Promise<NextResponse> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return NextResponse.next({ request });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  await supabase.auth.getUser();

  const { pathname } = request.nextUrl;

  if (options.setLocaleHeader) {
    const locale = pathname.split("/").filter(Boolean)[0] || defaultLocale;
    supabaseResponse.headers.set("x-locale", locale);
  } else {
    supabaseResponse.headers.set("x-locale", defaultLocale);
  }

  return supabaseResponse;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  /** Callback OAuth/email de Supabase: sin prefijo /{locale} */
  if (pathname.startsWith("/auth")) {
    return withSupabaseSession(request, { setLocaleHeader: false });
  }

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  if (!hasLocale) {
    const url = request.nextUrl.clone();
    url.pathname = `/${defaultLocale}${pathname}`;
    return NextResponse.redirect(url);
  }

  const segments = pathname.split("/").filter(Boolean);
  if (
    segments.length >= 2 &&
    locales.includes(segments[0] as Locale) &&
    locales.includes(segments[1] as Locale)
  ) {
    const url = request.nextUrl.clone();
    url.pathname = `/${segments.slice(1).join("/")}`;
    return NextResponse.redirect(url, { status: 308 });
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    const headers = new Headers(request.headers);
    const locale = pathname.split("/")[1];
    headers.set("x-locale", locale);
    return NextResponse.next({ request: { headers } });
  }

  let supabaseResponse = NextResponse.next({
    request,
  });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({
          request,
        });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && isCheckoutPath(pathname)) {
    const locale = pathname.split("/").filter(Boolean)[0] || defaultLocale;
    const authUrl = request.nextUrl.clone();
    authUrl.pathname = `/${locale}/auth`;
    authUrl.searchParams.set(
      "redirect",
      pathname + (request.nextUrl.search || "")
    );
    const redirectResponse = NextResponse.redirect(authUrl);
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      redirectResponse.cookies.set(cookie.name, cookie.value);
    });
    return redirectResponse;
  }

  const locale = pathname.split("/").filter(Boolean)[0] || defaultLocale;
  supabaseResponse.headers.set("x-locale", locale);
  return supabaseResponse;
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
