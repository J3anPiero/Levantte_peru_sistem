import type { Metadata, Viewport } from "next";
import { Inter, Sora } from "next/font/google";
import { CartProvider } from "@/components/cart/cart-provider";
import { CartToast } from "@/components/cart/cart-toast";
import { site } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const sora = Sora({ subsets: ["latin"], weight: ["500", "600", "700", "800"], variable: "--font-sora", display: "swap" });

export const metadata: Metadata = {
  title: {
    default: `${site.name} · Repuestos automotrices originales y alternativos`,
    template: `%s · ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  openGraph: { siteName: site.name, locale: "es_PE", type: "website" },
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${inter.variable} ${sora.variable}`}>
      <body className="min-h-screen">
        <CartProvider>
          {children}
          <CartToast />
        </CartProvider>
      </body>
    </html>
  );
}
