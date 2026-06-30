import { redirect } from "next/navigation";
import type { Locale } from "@/lib/i18n/config";
import { authPath } from "@/lib/routing/paths";

type Props = {
  params: Promise<{ locale: Locale }>;
  searchParams: Promise<{ redirect?: string }>;
};

export default async function RegisterPage({ params, searchParams }: Props) {
  const { locale } = await params;
  const { redirect: redirectTo } = await searchParams;
  const qs = new URLSearchParams({ tab: "register" });
  if (redirectTo?.startsWith("/")) {
    qs.set("redirect", redirectTo);
  }
  redirect(`${authPath(locale)}?${qs.toString()}`);
}
