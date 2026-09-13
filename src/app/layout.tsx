import type { Metadata } from "next";
import { Fraunces } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/lib/cart";
import { site, siteUrl } from "@/lib/site";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Preloader from "@/components/fx/Preloader";
import SmoothScroll from "@/components/fx/SmoothScroll";
import RevealObserver from "@/components/fx/RevealObserver";
import ScrollProgress from "@/components/fx/ScrollProgress";

const fraunces = Fraunces({
  subsets: ["latin"],
  axes: ["opsz", "SOFT"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
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
        </CartProvider>
      </body>
    </html>
  );
}
