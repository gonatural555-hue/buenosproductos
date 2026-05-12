import "./globals.css";
import { headers } from "next/headers";
import localFont from "next/font/local";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext";
import { AuthProvider } from "@/context/AuthContext";
import { defaultLocale } from "@/lib/i18n/config";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import MicrosoftClarity from "@/components/analytics/MicrosoftClarity";

/** TAN Nimbus — archivo local: `public/fonts/TAN-Nimbus.otf` (variable CSS `--font-tan-nimbus`). */
const tanNimbus = localFont({
  src: "../public/fonts/TAN-Nimbus.otf",
  variable: "--font-tan-nimbus",
  display: "swap",
  fallback: ["Georgia", "Times New Roman", "serif"],
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-locale") || defaultLocale;

  return (
    <html lang={locale} className={tanNimbus.variable}>
      <body>
        <GoogleAnalytics />
        <MicrosoftClarity />
        <UserProvider>
          <AuthProvider>
            <CartProvider>{children}</CartProvider>
          </AuthProvider>
        </UserProvider>
      </body>
    </html>
  );
}
