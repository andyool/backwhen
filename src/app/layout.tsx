import type { Metadata, Viewport } from "next";
import { Fraunces } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { site, siteOrigin } from "@/lib/site";
import { asset } from "@/lib/paths";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartDrawer from "@/components/CartDrawer";
import Analytics from "@/components/Analytics";
import RevealObserver from "@/components/fx/RevealObserver";
import Chatbox from "@/components/fx/Chatbox";
import ChooseOption from "@/components/fx/ChooseOption";
import ClickMarker from "@/components/fx/ClickMarker";
import Compass from "@/components/fx/Compass";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: siteOrigin(),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s — ${site.name}` },
  description: site.description,
  openGraph: { siteName: site.name, type: "website", images: [asset("/og/home.jpg")] },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#1C1A17" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={fraunces.variable}>
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
          <RevealObserver />
          <Compass />
          <ChooseOption />
          <ClickMarker />
          <Chatbox />
          <Analytics />
        </CartProvider>
      </body>
    </html>
  );
}
