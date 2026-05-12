import "./globals.css";
import { headers } from "next/headers";
import localFont from "next/font/local";
import { CartProvider } from "@/context/CartContext";
import { UserProvider } from "@/context/UserContext";
import { AuthProvider } from "@/context/AuthContext";
import { defaultLocale } from "@/lib/i18n/config";
import GoogleAnalytics from "@/components/analytics/GoogleAnalytics";
import MicrosoftClarity from "@/components/analytics/MicrosoftClarity";

/**
 * TAN Nimbus — coloca tu archivo en `/public/fonts/TAN-Nimbus.otf` y reinicia el servidor.
 * Hasta entonces, el repo incluye en esa ruta un WOFF2 de respaldo (mismo nombre de archivo) para que el build funcione; sustitúyelo por tu OTF cuando lo tengas.
 */
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
