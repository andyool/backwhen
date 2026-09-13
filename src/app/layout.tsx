import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { site, siteOrigin } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Preloader from "@/components/fx/Preloader";
import SmoothScroll from "@/components/fx/SmoothScroll";
import RevealObserver from "@/components/fx/RevealObserver";
import ScrollProgress from "@/components/fx/ScrollProgress";
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
  openGraph: { siteName: site.name, type: "website" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={fraunces.variable}>
      <body className="min-h-screen flex flex-col">
        <CartProvider>
          <Preloader />
          <ScrollProgress />
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <RevealObserver />
          <SmoothScroll />
          <Compass />
          <ChooseOption />
          <ClickMarker />
          <Chatbox />
        </CartProvider>
      </body>
    </html>
  );
}
