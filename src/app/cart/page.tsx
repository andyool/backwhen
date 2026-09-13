import type { Metadata } from "next";
import CartView from "@/components/CartView";
import SplitText from "@/components/fx/SplitText";
import { artworkMap } from "@/lib/art";
import { products } from "@/lib/products";

export const metadata: Metadata = { title: "Cart" };

export default function CartPage() {
  return (
    <div className="mx-auto w-full max-w-page px-5 sm:px-8">
      <SplitText as="h1" text="Cart" className="display block pb-10 pt-6 text-[44px] sm:text-[60px]" />
      <div data-reveal style={{ ["--d" as string]: "250ms" }}>
        <CartView artwork={artworkMap(products.map((p) => p.slug))} />
      </div>
    </div>
  );
}
