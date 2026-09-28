import type { Metadata } from "next";
import ProductGrid from "@/components/ProductGrid";
import ShopFilter from "@/components/ShopFilter";
import { collections, products, productsIn } from "@/lib/products";
import { money } from "@/lib/format";

export const metadata: Metadata = {
  title: "All twelve",
  description: `All ${products.length} places on heavyweight hoodies and tees. No logos, nothing explained. Printed for you.`,
};

const HOODIE = products[0].garments.find((g) => g.type === "hoodie")!.priceCents;
const TEE = products[0].garments.find((g) => g.type === "tee")!.priceCents;

export default function ShopPage() {
  const filters = [
    { key: "all", label: "All", count: products.length },
    ...collections.map((c) => ({ key: c.slug, label: c.name, count: productsIn(c.slug).length })),
  ];
  return (
    <div className="mx-auto w-full max-w-page px-5 sm:px-8">
      <header className="flex flex-col gap-2 pb-8 pt-4 sm:pb-10 sm:pt-8">
        <h1 className="display hero-in text-[48px] sm:text-[80px]">All twelve.</h1>
        <p className="hero-in max-w-[52ch] text-faded" style={{ ["--d" as string]: "80ms" }}>
          Twelve places, each on a heavyweight hoodie and a heavy tee in one matching colour. Big print on the back, crest on the chest. You&rsquo;ll know which ones are yours.
        </p>
      </header>
      <div data-compass="shop">
        <ShopFilter filters={filters} prices={{ hoodie: money(HOODIE), tee: money(TEE) }}>
          <ProductGrid products={products} priorityCount={4} garment={null} />
        </ShopFilter>
      </div>
    </div>
  );
}
