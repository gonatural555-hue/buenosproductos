import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { sendPasswordUpdatedEmail } from "@/lib/email/transactional-templates";
import type { GiEmailLocale } from "@/lib/email/layout";

export async function POST(request: Request) {
  try {
    const supabase = await createSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user?.email) {
      return NextResponse.json({ ok: false }, { status: 401 });
    }

    let locale: GiEmailLocale = "es";
    try {
      const body = (await request.json()) as { locale?: string };
      if (body.locale === "en") locale = "en";
    } catch {
      /* default es */
    }

    await sendPasswordUpdatedEmail(user.email, locale);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("[notify-password-updated]", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
